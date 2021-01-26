<!-- 剖面分析 -->
<template>
  <div class="profileAnalysisWrap">
    <div class="spaceChildHeaderWrap">
      <div class="leftHeader blockToLine">
        <i class="el-icon-back getCursor" @click="$parent.childBackMenu"></i>
        {{ $parent.currentData.name }}
      </div>
      <div class="rightHeader blockToLine" @click="beginDraw">
        <i class="el-icon-edit-outline">{{ drawText }}</i>
      </div>
    </div>
    <div id="profileChart"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      start: null,
      end: null,
      drawText: "开始绘制",
      myChart: null,
    };
  },

  components: {},

  computed: {},

  mounted() {
    const self = this;
    self.domProfile = document.getElementById("profileChart"); // 绘图对象
  },

  methods: {
    //画线
    drawLine() {
      const self = this;
      let viewer = self.viewer;
      viewer.entities.add({
        polyline: {
          positions: new Cesium.CallbackProperty(function () {
            return [self.start, self.end];
          }),
          material: Cesium.Color.RED,
          clampToGround: true,
          classificationType: Cesium.ClassificationType.BOTH,
        },
      });
    },
    //画点
    drawPoint(position) {
      this.viewer.entities.add({
        position: position,
        point: {
          size: 10,
          color: Cesium.Color.GREEN,
        },
      });
    },
    //开始绘制 两个点
    beginDraw() {
      const self = this;
      let viewer = self.viewer;
      if (self.drawText == "开始绘制") {
        self.drawText = "重新绘制";
      }
      // 重置
      $("#profileChart").hide();
      viewer.entities.removeAll();
      self.start = null;
      self.end = null;
      viewer.screenSpaceEventHandler.setInputAction(function (clickEvent) {
        if (self.start == null) {
          self.start = viewer.scene.pickPosition(clickEvent.position);
          self.drawPoint(self.start);
          viewer.screenSpaceEventHandler.setInputAction(function (moveEvent) {
            self.end = viewer.scene.pickPosition(moveEvent.endPosition);
            self.drawLine();
          }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        } else {
          self.end = viewer.scene.pickPosition(clickEvent.position);
          self.drawPoint(self.end);
          viewer.screenSpaceEventHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.LEFT_CLICK
          );
          viewer.screenSpaceEventHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.MOUSE_MOVE
          );
          self.profileAnalyse();
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    //剖面分析开始
    profileAnalyse() {
      const self = this;

      let positions = [Cesium.Cartographic.fromCartesian(self.start)];
      // 插值100个点，点越多模拟越精确，但是效率会低
      let count = 100;
      for (let i = 1; i < count; i++) {
        let cart = Cesium.Cartesian3.lerp(
          self.start,
          self.end,
          i / count,
          new Cesium.Cartesian3()
        );
        positions.push(Cesium.Cartographic.fromCartesian(cart));
      }
      positions.push(Cesium.Cartographic.fromCartesian(self.end));

      // 异步使用最精确的地形采样获取地形高度
      let promise = Cesium.sampleTerrainMostDetailed(
        self.viewer.terrainProvider,
        positions
      );
      Cesium.when(promise, function (updatedPositions) {
        // 处理返回的数据
        let height = [];
        let xData = [];
        for (let i = 0; i < updatedPositions.length; i++) {
          height.push(updatedPositions[i].height.toFixed(2)); // 取得高程值
          xData.push(i);
        }

        // 绘制高程走势图
        $("#profileChart").show();

        // 使用Echart等图表工具可视化
        if (self.myChart == null) {
          self.myChart = self.$echarts.init(self.domProfile);
          self.initChart(height, false, xData);
        } else {
          self.initChart(height, true, xData);
        }
      });
    },
    //绘制echart图表
    initChart(height, isMerge, xData) {
      const self = this;
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        // grid: {
        //   left: "3%",
        //   right: "4%",
        //   bottom: "3%",
        //   containLabel: true,
        // },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: xData,
            axisLine: {
              lineStyle: {
                color: "#fff",
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#fff",
              },
            },
          },
        ],
        series: [
          {
            name: "高度",
            type: "line",
            stack: "总量",
            areaStyle: { normal: {} },
            data: height,
          },
        ],
      };
      self.myChart.setOption(option, isMerge);
    },
  },
};
</script>
<style scoped>
#profileChart {
  width: 16vw;
  height: 30vh;
}
</style>
