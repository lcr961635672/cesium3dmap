<!-- 地图打印 -->
<template>
</template>

<script>
import html2canvas from "html2canvas";
export default {
  name: "mapPrint",
  data() {
    return {
      showprint: true,
      textEntity: null,
      showTip: false,
      tipMessage: "",
      tipMoveHandler: null,
      textName: "文字",
      fontSizeInput: "24",
      textarea: "",
      handler: null,
      clickTextHanlder: null,
      showBLC: true,
      showTEXT: false,
      showZBZ: false,
      showMapPanel: false,
      activeShapePoints: [],
      activeShape: null,
      floatingPoint: null,
      drawingMode: "",
      colorText: "#f00",
      color: "#f00",
     
    };
  },
  methods: {
    msSaveOrOpenBlob(blob, filename) {
      if (filename === "") {
        filename;
      }
      const element = document.createElement("a");
      element.setAttribute("href", window.URL.createObjectURL(blob));
      element.setAttribute("download", filename);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      this.$parent.selectMenuIndex = -1;
    },
    _downloadImage(filename, dataUrl) {
      const self = this;
      const byteString = atob(dataUrl.split(",")[1]);
      const mimeString = dataUrl
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      self.msSaveOrOpenBlob(blob, filename);
    },
    // 输入打印名称
    open() {
      const self = this;
      self
        .$prompt("请输入导出名称", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputValue: "地图打印",
          closeOnClickModal: false
        })
        .then(({ value }) => {
          var test = $("#cesiumContainer").get(0); //将jQuery对象转换为dom对象
          html2canvas(test).then(function(canvas) {
            // canvas宽度
            var canvasWidth = canvas.width;
            // canvas高度
            var canvasHeight = canvas.height;

            // 调用Canvas2Image插件转图片
            var img = Canvas2Image.convertToImage(
              canvas,
              canvasWidth,
              canvasHeight
            );
            // 调用保存到本地的方法下载图片
            self._downloadImage(value, img.src);
          });
        })
        .catch(e => {
          console.log(e);
          this.$parent.selectMenuIndex = -1;
          this.$message({
            type: "info",
            message: "打印取消"
          });
        });
    },
  },
  mounted() {
    const self = this;
    self.open()
    
  },
  beforeDestroy() {
    const self = this;
    $(".distance-legend").show();
    $("#distanceLegendDiv").show();
    $(".compassN").hide();
    if (self.handler) {
      self.handler.destroy();
    }
    if (self.clickTextHanlder) {
      self.clickTextHanlder.destroy();
    }
  }
};
</script>

<style scoped>
.printWrap {
  font-size: 0.8rem;
  /* position: fixed;
  bottom: 10vh;
  left: 35vw;
  width: 38vw;
  border: 1px solid #379dff;
  border-radius: 8px;
  font-size: 0.9rem;
  height: fit-content; */
}

.titleH {
  border-left: 3px solid #00fff6;
  padding: 0 0.4vw;
  margin: 2vh 0.4vw 2vh;
  font-size: 0.8rem;
}
.selected {
  color: #ffd200;
}
.headerWrap {
  width: 100%;
  height: 30px;
  background: #193b9a;
  border-radius: 8px 8px 0px 0px;
  display: flex;
  align-items: center;
  padding-left: 1vw;
  box-sizing: border-box;
}
.closebtn {
  position: absolute;
  right: 1vh;
  cursor: pointer;
}
.contentWrap {
  height: fit-content;
  width: 100%;
  /* background: rgba(255, 255, 255, 0.8);
  border-radius: 0px 0px 8px 8px;
  color: #42474a; */
  overflow: hidden;
}
.contentWrap li {
  float: left;
  display: flex;
  align-items: center;
  padding: 1vh 0.1vw;
  cursor: pointer;
}
.one {
  padding: 0.5vh 0.5vw 0 !important;
}
.one img {
  padding: 0.5vh 0.3vw 0 0;
}
.select {
  border: 1px solid red;
  border-radius: 4px;
  background: rgba(255, 0, 0, 0.2);
}
.color {
  padding: 0 !important;
}
.btn {
  background: #316db9;
  padding: 2px 5px;
  color: #fff;
  border-radius: 4px;
  margin-left: 0.7vw;
}
/*leaflet风格气泡窗口样式模板*/
.leaflet-popup {
  position: absolute;
  text-align: center;
  font-size: 0.8rem;
}
.close {
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
}

.leaflet-popup-content-wrapper {
  /* text-align: center;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
  padding: 1px; */
  /* border-radius: 12px;*/
  text-align: left;
  background: url("../../../static/img/index/panel.png") no-repeat -2px;
  height: 25vh;
  width: 21vw;
  background-size: 21vw 25vh;
}

.leaflet-popup-content {
  /*  width: 250px;
  max-height: 200px; */
  height: 90%;
  padding: 1vh 1vw;
  overflow-y: auto;
  line-height: 1.4;
  color: #000;
  margin-bottom: 2vh;
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
  color: #fff;
  height: 35px;
  width: 20.7vw;
  background: #193b9a;
  border: 1px solid rgba(55, 157, 255, 1);
  border-bottom: none;
  border-radius: 8px 8px 0px 0px;
  display: flex;
  align-items: center;
  padding-left: 1vh;
  box-sizing: border-box;
}
.drawl-label-tooltip {
  position: fixed;
  z-index: 1;
  max-width: 20vw;
  padding: 3px 8px;
  text-align: center;
  border-width: 1px;
  border-radius: 5px;
  background-color: rgba(15, 59, 129, 0.72);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #fff;
}
.drawl-label-tooltip i {
  font-size: 14px;
}
</style>
<style>
.contentWrap .el-color-picker__trigger {
  border: none !important;
}
</style>
