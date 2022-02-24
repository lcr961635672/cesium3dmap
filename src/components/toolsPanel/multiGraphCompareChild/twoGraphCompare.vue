<template>
  <div class="multiple-warp">
    <div class="left-warp">
      <div id="cesium-left" style="height:100%"></div>
      <model-b-i-m msg-father="leftBim" v-if="showBim" v-show="showmuluLeft"></model-b-i-m>
      <div class="leftMapL" @mouseenter="mapImgIn" @mouseleave="mapImgOut">
        <ul>
          <li
            v-for="(item,index) in options"
            :key="index"
            v-show="showMap && item.url!==''"
            :title="item.label "
            @click="changeMapLeft(item,index)"
            :style="{'z-index': item.index, left: item.left}"
          >
            <img
              v-show="!showChangeImg"
              :class="[{ select: isActiveLeft==index }, 'mapImg']"
              :src="'/static/img/index/'+item.label+'.png'"
              alt
            />
          </li>
        </ul>
        <!-- <img
        v-show="!showChangeImg"
        class="mapImg"
        src="../../../static/img/index/erwei.png"
        alt
        @click="toChangeMap(2)"
      />
      <img
        v-show="showChangeImg"
        class="mapImg"
        src="../../../static/img/index/sanwei.png"
        alt
        @click="toChangeMap(3)"
        />-->
      </div>
      <div class="toolBtn">
        <ul>
          <li>
            <img
              v-show="showmuluLeft"
              title="资源目录"
              class="toolImg"
              src="/static/img/rightChild/mulu.png"
              alt
              @click="showmuluLeft=false"
            />
            <img
              v-show="!showmuluLeft"
              title="资源目录"
              class="toolImg"
              src="/static/img/rightChild/mulu1.png"
              alt
              @click="showmuluLeft=true"
            />
          </li>
         
        </ul>
      </div>
      <div id="trackPopUp1" v-show="showLeftMapPanel" style="position: fixed;top:0;left:0;">
        <div id="trackPopUpContent1" class="leaflet-popup" style="top:100px;left:0;">
          <div class="leaflet-mark">
            {{popLeftName}}
            <img
              class="close"
              src="/static/img/index/close.png"
              alt
              @click="closeLeft(false)"
            />
          </div>
          <div class="leaflet-popup-content-wrapper">
            <div id="trackPopUpLink" class="leaflet-popup-content">
              <div
                v-for="(item,index) in popLeftContent"
                :key="index"
                style="white-space: nowrap;
                 overflow: hidden;
                 text-overflow: ellipsis;margin: 0.9vh 0"
              >
                <span>{{item.name}}：</span>
                <span :title="item.value">{{item.value}}</span>
              </div>
              <div id="savebtn" style="text-align: center;margin-top: 10px"></div>
            </div>
          </div>
          <!--  <div class="leaflet-popup-tip-container">
          <div class="leaflet-popup-tip"></div>
          </div>-->
        </div>
        <div hidden id="markDiv"></div>
      </div>
    </div>
    <div class="right-warp">
      <div id="cesium-right" style="height:100%"></div>
      <model-b-i-m msg-father="rightBim" v-if="showBim" v-show="showmuluRight"></model-b-i-m>
      <div class="leftMapR" @mouseenter="mapImgInRight" @mouseleave="mapImgOutRight">
        <ul>
          <li
            v-for="(item,index) in options"
            :key="index"
            v-show="showMap && item.url!==''"
            :title="item.label "
            @click="changeMapRight(item,index)"
            :style="{'z-index': item.index, left: item.left}"
          >
            <img
              v-show="!showChangeImg"
              :class="[{ select: isActiveRight==index }, 'mapImg']"
              :src="'/static/img/index/'+item.label+'.png'"
              alt
            />
          </li>
        </ul>
        <!-- <img
          v-show="!showRightChangeImg"
          class="mapImg"
          src="../../../static/img/index/erwei.png"
          alt
          @click="toChangeMap(2, 'right')"
        />
        <img
          v-show="showRightChangeImg"
          class="mapImg"
          src="../../../static/img/index/sanwei.png"
          alt
          @click="toChangeMap(3, 'right')"
        />-->
      </div>
      <div class="toolBtn">
        <ul>
          <li>
            <img
              v-show="showmuluRight"
              title="资源目录"
              class="toolImg"
              src="/static/img/secondMenu/mulu.png"
              alt
              @click="showmuluRight=false"
            />
            <img
              v-show="!showmuluRight"
              title="资源目录"
              class="toolImg"
              src="/static/img/secondMenu/mulu1.png"
              alt
              @click="showmuluRight=true"
            />
          </li>
          
        </ul>
      </div>
      <div id="trackPopUp2" v-show="showRightMapPanel" style="position: fixed;top:0;left:0;">
        <div id="trackPopUpContent2" class="leaflet-popup" style="top:100px;left:0;">
          <div class="leaflet-mark">
            {{popRightName}}
            <img
              class="close"
              src="/static/img/index/close.png"
              alt
              @click="closeRight(false)"
            />
          </div>
          <div class="leaflet-popup-content-wrapper">
            <div id="trackPopUpLink" class="leaflet-popup-content">
              <div
                v-for="(item,index) in popRightContent"
                :key="index"
                style="white-space: nowrap;
                 overflow: hidden;
                 text-overflow: ellipsis;margin: 0.9vh 0"
              >
                <span>{{item.name}}：</span>
                <span :title="item.value">{{item.value}}</span>
              </div>
              <div id="savebtn" style="text-align: center;margin-top: 10px"></div>
            </div>
          </div>
        </div>
        <div hidden id="markDiv"></div>
      </div>
      <img class="closeImg" src="/static/img/index/guanbi.png" @click="close" />
    </div>
  </div>
</template>

<script>
import modelBIM from "./modelBIM";
import Globe from "../../../core/globe";
export default {
  name: "multipleCompare",
  components: {
    modelBIM
  },
  data() {
    return {
      isActiveLeft: 1,
      isActiveRight: 1,
      showChangeImg: false,
      showMap: true,
      viewerLeft: null,
      viewerRight: null,
      rightEvent: null,
      leftEvent: null,
      showBim: false,
      showmuluLeft: true,
      showtushuLeft: true,
      showmuluRight: true,
      showtushuRight: true,
      showLeftChangeImg: false,
      showRightChangeImg: false,
      propertyLeftHander: null,
      showLeftMapPanel: false,
      popLeftName: "",
      popLeftContent: [],
      propertyRightHander: null,
      showRightMapPanel: false,
      popRightName: "",
      popRightContent: [],
      handlerL: null,
      handlerR: null,
      silhouetteAdd: null,
      lastFeatureLeft: null,
      preColorLeft: null,
      tileURLLeft: "",
      lastFeatureRight: null,
      preColorRight: null,
      tileURLRight: "",
      options: [
        {
          value: "1",
          label: "标准地图",
          url: "",
          index: 2,
          left: 0
        },
        {
          value: "2",
          label: "影像地图",
          url: "",
          index: 3,
          left: "20px"
        },
        {
          value: "3",
          label: "地形地图",
          url: "",
          index: 1,
          left: "40px"
        }
      ]
    };
  },
  methods: {
    //鼠标移除触发事件
    mapImgIn() {
      const self = this;
      $(".leftMapL li").each(function(i, n) {
        self.animate(n, i * 60, 50);
      });
    },
    mapImgOut() {
      const self = this;
      $(".leftMapL li").each(function(i, n) {
        self.animate(n, i * 30, 5);
      });
    },
    mapImgInRight() {
      const self = this;
      $(".leftMapR li").each(function(i, n) {
        self.animate(n, i * 60, 50);
      });
    },
    mapImgOutRight() {
      const self = this;
      $(".leftMapR li").each(function(i, n) {
        self.animate(n, i * 30, 5);
      });
    },
    animate(ele, target, time) {
      //要用定时器，先清除定时器
      //一个盒子只能有一个定时器，这样的话，不会和其他盒子出现定时器冲突
      //我们可以把定时器本身，当成为盒子的一个属性
      clearInterval(ele.timer);
      //我们要求盒子既能向前又能向后，那么我们的步长就得有正有负
      //目标值如果大于当前值取正，目标值如果小于当前值取负
      var speed = target > ele.offsetLeft ? 10 : -10; //speed指的是步长
      ele.timer = setInterval(function() {
        //在执行之前就获取当前值和目标值之差
        var val = target - ele.offsetLeft;

        //移动的过程中，如果目标值和当前值之差如果小于步长，那么就不能在前进了
        //因为步长有正有负，所有转换成绝对值来比较
        if (Math.abs(val) < Math.abs(speed)) {
          //如果val小于步长，则直接到达目的地；否则，每次移动一个步长
          ele.style.left = target + "px";
          clearInterval(ele.timer);
        } else {
          ele.style.left = ele.offsetLeft + speed + "px";
        }
      }, time);
    },
    close() {
      const self = this;
      Globe.viewerLeft = null;
      Globe.viewerRight = null;
      self.$parent.$parent.$parent.twoGraphFlag = false;
      if (self.silhouetteAdd) {
        self.silhouetteAdd.enabled = false;
      }
      self.$parent.dynamicComponents = null;
      self.$parent.selectMenuIndex = -1;
      self.$parent.$parent.$parent.changeFooter = true;
      $(".distance-legend").show();
      if (self.handlerL) {
        self.handlerL.destroy();
      }
      if (self.handlerR) {
        self.handlerR.destroy();
      }
      if (self.propertyLeftHander) {
        self.propertyLeftHander.destroy();
      }
      if (self.propertyRightHander) {
        self.propertyRightHander.destroy();
      }
    },
    changeMapLeft(item, index) {
      const self = this;
      self.isActiveLeft = index;
      let viewer = self.viewerLeft;
      let bottomMap = null;
      var layers = viewer.imageryLayers;
      let bottomLayer = layers.get(0);
      bottomMap = layers.addImageryProvider(self.setCurrentImageryLayer(item));
      layers.lower(bottomMap);
      layers.remove(bottomLayer);
    },
    changeMapRight(item, index) {
      const self = this;
      self.isActiveRight = index;
      let viewer = self.viewerRight;
      let bottomMap = null;
      var layers = viewer.imageryLayers;
      let bottomLayer = layers.get(0);
      bottomMap = layers.addImageryProvider(self.setCurrentImageryLayer(item));
      layers.lower(bottomMap);
      layers.remove(bottomLayer);
    },
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
              self.options[0].label = item.ALIASNAME;
              self.options[0].url = item.RESOURCEVALUE;
              break;
            case "tdtQQYXURL":
              self.options[1].label = item.ALIASNAME;
              self.options[1].url = item.RESOURCEVALUE;
              break;
            case "demMapURL":
              self.options[2].label = item.ALIASNAME;
              self.options[2].url = item.RESOURCEVALUE;
              break;
            default:
              break;
          }
        });
      });
    },
    setCurrentImageryLayer(item) {
      const self = this;
      let result = null;
      let matrixIds = [];
      for (let i = 0; i < 19; ++i) {
        matrixIds[i] = i + 1;
      }
      switch (item.value) {
        case "1":
          self.options[0].index = 999;
          self.options[1].index = 2;
          self.options[2].index = 1;
          //标准地图
          result = new Cesium.WebMapTileServiceImageryProvider({
            url: item.url,
            style: "default",
            format: "image/jpeg",
            tileMatrixLabels: matrixIds,
            tilingScheme: new Cesium.GeographicTilingScheme({
              //此处很重要，很重要。。。
              numberOfLevelZeroTilesX: 2,
              numberOfLevelZeroTilesY: 1
            })
          });
          break;
        case "2":
          self.options[0].index = 1;
          self.options[1].index = 999;
          self.options[2].index = 2;
          //影像地图
          result = new Cesium.WebMapTileServiceImageryProvider({
            url: item.url,
            style: "default",
            format: "image/jpeg",
            tileMatrixLabels: matrixIds,
            tilingScheme: new Cesium.GeographicTilingScheme({
              //此处很重要，很重要。。。
              numberOfLevelZeroTilesX: 2,
              numberOfLevelZeroTilesY: 1
            })
          });
          //self.viewer.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider();
          break;
        //地形地图
        case "3":
          self.options[0].index = 1;
          self.options[1].index = 2;
          self.options[2].index = 999;
          result = new Cesium.WebMapTileServiceImageryProvider({
            url: item.url,
            style: "default",
            format: "image/jpeg",
            tileMatrixLabels: matrixIds,
            tilingScheme: new Cesium.GeographicTilingScheme({
              //此处很重要，很重要。。。
              numberOfLevelZeroTilesX: 2,
              numberOfLevelZeroTilesY: 1
            })
          });
          /* self.viewer.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider();
          self.viewer.scene.terrainProvider = new Cesium.CesiumTerrainProvider({
            url: config.terrainURL
          }); */
          break;
        default:
          break;
      }
      return result;
    },
    closeLeft(flag) {
      const self = this;
      self.showLeftMapPanel = false;
      //self.silhouetteAdd.enabled = false;
      if(self.lastFeatureLeft) {
        self.lastFeatureLeft.color = self.preColorLeft;
      }
      self.tileURLLeft = "";
      self.lastFeatureLeft = null;
      self.preColorLeft = null;
      if (flag && self.propertyLeftHander) {
        self.propertyLeftHander.destroy();
        self.showtushuLeft = true;
      }
    },
    closeRight(flag) {
      const self = this;
      self.showRightMapPanel = false;
      //self.silhouetteAdd.enabled = false;
      if (self.lastFeatureRight) {
        self.lastFeatureRight.color = self.preColorRight;
      }
      self.tileURLRight = "";
      self.lastFeatureRight = null;
      self.preColorRight = null;
      if (flag && self.propertyRightHander) {
        self.propertyRightHander.destroy();
        self.showtushuRight = true;
      }
    },
    toChangeMap(val, type) {
      const self = this;
      let viewer = null;
      if (type == "left") {
        viewer = self.viewerLeft;
        if (val == 2) {
          self.showLeftChangeImg = true;
        } else {
          self.showLeftChangeImg = false;
        }
      } else {
        viewer = self.viewerRight;
        if (val == 2) {
          self.showRightChangeImg = true;
        } else {
          self.showRightChangeImg = false;
        }
      }
      let bottomMap = null;
      var layers = viewer.imageryLayers;
      let bottomLayer = layers.get(0);
      if (val == 2) {
        bottomMap = viewer.imageryLayers.addImageryProvider(
          new Cesium.WebMapTileServiceImageryProvider({
            url: MapConfig.tdtSLURL,
            layer: "tdtVecBasicLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible",
            show: false
          })
        );
      } else {
        bottomMap = viewer.imageryLayers.addImageryProvider(
          new Cesium.WebMapTileServiceImageryProvider({
            url: MapConfig.tdtYXURL,
            layer: "tdtAnnoLayer1",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible",
            show: false
          })
        );
      }
      layers.lower(bottomMap);
      layers.remove(bottomLayer);
    },
    queryLeftProperty() {
      const self = this;
      self.showtushuLeft = false;
      let viewer = self.viewerLeft;
      self.propertyLeftHander = new Cesium.ScreenSpaceEventHandler(
        viewer.canvas
      );
      self.clickModelShowProperty(viewer, self.propertyLeftHander, 1);
    },
    queryRightProperty() {
      const self = this;
      self.showtushuRight = false;
      let viewer = self.viewerRight;
      self.propertyRightHander = new Cesium.ScreenSpaceEventHandler(
        viewer.canvas
      );
      self.clickModelShowProperty(viewer, self.propertyRightHander, 2);
    },
    clickModelShowProperty(viewer, handler, type) {
      const self = this;
      let leftWidth = 0;

      /*  var silhouetteGreen = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
      silhouetteGreen.uniforms.color = Cesium.Color.fromCssColorString(
        "#00FFFF"
      );
      silhouetteGreen.uniforms.length = 0.01;
      silhouetteGreen.selected = [];

      self.silhouetteAdd = viewer.scene.postProcessStages.add(
        Cesium.PostProcessStageLibrary.createSilhouetteStage([silhouetteGreen])
      );
 */
      handler.setInputAction(function onLeftClick(movement) {
        if (type == 2) {
          self.popRightContent = [];
          leftWidth = $(".left-warp").width();
        } else {
          self.popLeftContent = [];
        }
        //silhouetteGreen.selected = [];
        var pickedFeature = viewer.scene.pick(movement.position);
        if (!Cesium.defined(pickedFeature)) {
          var pickRay = viewer.camera.getPickRay(movement.position);
          var featuresPromise = viewer.imageryLayers.pickImageryLayerFeatures(
            pickRay,
            viewer.scene
          );
          Cesium.when(featuresPromise, function(features) {
            // This function is called asynchronously when the list if picked features is available.
            if (features.length > 0) {
              console.log(features[0]);
              console.log(1111);
              self.showMapPanel = true;
              $("#trackPopUp" + type).css(
                "left",
                movement.position.x -
                  $("#trackPopUpContent" + type).width() / 2 +
                  leftWidth
              );
              $("#trackPopUp" + type).css(
                "top",
                movement.position.y -
                  $("#trackPopUpContent" + type).height() -
                  100
              );
              let coordinate3 = viewer.camera.pickEllipsoid(movement.position); //屏幕坐标转三维坐标
              viewer.scene.postRender.addEventListener(function() {
                let _pm_position_2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                  viewer.scene,
                  coordinate3
                );
                if (_pm_position_2 != undefined) {
                  $("#trackPopUp" + type).css(
                    "left",
                    _pm_position_2.x -
                      $("#trackPopUpContent" + type).width() / 2 +
                      leftWidth
                  );
                  $("#trackPopUp" + type).css(
                    "top",
                    _pm_position_2.y -
                      $("#trackPopUpContent" + type).height() -
                      100
                  );
                }
              });
              self.popName = "属性信息";
              let property = features[0].properties;
              self.popContent = [];
              for (let key in property) {
                if (type == 1) {
                  self.showLeftMapPanel = true;
                  self.popLeftName = "属性信息";
                  self.popLeftContent.push({
                    name: key,
                    value: property[key] == "Null" ? "" : property[key]
                  });
                } else {
                  self.showRightMapPanel = true;
                  self.popRightName = "属性信息";
                  self.popRightContent.push({
                    name: key,
                    value: property[key] == "Null" ? "" : property[key]
                  });
                }
              }
            }
          });
        } else {
          // Select the feature if it's not already selected
          /* if (silhouetteGreen.selected[0] === pickedFeature) {
            return;
          } */
          $("#trackPopUp" + type).css(
            "left",
            movement.position.x -
              $("#trackPopUpContent" + type).width() / 2 +
              leftWidth
          );
          $("#trackPopUp" + type).css(
            "top",
            movement.position.y - $("#trackPopUpContent" + type).height() - 100
          );
          let coordinate3 = viewer.camera.pickEllipsoid(movement.position); //屏幕坐标转三维坐标
          viewer.scene.postRender.addEventListener(function() {
            let _pm_position_2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
              viewer.scene,
              coordinate3
            );
            if (_pm_position_2 != undefined) {
              $("#trackPopUp" + type).css(
                "left",
                _pm_position_2.x -
                  $("#trackPopUpContent" + type).width() / 2 +
                  leftWidth
              );
              $("#trackPopUp" + type).css(
                "top",
                _pm_position_2.y - $("#trackPopUpContent" + type).height() - 100
              );
            }
          });
          var propertyNames = pickedFeature.getPropertyNames();
          var length = propertyNames.length;
          self.popContent = [];
          for (var i = 0; i < length; ++i) {
            var name = propertyNames[i];
            var value = pickedFeature.getProperty(name);
            if (name !== "_properties") {
              if (name == "fname") {
                if (type == 1) {
                  self.showLeftMapPanel = true;
                  self.popLeftName = value;
                } else {
                  self.showRightMapPanel = true;
                  self.popRightName = value;
                }
              } else {
                if (type == 1) {
                  if (!self.tileURLLeft) {
                    self.tileURLLeft = pickedFeature.tileset.url;
                  } else {
                    if (self.tileURLLeft !== pickedFeature.tileset.url) {
                      self.tileURLLeft = pickedFeature.tileset.url;
                      self.lastFeatureLeft = null;
                    }
                  }
                  if (!self.lastFeatureLeft) {
                    self.lastFeatureLeft = pickedFeature;
                  } else {
                    self.lastFeatureLeft.color = self.preColorLeft;
                    self.lastFeatureLeft = pickedFeature;
                  }
                  self.preColorLeft = pickedFeature.color;
                  pickedFeature.color = Cesium.Color.fromCssColorString(
                    "#00FFFF"
                  );
                  self.popLeftContent.push({
                    name: name,
                    value: value
                  });
                } else {
                  if (!self.tileURLRight) {
                    self.tileURLRight = pickedFeature.tileset.url;
                  } else {
                    if (self.tileURLRight !== pickedFeature.tileset.url) {
                      self.tileURLRight = pickedFeature.tileset.url;
                      self.lastFeatureRight = null;
                    }
                  }
                  if (!self.lastFeatureRight) {
                    self.lastFeatureRight = pickedFeature;
                  } else {
                    self.lastFeatureRight.color = self.preColorRight;
                    self.lastFeatureRight = pickedFeature;
                  }
                  self.preColorRight = pickedFeature.color;
                  pickedFeature.color = Cesium.Color.fromCssColorString(
                    "#00FFFF"
                  );
                  self.popRightContent.push({
                    name: name,
                    value: value
                  });
                }
              }
            }
          }
          // silhouetteGreen.selected = [pickedFeature];
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
  },
  mounted() {
    const self = this;
    self.getMapData();
    self.$parent.$parent.$parent.changeFooter = false;
    $(".distance-legend").hide();
    let matrixIds = [];
    for (let i = 0; i < 19; ++i) {
      matrixIds[i] = i + 1;
    }
    let optionsViewer = {
      timeline: false, //是否显示时间轴
      sceneModePicker: false, //是否显示3D/2D选择器
      geocoder: false, //是否显示geocoder小器件，右上角查询按钮
      scene3DOnly: true, //如果为true，则每个几何实例将仅以3D渲染以节省GPU内存。
      animation: false, //如果设置为false，则不会创建动画小部件。
      navigationHelpButton: false, //如果设置为false，则不会创建导航帮助按钮。
      homeButton: false, //如果设置为false，则不会创建“主页按钮”小部件。
      infoBox: false, //是否显示信息框
      showRenderLoopErrors: false, //如果设为true，将在一个HTML面板中显示错误信息
      fullscreenElement: document.documentElement, //全屏时渲染的HTML元素.
      selectionIndicator: false, //是否显示选取指示器组件
      baseLayerPicker: false, //是否显示图层选择器
      fullscreenButton: false, //是否显示全屏
      shouldAnimate: true,
      skyAtmosphere: false,
      clockViewModel: this.clockViewModel,
      //globe: true //在场景中使用的地球仪。如果设置为false，则不会添加地球仪
      //加载地球
      imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
        url: MapConfig.tdtQQYXURL,
        tileMatrixLabels: matrixIds,
        tilingScheme: new Cesium.GeographicTilingScheme({
          numberOfLevelZeroTilesX: 2,
          numberOfLevelZeroTilesY: 1
        })
      })
    };
    self.viewerLeft = new Cesium.Viewer("cesium-left", optionsViewer);
    self.viewerLeft.scene.globe.baseColor = Cesium.Color.WHITE.withAlpha(0.5);
    Globe.viewerLeft = self.viewerLeft;
    self.viewerLeft.camera.setView({
      destination: Cesium.Rectangle.fromDegrees(
        120.03220798419508,
        30.089156444856183,
        120.515799485922,
        30.28137850304054
      )
    });
    self.viewerLeft._cesiumWidget._creditContainer.style.display = "none";
    self.viewerRight = new Cesium.Viewer("cesium-right", optionsViewer);
    self.viewerRight.scene.globe.baseColor = Cesium.Color.WHITE.withAlpha(0.5);
    self.viewerRight.camera.setView({
      destination: Cesium.Rectangle.fromDegrees(
        120.03220798419508,
        30.089156444856183,
        120.515799485922,
        30.28137850304054
      )
    });
    self.viewerRight._cesiumWidget._creditContainer.style.display = "none";
    Globe.viewerRight = self.viewerRight;
    self.showBim = true;
    var sceneL = self.viewerLeft.scene;
    var sceneR = self.viewerRight.scene;

    self.handlerL = new Cesium.ScreenSpaceEventHandler(sceneL.canvas);
    var ellipsoidL = sceneL.globe.ellipsoid;
    self.handlerR = new Cesium.ScreenSpaceEventHandler(sceneR.canvas);
    var ellipsoidR = sceneR.globe.ellipsoid;

    self.handlerL.setInputAction(function(movement) {
      isLeftTrigger = true;
      isRightTrigger = false;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    self.handlerR.setInputAction(function(movement) {
      isLeftTrigger = false;
      isRightTrigger = true;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    var isLeftTrigger = false;
    var isRightTrigger = false;

    var syncViewerL = function() {
      if (isLeftTrigger) {
        self.viewerRight.camera.flyTo({
          destination: self.viewerLeft.camera.position,
          orientation: {
            heading: self.viewerLeft.camera.heading,
            pitch: self.viewerLeft.camera.pitch,
            roll: self.viewerLeft.camera.roll
          },
          duration: 0.0
        });
      }
    };

    self.viewerLeft.camera.changed.addEventListener(syncViewerL);
    self.viewerLeft.scene.preRender.addEventListener(syncViewerL);

    var syncViewerR = function() {
      if (isRightTrigger) {
        self.viewerLeft.camera.flyTo({
          destination: self.viewerRight.camera.position,
          orientation: {
            heading: self.viewerRight.camera.heading,
            pitch: self.viewerRight.camera.pitch,
            roll: self.viewerRight.camera.roll
          },
          duration: 0.0
        });
      }
    };

    self.viewerLeft.camera.changed.addEventListener(syncViewerR);
    self.viewerLeft.scene.preRender.addEventListener(syncViewerR);
  }
};
</script>

<style scoped>
.multiple-warp {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  /* background-color: rgba(255, 0, 0, 1); */
  z-index: 1009;
}
.select {
  border: 1px solid #00fff6;
}
.left-warp {
  width: 50vw;
  height: 100%;
  border-right: 0.2vw solid rgba(55, 142, 233, 1);
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.8);
  position: absolute;
  left: 0;
  top: 0;
}
.right-warp {
  width: 49.8vw;
  height: 100%;
  border-left: 0.2vw solid rgba(55, 142, 233, 1);
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.8);
  position: absolute;
  right: 0;
  top: 0;
}
.closeImg {
  position: fixed;
  top: 10vh;
  right: 2vw;
  cursor: pointer;
  padding: 10px;
}
.leftMapL {
  position: relative;
  left: 0.5vw;
  bottom: 10vh;
  cursor: pointer;
  display: inline-block;
  height: 40px;
}
.mapImg {
  width: 100%;
  height: 100%;
}
.leftMapL li {
  position: absolute;
  /* float: left; */
  width: 50px;
  height: 45px;
  margin: 0 5px;
}
.leftMapR {
  position: relative;
  left: 0.5vw;
  bottom: 10vh;
  cursor: pointer;
  display: inline-block;
  height: 40px;
}
.leftMapR li {
  position: absolute;
  /* float: left; */
  width: 50px;
  height: 45px;
  margin: 0 5px;
}
.toolBtn {
  position: absolute;
  bottom: 1vh;
  right: 1vw;
}
.toolBtn li {
  float: left;
  margin-left: 0.5vw;
  cursor: pointer;
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
  /* text-align: center;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
  padding: 1px; */
  /* border-radius: 12px;*/
  text-align: left;
  background: url("/static/img/index/panel.png") no-repeat -2px;
  height: 40vh;
  width: 25vw;
  background-size: 25vw 40vh;
}

.leaflet-popup-content {
  /*  width: 250px;
  max-height: 200px; */
  height: 90%;
  padding: 0 1vw;
  overflow-y: auto;
  line-height: 1.4;
  color: #000;
  margin-bottom: 2vh;
}

.leaflet-popup-tip-container {
  margin: 0 auto;
  width: 40px;
  height: 20px;
  position: relative;
  overflow: hidden;
}
.leaflet-popup-tip {
  background: white;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
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
  height: 6vh;
  width: 24.7vw;
  background: #193b9a;
  border: 1px solid rgba(55, 157, 255, 1);
  border-bottom: none;
  border-radius: 8px 8px 0px 0px;
  display: flex;
  align-items: center;
  padding-left: 1vh;
  box-sizing: border-box;
}
</style>