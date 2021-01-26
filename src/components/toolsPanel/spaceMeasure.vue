  <!-- 空间测量 -->
<template>
  <div class="spaceMeasureWrap">
    <div class="measureImgWrap">
      <ul class="contentToolImgUl">
        <li
          v-for="(item, index) in $parent.selectData.children"
          :key="index"
          @click="clickTool(item,index)"
        >
          <div v-show="selectIndex !== index">
            <img class="toolImg" :src="'./static/img/secondMenu/'+item.name+'.png'" alt />
            <div>{{item.name}}</div>
          </div>
          <div v-show="selectIndex == index">
            <img class="toolImg" :src="'./static/img/secondMenu/'+item.name+'1.png'" alt />
            <div style="color: #55f32f">{{item.name}}</div>
          </div>
        </li>
      </ul>
    </div>
    <component v-bind:is="dynamicComponents" ref="child"></component>
    <promptBox ref="prompt"></promptBox>
  </div>
</template>

<script>
import DrawTool from "../../core/drawPlot/drawTool";
import promptBox from "../common/promptBox";
export default {
  data() {
    return {
      selectIndex: -1,
      dynamicComponents: null,
    };
  },

  components: { promptBox },

  computed: {},

  mounted() {
    const self = this;
    DrawTool.initParam(self.viewer, self.$refs.prompt);
  },

  methods: {
    clickTool(item, index) {
      const self = this;
      self.selectIndex = index;
      item.active = !item.active;
      if (item.active) {
        switch (item.name) {
          case "空间距离":
            DrawTool.startDraw({
              type: "polyline",
              style: {
                material: Cesium.Color.YELLOW,
                clampToGround: true,
              },
              success: function (evt) {},
            });
            break;
          case "垂直距离":
            DrawTool.startDraw({
              type: "rectangle",
              style: {
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              },
              success: function (evt) {},
            });
            break;
          case "水平面积":
            break;
          case "贴地距离":
            break;
          case "贴地面积":
            break;
          case "角度":
            break;

          default:
            break;
        }
      }
    },
  },
};
</script>
<style scoped>
.measureImgWrap {
  overflow: hidden;
}

</style>