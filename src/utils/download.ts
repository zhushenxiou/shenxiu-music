/**
 * 跨域资源下载工具。
 * 为什么不直接用 <a href download>：跨域资源（无 Content-Disposition: attachment）时
 * download 属性会被浏览器忽略、退化成直接打开页面，因此只能先 fetch 再保存到本地。
 *
 * 流程上保证：先弹"另存为"对话框（此时尚未发起任何下载、零内存占用），
 * 用户确认保存位置后才发起请求，并把响应体边读边写进磁盘（File System Access API，
 * Chrome/Edge 等 Chromium 系支持）。不支持的浏览器回退为 blob 整块读入、由浏览器静默下载。
 */

// ==================== 类型声明 ====================
// showSaveFilePicker 等尚未进入所有 TS 版本的 lib.dom，这里做最小声明，避免引入额外依赖

interface SaveFilePickerOptions {
  suggestedName?: string
}

interface FileSystemWritableFileStreamLike {
  write(data: Uint8Array): Promise<void>
  close(): Promise<void>
  abort(reason?: unknown): Promise<void>
}

interface FileSystemFileHandleLike {
  createWritable(): Promise<FileSystemWritableFileStreamLike>
}

interface SavePickerWindow {
  showSaveFilePicker?(options?: SaveFilePickerOptions): Promise<FileSystemFileHandleLike>
}

/** 打开的"另存为"目标：ok = 拿到了可写流；cancelled / unsupported = 需要调用方处理 */
type SaveSink =
  | { kind: 'ok'; writable: FileSystemWritableFileStreamLike }
  | { kind: 'cancelled' }
  | { kind: 'unsupported' }

// ==================== 内部实现 ====================

/** 过滤文件名中的非法字符，避免存出非法文件名或越出当前目录 */
function sanitizeFilename(name: string) {
  const cleaned = name.replace(/[\\/:*?"<>|]/g, ' ').replace(/\s+/g, ' ').trim()
  return cleaned || 'untitled'
}

/** 用户主动关掉"另存为"对话框时浏览器抛的错 */
function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

/** 兜底方案：fetch 全量后整块落盘，由浏览器静默下载（无对话框） */
async function downloadViaBlob(url: string, filename: string) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`下载链接已失效（HTTP ${response.status}），请重试`)
  }
  const blob = await response.blob()

  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  link.remove()
  // 下载是异步启动的，同步 revoke 在部分浏览器（如 Firefox）会中断下载，延迟再释放
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
}

/**
 * 打开"另存为"对话框并准备好可写流。
 * 此时不请求、不读取任何内容，纯粹是用户选定保存位置。
 */
async function openSaveSink(suggestedName: string): Promise<SaveSink> {
  const pickerWin = window as unknown as SavePickerWindow
  if (typeof pickerWin.showSaveFilePicker !== 'function') {
    return { kind: 'unsupported' }
  }
  try {
    const handle = await pickerWin.showSaveFilePicker({ suggestedName })
    const writable = await handle.createWritable()
    return { kind: 'ok', writable }
  } catch (error) {
    // 用户主动取消：正常返回，不算错误
    if (isAbortError(error)) return { kind: 'cancelled' }
    // 其他失败（如不在用户手势中触发）交给调用方走 blob 兜底
    return { kind: 'unsupported' }
  }
}

/** 请求文件并把响应体边读边写进用户选定的文件，全程不整块缓冲 */
async function pipeBodyToWritable(url: string, writable: FileSystemWritableFileStreamLike) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`下载链接已失效（HTTP ${response.status}），请重试`)
  }
  if (!response.body) {
    throw new Error('下载失败：无法读取响应内容')
  }

  const reader = response.body.getReader()
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      await writable.write(value)
    }
    await writable.close()
  } catch (error) {
    // 网络中断/链接失效：丢弃半成品文件并把错误抛给调用方
    await reader.cancel().catch(() => {})
    await writable.abort().catch(() => {})
    throw error
  }
}

// ==================== 对外接口 ====================

/**
 * 根据 URL 下载文件。
 * 顺序：先弹"另存为"让用户选位置 → 再发请求并流式写入磁盘。
 * @param url      - 文件下载地址
 * @param filename - 建议的文件名（不含路径），用户可在对话框里改名
 * @returns 是否真正保存了文件（用户主动取消对话框时返回 false，不应视为错误）
 */
export async function downloadFromUrl(
  url: string,
  filename: string,
): Promise<boolean> {
  const safeName = sanitizeFilename(filename)

  // 第 1 步：打开"另存为"，此时还没有任何网络请求和内存占用
  const sink = await openSaveSink(safeName)
  if (sink.kind === 'cancelled') return false
  if (sink.kind === 'unsupported') {
    // Firefox/Safari 没有 File System Access API：静默退回整块落盘
    await downloadViaBlob(url, safeName)
    return true
  }

  // 第 2 步：用户确认后才开始下载，正文以流的方式直落磁盘
  await pipeBodyToWritable(url, sink.writable)
  return true
}
