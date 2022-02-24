/* global Cesium */

// 绘制圆
class CreateCircle {
  constructor () {
    this.objId = Number((new Date()).getTime() + '' + Number(Math.random() * 1000).toFixed(0))
    this.circle = null
    this.screenSpaceCameraController = []
    this.floatPoint = null
    this.centerPoint = null
    this.center = null
    this.float = null
    this.radius = 0
    this.modifyPoint = null
    this.state = 0
    this.pointArr = []
  }
  initCircle (viewer, style, prompt) {
    const that = this
    that.viewer = viewer
    that.prompt = prompt
    that.handler = new Cesium.ScreenSpaceEventHandler(that.viewer.scene.canvas)
    that.modifyHandler = new Cesium.ScreenSpaceEventHandler(that.viewer.scene.canvas)
    that.style = style
  }
  start (callBack) {
    var that = this
    this.handler.setInputAction(function (evt) { // 单机开始绘制
      var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.circle])
      if (!that.centerPoint) {
        that.center = cartesian
        that.centerPoint = that.createPoint(cartesian)
        that.centerPoint.typeAttr = 'center'
        that.floatPoint = that.createPoint(cartesian.clone())
        that.float = cartesian.clone()
        that.floatPoint.typeAttr = 'float'
        that.circle = that.createCircle(that.center, that.radius)
      } else {

      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    this.handler.setInputAction(function (evt) { // 移动时绘制线
      if (!that.centerPoint) {
        that.prompt.updatePrompt(evt.endPosition, '单击开始绘制')
        return
      }
      that.prompt.updatePrompt(evt.endPosition, '右键结束')
      var cartesian = that.getCatesian3FromPX(evt.endPosition, that.viewer, [that.circle])
      if (that.floatPoint) {
        that.floatPoint.position.setValue(cartesian)
        that.float = cartesian.clone()
      }
      that.radius = Cesium.Cartesian3.distance(cartesian, that.center)
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    this.handler.setInputAction(function () { // 单机开始绘制
      if (!that.circle) {
        return
      }
      that.state = 1
      that.handler.destroy()
      if (that.floatPoint) that.floatPoint.show = false
      if (that.centerPoint) that.centerPoint.show = false
      if (that.prompt) {
        that.prompt.closePrompt()
        that.prompt = null
      }
      if (callBack) callBack(that.circle)
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }
  startModify (callback) {
    if (this.state !== 2 && this.state !== 1) return // 表示还没绘制完成
    if (!this.modifyHandler) this.modifyHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
    var that = this
    if (that.floatPoint) that.floatPoint.show = true
    if (that.centerPoint) that.centerPoint.show = true
    this.modifyHandler.setInputAction(function (evt) {
      if (!that.circle) return
      var pick = that.viewer.scene.pick(evt.position)
      if (Cesium.defined(pick) && pick.id) {
        if (!pick.id.objId) { that.modifyPoint = pick.id }
        that.forbidDrawWorld(true)
      } else {
        if (that.floatPoint) that.floatPoint.show = false
        if (that.centerPoint) that.centerPoint.show = false
        if (that.modifyHandler) {
          that.modifyHandler.destroy()
          that.modifyHandler = null
          if (callback) callback(that.circle)
        }
        that.state = 2
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
    this.modifyHandler.setInputAction(function (evt) {
      if (!that.modifyPoint) return
      var cartesian = that.getCatesian3FromPX(evt.endPosition, that.viewer, [that.circle])
      if (!cartesian) {
        return
      }
      if (that.modifyPoint.typeAttr === 'center') {
        that.center = cartesian
        that.centerPoint.position.setValue(that.center)
        that.circle.position.setValue(that.center)
      } else {
        that.float = cartesian
        that.floatPoint.position.setValue(that.float)
      }
      that.radius = Cesium.Cartesian3.distance(that.float, that.center)
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    this.modifyHandler.setInputAction(function (evt) {
      if (!that.modifyPoint) return
      that.modifyPoint = null
      that.forbidDrawWorld(false)
    }, Cesium.ScreenSpaceEventType.LEFT_UP)
  }
  endModify (callback) {
    if (this.floatPoint) this.floatPoint.show = false
    if (this.centerPoint) this.centerPoint.show = false
    if (this.modifyHandler) {
      this.modifyHandler.destroy()
      this.modifyHandler = null
      if (callback) callback(this.circle)
    }
    this.state = 2
  }
  createPoint (position) {
    if (!position) return
    return this.viewer.entities.add({
      position: position,
      point: {
        pixelSize: 5,
        color: Cesium.Color.YELLOW,
        outlineWidth: 2,
        outlineColor: Cesium.Color.DARKRED,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      },
      show: false
    })
  }
  createCircle () {
    var that = this
    var ellipse = this.viewer.entities.add({
      position: this.center,
      ellipse: {
        semiMajorAxis: new Cesium.CallbackProperty(function () {
          return that.radius
        }, false),
        semiMinorAxis: new Cesium.CallbackProperty(function () {
          return that.radius
        }, false),
        material: this.style.material || Cesium.Color.YELLOW,
        width: this.style.width || 3,
        heightReference: this.style.heightReference === undefined ? Cesium.HeightReference.CLAMP_TO_GROUND : this.style.heightReference
      }
    })
    ellipse.objId = this.objId
    return ellipse
  }
  getCenter () {
    return this.center
  }
  setStyle (obj) {}
  remove () {
    if (this.circle) {
      this.state = 0
      this.viewer.entities.remove(this.circle)
      this.circle = null
    }
  }
  setVisible (vis) {
    this.circle.show = vis
  }
  forbidDrawWorld (isForbid) {
    this.viewer.scene.screenSpaceCameraController.enableRotate = !isForbid
    this.viewer.scene.screenSpaceCameraController.enableTilt = !isForbid
    this.viewer.scene.screenSpaceCameraController.enableTranslate = !isForbid
    this.viewer.scene.screenSpaceCameraController.enableInputs = !isForbid
  }
  destroy () {
    if (this.handler) {
      this.handler.destroy()
      this.handler = null
    }
    if (this.modifyHandler) {
      this.modifyHandler.destroy()
      this.modifyHandler = null
    }
    if (this.circle) {
      this.viewer.entities.remove(this.circle)
      this.circle = null
    }
    if (this.floatPoint) {
      this.viewer.entities.remove(this.floatPoint)
      this.floatPoint = null
    }
    if (this.centerPoint) {
      this.viewer.entities.remove(this.centerPoint)
      this.centerPoint = null
    }

    this.style = null
    this.modifyPoint = null
    if (this.prompt) this.prompt.closePrompt()
  }
  getCatesian3FromPX (px, viewer, entitys) {
    var picks = viewer.scene.drillPick(px)
    this.viewer.scene.render()
    var cartesian
    var isOn3dtiles = false
    for (var i = 0; i < picks.length; i++) {
      var isContinue = false
      for (var step = 0; step < entitys.length; step++) {
        if (entitys[step] && picks[i].id && entitys[step].objId === picks[i].id.objId) {
          isContinue = true
          break
        }
      }
      if (isContinue) continue
      if ((picks[i] && picks[i].primitive) || picks[i] instanceof Cesium.Cesium3DTileFeature) { // 模型上拾取
        isOn3dtiles = true
      }
    }
    if (isOn3dtiles) {
      cartesian = viewer.scene.pickPosition(px)
    } else {
      var ray = viewer.camera.getPickRay(px)
      if (!ray) return null
      cartesian = viewer.scene.globe.pick(ray, viewer.scene)
    }
    return cartesian
  }
}
export default new CreateCircle()
