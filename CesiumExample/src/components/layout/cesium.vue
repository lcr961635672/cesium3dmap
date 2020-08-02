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
        homeButton: true, //是否创建默认位置小部件（右上）
        navigationHelpButton: true, //是否创建导航小部件（右上）
        sceneModePicker: true, //是否设置维度选择小部件，二维，三维，2,5维（右上）
    });
    //隐藏cesium版权信息
    viewer.cesiumWidget.creditContainer.style.display = "none";
    //自定义小控件位置
    //"flex-direction":"column"使每个子元素垂直排列，位置放于距底部5vh,top:unset 默认是有top值所有unset去掉
    $(".cesium-viewer-toolbar").css({"display":"flex","flex-direction":"column","bottom":"5vh","top":"unset"});
    $(".cesium-viewer-toolbar .cesium-sceneModePicker-wrapper").css("width","fit-content");
    $(".cesium-sceneModePicker-wrapper .cesium-sceneModePicker-dropDown-icon").css({"float":"left"})

    //修改小控件显示名称
    viewer.homeButton.viewModel.tooltip = "初始位置";  //默认位置设置
    viewer.navigationHelpButton.viewModel.tooltip = "帮助"; //导航设置
    //viewer.sceneModePicker.viewModel.tooltip2D = "二维视图"
    //viewer.sceneModePicker.viewModel.tooltip3D = "三维视图"
    //viewer.sceneModePicker.viewModel.tooltipColumbusView = "哥伦布视图"
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
