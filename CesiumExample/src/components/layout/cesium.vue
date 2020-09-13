<template>
  <div class="container">
    <div id="cesiumContainer"></div>
    <footerMain v-if="showGloble"></footerMain>
  </div>
</template>

<script>
import footerMain from './footer'
import Globe from '../../core/globe'
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
    Globe.initGlobe();
    Globe.changeInitGlobe(self.viewer);
    Globe.flytochina_hz(115.0529, 39.1993, 117.5802, 40.6345, self.viewer);
    self.showGloble = true;
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
