<!-- 通视分析 -->
<template>
  <div>
    <div class="permeateWrap">
      <div class="spaceChildHeaderWrap">
        <div class="leftHeader blockToLine">
          <i class="el-icon-back getCursor" @click="$parent.childBackMenu"></i>
          {{ $parent.currentData.name }}
        </div>
        <!-- <div class="rightHeader blockToLine" @click="close">
          <i class="el-icon-delete">清除</i>
        </div> -->
      </div>

      <div class="contentWrap">
        <div class="resultWrap">
          <el-form ref="form" label-width="70px" size="mini" :disabled="true">
            <el-form-item label="是否通视">
              <el-input
                v-model="resultInfo.isVisible"
                class="formItem"
              ></el-input>
            </el-form-item>
            <el-form-item label="起点坐标">
              <el-input
                v-model="resultInfo.startPoint"
                class="formItem"
              ></el-input>
            </el-form-item>
            <el-form-item label="终点坐标">
              <el-input
                v-model="resultInfo.endPoint"
                class="formItem"
              ></el-input>
            </el-form-item>
            <el-form-item label="垂直距离">
              <el-input
                v-model="resultInfo.distanceVertical"
                class="formItem"
              ></el-input>
            </el-form-item>
            <el-form-item label="水平距离">
              <el-input
                v-model="resultInfo.distanceHorizontal"
                class="formItem"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div id="lineChart"></div>
      </div>
    </div>
    <div v-show="showTip" class="drawl-label-tooltip" id="submit_fault_tooltip">
      <i>{{ tipMessage }}</i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tipMessage: "",
      showTip: false,
      showPermeatePanel: false,
      tipMoveHandler: null,
      handler: null,
      clickFlag: false,
      count: 0,
      resultInfo: {
        isVisible: "是",
        startPoint: "",
        endPoint: "",
        distanceVertical: "",
        distanceHorizontal: "",
      },
    };
  },

  components: {},

  computed: {},

  mounted() {
    const self = this;
    self.clickFlag = true;
    self.tipMoveHandler = new Cesium.ScreenSpaceEventHandler(
      self.viewer.canvas
    );
    self.tipMessage = "单击地图绘制第一个点";
    self.tipMoveHandler.setInputAction(function (movement) {
      if (self.clickFlag) {
        self.showTip = true;
      }
      const tooltip = document.getElementById("submit_fault_tooltip");
      const x = movement.endPosition.x;
      const y = movement.endPosition.y;
      tooltip.style.top = y + "px";
      tooltip.style.left = x + 20 + "px";
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    //self.permeateAnalysisStart(self.viewer, self.resultInfo);
    self.visiableSelectPoint(self.viewer);
  },

  methods: {
    close() {
      const self = this;
      self.showPermeatePanel = false;
      self.$parent.currentData.active = false;
      let entities = self.viewer.entities._entities._array;
      let aaa = [];
      entities.forEach((item, index) => {
        if (item.name == "permeateBillboard") {
          aaa.push(item);
        }
      });
      aaa.forEach((aI) => {
        self.viewer.entities.remove(aI);
      });
      self.clickFlag = true;
      if (self.handler) {
        self.handler.destroy();
      }
      self.tipMessage = "单击地图绘制第一个点";
      self.visiableSelectPoint(self.viewer);
      $("#lineChart").html("");
    },
    visiableSelectPoint(viewer) {
      const self = this;
      var lng_start, lat_start, height_start, lng_stop, lat_stop, height_stop;
      var lng_lerp = [],
        lat_lerp = [],
        height_lerp = [];
      var cartographic = [];
      var cartographic_lerp = [];
      var height_terrain = [];
      var isSeen = true;
      var visiableOrNot;
      var inPoint = [];
      var outPoint = [];
      var m = 0;
      var n = 0;
      var point_start, scartesian, ecartesian; //起点和终点的地理坐标
      viewer.scene.globe.depthTestAgainstTerrain = true;
      self.handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
      self.handler.setInputAction(function (movement) {
        self.count++;
        //获取起点表面坐标
        var adaptivePosition = viewer.scene.pickPosition(movement.position);
        let scartesian = viewer.scene.pickPosition(movement.position);
        if (
          viewer.scene.pickPositionSupported &&
          Cesium.defined(adaptivePosition)
        ) {
          //转成经纬度坐标
          var positionCarto = Cesium.Cartographic.fromCartesian(
            adaptivePosition
          );
          if (self.count == 1) {
            self.tipMessage = "单击地图绘制第二个点，结束绘制";
            //起点的经纬度和高度
            lng_start = Cesium.Math.toDegrees(positionCarto.longitude).toFixed(
              4
            );
            lat_start = Cesium.Math.toDegrees(positionCarto.latitude).toFixed(
              4
            );
            height_start = positionCarto.height.toFixed(4);
            self.resultInfo.startPoint =
              lng_start + "," + lat_start + "," + height_start;
            //在地图上显示
            point_start = {
              name: "permeateBillboard",
              position: Cesium.Cartesian3.fromDegrees(
                parseFloat(lng_start),
                parseFloat(lat_start),
                parseFloat(height_start)
              ),
              billboard: {
                image: "../../../../static/img/index/起点.png",
                /* heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              disableDepthTestDistance: Number.POSITIVE_INFINITY, */
                width: 40,
                height: 40,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              },
            };
            viewer.entities.add(point_start);
          } else if (self.count == 2) {
            //终点的经纬度和高度
            lng_stop = Cesium.Math.toDegrees(positionCarto.longitude).toFixed(
              4
            );
            lat_stop = Cesium.Math.toDegrees(positionCarto.latitude).toFixed(4);
            height_stop = positionCarto.height.toFixed(4);

            //在地球上显示
            var point_stop = {
              name: "permeateBillboard",
              position: Cesium.Cartesian3.fromDegrees(
                parseFloat(lng_stop),
                parseFloat(lat_stop),
                parseFloat(height_stop)
              ),
              billboard: {
                image: "../../../../static/img/index/终点.png",
                /* heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              disableDepthTestDistance: Number.POSITIVE_INFINITY, */
                width: 40,
                height: 40,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              },
            };
            //viewer.scene.globe.depthTestAgainstTerrain = false;
            viewer.entities.add(point_stop);
            self.resultInfo.endPoint =
              lng_stop + "," + lat_stop + "," + height_stop;
            self.resultInfo.distanceVertical =
              Math.abs(height_start - height_stop).toFixed(4) + "米";
            self.resultInfo.distanceHorizontal =
              parseInt(
                Cesium.Cartesian3.distance(
                  point_start.position,
                  point_stop.position
                )
              ) + "米";
            self.clickFlag = false;
            self.showTip = false;
            const loading = self.$loading({
              target: document.getElementById("cesiumContainer"),
              lock: true,
              text: "通视分析中",
              background: "rgba(255, 255, 255, 0.7)",
            });
            setTimeout(function () {
              visiableDraw();
              loading.close();
            }, 300);
            //visiableDraw();
          }
        }
        //鼠标左键添加起点
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      function visiableDraw() {
        for (var i = 0; i <= 500; i++) {
          //分成500份差值
          lng_lerp[i] =
            parseFloat(lng_start) +
            parseFloat((i * (lng_stop - lng_start)) / 500);
          lat_lerp[i] =
            parseFloat(lat_start) +
            parseFloat((i * (lat_stop - lat_start)) / 500);
          height_lerp[i] =
            parseFloat(height_start) +
            parseFloat((i * (height_stop - height_start)) / 500);

          //将每个插值点存入cartographic数组
          cartographic.push(
            Cesium.Cartographic.fromDegrees(
              lng_lerp[i],
              lat_lerp[i],
              height_lerp[i]
            )
          );
          cartographic_lerp.push(
            Cesium.Cartographic.fromDegrees(
              lng_lerp[i],
              lat_lerp[i],
              height_lerp[i].toFixed(4)
            )
          );
        }

        var sceneHeight = [];
        for (var i = 0; i < cartographic.length; i++) {
          sceneHeight[i] = viewer.scene
            .sampleHeight(cartographic[i])
            .toFixed(4);
        }
        for (var i = 10; i <= 1001; i++) {
          var forward_hl = height_lerp[i - 1];
          var forward_ht = sceneHeight[i - 1];
          if (forward_ht - forward_hl >= 2) {
            isSeen = false;
          }
        }
        if (isSeen == true) {
          var visiableLine_Positions = Cesium.Ellipsoid.WGS84.cartographicArrayToCartesianArray(
            cartographic_lerp
          );
          var visiableLine = viewer.entities.add({
            name: "permeateBillboard",
            polyline: {
              positions: visiableLine_Positions,
              width: 5,
              material: Cesium.Color.GREEN,
            },
          });
          self.resultInfo.isVisible = "通视";
          visiableOrNot = "通视";
          console.log(visiableOrNot);
          self.showPermeatePanel = true;
          //document.getElementById("measure-result").innerHTML='<span>两点之间：' + visiableOrNot +'</span>';
        } else {
          for (var i = 1; i <= 1001; i++) {
            var forward_hl2 = height_lerp[i - 1];
            var forward_ht2 = sceneHeight[i - 1];
            var backward_ht2 = sceneHeight[i];
            var backward_hl2 = height_lerp[i];
            if (forward_hl2 >= forward_ht2) {
              //入点
              if (backward_hl2 < backward_ht2) {
                inPoint[m] = i;
                m++;
              }
            }
            //出点
            else {
              if (backward_hl2 > backward_ht2) {
                outPoint[n] = i;
                n++;
              }
            }
          }

          var inLine = cartographic_lerp.slice(0, inPoint[0]);
          var outLine = cartographic_lerp.slice(inPoint[0]);
          var inLine_Positions = Cesium.Ellipsoid.WGS84.cartographicArrayToCartesianArray(
            inLine
          );
          var partvisiableLine = viewer.entities.add({
            name: "permeateBillboard",
            polyline: {
              positions: inLine_Positions,
              width: 5,
              material: Cesium.Color.GREEN,
            },
          });
          var outLine_Positions = Cesium.Ellipsoid.WGS84.cartographicArrayToCartesianArray(
            outLine
          );
          var invisiableLine = viewer.entities.add({
            name: "permeateBillboard",
            polyline: {
              positions: outLine_Positions,
              width: 5,
              material: Cesium.Color.RED,
            },
          });
          visiableOrNot = "不通视";
          self.resultInfo.isVisible = "不通视";
          console.log(visiableOrNot);
          self.showPermeatePanel = true;
          //document.getElementById("measure-result").innerHTML='<span>两点之间：' + visiableOrNot + '</span>';
        }
        let xLength = [];
        for (var i = 0; i < 501; i++) {
          xLength.push(i);
        }
        let myChart = self.$echarts.init(document.getElementById("lineChart"));
        let option = {
          color: ["yellow", "Lime"],
          tooltip: {
            trigger: "axis",
          },
          legend: {
            //data: ['实际地形线', '计划可视线','实际空间线']
            data: ["计划可视线", "实际空间线"],
            textStyle: {
              color: "#fff",
            },
          },
          /* grid: {
            left: "8%",
            top: "15%",
            right: "0%",
            bottom: "30%"
          }, */
          xAxis: {
            axisLabel: { interval: 125 },
            data: xLength,
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: "#fff",
              },
            },
          },
          yAxis: {
            type: "value",
            scale: true,
            name: "高度(米)",
            axisLine: {
              lineStyle: {
                color: "#fff",
              },
            },
          },
          series: [
            {
              name: "计划可视线",
              type: "line",
              data: height_lerp,
              lineStyle: {
                normal: {
                  color: "yellow",
                  width: 2,
                  type: "dashed",
                },
              },
            },
            {
              name: "实际空间线",
              type: "line",
              data: sceneHeight,
              lineStyle: {
                normal: {
                  color: "Lime",
                  width: 2,
                },
              },
            },
          ],
        };
        myChart.setOption(option);
      }
    },
  },
  beforeDestroy() {
    const self = this;
    self.close();
    if (self.tipMoveHandler) {
      self.tipMoveHandler.destroy();
    }
    if (self.handler) {
      self.handler.destroy();
    }
  },
};
</script>

<style scoped>
.titleH {
  border-left: 3px solid #00fff6;
  padding: 0 0.4vw;
  margin: 2vh 0.4vw 2vh;
  font-size: 0.8rem;
}
.headerWrap {
  width: 100%;
  height: 5vh;
  background: #193b9a;
  border: 1px solid rgba(55, 157, 255, 1);
  border-bottom: none;
  border-radius: 8px 8px 0px 0px;
  display: flex;
  align-items: center;
  padding-left: 1vh;
  box-sizing: border-box;
}
.closebtn {
  position: absolute;
  right: 1vh;
  cursor: pointer;
}
.contentWrap {
  margin-top: 5px;
}
#lineChart {
  width: 16vw;
  height: 30vh;
}
.drawl-label-tooltip {
  position: fixed;
  z-index: 1;
  max-width: 20vw;
  padding: 3px 8px;
  text-align: center;
  border-width: 1px;
  border-radius: 5px;
  background-color: rgba(15, 59, 129, 0.72);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #fff;
}
.drawl-label-tooltip i {
  font-size: 14px;
}
</style>
<style>
.resultWrap .el-form-item {
  margin-bottom: 0 !important;
}
.resultWrap .el-input.is-disabled .el-input__inner {
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 0;
  color: #fff;
  margin: 2px 0;
}
.resultWrap .el-form-item__label {
  color: #ffffff !important;
}
</style>
