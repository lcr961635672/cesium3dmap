<template>
  <div class="footerWrap">
    <div class="row">视高：{{viewHeight}}米</div>
    <div class="row">俯仰角：{{pitch}}度</div>
    <div class="row">方向：{{heading}}度</div>
    <div class="row">海拔：{{height}}米</div>
    <div class="row">纬度：{{lat}}</div>
    <div class="row">经度：{{long}}</div>
  </div>
</template>

<script>
import * as Cesium from "cesium/Cesium";
import "cesium/Widgets/widgets.css";
export default {
  data() {
    return {
      height: 0,
      viewHeight: 0,
      pitch: 0,
      heading: 0,
      long: 0,
      lat: 0,
    };
  },

  mounted() {
    const self = this;
    //const Cesium = self.Cesium;
    const viewer = self.viewer;
    //得到当前三维场景
    const scene = viewer.scene;
    //得到当前三维场景的椭球体
    const ellipsoid = scene.globe.ellipsoid;
    //定义当前场景的画布元素的事件处理
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction(function (movement) {
      //通过指定的椭球或者地图对应的坐标系，将鼠标的二维坐标转换为对应椭球体三维坐标
      let cartesian = viewer.camera.pickEllipsoid(
        movement.endPosition,
        ellipsoid
      );
      if (cartesian) {
        //将笛卡尔坐标系转为地理坐标
        const cartographic = ellipsoid.cartesianToCartographic(cartesian);
        //将弧度制转为度的十进制度表示
        self.long = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
        self.lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);
        self.height = viewer.scene.globe.getHeight(cartographic).toFixed(4);
        //获取相机高度
        self.viewHeight = Math.ceil(viewer.camera.positionCartographic.height);
        let position = viewer.camera.position;
        self.heading = viewer.camera.heading; // 偏航角 机体轴在水平面上的投影与地轴之间的夹角，以机头右偏为正。
        self.pitch = viewer.camera.pitch;  //俯仰角  机体轴与地平面（水平面 ）之间的夹角，飞机抬头为正；
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  },
};
</script>

<style scoped>
.footerWrap {
  color: #fff;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30px;
  line-height: 30px;
  background: rgba(0, 0, 0, 0.4);
  padding-right: 30px;
  box-sizing: border-box;
}
.row {
  float: right;
  margin-left: 30px;
}
</style>