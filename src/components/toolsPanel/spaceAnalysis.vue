<!-- 空间分析 -->
<template>
  <div>
    <div class="spaceAnalysisWrap">
      <ul class="contentToolImgUl" v-show="firstMenuShow">
        <li
          v-for="(item, index) in $parent.selectData.children"
          :key="index"
          @click="clickAnalysis(item, index)"
        >
          <div v-show="selectIndex !== index">
            <img
              class="toolImg"
              :src="'./static/img/secondMenu/' + item.name + '.png'"
              alt
            />
            <div>{{ item.name }}</div>
          </div>
          <div v-show="selectIndex == index">
            <img
              class="toolImg"
              :src="'./static/img/secondMenu/' + item.name + '1.png'"
              alt
            />
            <div style="color: #55f32f">{{ item.name }}</div>
          </div>
        </li>
      </ul>
      <!-- 绑定动态组件 -->
      <component
        class="secondMenuWrap"
        v-show="!firstMenuShow"
        v-bind:is="dynamicComponents"
      ></component>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectIndex: -1,
      dynamicComponents: null,
      firstMenuShow: true,
      currentData: {} // 当前选中的值
    }
  },

  components: {},

  computed: {},

  mounted () {},

  methods: {
    // 子菜单返回按钮调用的事件
    childBackMenu () {
      const self = this
      self.firstMenuShow = true
      self.dynamicComponents = null
      self.currentData.active = false
      self.selectIndex = -1
    },
    clickAnalysis (item, index) {
      const self = this
      self.dynamicComponents = null // 先清空之前赋值的组件
      item.active = !item.active
      self.currentData = item
      if (item.active) {
        self.selectIndex = index
        self.firstMenuShow = false // 二级菜单展示，一级菜单隐藏
        switch (item.name) {
          case '日照分析':
            self.$nextTick(() => {
              self.dynamicComponents = (
                resolve // 赋值动态组件
              ) =>
                require([
                  '../toolsPanel/spaceAnalysisChild/sunshineAnalysis'
                ], resolve)
            })
            break
          case '通视分析':
            self.$nextTick(() => {
              self.dynamicComponents = (
                resolve
              ) =>
                require([
                  '../toolsPanel/spaceAnalysisChild/permeateAnalysis.vue'
                ], resolve)
            })
            break
          case '可视域':
            self.$nextTick(() => {
              self.dynamicComponents = (
                resolve
              ) =>
                require([
                  '../toolsPanel/spaceAnalysisChild/vsualAnalysis.vue'
                ], resolve)
            })
            break
          case '剖面分析':
            self.$nextTick(() => {
              self.dynamicComponents = (
                resolve
              ) =>
                require([
                  '../toolsPanel/spaceAnalysisChild/profileAnalysis.vue'
                ], resolve)
            })
            break
          case '淹没分析':
            self.$nextTick(() => {
              self.dynamicComponents = (
                resolve
              ) =>
                require([
                  '../toolsPanel/spaceAnalysisChild/floodAnalysis.vue'
                ], resolve)
            })
            break
          case '地形开挖':
            self.$nextTick(() => {
              self.dynamicComponents = (
                resolve
              ) =>
                require([
                  '../toolsPanel/spaceAnalysisChild/terrainExcavateAnalysis.vue'
                ], resolve)
            })
            break
          default:
            break
        }
      } else {
        self.selectIndex = -1
      }
    }
  }
}
</script>
<style scoped>
.spaceAnalysisWrap {
  overflow: hidden;
}

.secondMenuWrap {
  padding: 0 10px;
}
</style>
