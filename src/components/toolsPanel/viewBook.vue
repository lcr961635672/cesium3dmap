<!--视角书签-->
<template>
  <div class="viewWrap">
    <el-input class="inputWrap" v-model="viewName" placeholder="请输入名称" size="mini"></el-input>
    <el-button type="primary" plain size="mini" @click="addView">添加</el-button>
    <div class="viewContent">
      <el-table :data="tableData" border style="width: 100%" size="mini" @row-click="goToView">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click.stop="deleteView(scope.$index, scope.row)" type="text" size="small">删除</el-button>
            <!-- <el-button type="text" size="small">编辑</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      viewName: "",
      tableData: []
    };
  },
  methods: {
    addView() {
      const self = this;
      if (!self.viewName) {
        self.$message.error("请输入名称");
        return;
      }
      const cartographic = self.viewer.scene.camera.positionCartographic;
      let viewLat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);
      let viewLng = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
      let viewAlt = self.viewer.camera.positionCartographic.height.toFixed(2);
      let viewHeading = self.viewer.camera.heading;
      let viewPitch = self.viewer.camera.pitch;
      let viewRoll = self.viewer.camera.roll;
      self.tableData.push({
        name: self.viewName,
        viewLng: viewLng,
        viewLat: viewLat,
        viewAlt: viewAlt,
        viewHeading: viewHeading,
        viewPitch: viewPitch,
        viewRoll: viewRoll
      });
      self.viewName = "";
    },
    deleteView(index,row) {
        const self = this;
        self.tableData.splice(index,1);
    },
    goToView(row, column, evt) {
      const self = this;
      self.viewer.camera.flyTo({
        // Cesium的坐标是以地心为原点，一向指向南美洲，一向指向亚洲，一向指向北极州
        // fromDegrees()方法，将经纬度和高程转换为世界坐标
        destination: Cesium.Cartesian3.fromDegrees(
          parseFloat(row.viewLng),
          parseFloat(row.viewLat),
          parseFloat(row.viewAlt)
        ),
        orientation: {
          // 指向
          heading: row.viewHeading,
          // 视角
          pitch: row.viewPitch,
          roll: row.viewRoll
        }
      });
    },
    handleClick(row) {
      console.log(row);
    }
  },
  mounted() {}
};
</script>
<style scoped>
.inputWrap {
  width: 11vw;
}
.viewContent {
  margin: 1vh 0;
}
</style>
<style>
.viewWrap .el-input {
  box-sizing: border-box;
}
.viewWrap .el-input__inner {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0;
  color: #fff;
  /* margin-bottom:1vh;  */
}
.viewWrap .el-button--primary.is-plain:hover {
  background: #55f32f;
  border-color: #55f32f;
}
.viewContent .el-table th,
.el-table tr {
  background: transparent;
}
.viewContent .el-table,
.viewContent .el-table th {
  border: 1px solid rgba(255, 255, 255, 0.5);
}
.viewContent .el-table td {
  border-right: 1px solid rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}
.viewContent .el-table::before {
  background: transparent;
}
.viewContent .el-table::after {
  background: transparent;
}
.viewContent tr {
  background: transparent !important;
}
.viewContent .el-table__body tr.hover-row > td {
  background-color: transparent !important;
  cursor: pointer;
}
.viewContent .el-table,
.el-table__expanded-cell {
  background-color: transparent;
  color: #fff;
}
.viewContent .el-table thead {
  color: #fff;
}
</style>