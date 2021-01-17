<!-- 坐标定位 -->
<template>
  <div class="coordinateWrap">
    <el-form
      size="mini"
      label-position="left"
      :model="formCoordinate"
      label-width="50px"
    >
      <el-form-item label="经度">
        <el-input v-model="formCoordinate.long"></el-input>
      </el-form-item>
      <el-form-item label="纬度">
        <el-input v-model="formCoordinate.lat"></el-input>
      </el-form-item>
      <el-form-item label="高度">
        <el-input v-model="formCoordinate.height"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="sureBtn" type="primary" plain @click="goToPosition"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formCoordinate: {
        long: 116.3914,
        lat: 39.9041,
        height: 20000,
      },
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    goToPosition() {
      const self = this;
      self.viewer.scene.globe.depthTestAgainstTerrain = true;
      self.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(
          self.formCoordinate.long,
          self.formCoordinate.lat,
          self.formCoordinate.height
        ),
        billboard: {
          image: "./static/img/index/position.png",
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          width: 45,
          height: 45,
        },
      });
      self.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          self.formCoordinate.long,
          self.formCoordinate.lat,
          self.formCoordinate.height
        ),
      });
    },
  },
};
</script>
<style scoped>
.sureBtn {
  float: right;
}
</style>
<style>
.coordinateWrap .el-input__inner {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0;
  color: #fff;
  /* margin-bottom:1vh;  */
}
</style>