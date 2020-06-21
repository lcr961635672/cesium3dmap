<template>
  <div class="container">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import * as Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
export default {
  name: "cesiumPage",
  data() {
    return {};
  },
  mounted() {
    let viewer = new Cesium.Viewer("cesiumContainer",{
        animation: false,  //是否创建动画小部件（左下角）
        timeline: false,   //是否粗昂见时间轴小部件（底部）
        baseLayerPicker: false, //是否创建底图切换小部件（右上）
        fullscreenButton: false, //是否创建全屏小部件（右上）
        geocoder: false, //是否创建搜索小部件（右上）
        homeButton: false, //是否创建默认位置小部件（右上）
        navigationHelpButton: false, //是否创建导小部件（右上）
        sceneModePicker: false, //是否设置维度选择小部件，二维，三维，2,5维（右上）
    });
    //隐藏cesium版权信息
    viewer.cesiumWidget.creditContainer.style.display = "none";
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
}
#cesiumContainer {
  width: 100%;
  height: 100vh;
}
</style>
