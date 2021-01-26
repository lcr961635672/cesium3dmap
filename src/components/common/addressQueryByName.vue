<!-- 地名地址查询 -->
<template>
  <div class="rightTopToolWrap elInputWrapAddress">
    <el-input
      clearable
      placeholder="请输入地名查询"
      v-model="keyWord"
      size="mini"
      @input="clearInput"
      @clear="showResult = false"
    >
      <i
        slot="suffix"
        class="el-input__icon el-icon-search"
        style="cursor: pointer; color: #fff"
        @click="searchAddress"
      ></i>
    </el-input>
    <div class="addressResult" v-show="showResult">
      <ul>
        <li
          v-for="(item, index) in infoDatas"
          :key="index"
          @click="gotoPosition(item, index)"
          :class="{ select: isActive == index }"
          :title="item.name"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div
      id="trackPopUp"
      v-show="showHeightPanel"
      style="position: fixed; top: 0; left: 0"
    >
      <div class="leaflet-popup" style="top: 0; left: 0">
        <div id="trackPopUpContent" class="leaflet-mark">
          详细信息
          <img
            class="close"
            src="../../../static/img/index/close.png"
            alt
            @click="close"
          />
        </div>
        <div class="leaflet-popup-content-wrapper">
          <div id="trackPopUpLink" class="leaflet-popup-content">
            <div>名称：{{ addressName }}</div>
            <div>地址：{{ addressPosition }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Globe from "../../core/globe"
export default {
  data() {
    return {
      keyWord: "", //地名地址查询 关键字
      showResult: false, //是否显示地名地址结果
      infoDatas: [], //地名地址信息
      showHeightPanel: false, //是否显示地址弹框
      heightEntity: null, //高亮实体
      addressName: "", //地址弹框名称
      addressPosition: "", //地名地址弹框详细地址
      isActive: -1, //选中索引
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    //关闭地名地址弹框
    close() {
      const self = this;
      self.isActive = -1;
      self.showHeightPanel = false;
    },
    //行点击定位显示地址信息
    gotoPosition(data, index) {
      const self = this;
      self.isActive = index;
      self.showHeightPanel = true;
      self.addressName = data.name;
      self.addressPosition = data.address;
      let lonlat = data.lonlat.split(" ");
      self.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lonlat[0], lonlat[1], 5000),
      });
      var ellipsoid = self.viewer.scene.globe.ellipsoid;
      var cartographic = Cesium.Cartographic.fromDegrees(
        lonlat[0],
        lonlat[1],
        0
      );
      var cartesian3 = ellipsoid.cartographicToCartesian(cartographic);
      self.viewer.scene.postRender.addEventListener(function () {
        let _pm_position_2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          self.viewer.scene,
          cartesian3
        );
        if (_pm_position_2 != undefined) {
          $("#trackPopUp").css(
            "left",
            _pm_position_2.x - $(".leaflet-popup").width() / 2
          );
          $("#trackPopUp").css(
            "top",
            _pm_position_2.y - $(".leaflet-popup").height()
          );
        }
      });
    },
    //查询地名地址（天地图api）
    searchAddress() {
      const self = this;
      var tiandituKey = "26e04a33ff17a2107699002df53e5063";
      var poiajaxurl =
        'http://api.tianditu.gov.cn/search?postStr={"keyWord":"' +
        self.keyWord +
        '","level":"15","mapBound":"116.18198,39.84396,116.5799,40.00327","queryType":"7","count":"10","start":"0"}&type=query&tk=' +
        tiandituKey;
      $.ajax({
        url: poiajaxurl,
        type: "get",
        dataType: "json",
        success: function (res) {
          console.log(res);
          self.infoDatas = res.pois;
          if (self.infoDatas.length == 0) {
            self.$message({
              message: "未查询到数据",
              type: "warning",
            });
            return;
          }
          self.showResult = true;
          self.allshowPosition();
        },
      });
    },
    //绘制所有查询到的点
    allshowPosition() {
      const self = this;
      self.viewer.scene.globe.depthTestAgainstTerrain = true;
      self.infoDatas.forEach((item) => {
        let lonlat = item.lonlat.split(" ");
        var entity = self.viewer.entities.add({
          name: "addressBillboard",
          position: Cesium.Cartesian3.fromDegrees(lonlat[0], lonlat[1], 0),
          billboard: {
            //图标
            image: "../../../static/img/index/position.png",
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            width: 30,
            height: 30,
          },
        });
      });
    },
    //清空地名地址查询输入框
    clearInput(val) {
      if (!val) {
        this.showResult = false;
        Globe.deleteBillboard(this.viewer,"addressBillboard");
        this.showHeightPanel = false;
      }
    },
  },
};
</script>
<style>
.elInputWrapAddress .el-input {
    box-sizing: border-box;
}

/* 修改输入框默认样式结束 */

.elInputWrapAddress .el-input__inner {
    background: rgba(63, 72, 84, 0.7);
    border-radius: 0;
    color: #fff;
}
</style>
<style scoped>
.rightTopToolWrap {
  position: fixed;
  top: 100px;
  right: 20px;
}
.addressResult {
  width: 100%;
  max-height: 38vh;
  background:rgba(63, 72, 84, 0.7);
  margin-top: 2px;
  overflow: auto;
  color: #fff;
  padding: 5px 0;
}
.addressResult::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.addressResult::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.addressResult::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.addressResult li {
  width: 95%;
  margin: 0 auto;
  text-align: left;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0.5vh 0.5vw;
  box-sizing: border-box;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap; /*文本不换行*/
}
.addressResult li:hover {
  background: #d1d1d1;
  color: #000;
}
.select {
  background: #d1d1d1;
  color: #000;
}
/*leaflet风格气泡窗口样式模板*/
.leaflet-popup {
  position: absolute;
  text-align: center;
  font-size: 0.8rem;
}
.close {
  position: absolute;
  right: 5px;
  top: 10px;
  cursor: pointer;
}
.leaflet-popup-close-button {
  position: absolute;
  top: 0;
  right: 0;
  padding: 4px 4px 0 0;
  text-align: center;
  width: 18px;
  height: 14px;
  font: 16px/14px Tahoma, Verdana, sans-serif;
  color: #ccc;
  text-decoration: none;
  font-weight: bold;
  background: transparent;
  cursor: pointer;
}

.leaflet-popup-content-wrapper {
  text-align: center;
  /*max-height: 200px;*/
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
  padding: 1px;
  text-align: left;
  /* border-radius: 12px;*/
}

.leaflet-popup-content {
  width: 200px;
  min-height: 30px;
  margin: 1vh 1vw;
  line-height: 1.4;
  color: #000;
}

.leaflet-popup-tip-container {
  margin: 0 auto;
  width: 40px;
  height: 20px;
  position: relative;
  overflow: hidden;
}

.leaflet-popup-tip {
  background: white;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
  width: 17px;
  height: 17px;
  padding: 1px;
  margin: -10px auto 0;
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}
.leaflet-mark {
  height: 30px;
  background: rgba(63, 72, 84, 1);
  border-bottom: none;
  border-radius: 8px 8px 0px 0px;
  display: flex;
  align-items: center;
  padding-left: 1vh;
  box-sizing: border-box;
}
.btnmark {
  margin: 5px;
}
.bookBtn {
  color: #fff;
  background-color: #1f87dc;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
