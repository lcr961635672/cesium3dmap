<!-- 可视域分析 -->
<template>
  <div class="visibleRangeWrap" v-show="showRange">
    <div class="spaceChildHeaderWrap">
      <div class="leftHeader blockToLine">
        <i class="el-icon-back getCursor" @click="$parent.childBackMenu"></i>
        {{ $parent.currentData.name }}
      </div>
    </div>
    <div class="contentWrap">
      <div class="title">观察点</div>
      <div class="resultWrapRange">
        <el-form ref="form" label-width="70px" size="mini" :model="resultInfo">
          <el-form-item label="方向角">
            <label slot="label">方&nbsp;向&nbsp;&nbsp;角:</label>
            <el-input v-model="resultInfo.angle" style="width: 10vw"
              ><i slot="suffix" style="margin-right: 10px">度</i></el-input
            >
          </el-form-item>
          <el-form-item label="可视距离">
            <el-input v-model="resultInfo.distance" style="width: 10vw"
              ><i slot="suffix" style="margin-right: 10px">米</i></el-input
            >
          </el-form-item>
          <el-form-item label="经度">
            <label slot="label"
              >经&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度:</label
            >
            <el-input
              v-model="resultInfo.long"
              class="formItem"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="纬度">
            <label slot="label"
              >纬&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度:</label
            >
            <el-input
              v-model="resultInfo.lat"
              class="formItem"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="高度">
            <label slot="label"
              >高&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度:</label
            >
            <el-input
              v-model="resultInfo.height"
              class="formItem"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center; margin: 2vh 0">
          <span @click="startAnalysis" class="cancelBtn">添加观察点</span>
          <span @click="clearLines" class="cancelBtn">清除分析</span>
        </div>
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
      handlers: null,
      showTip: false,
      showRange: true,
      tipMessage: "点击地图添加观察点",
      tipMoveHandler: null,
      resultInfo: {
        long: "单击地图选取点经度",
        lat: "单击地图选取点纬度",
        height: "单击地图选取点高度",
        distance: 1000,
        angle: 90,
      },
    };
  },
  methods: {
    close() {
      const self = this;
      self.showRange = false;
      self.clearLines();
      self.$parent.currentData.active = false;
      if (self.tipMoveHandler) {
        self.tipMoveHandler.destroy();
      }
      if (self.handlers) {
        self.handlers.destroy();
      }
    },
    clearLines() {
      const self = this;
      let entities = self.viewer.entities._entities._array;
      let aaa = [];
      entities.forEach((item, index) => {
        if (item.name == "range") {
          aaa.push(item);
        }
      });
      aaa.forEach((aI) => {
        self.viewer.entities.remove(aI);
      });
    },
    startAnalysis() {
      const self = this;
      if (!(self.resultInfo.angle > 0 && self.resultInfo.angle <= 360)) {
        self.$message.error("角度值范围为1-360");
        return;
      }
      let viewer = self.viewer;
      let scene = viewer.scene;
      self.showTip = true;
      viewer.scene.globe.depthTestAgainstTerrain = true;
      self.handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
      self.near_parent_entity = viewer.entities.add(new Cesium.Entity());
      self.handler.setInputAction(function (click) {
        self.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        const cartesian = scene.pickPosition(click.position);
        if (cartesian) {
          self.showTip = false;
          let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          self.resultInfo.long = Cesium.Math.toDegrees(cartographic.longitude);
          self.resultInfo.lat = Cesium.Math.toDegrees(cartographic.latitude);
          self.resultInfo.height = cartographic.height;
          // 观察点
          var viewPoint = Cesium.Cartesian3.fromDegrees(
            self.resultInfo.long,
            self.resultInfo.lat,
            self.resultInfo.height
          ); //120.1752, 30.3045, 100
          // 世界坐标转换为投影坐标
          var webMercatorProjection = new Cesium.WebMercatorProjection(
            viewer.scene.globe.ellipsoid
          );
          var viewPointWebMercator = webMercatorProjection.project(
            Cesium.Cartographic.fromCartesian(viewPoint)
          );

          // 目标点集合
          var destPoints = [];

          // 观察点和目标点的距离
          var radius = self.resultInfo.distance; // 视距1000米

          // 计算45°和135°之间的目标点
          for (var i = 0; i <= self.resultInfo.angle; i++) {
            // 度数转弧度
            var radians = Cesium.Math.toRadians(i);
            // 计算目标点
            var toPoint = new Cesium.Cartesian3(
              viewPointWebMercator.x + radius * Math.cos(radians),
              viewPointWebMercator.y + radius * Math.sin(radians),
              30
            );
            // 投影坐标转世界坐标
            toPoint = webMercatorProjection.unproject(toPoint);
            destPoints.push(Cesium.Cartographic.toCartesian(toPoint.clone()));
          }

          // 一定要等3dtile模型加载完成后执行

          pickFromRay();

          function pickFromRay() {
            for (var i = 0; i < destPoints.length; i++) {
              // 计算射线的方向，目标点left 视域点right
              var direction = Cesium.Cartesian3.normalize(
                Cesium.Cartesian3.subtract(
                  destPoints[i],
                  viewPoint,
                  new Cesium.Cartesian3()
                ),
                new Cesium.Cartesian3()
              );
              // 建立射线
              var ray = new Cesium.Ray(viewPoint, direction);
              var result = viewer.scene.pickFromRay(ray); // 计算交互点，返回第一个
              showIntersection(result, destPoints[i], viewPoint);
            }
          }

          // 处理交互点
          function showIntersection(result, destPoint, viewPoint) {
            // 如果是场景模型的交互点，排除交互点是地球表面
            if (
              Cesium.defined(result) &&
              Cesium.defined(result.object) &&
              Cesium.defined(result.position)
            ) {
              drawLine(
                result.position,
                viewPoint,
                Cesium.Color.CHARTREUSE.withAlpha(0.5)
              ); // 可视区域
              drawLine(
                result.position,
                destPoint,
                Cesium.Color.RED.withAlpha(0.5)
              ); // 不可视区域
            } else {
              drawLine(
                viewPoint,
                destPoint,
                Cesium.Color.CHARTREUSE.withAlpha(0.5)
              );
            }
          }
          // 绘制线
          function drawLine(leftPoint, secPoint, color) {
            //debugger
            viewer.entities.add({
              name: "range",
              polyline: {
                positions: [leftPoint, secPoint],
                arcType: Cesium.ArcType.NONE,
                width: 5,
                material: color,
                depthFailMaterial: color,
              },
            });
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
  },
  mounted() {
    const self = this;
    // 拖动面板
    $(".headerWrap").mousedown(function (e) {
      var isMove = true;
      var div_x = e.pageX - $(".visibleRangeWrap").offset().left;
      var div_y = e.pageY - $(".visibleRangeWrap").offset().top;
      $(document)
        .mousemove(function (e) {
          if (isMove) {
            var obj = $(".visibleRangeWrap");
            obj.css({ left: e.pageX - div_x, top: e.pageY - div_y });
          }
        })
        .mouseup(function () {
          isMove = false;
        });
    });
    //Globe.add3DtilesModel(self.viewer, config.testShpURL);
    self.tipMoveHandler = new Cesium.ScreenSpaceEventHandler(
      self.viewer.canvas
    );
    self.tipMoveHandler.setInputAction(function (movement) {
      const tooltip = document.getElementById("submit_fault_tooltip");
      const x = movement.endPosition.x;
      const y = movement.endPosition.y;
      tooltip.style.top = y + "px";
      tooltip.style.left = x + 20 + "px";
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  },
  beforeDestroy() {
    const self = this;
    self.close();
  },
};
</script>

<style scoped>
.cancelBtn {
  background: #316db9;
  padding: 5px;
  border-radius: 4px;
  cursor: pointer;
  color: #fff;
  margin-right: 10px;
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
  /* cursor: auto!important;
  box-sizing: border-box;
  border: 1px solid rgba(55, 157, 255, 1);
  border-radius: 0px 0px 8px 8px;
  border-top: none;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 1px 18px 0px rgba(128, 128, 128, 0.41); */
}
.title {
  font-weight: 400;
  /* color: rgba(25, 59, 154, 1); */
  padding: 1vh 0 1vh 1vw;
}
.drawl-label-tooltip {
  position: fixed;
  z-index: 1;
  max-width: 10vw;
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
.resultWrapRange .el-button {
  pointer-events: none !important;
}
:not(.resultWrapRange .el-button):hover {
}
.resultWrapRange .el-form-item {
  margin-bottom: 0 !important;
}
.resultWrapRange .el-input__inner {
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 0;
  color: #fff;
  margin: 2px 0;
}
.resultWrapRange .el-input.is-disabled .el-input__inner {
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 0;
  margin: 2px 0;
  color: #fff;
}
.resultWrapRange .el-form-item__label {
  color: #ffffff !important;
}
</style>