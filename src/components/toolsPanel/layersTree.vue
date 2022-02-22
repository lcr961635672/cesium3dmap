<!-- 图层目录 -->
<template>
  <div class="layersTerrWrap elInputWrapInit">
    <el-input
      placeholder="输入关键字进行过滤"
      size="mini"
      v-model="filterText"
    ></el-input>
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
import Globe from '../../core/globe'
export default {
  data () {
    return {
      filterText: '', // 过滤关键字
      layersData: [
        {
          id: 1,
          label: '模型数据',
          children: [
            {
              id: 4,
              label: '倾斜摄影',
              children: [
                {
                  id: 9,
                  label: '大雁塔',
                  url: '/static/data/model/大雁塔3dtiles/tileset.json',
                  type: 'model-osgb',
                  modelSoilHeight: '-20',
                  initPosition: '',
                  modelPositionCalibration: '108.96397,34.21843'
                }
              ]
            },
            {
              id: 14,
              label: '人工建模',
              children: [
                {
                  id: 110,
                  label: '现代建筑',
                  url: '/static/data/model/模型3dtiles/tileset.json',
                  type: 'model-max',
                  modelSoilHeight: '140',
                  initPosition: '',
                  modelPositionCalibration: '116.3912,39.9084'
                }
              ]
            },
            {
              id: 34,
              label: '建筑物白模',
              children: [
                {
                  id: 39,
                  label: '合肥市',
                  url: '/static/data/model/合肥3dtiles/tileset.json',
                  type: 'model-shp',
                  modelSoilHeight: '20',
                  initPosition: '117.2860,31.8555, 3000',
                  modelPositionCalibration: ''
                }
              ]
            }
          ]
        },
        {
          id: 3,
          label: '影像数据',
          type: 'layer',
          children: [
            {
              id: 31,
              label: 'WMTS',
              children: [
                {
                  id: 311,
                  label: '地形晕渲',
                  url: 'http://t0.tianditu.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetCapabilities&VERSION=1.0.0',
                  type: 'layer-wmts',
                  initPosition: ''
                }, {
                  id: 312,
                  label: '宁波影像地图',
                  url: 'http://www.nbmap.gov.cn/wmts/NBIMG',
                  type: 'layer-wmts',
                  initPosition: ''
                }
              ]
            }, {
              id: 32,
              label: 'ArcGIS',
              children: [
                {
                  id: 321,
                  label: '湖南省医院分布地理信息数据',
                  url: 'http://222.247.40.204:6080/arcgis/rest/services/yiyuan/MapServer',
                  type: 'layer-ArcGIS',
                  initPosition: '111.7162, 27.6019, 500000'
                }
              ]
            }, {
              id: 33,
              label: 'WMS',
              children: [
                {
                  id: 331,
                  label: '水体',
                  url: 'https://nationalmap.gov.au/proxy/http://geoserver.nationalmap.nicta.com.au/geotopo_250k/ows',
                  layers: 'Hydrography:bores',
                  type: 'layer-wms',
                  initPosition: ''
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '矢量数据',
          children: [
            {
              id: 21,
              label: 'GeoJson',
              children: [
                {
                  id: 211,
                  label: '全国行政区',
                  url: '/static/data/vector/geojson/region.json',
                  type: 'vector-geojson'
                }
              ]
            },
            {
              id: 22,
              label: 'CZML',
              children: [{
                id: 221,
                label: '船舶',
                url: '/static/data/vector/czml/ScenarioFlight.czml',
                type: 'vector-czml',
                initPosition: '123.3486, 34.4603, 800000'
              }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  components: {},

  computed: {},

  mounted () {},

  methods: {
    // 输入框过滤
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 树选中方法   模型加载或矢量图层加载
    treeCheck (node, check, childCheck) {
      const self = this
      let url = ''
      let type = node.type
      let soilHeight = ''
      let layerType = ''
      let layerid = node.id
      if (check) {
        if (node.url) {
          soilHeight = node.modelSoilHeight
          if (type.includes('model')) {
            let urls = node.url.split(',')
            urls.forEach((urlItem) => {
              url = urlItem
              let modelAdd = Globe.add3DtilesData(
                self.viewer,
                url,
                soilHeight,
                node
              )
              Globe.modelsLevel.push({
                model: modelAdd,
                level: node.displayLevel
              })
            })
            if (type.includes('shp')) {
              self.shpLegendShow = true
            }
          } else if (type.includes('layer')) {
            layerType = type.split('-')[1]
            let twodLayer = self.layerDiftypeAdd(node, layerType)
            if (twodLayer) {
              let imageryLayers =
                self.viewer.scene.imageryLayers.addImageryProvider(twodLayer)
              Globe.ids.push({
                mark: layerid,
                layer: imageryLayers
              })
            }
          } else if (type.includes('vector')) {
            layerType = type.split('-')[1]
            const resource = this.vectorDiftypeAdd(node, layerType)
            const dataSrouce = this.viewer.dataSources.add(resource);
            Globe.ids.push({
                mark: layerid,
                layer: dataSrouce
              })
          }
        }
      } else {
        if (node.url) {
          type = node.type
          if (type.includes('model')) {
            let urls = node.url.split(',')
            urls.forEach((urlItem) => {
              url = urlItem
              self.removeModel(self.viewer, url)
              Globe.modelsLevel.forEach((item, indexM) => {
                if (item.model.url === url) {
                  Globe.modelsLevel.splice(indexM, 1)
                }
              })
            })
          } else if (type.includes('layer')) {
            url = node.url
            layerType = node.interfaceType
            self.removeLayer(self.viewer, url, layerid, layerType)
          } else if (type.includes('vector')) {
            url = node.url
            self.removeVector(self.viewer, url)
          }
        }
      }
    },
    removeModel (viewer, url) {
      var primitives = viewer.scene.primitives._primitives
      primitives.forEach((item, i) => {
        if (item._url === url) {
          viewer.scene.primitives.remove(item)
        }
      })
    },
    removeLayer (viewer, url, layerid, type) {
      Globe.ids.forEach((item, i) => {
        if (item.mark === layerid) {
          viewer.scene.imageryLayers.remove(item.layer)
        }
      })
    },
    removeVector(viewer, url) {
      let GeoJSONDatas = viewer.dataSources._dataSources
        GeoJSONDatas.forEach((geoItem) => {
          if (url.includes(geoItem._name)) {
            viewer.dataSources.remove(geoItem)
          }
        })
    },
    layerDiftypeAdd(node, type) {
      const {url, layers, initPosition} = node;
      let result = null;
      switch (type) {
        case 'wms':
          result = new Cesium.WebMapServiceImageryProvider({
            url,
            layers,
            parameters: {
              transparent: true,
              format: "image/png",
            },
          })
        case 'wmts':
          result = new Cesium.WebMapTileServiceImageryProvider({
            url,
            style : 'default',
            format : 'image/jpeg',
          });
        case 'ArcGIS':
        result = new Cesium.ArcGisMapServerImageryProvider({
          url
        })
        if (initPosition) {
          Globe.flyToPoint(this.viewer, initPosition)
        }
       return result;
      }

    },
    vectorDiftypeAdd(node, type) {
      const { url, initPosition } = node;
      let result = null;
      switch (type) {
        case 'geojson':
          result = Cesium.GeoJsonDataSource.load(url, {
            stroke: Cesium.Color.WHITE,
            fill: Cesium.Color.BLUE.withAlpha(0.3), //注意：颜色必须大写，即不能为blue
            strokeWidth: 5
          });
        case 'czml':
        result = Cesium.CzmlDataSource.load(url)
        if (initPosition) {
          Globe.flyToPoint(this.viewer, initPosition)
        }
        return result;
      }
    }
  }
}
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
  font-size: 14px;
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
  padding-left: 23px;
  margin: 0 4px;
  background: url("../../../static/img/secondMenu/wenjian.png") no-repeat;
  background-size: 1.1vw 2vh;
}
.el-tree-node__children .el-tree-node__children .el-tree-node__label {
  background: url("../../../static/img/secondMenu/wendang.png") no-repeat;
  background-size: 1vw 1.7vh;
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
  background-size: 1vw 1.7vh;
  color: #55f32f;
}
</style>
