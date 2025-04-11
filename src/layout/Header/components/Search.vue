<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 搜索模块 -->
  <div class="search">
    <el-popover placement="bottom" width="18rem" trigger="click">
      <template #reference>
        <!-- 搜索框 -->
        <el-input class="search-input" placeholder="请输入内容" :prefix-icon="Search" v-model.trim="keywords"
          @keyup.enter="toSearch"></el-input>
      </template>
      <!-- 热搜列表 -->
      <div class="hotsearch">
        <div class="title">热搜榜</div>
        <div class="item" v-for="(item, index) in hotSearch" @click="goHotSearch(item.searchWord)" :key="index">
          <div class="index">{{ index + 1 }}</div>
          <div class="searchWord">{{ item.searchWord }}</div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { hotSearchApi } from '@/api/search'
import router from '@/router'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'

/**
 * 搜索
 */
const keywords = ref('')

function toSearch() {
  // 将当前搜索框中的关键字保存在 session 中
  // TODO 做建议搜索
  sessionStorage.setItem('keywords', keywords.value)
  // 判断，如果当关键字不为空串时才能进行搜索，否则进行提示
  if (keywords.value) {
    // 跳转页面，并传递搜索的关键词
    router.push({
      name: 'searchSongs',
      params: {
        keywords: keywords.value,
      },
    })
  } else {
    ElMessage.warning('请输入有效的搜索关键字 ！')
  }
}

const hotSearch = ref<{ searchWord: string; }[]>()
// 热搜榜单
async function getHotSearch() {
  const res = await hotSearchApi()
  hotSearch.value = res.data
}
// 跳转热搜
function goHotSearch(searchWord: string) {
  router.push({
    name: 'searchSongs',
    params: {
      keywords: searchWord,
    },
  })
}

onMounted(() => {
  // 获取热搜榜单
  getHotSearch()
})

</script>

<style lang="less" scoped>
.search {
  margin: 1rem;
  position: relative;

  // 搜索框样式优化
  :deep(.search-input) {
    .el-input__wrapper {
      border-radius: 20px;
      background: linear-gradient(145deg, #ff6060, #e13e3e);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      padding: 0 15px;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      &.is-focus {
        background: linear-gradient(145deg, #ff7070, #f15050);
      }

      input {
        color: #fff;
        font-weight: 500;
        height: 36px;

        &::placeholder {
          color: rgba(255, 255, 255, 0.8);
        }
      }

      .el-input__prefix {
        color: rgba(255, 255, 255, 0.9);
        margin-right: 8px;
      }
    }
  }

  // 弹出窗口样式
  :deep(.el-popper) {
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border: none;
    overflow: hidden;

    &[data-popper-placement^=bottom] {
      margin-top: 10px;
    }
  }
}

// 热搜榜样式优化
.hotsearch {
  height: 360px;
  padding: 12px 0;
  background: #fff;
  overflow-y: scroll;

  .title {
    position: sticky;
    top: 0;
    background: linear-gradient(180deg, #fff 85%, rgba(255, 255, 255, 0));
    padding: 0 16px 12px;
    margin: 0 0 8px;
    font-size: 18px;
    font-weight: 700;
    color: #333;
    z-index: 1;
  }

  .item {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    margin: 0 8px;
    border-radius: 8px;
    transition: all 0.2s ease;
    gap: 12px;

    &:hover {
      background: #f8f9fa;
      transform: translateX(4px);
    }

    .index {
      width: 24px;
      text-align: center;
      font-weight: 600;
      color: #666;

      &:nth-child(-n+3) {
        color: #ff3a3a;
      }
    }

    .searchWord {
      flex: 1;
      font-size: 14px;
      color: #333;
      font-weight: 500;
      position: relative;

      &::after {
        content: attr(data-content);
        position: absolute;
        right: 0;
        color: #999;
        font-size: 12px;
        opacity: 0;
        transition: opacity 0.2s;
      }
    }

    &:hover .searchWord::after {
      content: "点击搜索";
      opacity: 1;
    }
  }

  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;

    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
