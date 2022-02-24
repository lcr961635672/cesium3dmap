<!-- 卷帘对比 -->
<template>
  <div class="rollingCurtainWrap">
    <div class="titleH">
      <div class="leftH">卷帘</div>
    </div>
    <div class="contentWrap">
      <div class="column">
        <div class="label">选择数据：</div>
        <el-select
          v-model="leftValue"
          placeholder="请选择"
          size="mini"
          style="width: 9vw"
          @change="changeLeftLayer"
        >
          <el-option
            v-for="item in options"
            :key="item.url"
            :label="item.label"
            :value="item.label"
          ></el-option>
        </el-select>
        <el-select
          v-model="rightValue"
          placeholder="请选择"
          size="mini"
          style="width: 9vw;margin: 1vh 0 0 68px;"
          @change="changeRightLayer"
        >
          <el-option
            v-for="item in options"
            :key="item.url"
            :label="item.label"
            :value="item.label"
          ></el-option>
        </el-select>
      </div>
      <div class="column" style="overflow:hidden;">
        <div class="label" style="float: left;height: 50px;line-height: 50px;">透明度：</div>
        <el-slider
          v-model="value2"
          :marks="marks"
          size="mini"
          :step="20"
          show-stops
          style="display: inline-block; width: 9vw; margin-left: 1vw;float: left;"
          @change="changeImageryAlpha"
        ></el-slider>
      </div>
      <!-- <div class="column" style="margin-top: 1vh;">
        <div class="label">卷帘顺序：</div>
        <el-radio-group v-model="radio">
          <el-radio :label="0">左右</el-radio>
          <el-radio :label="1">上下</el-radio>
        </el-radio-group>
      </div>-->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      /*  options: [
        {
          value: "1",
          label: "ArcGIS卫星"
        },
        {
          value: "2",
          label: "谷歌卫星"
        },
        // {
        //   value: "3",
        //   label: "微软卫星"
        // },
        {
          value: "4",
          label: "天地图卫星"
        },
        {
          value: "5",
          label: "天地图电子"
        }
      ], */
      leftValue: "标准地图",
      rightValue: "影像地图",
      value2: 0,
      marks: {
        0: "0",
        20: "0.2",
        40: "0.4",
        60: "0.6",
        80: "0.8",
        100: "1"
      },
      radio: 0
    };
  },
  methods: {
    getMapData() {
      const self = this;
      let params = {
        pageSize: 1000,
        pageNo: 1
      };
      $.post(config.baseURL + "/digitalcity/query", params, res => {
        let data = res.data.resultList;
        data.forEach(item => {
          switch (item.RESOURCENAME) {
            case "commonMapURL":
              self.options.push({
                label: item.ALIASNAME,
                url: item.RESOURCEVALUE
              });
              break;
            case "tdtQQYXURL":
              self.options.push({
                label: item.ALIASNAME,
                url: item.RESOURCEVALUE
              });
              break;
            case "demMapURL":
              self.options.push({
                label: item.ALIASNAME,
                url: item.RESOURCEVALUE
              });
              break;
            default:
              break;
          }
        });
        self.leftInit("标准地图");
      });
    },
    changeLeftLayer(val) {
      const self = this;
      self.leftInit(val);
      //self.viewer.imageryLayers._layers[2] = self.setCurrentImageryLayer(val);
    },
    getItemByVal(val) {
      const self = this;
      let result = null;
      self.options.forEach(item => {
        if (item.label == val) {
          result = item;
        }
      });
      return  result;
    },
    changeRightLayer(val) {
      const self = this;
      let item = self.getItemByVal(val);
      var layers = self.viewer.imageryLayers;
      let bottomLayer = layers.get(0);
      layers.remove(bottomLayer);
      let rightChangeLayer = layers.addImageryProvider(
        self.setCurrentImageryLayer(item)
      );
      layers.lower(rightChangeLayer);
    },
    setCurrentImageryLayer(item) {
      const self = this;
      let result = null;
      let matrixIds = [];
      for (let i = 0; i < 19; ++i) {
        matrixIds[i] = i + 1;
      }
      switch (item.label) {
        case "标准地图":
          //标准地图
          result = new Cesium.WebMapTileServiceImageryProvider({
            url: item.url,
            style: "default",
            format: "image/jpeg",
            tileMatrixLabels: matrixIds,
            tilingScheme: new Cesium.GeographicTilingScheme({
              numberOfLevelZeroTilesX: 2,
              numberOfLevelZeroTilesY: 1
            })
          });
          break;
        case "影像地图":
          //影像地图
          result = new Cesium.WebMapTileServiceImageryProvider({
            url: item.url,
            style: "default",
            format: "image/jpeg",
            tileMatrixLabels: matrixIds,
            tilingScheme: new Cesium.GeographicTilingScheme({
              numberOfLevelZeroTilesX: 2,
              numberOfLevelZeroTilesY: 1
            })
          });
          break;
        //地形地图
        case "地形地图":
          result = new Cesium.WebMapTileServiceImageryProvider({
            url: item.url,
            style: "default",
            format: "image/jpeg",
            tileMatrixLabels: matrixIds,
            tilingScheme: new Cesium.GeographicTilingScheme({
              numberOfLevelZeroTilesX: 2,
              numberOfLevelZeroTilesY: 1
            })
          });
          break;
        default:
          break;
      }
      /*  switch (val) {
        case "1":
          //arcgis卫星
          result = new Cesium.ArcGisMapServerImageryProvider({
            url:
              "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
          });
          break;
        case "2":
          //谷歌卫星
          result = new Cesium.UrlTemplateImageryProvider({
            url:
              "https://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali"
          });
          break;
        case "3":
          break;
        //天地图影像及注记
        case "4":
          result = new Cesium.WebMapTileServiceImageryProvider({
            url: MapConfig.tdtYXURL,
            layer: "tdtAnnoLayer1",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible",
            show: false
          });
          break;
        case "5":
          //天地图电子及注记
          result = new Cesium.WebMapTileServiceImageryProvider({
            url: MapConfig.tdtSLURL,
            layer: "tdtVecBasicLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible",
            show: false
          });
          break;
        default:
          break;
      } */
      return result;
    },
    changeImageryAlpha(val) {
      const self = this;
      const layers = self.viewer.imageryLayers;
      layers._layers.forEach((item, index) => {
        item.alpha = (100 - val) / 100;
      });
    },
    leftInit(val) {
      const self = this;
      var layers = self.viewer.imageryLayers;
      let splitLayer = layers.get(layers.length - 1);
      let item = self.getItemByVal(val);
      ///layers.remove(splitLayer);
      var earthAtNight = layers.addImageryProvider(
        self.setCurrentImageryLayer(item)
      );
      earthAtNight.splitDirection = Cesium.ImagerySplitDirection.LEFT;
    }
  },
  mounted() {
    const self = this;
    self.getMapData();
    $("#slider").show();
    var slider = document.getElementById("slider");
    self.viewer.scene.imagerySplitPosition =
      slider.offsetLeft / slider.parentElement.offsetWidth;
    var handler = new Cesium.ScreenSpaceEventHandler(slider);
    var moveActive = false;
    function move(movement) {
      if (!moveActive) {
        return;
      }
      var relativeOffset = movement.endPosition.x;
      var splitPosition =
        (slider.offsetLeft + relativeOffset) / slider.parentElement.offsetWidth;
      slider.style.left = 100.0 * splitPosition + "%";
      self.viewer.scene.imagerySplitPosition = splitPosition;
    }
    handler.setInputAction(function() {
      moveActive = true;
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    handler.setInputAction(function() {
      moveActive = true;
    }, Cesium.ScreenSpaceEventType.PINCH_START);
    handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);
    handler.setInputAction(function() {
      moveActive = false;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);
    handler.setInputAction(function() {
      moveActive = false;
    }, Cesium.ScreenSpaceEventType.PINCH_END);
  },
  beforeDestroy() {
    const self = this;
    $("#slider").hide();
    self.viewer.scene.imagerySplitPosition = 0;
    //let layers = self.viewer.imageryLayers;
    //layers.removeAll();
  }
};
</script>

<style scoped>
.rollingCurtainWrap {
  /* position: fixed;
  bottom: 5vh;
  left: 52%; */
  /* width: 16vw;
  height: 23vh;
  background: rgba(255, 255, 255, 0.7);
  border: 2px solid rgba(55, 157, 255, 1);
  box-shadow: 0px 1px 18px 0px rgba(128, 128, 128, 0.41);
  border-radius: 10px;
  color: #191919; */
  font-size: 0.8rem;
}
.titleH {
  border-left: 3px solid #00fff6;
  padding: 0 0.4vw;
  margin: 2vh 0.4vw 2vh;
  font-size: 0.8rem;
}
.contentWrap {
  width: 100%;
  height: 100%;
  padding: 1vh 1vw;
}
.label {
  display: inline-block;
}
</style>
<style>
.rollingCurtainWrap .el-input__inner {
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 0;
  height: 3.5vh;
  color: #fff;
}
.rollingCurtainWrap .el-slider__button {
  width: 10px;
  height: 10px;
}
.rollingCurtainWrap .el-radio {
  margin-right: 1vw;
  color: #191919;
}
.rollingCurtainWrap .el-radio__label {
  font-size: 0.8rem;
}
.rollingCurtainWrap .el-slider__marks-text {
  color: #fff;
}
.rollingCurtainWrap .el-radio__input.is-checked + .el-radio__label {
  color: #191919;
}
</style>