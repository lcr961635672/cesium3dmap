<template>
  <div class="container">
    <div class="headerWrap">
      <img src="../../../static/img/index/logo.png" alt="" />
      <h1 class="titleText">基于Cesium的三维可视化展示系统</h1>
    </div>
    <div id="cesiumContainer"></div>
    <footerMain v-if="showGloble"></footerMain>
  </div>
</template>

<script>
import footerMain from './footer'
import Globe from '../../core/globe'
// import CesiumNavigation from "cesium-navigation-es6";
export default {
  name: 'cesiumPage',
  data () {
    return {
      showGloble: false
    }
  },
  mounted () {
    const self = this
    Globe.initGlobe()
    Globe.changeInitGlobe(self.viewer)
    Globe.flytochina_hz(115.0529, 39.1993, 117.5802, 40.6345, self.viewer)
    self.showGloble = true
  },
  components: {
    footerMain
  }
}
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
.headerWrap {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 998;
  width: 100%;
}
.headerWrap img {
  width: 100%;
}
.titleText {
  z-index: 999;
  color: #fff;
  width: 100%;
  position: fixed;
  top: 0;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
</style>
