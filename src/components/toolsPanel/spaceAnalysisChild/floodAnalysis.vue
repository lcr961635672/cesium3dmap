<!-- 淹没分析 -->
<template>
  <div class="profileAnalysisWrap">
    <div class="spaceChildHeaderWrap">
      <div class="leftHeader blockToLine">
        <i class="el-icon-back getCursor" @click="$parent.childBackMenu"></i>
        {{ $parent.currentData.name }}
      </div>
      <div class="rightHeader blockToLine" @click="beginDraw">
        <i class="el-icon-edit-outline">{{ drawText }}</i>
      </div>
    </div>
     <promptBox ref="prompt"></promptBox>
  </div>
</template>

<script>
import DrawTool from '../../../core/drawPlot/drawTool'
import promptBox from '../../common/promptBox.vue'
export default {
  data () {
    return {
      start: null,
      end: null,
      drawText: '开始绘制',
      myChart: null
    }
  },

  components: {promptBox},

  computed: {},

  mounted () {
    DrawTool.initParam(this.viewer, this.$refs.prompt)
    this.viewer.scene.globe.depthTestAgainstTerrain = true
  },

  methods: {
    // 开始绘制
    beginDraw () {
      const viewer = this.viewer
      const {Cesium} = window
      DrawTool.startDraw({
        type: 'polygon',
        style: {
          hasEdit: false,
          clampToGround: true,
          // eslint-disable-next-line new-cap
          material: new Cesium.Color.fromBytes(64, 157, 253, 100)
        },
        success: function (evt) {
          console.log(evt)
          const { positions, polygon } = evt
          viewer.entities.remove(polygon)
          var waterHeight = 0
          var entity = viewer.entities.add({
            polygon: {
              hierarchy: positions,
              // eslint-disable-next-line new-cap
              material: new Cesium.Color.fromBytes(64, 157, 253, 100),
              perPositionHeight: true,
              extrudedHeight: new Cesium.CallbackProperty(function () {
                return waterHeight
              })
            }
          })

          viewer.zoomTo(entity)

          viewer.clock.onTick.addEventListener(function () {
            if (waterHeight > 250) {
              viewer.entities.remove(entity)
            }
            waterHeight += 0.9
          })
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
