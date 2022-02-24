<!-- 图上标绘 -->
<template>
  <div>
    <div class="drawMarksWrap">
      <ul class="contentToolImgUl" v-show="firstMenuShow">
        <li
          v-for="(item, index) in $parent.selectData.children"
          :key="index"
          @click="clickQuery(item, index)"
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
    </div>
        <promptBox ref="prompt"></promptBox>

  </div>
</template>

<script>
import DrawTool from '../../core/drawPlot/drawTool'
import promptBox from '../common/promptBox'

export default {
  data () {
    return {
      selectIndex: -1,
      firstMenuShow: true,
      currentData: {} // 当前选中的值
    }
  },

  components: {promptBox},

  computed: {},

  mounted () {
    DrawTool.initParam(this.viewer, this.$refs.prompt)
  },

  methods: {
    // 子菜单返回按钮调用的事件
    childBackMenu () {
      const self = this
      self.firstMenuShow = true
      self.dynamicComponents = null
      self.currentData.active = false
      self.selectIndex = -1
    },
    clickQuery (item, index) {
      const self = this
      self.selectIndex = index
      item.active = !item.active
      self.currentData = item
      if (item.active) {
        switch (item.name) {
          case '点':
            DrawTool.startDraw({
              type: 'billboard',
              style: {

              },
              success: function (positions) {
                console.log(positions)
              }
            })
            break
          case '线':
            DrawTool.startDraw({
              type: 'polyline',
              style: {
                material: window.Cesium.Color.YELLOW,
                clampToGround: true
              },
              success: function (positions) {
                console.log(positions)
              }
            })
            break
          case '面':
            DrawTool.startDraw({
              type: 'polygon',
              style: {
                clampToGround: true,
                material: window.Cesium.Color.BLUE
              },
              success: function (evt) {}
            })
            break
          case '圆':
            DrawTool.startDraw({
              type: 'circle',
              style: {
                clampToGround: true,
                material: window.Cesium.Color.YELLOW
              },
              success: function (evt) {}
            })
            break
          default:
            break
        }
      }
    }
  }
}
</script>
<style scoped>
.drawMarksWrap {
  overflow: hidden;
}

.secondMenuWrap {
  padding: 0 10px;
}
</style>
