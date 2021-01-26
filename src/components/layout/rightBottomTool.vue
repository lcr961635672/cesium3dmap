<!-- 右下角公共工具 -->
<template>
  <div class="rightToolWrap">
    <address-query-by-name></address-query-by-name>
    <div class="rightBottomToolWrap">
      <div class="imgWrap">
        <div class="imgsContain" v-for="(item, index) in imgBtns" :key="index">
          <img
            v-show="!item.active"
            :src="'../../../static/img/index/' + item.name + '.png'"
            alt=""
            :title="item.titleshow ? item.name + '开启' : item.name"
            @click="openTool(item)"
          />
          <img
            v-show="item.active"
            :src="'../../../static/img/index/' + item.name + '1.png'"
            alt=""
            :title="!item.titleshow ? item.name + '关闭' : item.name"
            @click="closeTool(item)"
          />
        </div>
      </div>
      <component v-bind:is="dynamicComponents"></component>
    </div>
   
  </div>
</template>

<script>
import Globe from "../../core/globe";
import addressQueryByName from "../common/addressQueryByName.vue";
export default {
  data() {
    return {
      dynamicComponents: null, //动态组件
      imgBtns: [
        {
          name: "i查询", //对应图片的名称， 加1为选中的图标
          active: false, //选中开关
          titleshow: true, //图标触碰上去的title显示，false显示name即可，true时，根据active的值显示开启关闭字眼
        },
        {
          name: "清除",
          active: false,
          titleshow: false,
        },
        {
          name: "地形",
          active: true,
          titleshow: true,
        },
        {
          name: "漫游",
          active: false,
          titleshow: true,
        },
        {
          name: "地图打印",
          active: false,
          titleshow: false,
        },
      ],
    };
  },

  components: { addressQueryByName },

  computed: {},

  mounted() {},

  methods: {
    //开启功能的按钮
    openTool(item) {
      const self = this;
      item.active = !item.active;
      switch (item.name) {
        case "i查询":
          self.$nextTick(() => {
            self.dynamicComponents = (resolve) =>
              require(["../toolsPanel/propertyQuery.vue"], resolve);
          });
          break;
        case "清除":
          Globe.clearAll(self.viewer, item.active);
          break;
        case "地形":
          Globe.terrainChange(self.viewer, item.active);
          break;
        case "漫游":
          self.$nextTick(() => {
            self.dynamicComponents = (resolve) =>
              require(["../common/roamModel.vue"], resolve);
          });
          break;
        case "地图打印":
          self.$nextTick(() => {
            self.dynamicComponents = (resolve) =>
              require(["../common/mapPrint.vue"], resolve);
          });
          break;
        default:
          break;
      }
    },
    //关闭功能的按钮
    closeTool(item) {
      const self = this;
      item.active = !item.active;
      self.dynamicComponents = null;
      switch (item.name) {
        case "i查询":
          break;
        case "地形":
          Globe.terrainChange(self.viewer, item.active);
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style scoped>
.rightBottomToolWrap {
  position: fixed;
  bottom: 220px;
  right: 5px;
}
.imgsContain {
  cursor: pointer;
}
</style>
