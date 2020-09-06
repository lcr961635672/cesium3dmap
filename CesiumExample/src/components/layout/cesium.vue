<template>
  <div class="container">
    <div id="cesiumContainer"></div>
    <footerMain v-if="showGloble"></footerMain>
  </div>
</template>

<script>
import Vue from "vue"
import footerMain from './footer'
 //import CesiumNavigation from "cesium-navigation-es6";
export default {
  name: "cesiumPage",
  data() {
    return {
      showGloble: false
    };
  },
  mounted() {
    const self = this;
    const Cesium = self.Cesium;
    let viewer = new Cesium.Viewer("cesiumContainer", {
      animation: false, //是否创建动画小部件（左下角）
      timeline: false, //是否粗昂见时间轴小部件（底部）
      baseLayerPicker: false, //是否创建底图切换小部件（右上）
      fullscreenButton: false, //是否创建全屏小部件（右上）
      geocoder: false, //是否创建搜索小部件（右上）
      homeButton: true, //是否创建默认位置小部件（右上）
      navigationHelpButton: true, //是否创建导航小部件（右上）
      sceneModePicker: false, //是否设置维度选择小部件，二维，三维，2,5维（右上）
      vrButton: true, //进入vr模式按钮
      fullscreenButton: true, //全屏
      terrainProvider: Cesium.createWorldTerrain(), //添加全球地形
    });
    Vue.prototype.viewer = viewer
    self.showGloble = true;
    //隐藏cesium版权信息
    viewer.cesiumWidget.creditContainer.style.display = "none";
    //导航插件
    var options = {};
    // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和Cesium.Rectangle.
    options.defaultResetView = Cesium.Cartographic.fromDegrees(
      110,
      30,
      2000000
    );
    // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
    options.enableCompass = true;
    // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件 将不会添加到地图中。
    options.enableZoomControls = true;
    // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
    options.enableDistanceLegend = true;
    // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
    options.enableCompassOuterRing = true;

     //CesiumNavigation(viewer, options);
    //自定义小控件位置
    //"flex-direction":"column"使每个子元素垂直排列，位置放于距底部5vh,top:unset 默认是有top值所有unset去掉
    $(".cesium-viewer-toolbar").css({
      display: "flex",
      "flex-direction": "column",
      bottom: "120px",
      top: "unset",
    });
    $(".cesium-viewer-toolbar .cesium-sceneModePicker-wrapper").css(
      "width",
      "fit-content"
    );
    $(
      ".cesium-sceneModePicker-wrapper .cesium-sceneModePicker-dropDown-icon"
    ).css({ float: "left" });
    $(".cesium-navigation-help").css({
      top: "unset",
      bottom: "0",
      right: "40px",
      "transform-origin": "right bottom",
    });
    $(".cesium-viewer-fullscreenContainer").css({
      bottom: "86px",
      right: "9px",
      width: "32px",
      height: "32px",
    });
    $(".cesium-viewer-vrContainer").css({
      bottom: "49px",
      right: "9px",
      width: "32px",
      height: "32px",
      "border-radius": "4px",
    });
    $(".cesium-button").css({ "border-radius": "4px" });

    //修改小控件显示名称
    viewer.homeButton.viewModel.tooltip = "初始位置"; //默认位置设置
    viewer.navigationHelpButton.viewModel.tooltip = "帮助"; //导航设置
    //viewer.sceneModePicker.viewModel.tooltip2D = "二维视图"
    //viewer.sceneModePicker.viewModel.tooltip3D = "三维视图"
    //viewer.sceneModePicker.viewModel.tooltipColumbusView = "哥伦布视图"
    //帮组按钮内容进行汉化
    var clickHelper = viewer.navigationHelpButton.container.getElementsByClassName(
      "cesium-click-navigation-help"
    )[0];
    var touchHelper = viewer.navigationHelpButton.container.getElementsByClassName(
      "cesium-touch-navigation-help"
    )[0];

    var button = viewer.navigationHelpButton.container.getElementsByClassName(
      "cesium-navigation-button-right"
    )[0];
    button.innerHTML = button.innerHTML.replace(">Touch", ">触摸屏");
    button = viewer.navigationHelpButton.container.getElementsByClassName(
      "cesium-navigation-button-left"
    )[0];
    button.innerHTML = button.innerHTML.replace(">Mouse", ">鼠标");

    var click_help_pan = clickHelper.getElementsByClassName(
      "cesium-navigation-help-pan"
    )[0];
    click_help_pan.innerHTML = "平移";
    var click_help_pan_details = click_help_pan.parentNode.getElementsByClassName(
      "cesium-navigation-help-details"
    )[0];
    click_help_pan_details.innerHTML = "按下左键 + 拖动";

    var click_help_zoom = clickHelper.getElementsByClassName(
      "cesium-navigation-help-zoom"
    )[0];
    click_help_zoom.innerHTML = "旋转";
    click_help_zoom.parentNode.getElementsByClassName(
      "cesium-navigation-help-details"
    )[0].innerHTML = "按下右键+拖动";
    click_help_zoom.parentNode.getElementsByClassName(
      "cesium-navigation-help-details"
    )[1].innerHTML = "";

    var click_help_rotate = clickHelper.getElementsByClassName(
      "cesium-navigation-help-rotate"
    )[0];
    click_help_rotate.innerHTML = "缩放";
    click_help_rotate.parentNode.getElementsByClassName(
      "cesium-navigation-help-details"
    )[0].innerHTML = "滚动鼠标滚轮";
    click_help_rotate.parentNode.getElementsByClassName(
      "cesium-navigation-help-details"
    )[1].innerHTML = "";

    //触屏操作
    var touch_help_pan = touchHelper.getElementsByClassName(
      "cesium-navigation-help-pan"
    )[0];
    touch_help_pan.innerHTML = "平移";
    touch_help_pan.parentNode.getElementsByClassName(
      "cesium-navigation-help-details"
    )[0].innerHTML = "单指拖动";

    var touch_help_zoom = touchHelper.getElementsByClassName(
      "cesium-navigation-help-zoom"
    )[0];
    touch_help_zoom.innerHTML = "缩放";
    touch_help_zoom.parentNode.getElementsByClassName(
      "cesium-navigation-help-details"
    )[0].innerHTML = "双指捏合";

    var touch_help_tilt = touchHelper.getElementsByClassName(
      "cesium-navigation-help-rotate"
    )[0];
    touch_help_tilt.innerHTML = "俯仰";
    touch_help_tilt.parentNode.getElementsByClassName(
      "cesium-navigation-help-details"
    )[0].innerHTML = "双指同向拖动";

    var touch_help_rotate = touchHelper.getElementsByClassName(
      "cesium-navigation-help-tilt"
    )[0];
    touch_help_rotate.innerHTML = "旋转";
    touch_help_rotate.parentNode.getElementsByClassName(
      "cesium-navigation-help-details"
    )[0].innerHTML = "双指反向拖动";
  },
  components: {
    footerMain
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
