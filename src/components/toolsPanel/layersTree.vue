<!-- 图层目录 -->
<template>
  <div class="layersTerrWrap elInputWrapInit">
    <el-input placeholder="输入关键字进行过滤" size="mini" v-model="filterText"></el-input>
    <el-tree
      show-checkbox
      :data="layersData"
      size="mini"
      node-key="id"
      :props="defaultProps"
      default-expand-all
      :filter-node-method="filterNode"
      @check-change="treeCheck"
      ref="tree"
    ></el-tree>
  </div>
</template>

<script>
import Globe from "../../core/globe";
export default {
  data() {
    return {
      filterText: "", //过滤关键字
      layersData: [
        {
          id: 1,
          label: "三维模型",
          children: [
            {
              id: 4,
              label: "倾斜摄影",
              children: [
                {
                  id: 9,
                  label: "厂房",
                  url:
                    "http://data.marsgis.cn/3dtiles/qx-changfang/tileset.json",
                  type: "model-osgb",
                  modelSoilHeight: "0",
                  initPosition: "",
                  modelPositionCalibration: "",
                },
                {
                  id: 10,
                  label: "学校",
                  url:
                    "http://data.marsgis.cn/3dtiles-ex/qx-xuexiao/tileset.json",
                  type: "model-osgb",
                  modelSoilHeight: "18",
                  initPosition: "",
                  modelPositionCalibration: "",
                },
              ],
            },
            {
              id: 14,
              label: "人工建模",
              children: [
                {
                  id: 19,
                  label: "检查站",
                  url: "http://data.marsgis.cn/3dtiles-ex/max-jcz/tileset.json",
                  type: "model-max",
                  modelSoilHeight: "45",
                  initPosition: "",
                  modelPositionCalibration: "",
                },
                {
                  id: 110,
                  label: "学校宿舍",
                  url:
                    "ttp://data.marsgis.cn/3dtiles-ex/max-sushe/tileset.json",
                  type: "model-max",
                  modelSoilHeight: "0",
                  initPosition: "",
                  modelPositionCalibration: "",
                },
              ],
            },
            {
              id: 24,
              label: "BIM模型",
              children: [
                {
                  id: 29,
                  label: "地铁口",
                  url:
                    "http://data.marsgis.cn/3dtiles-ex/bim-ditiekou/tileset.json",
                  type: "model-bim",
                  modelSoilHeight: "-430",
                  initPosition: "",
                  modelPositionCalibration: "",
                },
                {
                  id: 210,
                  label: "幼儿园建筑",
                  url:
                    "http://data.marsgis.cn/3dtiles-ex/bim-youeryuan/tileset.json",
                  type: "model-bim",
                  modelSoilHeight: "36",
                  initPosition: "",
                  modelPositionCalibration: "",
                },
              ],
            },
            {
              id: 34,
              label: "建筑物白模",
              children: [
                {
                  id: 39,
                  label: "上海市区",
                  url:
                    "http://data.marsgis.cn/3dtiles/jzw-shanghai/tileset.json",
                  type: "model-shp",
                  modelSoilHeight: "20",
                  initPosition: "",
                  modelPositionCalibration: "",
                },
                {
                  id: 310,
                  label: "青岛市",
                  url:
                    "http://data.marsgis.cn/3dtiles-ex/jzw-qingdao/tileset.json",
                  type: "model-shp",
                  modelSoilHeight: "0",
                  initPosition: "",
                  modelPositionCalibration: "",
                },
              ],
            },
          ],
        },
        {
          id: 2,
          label: "矢量数据",
          children: [],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  components: {},

  computed: {},

  mounted() {
  },

  methods: {
    //输入框过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    //树选中方法   模型加载或矢量图层加载
    treeCheck(node, check, childCheck) {
      const self = this;
      let url = "";
      let type = node.type;
      let soilHeight = "";
      let layerType = "";
      let layerid = node.id;
      if (check) {
        if (node.url) {
          soilHeight = node.modelSoilHeight;
          if (type.includes("model")) {
            let urls = node.url.split(",");
            urls.forEach((urlItem) => {
              url = urlItem;
              let modelAdd = Globe.add3DtilesData(
                self.viewer,
                url,
                soilHeight,
                node
              );
              Globe.modelsLevel.push({
                model: modelAdd,
                level: node.displayLevel,
              });
            });
            if (type.includes("shp")) {
              self.shpLegendShow = true;
            }
          } else if (type.includes("layer")) {
            url = node.address;
            layerType = node.interfaceType;
            let twodLayer = self.layerDiftypeAdd(url, layerType);
            if (twodLayer) {
              let imageryLayers = self.viewer.scene.imageryLayers.addImageryProvider(
                twodLayer
              );
              if (node.transparency) {
                imageryLayers.alpha = node.transparency / 100;
              }
              Globe.ids.push({
                mark: layerid,
                layer: imageryLayers,
              });
            }
          }
        }
      } else {
        if (node.url) {
          type = node.type;
          if (type.includes("model")) {
            let urls = node.url.split(",");
            urls.forEach((urlItem) => {
              url =  urlItem;
              self.removeModel(self.viewer, url);
              Globe.modelsLevel.forEach((item, indexM) => {
                if (item.model.url == url) {
                  Globe.modelsLevel.splice(indexM, 1);
                }
              });
            });
          } else if (type.includes("layer")) {
            url = node.address;
            layerType = node.interfaceType;
            self.removeLayer(self.viewer, url, layerid, layerType);
          }
        }
      }
    },
    removeModel(viewer, url) {
      var primitives = viewer.scene.primitives._primitives;
      primitives.forEach((item, i) => {
        if (item._url == url) {
          viewer.scene.primitives.remove(item);
        }
      });
    },
    removeLayer(viewer, url, layerid, type) {
      const self = this;
      if (type == "GeoJSON") {
        let GeoJSONDatas = viewer.dataSources._dataSources;
        GeoJSONDatas.forEach((geoItem) => {
          if (url.includes(geoItem._name)) {
            viewer.dataSources.remove(geoItem);
          }
        });
      } else {
        Globe.ids.forEach((item, i) => {
          if (item.mark == layerid) {
            viewer.scene.imageryLayers.remove(item.layer);
          }
        });
      }
    },
  },
};
</script>
<style scoped>
</style>
<style >
.layersTerrWrap .el-tree {
  height: 90%;
  overflow: auto;
}
.layersTerrWrap .el-tree::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.layersTerrWrap .el-tree::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.layersTerrWrap .el-tree::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.layersTerrWrap .el-checkbox__inner {
  background-color: transparent;
}
.layersTerrWrap .el-checkbox__inner:hover {
  border-color: #dcdfe6;
}
.layersTerrWrap .el-tree-node__content > label.el-checkbox {
  margin-right: 0;
}
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: transparent !important;
  border-color: #dcdfe6;
}
.layersTerrWrap .el-checkbox__input.is-checked .el-checkbox__inner {
  background: transparent;
  border-color: #dcdfe6;
}
.layersTerrWrap
  .el-tree-node__children
  .el-tree-node__children
  .el-checkbox__input.is-checked
  .el-checkbox__inner {
  background-color: #55f32f;
  border: none;
}
.layersTerrWrap .el-tree {
  background: transparent;
  color: #feffff;
}
.layersTerrWrap .el-tree-node__label {
  font-size: 0.8rem;
}
.layersTerrWrap .el-tree-node__content:hover {
  background: transparent;
  /* color: #f06045; */
  border: none;
}
.layersTerrWrap .el-tree-node__content:active {
  background: transparent;
  /* color: #f06045; */
  border: none;
}
.el-tree-node:focus > .el-tree-node__content {
  background-color: transparent !important;
  /* color: #f06045; */
  border: none;
}
.el-tree-node__content .el-tree-node__label {
  padding-left: 22px;
  margin: 0 3px;
  background: url("../../../static/img/secondMenu/wenjian.png") no-repeat;
  background-size: 1vw 2vh;
}
.el-tree-node__children .el-tree-node__children .el-tree-node__label {
  background: url("../../../static/img/secondMenu/wendang.png") no-repeat;
  background-size: 1vw 2vh;
}
/* .layersTerrWrap
  .el-tree-node__children
  .el-tree-node__children
  .el-tree-node__content:hover
  .el-tree-node__label, 
/* .layersTerrWrap
  .el-tree-node__children
  .el-tree-node__children
  .el-tree-node:focus
  .el-tree-node__label {
  background: url("../../../static/img/secondMenu/wendang1.png") no-repeat;
} */
.layersTerrWrap
  .el-tree-node__children
  .el-tree-node__children
  .el-tree-node__content
  .el-checkbox.is-checked
  + .el-tree-node__label {
  background: url("../../../static/img/secondMenu/wendang1.png") no-repeat;
  background-size: 1vw 2vh;
  color: #55f32f;
}
</style>