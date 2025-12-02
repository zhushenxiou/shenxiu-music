<template>
  <div class="singer">
    <!-- 歌手分类 -->
    <div class="category">
      <!-- 地区分类 -->
      <div class="area">
        <div class="opts">
          <div :class="{ opt: true, selected: area.key === condition.areaKey }" v-for="(area, i) in category.area"
            :key="i" @click="switchOpt(area.key, 'area')">
            <span>{{ area.name }}</span>
          </div>
        </div>
      </div>
      <!-- 性别分类 -->
      <div class="type">
        <div class="opts">
          <div :class="{ opt: true, selected: type.key === condition.typeKey }" v-for="(type, i) in category.type"
            :key="i" @click="switchOpt(type.key, 'type')">
            <span>{{ type.name }}</span>
          </div>
        </div>
      </div>
      <!-- 首字母分类 -->
      <div class="initial">
        <div class="opts">
          <div :class="{ opt: true, selected: initial.key === condition.initialKey }" id="initial"
            v-for="(initial, i) in category.initial" :key="i" @click="switchOpt(initial.key, 'initial')">
            <span>{{ initial.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 歌手列表 -->
    <CSingerList :singerlist="singerlist" v-loading="isLoading" />
    <!-- 是否继续加载 -->
    <div class="continueLoading">
      <el-button color='#ed5736' plain @click="continueLoading">点击查看更多</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { staticSingerCategory } from '../static/useStaticData'
import { singerlistApi } from '@/api/discovery'
import { ElMessage } from 'element-plus'
import CSingerList from '@/components/common/CSingerList.vue'
const category = staticSingerCategory

const isLoading = ref(true)
// 关于分类获取歌手的条件
const condition = reactive({
  areaKey: -1,
  typeKey: -1,
  initialKey: '-1',
  // 当前加载数据的次数（配合实现懒加载）
  count: 1,
  // 每次加载30个
  limit: 30,
  // 是否还有更多数据
  isMore: false,
})
// 歌手列表信息
const singerlist = ref<any>([])

async function getSingerlist() {
  isLoading.value = true
  const res: any = await singerlistApi(
    condition.areaKey, condition.typeKey, condition.initialKey,
    (condition.count - 1) * condition.limit, condition.limit
  )
  singerlist.value.push(...res.artists)
  condition.isMore = res.more
  isLoading.value = false
}

// 切换条件
function switchOpt(key: any, opt: string) {
  if (opt == 'area') {
    condition.areaKey = key
  } else if (opt == 'type') {
    condition.typeKey = key
  } else {
    condition.initialKey = key
  }
  // 清空
  singerlist.value = []
  condition.count = 1
  getSingerlist()
}

// 继续加载
function continueLoading() {
  if (condition.isMore) {
    condition.count++
    getSingerlist()
  } else {
    ElMessage.warning('暂无更多数据!')
  }
}

getSingerlist()
</script>

<style lang="less" scoped>
.singer {
  padding: 0 0.5rem;
  height: 100%;

  .category {
    margin: 1rem 0;

    .area,
    .type,
    .initial {
      display: flex;
      align-items: flex-start;
      margin: 1rem 0;

      .opts {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-left: 12px;
        font-size: 14px;

        .opt {
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fff;
          border: 1px solid #eee;

          &:hover {
            background: rgba(236, 65, 65, 0.08);
            border-color: rgba(236, 65, 65, 0.2);
            transform: translateY(-2px);
          }

          &.selected {
            color: #ec4141;
            background: rgba(236, 65, 65, 0.08);
            border-color: rgba(236, 65, 65, 0.2);
          }
        }
      }
    }
  }

  .continueLoading {
    display: flex;
    justify-content: center;
    padding: 0.5rem;
  }

}
</style>
