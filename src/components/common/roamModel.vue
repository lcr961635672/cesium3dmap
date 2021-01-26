<!-- 漫游 -->
<template>
  <div>1111111111111111111111</div>
</template>

<script>
export default {
  name: "roamModel",
  data() {
    return {
      handlers: null,
      flags: {
        //记录是否在查看地图，也就是记录是否点击了鼠标或键盘
        looking: false,
        //记录键盘的前后上下左右
        moveForward: false,
        moveBackward: false,
        moveUp: false,
        moveDown: false,
        moveLeft: false,
        moveRight: false,
      },
    };
  },
  methods: {
    //相机camera漫游
    cameraMove() {
      const self = this;
      //相机设置
      const viewer = self.viewer;
      const scene = viewer.scene;
      const canvas = viewer.canvas;
      canvas.setAttribute("tabindex", "0"); // 需要把焦点放在画布上
      canvas.onclick = function () {
        canvas.focus();
      };
      //这个椭球形就是地球了
      const ellipsoid = viewer.scene.globe.ellipsoid;

      // 禁止默认的事件
      /*   scene.screenSpaceCameraController.enableRotate = false
      scene.screenSpaceCameraController.enableTranslate = false
      scene.screenSpaceCameraController.enableZoom = false
      scene.screenSpaceCameraController.enableTilt = false
      scene.screenSpaceCameraController.enableLook = false */

      //存储鼠标位置的变量
      let startMousePosition;
      let mousePosition;

      //当鼠标左键按下时执行(拿到鼠标按下时的位置)
      /*     self.handlers = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
      self.handlers.setInputAction(function(movement) {
        self.flags.looking = true
        mousePosition = startMousePosition = Cesium.Cartesian3.clone(movement.position)
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN) */
      //当鼠标移动时执行(拿到鼠标抬起时的位置)
      /*  self.handlers.setInputAction(function(movement) {
        mousePosition = movement.endPosition;
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE); */
      //当鼠标左键抬起时执行
      /*  self.handlers.setInputAction(function(position) {
        self.flags.looking = false;
      }, Cesium.ScreenSpaceEventType.LEFT_UP); */

      //获得键盘keydown事件
      document.addEventListener("keydown", self.keydownEvnet, false);
      //获得键盘keyup事件
      document.addEventListener("keyup", self.keyupEvent, false);

      //更新相机
      self.$parent.cameraEvent = viewer.clock.onTick.addEventListener(function (
        clock
      ) {
        const camera = viewer.camera;
        //当按下鼠标左键时
        /* if (self.flags.looking) {
          const width = canvas.clientWidth;
          const height = canvas.clientHeight;

          // 鼠标滑动的距离的x或y/网页可见区域的宽或者高
          let x = (mousePosition.x - startMousePosition.x) / width;
          let y = -(mousePosition.y - startMousePosition.y) / height;
          //这就是决定相机移动速度的参数
          const lookFactor = 0.05;
          //相机移动
          camera.lookRight(x * lookFactor);
          camera.lookUp(y * lookFactor);
        } */

        // 镜头移动的速度基于镜头离地球的高度
        const cameraHeight = ellipsoid.cartesianToCartographic(camera.position)
          .height;
        let moveRate = cameraHeight / 300.0;

        if (self.flags.moveForward) {
          camera.moveForward(moveRate);
        }
        if (self.flags.moveBackward) {
          camera.moveBackward(moveRate);
        }
        if (self.flags.moveUp) {
          camera.moveUp(moveRate);
        }
        if (self.flags.moveDown) {
          camera.moveDown(moveRate);
        }
        if (self.flags.moveLeft) {
          camera.moveLeft(moveRate);
        }
        if (self.flags.moveRight) {
          camera.moveRight(moveRate);
        }
      });
    },
    //判断键盘的输入
    getFlagForKeyCode(keyCode) {
      switch (keyCode) {
        case "W".charCodeAt(0):
          return "moveUp";
        case "S".charCodeAt(0):
          return "moveDown";
        case "Q".charCodeAt(0):
          return "moveForward";
        case "E".charCodeAt(0):
          return "moveBackward";
        case "D".charCodeAt(0):
          return "moveRight";
        case "A".charCodeAt(0):
          return "moveLeft";
        default:
          return undefined;
      }
    },
    //键盘上事件
    keyupEvent(e) {
      const self = this;
      var flagName = self.getFlagForKeyCode(e.keyCode);
      if (typeof flagName !== "undefined") {
        self.flags[flagName] = false;
      }
    },
    //键盘按下事件内容
    keydownEvnet(e) {
      const self = this;
      var flagName = self.getFlagForKeyCode(e.keyCode);
      if (typeof flagName !== "undefined") {
        self.flags[flagName] = true;
      }
    },
  },
  mounted() {
    const self = this;
    self.cameraMove();
  },
  beforeDestroy() {
    const self = this;
    const scene = self.viewer.scene;
    scene.screenSpaceCameraController.enableRotate = true;
    scene.screenSpaceCameraController.enableTranslate = true;
    scene.screenSpaceCameraController.enableZoom = true;
    scene.screenSpaceCameraController.enableTilt = true;
    scene.screenSpaceCameraController.enableLook = true;
    //移除键盘keydown事件
    document.removeEventListener("keydown", self.keydownEvnet, false);
    //移除键盘keyup事件
    document.removeEventListener("keyup", self.keyupEvent, false);
    if (self.handlers !== null) {
      self.handlers.destroy();
    }
  },
};
</script>

<style scoped>
</style>
