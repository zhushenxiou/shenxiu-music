<template>
  <div class="login">
    <!-- 二维码扫码登录 -->
    <div class="QRCodeLogin">
      <div class="title">扫码登录</div>

      <!-- 扫码图片部分 -->
      <div class="scanfArea" v-show="QRCodeStateCode === 0 ||
        QRCodeStateCode === 800 ||
        QRCodeStateCode === 801
        ">
        <!-- 提示图片 -->
        <div class="hintImg">
          <img src="./img/hint.png" alt="" />
        </div>
        <!-- 二维码 -->
        <div class="QRCode">
          <img :src="QRCodeBase" alt="" />
          <!-- 提示内容 -->
          <p class="hint">使用网易云音乐App扫码登录</p>
        </div>
      </div>

      <!-- 二维码失效刷新 -->
      <div class="QRCodeInvalid" v-show="QRCodeStateCode === 800">
        <el-button type="danger" size="small" @click="updateQRCode">刷新二维码</el-button>
      </div>

      <!-- 扫码确认待确认 -->
      <div class="waitConfirm">
        <img src="./img/waitConfirm.png" v-show="QRCodeStateCode === 802" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getQRCodeKeyApi, getQRCodeBaseApi, checkQRCodeStateApi
} from '@/api/login'
import { useRouter } from 'vue-router';
const router = useRouter()
const { closeDialog } = defineProps(['closeDialog'])


// 二维码的Base64值
const QRCodeBase = ref('')
// 二维码的状态值
const QRCodeState = ref({})
// 二维码的状态码
const QRCodeStateCode = ref(0)
// 监测二维码状态的定时器
let checkTimer: number | undefined = undefined

//二维码登录
async function toQRCodeLogin() {
  // 先生成二维码key值
  const key = await getQRCodeKey()
  // 通过key获取二维码的 base64 编码
  await getQRCodeBase(key)
  // 防抖,如果定时器存在，则先清除定时器
  if (checkTimer) {
    clearInterval(checkTimer)
  }
  // 开启定时器，定时检测二维码的扫描状态
  checkTimer = setInterval(async () => {
    await checkQRCodeState(key)
  }, 1000)
}

onMounted(async () => {
  toQRCodeLogin()
})

onUnmounted(() => {
  // 组件卸载时，清除定时器
  if (checkTimer) {
    clearInterval(checkTimer)
  }
})
// 获取二维码key值
async function getQRCodeKey() {
  const res = await getQRCodeKeyApi()
  return res.data.unikey
}

// 生成二维码Base值
async function getQRCodeBase(key: string) {
  // 每次重新获取二维码时，将二维码的状态值重置
  QRCodeState.value = {}
  QRCodeStateCode.value = 0
  // 通过key获取二维码的 base64 编码
  const res = await getQRCodeBaseApi(key)
  QRCodeBase.value = res.data.qrimg
}

//检测二维码状态是否过期
async function checkQRCodeState(key: string) {
  const res: any = await checkQRCodeStateApi(key)
  // 如果状态码改变了
  if (res.code !== QRCodeStateCode.value) {
    console.log(res)
    if (res.code === 800) {
      clearInterval(checkTimer)
      ElMessage.warning('二维码已过期')
    } else if (res.code === 802) {
      ElMessage.success('扫码成功，请确认是否登录')
    } else if (res.code === 803) {
      clearInterval(checkTimer)
      ElMessage.success('登录成功')
      closeDialog()
      // 刷新页面
      router.go(0)
    }
    // 将获取到的 cookie 保存在 localStorage 中
    localStorage.setItem('cookie', res.cookie)
    // 储存新的状态码状态码和状态值
    QRCodeStateCode.value = res.code
    QRCodeState.value = res
  }
}

// 刷新二维码
function updateQRCode() {
  toQRCodeLogin().then(() => ElMessage.success('刷新成功！'))
}

</script>

<style lang="less" scoped>
.login {

  .QRCodeLogin {
    padding: 0 10px;
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      font-size: 20px;
      color: #000;
      text-align: center;
    }

    .scanfArea {
      display: flex;
      flex-direction: column;
      align-items: center;

      .hintImg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        height: 250px;
        transition: 0.5s;

        img {
          height: 100%;
        }
      }

      .QRCode {
        transition: 0.5s;
        height: 100px;
        width: 220px;

        img {
          width: 100%;
          transition: 0.5s;
        }

        .hint {
          white-space: normal;
          text-align: center;
          line-height: 25px;
          font-size: 16px;
        }
      }

      &:hover {
        .hintImg {
          opacity: 1;
          transform: translate(-150px, -150px);
        }

        .QRCode {
          transform: scale(0.7) translate(150px, 25px);
        }
      }
    }

    .QRCodeInvalid {
      position: absolute;
      bottom: 1rem;
      left: 1rem;
      font-size: 14px;
    }

    .waitConfirm {
      padding: 1rem;

    }

    .selectOther {
      position: absolute;
      bottom: 2rem;
      font-size: large;
      color: skyblue;
      cursor: pointer;

      &:active {
        color: #aaa;
      }
    }
  }
}
</style>
