<!-- 主界面右侧主菜单 -->
<template>
  <div class="firstMenuWrap">
    <div class="mainMenuLeft">
      <div class="menuTool">
        <div
          :class="[{ active: selectMenuIndex == indexP }, 'menuToolItem']"
          v-for="(itemParent, indexP) in menuData"
          :key="indexP"
          @click="clickMenu(itemParent, indexP)"
        >
          <img
            v-show="selectMenuIndex != indexP"
            class="toolImg"
            :src="'./static/img/firstMenu/' + itemParent.name + '.png'"
            alt
          />
          <img
            v-show="selectMenuIndex == indexP"
            class="toolImg"
            :src="'./static/img/firstMenu/' + itemParent.name + '1.png'"
            alt
          />
          {{ itemParent.name }}
        </div>
      </div>
    </div>
    <div class="menuRightPanel" v-show="showPanelBtn">
      <div class="headerMenu">
        {{ menuName }}
        <img
          class="closeImg"
          src="../../../static/img/index/close.png"
          @click="closeRightChild"
          alt
        />
      </div>
      <component
        class="contentPanel"
        v-bind:is="dynamicComponents"
        ref="child"
      ></component>
    </div>
  </div>
</template>

<script>
import Globe from "../../core/globe";
export default {
  data() {
    return {
      menuImgPre: "../../../static/img/firstMenu/",
      imgLast: ".png",
      selectMenuIndex: -1,
      showPanelBtn: false,
      selectData: null,
      menuName: "",
      dynamicComponents: null,
      treeDefaultCheck: [],
      treeCheckNode: [],
      menuData: [
        {
          name: "图层目录",
          children: [],
        },
        {
          name: "空间测量",
          children: [
            {
              name: "空间距离",
              active: false,
            },
            {
              name: "垂直距离",
              active: false,
            },

            {
              name: "水平面积",
              active: false,
            },
            {
              name: "贴地距离",
              active: false,
            },
            {
              name: "贴地面积",
              active: false,
            },
            {
              name: "角度",
              active: false,
            },
          ],
        },
        {
          name: "坐标定位",
          children: [],
        },
        //  {
        //   name: "常用工具",
        //   children: [
        //     {
        //       name: "打印输出",
        //       active: false
        //     },
        //     {
        //       name: "清除",
        //       active: false
        //     }
        //   ]
        // },
        {
          name: "空间查询",
          children: [
            {
              name: "地名查询",
              active: false,
            },
            {
              name: "空间查询",
              active: false,
            },
            {
              name: "坡度查询",
              active: false,
            },
            {
              name: "高程查询",
              active: false,
            },
          ],
        },
        {
          name: "视角书签",
          children: [],
        },
        {
          name: "空间分析",
          children: [
            {
              name: "日照分析",
              active: false,
            },
            {
              name: "通视分析",
              active: false,
            },
            {
              name: "可视域",
              active: false,
            },
            {
              name: "控高分析",
              active: false,
            },
            {
              name: "淹没分析",
              active: false,
            },
            {
              name: "地形开挖",
              active: false,
            },
            {
              name: "剖面分析",
              active: false,
            },
            {
              name: "挖填方",
              active: false,
            },
          ],
        },
        {
          name: "对比分析",
          children: [
            {
              name: "双图对比",
              active: false,
            },
            {
              name: "卷帘对比",
              active: false,
            },
          ],
        },

        /* {
          name: "控规盒子",
          children: []
        } */
      ],
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    hideRight() {
      const self = this;
      //self.selectMenuIndex = -1;
      self.showPanelBtn = false;
    },
    openRight() {
      const self = this;
      if (self.selectMenuIndex == -1) {
        self.$message({
          message: "未选择功能按钮",
          type: "warning",
        });
      } else {
        self.showPanelBtn = true;
      }
    },
    closeRightChild() {
      const self = this;
      self.selectMenuIndex = -1;
      self.showPanelBtn = false;
    },

    clickMenu(data, index) {
      const self = this;
      self.showPanelBtn = true;
      self.selectMenuIndex = index;
      if (self.selectData) {
        self.selectData.children.forEach((item) => {
          item.active = false;
        });
      }
      self.menuName = data.name;
      self.selectData = data;
      switch (data.name) {
        case "图层目录":
          self.$nextTick(() => {
            self.dynamicComponents = (resolve) =>
              require(["../toolsPanel/layersTree.vue"], resolve);
          });
          break;
        case "空间测量":
          self.$nextTick(() => {
            self.dynamicComponents = (resolve) =>
              require(["../toolsPanel/spaceMeasure.vue"], resolve);
          });
          break;
        case "坐标定位":
          self.$nextTick(() => {
            self.dynamicComponents = (resolve) =>
              require(["../toolsPanel/coordinatePosition.vue"], resolve);
          });
          break;
        // case "空间查询":
        //   self.$nextTick(() => {
        //     self.dynamicComponents = resolve =>
        //       require(["../rightTools/spaceQuery.vue"], resolve);
        //   });
        //   self.$parent.$refs.lefttool.queryIClose();
        //   break;
        case "视角书签":
          self.$nextTick(() => {
            self.dynamicComponents = (resolve) =>
              require(["../toolsPanel/viewBook.vue"], resolve);
          });
          break;
          case "空间分析":
          self.$nextTick(() => {
            self.dynamicComponents = (resolve) =>
              require(["../toolsPanel/spatialAnalysis.vue"], resolve);
          });
        // case "三维分析":
        //   self.$nextTick(() => {
        //     self.dynamicComponents = resolve =>
        //       require(["../rightTools/threeMapAnalysis.vue"], resolve);
        //   });
        //   self.$parent.$refs.lefttool.queryIClose();
        //   break;
        //   case "地形分析":
        //   self.$nextTick(() => {
        //     self.dynamicComponents = resolve =>
        //       require(["../rightTools/terrainAnalysis.vue"], resolve);
        //   });
        //   self.$parent.$refs.lefttool.queryIClose();
        //   break;
        //  case "空间测量":
        //   self.$nextTick(() => {
        //     self.dynamicComponents = resolve =>
        //       require(["../rightTools/spaceMeasure.vue"], resolve);
        //   });
        //   break;
        // case "多图对比":
        //   self.$nextTick(() => {
        //     self.dynamicComponents = resolve =>
        //       require(["../rightTools/multiGraphCompare.vue"], resolve);
        //   });
        //   self.$parent.$refs.lefttool.queryIClose();
        //   break;
        // case "控规盒子":
        //   self.$nextTick(() => {
        //     self.dynamicComponents = resolve =>
        //       require(["../rightTools/controlBox.vue"], resolve);
        //   });
        //   break;
        // case "地下空间":
        //   self.$nextTick(() => {
        //     self.dynamicComponents = resolve =>
        //       require(["../rightTools/caseAnalysis.vue"], resolve);
        //   });
        //   break;
        //   case "方案评审":
        //   self.$nextTick(() => {
        //     self.dynamicComponents = resolve =>
        //       require(["../rightTools/schemeReview.vue"], resolve);
        //   });
        //   break;
        default:
          break;
      }
    },
  },
};
</script>
<style scoped>
.firstMenuWrap {
  position: fixed;
  left: 0;
  top: 14vh;
  color: #fff;
  font-size: 1rem;
}
.mainMenuLeft {
  margin-left: 1vw;
  display: inline-block;
}
.menuLogo {
  width: 13vw;
  cursor: pointer;
  margin-top: -3vh;
}
.menuTool {
  width: 7rem;
  margin: 0 auto;
  padding: 0 1.2vw;
  background: rgba(63, 72, 84, 0.7);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
}
.menuToolItem {
  padding: 1vh 0;
  cursor: pointer;
}
.toolImg {
  vertical-align: middle;
  width: 1.5rem;
  height: 1.5rem;
}
.active {
  color: #55f32f;
}
.menuRightPanel {
  float: right;
  width: 17vw;
  height: 80vh;
  background: rgba(63, 72, 84, 0.7);
  margin-left: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
}
.headerMenu {
  width: 100%;
  height: 2.2vw;
  line-height: 2.2vw;
  padding-left: 1vw;
  font-size: 0.9rem;
  background: rgba(63, 72, 84, 1);
  box-sizing: border-box;
}
.closeImg {
  position: absolute;
  right: 0.8vw;
  top: 0.8vh;
  cursor: pointer;
}
.contentPanel {
  width: 100%;
  height: 75vh;
  padding: 1vh 0.5vw;
  box-sizing: border-box;
}
</style>
