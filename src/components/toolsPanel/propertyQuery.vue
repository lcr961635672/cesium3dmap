<!-- 二三维i查询 -->
<template>
  <div class="tushuWrap">
    <div id="trackPopUpProperty" v-show="showMapPanel" style="position: fixed;top:0;left:0;">
      <div id="trackPopUpContent" class="leaflet-popup" style="top:100px;left:0;">
        <div class="leaflet-mark">
          {{popName}}
          <img
            class="close"
            src="../../../static/img/index/close.png"
            alt
            @click="close"
          />
        </div>
        <div class="leaflet-popup-content-wrapper">
          <div id="trackPopUpLink" class="leaflet-popup-content">
            <div
              v-show="!showLayerProperty"
              v-for="(item,index) in popContent"
              :key="index"
              style="white-space: nowrap;
                 overflow: hidden;
                 text-overflow: ellipsis;margin: 0.9vh 0"
            >
              <span>{{item.name}}：</span>
              <span :title="item.value">{{item.value}}</span>
            </div>
            <div
              v-show="showLayerProperty"
              v-for="(item,index) in layerFeatures[currentPage-1]"
              :key="index + item.name"
              style="white-space: nowrap;
                 overflow: hidden;
                 text-overflow: ellipsis;margin: 0.9vh 0"
            >
              <span>{{item.name}} ：</span>
              <span :title="item.value">{{item.value}}</span>
            </div>
            <el-pagination
              background
              size="mini"
              v-show="showLayerProperty"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              layout="prev, pager, next"
              :total="layerFeatures.length * 10"
            ></el-pagination>
            <div id="savebtn" style="text-align: center;margin-top: 10px"></div>
          </div>
        </div>
         <div class="leaflet-popup-tip-container">
          <div class="leaflet-popup-tip"></div>
        </div>
      </div>
      <div hidden id="markDiv"></div>
    </div>
  </div>
</template>

<script>
import Globe from "../../core/globe";
export default {
  data() {
    return {
      inputName: "",
      showResult: false,
      showMapPanel: false,
      selectedIndex: -1,
      showLayerProperty: false,
      currentPage: 1,
      infoDatas: [
        /*  {
          name: "杭州市中小学"
        },
        {
          name: "杭州市中小学"
        },
        {
          name: "杭州市中小学"
        },
        {
          name: "杭州市中小学"
        },
        {
          name: "杭州市中小学"
        },
        {
          name: "杭州市中小学"
        },
        {
          name: "杭州市中小学"
        } */
      ],
      propertyHander: null,
      popName: "",
      popContent: [],
      coordinate3: null,
      silhouetteGreen: null,
      silhouetteAdd: null,
      lastFeature: null,
      preColor: null,
      tileURL: "",
      layerFeatures: []
    };
  },

  components: {},

  computed: {},

  mounted() {
    const self = this;
    self.propertyHander = new Cesium.ScreenSpaceEventHandler(
      self.viewer.canvas
    );
    /* console.log(self.viewer.scene.primitives._primitives);
    let primitives = self.viewer.scene.primitives._primitives;
    primitives.forEach(item => {
      console.log(item.root);
    }); */
    self.clickModelShowProperty();
    self.loadAllModelByGlobe();
  },

  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    clickName(item, index) {
      const self = this;
      self.selectedIndex = index;
      console.log(item);
      self.coordinate3 = Cesium.Cartesian3.fromDegrees(
        item.geometry.x,
        item.geometry.y,
        item.attributes.HEIGHT
      );
      self.popName = item.attributes.FNAME;
      for (var key in item.attributes) {
        self.popContent.push({
          name: key,
          value: item.attributes[key]
        });
      }
      self.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          item.geometry.x,
          item.geometry.y,
          500
        )
      });
      self.showMapPanel = true;
    },
    nameSearch() {
      const self = this;
      let checkNodes = self.$parent.$parent.treeCheckNode;
      let layerids = [];
      if (checkNodes.length < 1) {
        self.$message({
          message: "未在资源目录中选中模型",
          type: "warning"
        });
        return;
      }
      checkNodes.forEach(item => {
        if (item.children.length < 1 && item.modelLayerid) {
          layerids.push(item.modelLayerid);
        }
      });
      if (layerids.length < 1) {
        self.$message({
          message: "未发布模型的矢量图层",
          type: "warning"
        });
        return;
      }
      let url =
        config.queryMapServerURL +
        "/find?searchText=" +
        self.inputName +
        "&contains=true&searchFields=FNAME&sr=&layers=" +
        layerids.join(",") +
        "&layerDefs=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&dynamicLayers=&returnZ=false&returnM=false&gdbVersion=&f=json";
      $.get(url, res => {
        let data = JSON.parse(res);
        self.infoDatas = data.results;
        if (self.infoDatas.length > 0) {
          self.showResult = true;
        }
      });
    },
    close() {
      const self = this;
      self.showMapPanel = false;
      self.lastFeature.color = self.preColor;
      self.tileURL = "";
      self.lastFeature = null;
      self.preColor = null;
      //self.silhouetteAdd.enabled = false;
      //self.$parent.currentData.active = false;
      /* if (self.propertyHander) {
        self.propertyHander.destroy();
      } */
    },
    loadAllModelByGlobe() {
      const self = this;
      console.log(self.viewer.scene.primitives._primitives);
      let primitives = self.viewer.scene.primitives._primitives;
      primitives.forEach(item => {
        console.log(item.root);
        console.log(item.root.content);
      });
    },
    clickModelShowProperty() {
      const self = this;
      let viewer = self.viewer;
      self.viewer.scene.postRender.addEventListener(function() {
        let _pm_position_2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          self.viewer.scene,
          self.coordinate3
        );
        if (_pm_position_2 != undefined) {
          $("#trackPopUpProperty").css(
            "left",
            _pm_position_2.x - $("#trackPopUpContent").width() / 2
          );
          $("#trackPopUpProperty").css(
            "top",
            _pm_position_2.y - $("#trackPopUpContent").height() - 100
          );
          /* et trackPopUpContent_ = document.getElementById("trackPopUp");
            trackPopUpContent_.style.left = _pm_position_2.x - 145 + "px";
            trackPopUpContent_.style.top = _pm_position_2.y - 395 + "px"; */
        }
      });
      /*  self.silhouetteGreen = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
      self.silhouetteGreen.uniforms.color = Cesium.Color.fromCssColorString(
        "#00FFFF"
      );
      self.silhouetteGreen.uniforms.length = 0.01;
      self.silhouetteGreen.selected = [];
      self.silhouetteAdd = viewer.scene.postProcessStages.add(
        Cesium.PostProcessStageLibrary.createSilhouetteStage([
          self.silhouetteGreen
        ])
      );
 */
      self.propertyHander.setInputAction(function onLeftClick(movement) {
        //self.silhouetteGreen.selected = [];
        //矢量属性查询
        var pickedFeature = viewer.scene.pick(movement.position);
        //pickedFeature.tileset.type == "model-shp"  为加载了白模型，白模型加载了会一起展示叠加的矢量属性。
        if (
          !Cesium.defined(pickedFeature) 
        ) {
          var pickRay = viewer.camera.getPickRay(movement.position);
          var featuresPromise = viewer.imageryLayers.pickImageryLayerFeatures(
            pickRay,
            viewer.scene
          );
          if (!Cesium.defined(featuresPromise)) {
          } else {
            Cesium.when(featuresPromise, function(features) {
              // This function is called asynchronously when the list if picked features is available.
                self.layerFeatures = [];
                features.forEach((layerFeature, index) => {
                  let property = layerFeature.properties;
                  let oneContent = [];
                  for (let key in property) {
                    oneContent.push({
                      name: key,
                      id: key + index,
                      value: property[key] == "Null" ? "" : property[key]
                    });
                  }
                  self.layerFeatures.push(oneContent);
                });
            });
          }
        }
        if (Cesium.defined(pickedFeature)) {
          /* if (self.silhouetteGreen.selected[0] === pickedFeature) {
            return;
          } */
          self.showMapPanel = true;
          $("#trackPopUpProperty").css(
            "left",
            movement.position.x - $("#trackPopUpContent").width() / 2
          );
          $("#trackPopUpProperty").css(
            "top",
            movement.position.y - $("#trackPopUpContent").height() - 100
          );
          if (!self.tileURL) {
            self.tileURL = pickedFeature.tileset.url;
          } else {
            if (self.tileURL !== pickedFeature.tileset.url) {
              self.tileURL = pickedFeature.tileset.url;
              self.lastFeature = null;
            }
          }
          if (!self.lastFeature) {
            self.lastFeature = pickedFeature;
          } else {
            self.lastFeature.color = self.preColor;
            self.lastFeature = pickedFeature;
          }
          self.preColor = pickedFeature.color;
          pickedFeature.color = Cesium.Color.fromCssColorString("#00FFFF");
          //模型属性查询
          self.coordinate3 = viewer.camera.pickEllipsoid(movement.position); //屏幕坐标转三维坐标
          var propertyNames = pickedFeature.getPropertyNames();
          var length = propertyNames.length;
          self.popContent = [];
          self.popName = "属性信息";
          for (var i = 0; i < length; ++i) {
            var name = propertyNames[i];
            var value = pickedFeature.getProperty(name);
            console.log(name);
            console.log(value);
            if (name !== "_properties") {
              if (name) {
                self.popContent.push({
                  name: name,
                  value: value ? value : "暂无数据"
                });
              }
            }
          }
          //self.silhouetteGreen.selected = [pickedFeature];
        }
        // Select the feature if it's not already selected
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      /* 
      self.propertyHander.setInputAction(function(movement) {
        let feature = self.viewer.scene.pick(movement.position);
        console.log(feature);
        if (!Cesium.defined(feature)) {
          return;
        }
        self.showMapPanel = true;
        $("#trackPopUp").css("left", movement.position.x - 145);
        $("#trackPopUp").css("top", movement.position.y - 395);
        let coordinate3 = self.viewer.camera.pickEllipsoid(movement.position); //屏幕坐标转三维坐标
        self.viewer.scene.postRender.addEventListener(function() {
          let _pm_position_2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            self.viewer.scene,
            coordinate3
          );
          if (_pm_position_2 != undefined) {
            let trackPopUpContent_ = document.getElementById("trackPopUp");
            trackPopUpContent_.style.left = _pm_position_2.x - 145 + "px";
            trackPopUpContent_.style.top = _pm_position_2.y - 395 + "px";
          }
        });
        var propertyNames = feature.getPropertyNames();
        var length = propertyNames.length;
        self.popContent = [];
        for (var i = 0; i < length; ++i) {
          var name = propertyNames[i];
          var value = feature.getProperty(name);
          //console.log(name);
          //console.log(value);
          if (name !== "_properties") {
            if (name == "name") {
              self.popName = value;
            } else {
              self.popContent.push({
                name: name,
                value: value
              });
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK); */
    },
    searchPropertyToMap() {}
  },
  beforeDestroy() {
    const self = this;
    if (self.propertyHander) {
      self.propertyHander.destroy();
    }
    self.silhouetteAdd.enabled = false;
    //self.silhouetteGreen.uniforms.color = Cesium.Color.RED.withAlpha(0.01)
  }
};
</script>

<style scoped>
.tushuWrap {
  /* margin: 16vh auto 4vh; */
  /* width: 16vw; */
}
.tabBtn {
  border: 1px solid #ccc;
  padding: 5px 10px;
  display: inline-block;
  cursor: pointer;
}
.active {
  background: #ffd200;
  color: #000;
}
.content {
  /* width: 16vw; */
  max-height: 50vh;
  margin-top: 0.5vh;
  overflow: auto;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);
  overflow: auto;
}
.content li {
  width: 95%;
  margin: 0 auto;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0.5vh 0.5vw;
  box-sizing: border-box;
}
.content li:hover {
  background: #f06045;
}
.select {
  background: #f06045;
}
/*leaflet风格气泡窗口样式模板*/
.leaflet-popup {
  position: absolute;
  text-align: center;
  font-size: 0.8rem;
}
.leaflet-popup-content::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.leaflet-popup-content::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.leaflet-popup-content.content {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.close {
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
}

.leaflet-popup-content-wrapper {
  text-align: left;
  background: rgba(63, 72, 84,0.8);
  opacity: 0.8;
}

.leaflet-popup-content {
  /*  width: 250px;
  max-height: 200px; */
  height: 90%;
  padding: 0 1vw;
  overflow-y: auto;
  line-height: 1.4;
  color: #fff;
}

.leaflet-popup-tip-container {
  margin: 0 auto;
  width: 40px;
  height: 20px;
  position: relative;
  overflow: hidden;
}
.leaflet-popup-tip {
  background: rgba(63, 72, 84, 0.8);
  box-shadow: 0 3px 14px rgba(63, 72, 84, 0.8);
  width: 17px;
  height: 17px;
  padding: 1px;
  margin: -10px auto 0;
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}
.leaflet-mark {
  color: #fff;
  padding: 10px;
  /* height: 30px; */
  width: 25vw;
  background: rgba(63, 72, 84, 1);
  border-bottom: none;
  border-radius: 8px 8px 0px 0px;
  display: flex;
  align-items: center;
  padding-left: 1vh;
  box-sizing: border-box;
}
</style>
<style>
.tushuWrap .el-input__inner {
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 0;
  color: #fff;
}
.tushuWrap .el-pagination {
  text-align: center;
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background: #ffd200;
  color: #000;
}
</style>
