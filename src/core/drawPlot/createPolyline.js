/* global Cesium */
class CreatePolyline {
  constructor () {
    this.objId = Number((new Date()).getTime() + '' + Number(Math.random() * 1000).toFixed(0))
    this.viewer = null
    this.handler = null
    this.modifyHandler = null
    this.polyline = null
    this.positions = []
    this.style = {}
    this.floatPoint = null
    this.linePointArr = []
    this.modifyPoint = null
    this.state = 0
    // 初始化鼠标提示框
    // this.prompt = new MovePrompt(viewer);
    this.prompt = null
  }
  initPolyline (viewer, style, prompt) {
    this.viewer = viewer
    this.prompt = prompt
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
    this.modifyHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
    this.style = style
  }
  start (callBack) {
    var that = this
    this.handler.setInputAction(function (evt) { // 单机开始绘制
      var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.polyline])
      if (that.positions.length === 0) {
        that.positions.push(cartesian.clone())
        that.floatPoint = that.createPoint(cartesian.clone())
      }
      that.positions.push(cartesian)
      var point = that.createPoint(cartesian)
      point.wz = that.linePointArr.length
      that.linePointArr.push(point)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    this.handler.setInputAction(function (evt) { // 移动时绘制线
      if (that.positions.length < 1) {
        that.prompt.updatePrompt(evt.endPosition, '单击开始绘制')
        return
      }
      that.prompt.updatePrompt(evt.endPosition, '单击新增点，双击结束绘制')
      var cartesian = that.getCatesian3FromPX(evt.endPosition, that.viewer, [that.polyline])
      if (that.floatPoint) that.floatPoint.position.setValue(cartesian)
      if (that.positions.length === 2) {
        if (!Cesium.defined(that.polyline)) {
          that.polyline = that.createPolyline()
        }
      }
      if (that.polyline) {
        that.positions.pop()
        that.positions.push(cartesian)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    this.handler.setInputAction(function (evt) { // 右键绘制
      if (!that.polyline) {
        return
      }
      var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.polyline])
      that.state = 1
      that.handler.destroy()
      if (that.floatPoint) {
        if (that.floatPoint) that.floatPoint.show = false
        that.floatPoint = null
      }
      that.positions.pop()
      that.positions.push(cartesian)
      var point = that.createPoint(cartesian)
      point.wz = that.linePointArr.length
      that.linePointArr.push(point)
      if (that.prompt) {
        that.prompt.closePrompt()
      }
      if (callBack) callBack(that.positions)
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
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
  createPolyline () {
    var that = this
    var polyline = this.viewer.entities.add({
      polyline: {
        positions: new Cesium.CallbackProperty(function () {
          return that.positions
        }, false),
        show: true,
        material: this.style.material || Cesium.Color.YELLOW,
        width: this.style.width || 3,
        clampToGround: this.style.clampToGround !== undefined
      }
    })
    polyline.objId = this.objId
    console.log(this.objId)
    return polyline
  }
  getPositions () {
    return this.positions
  }
  startModify (callback) {
    if (this.state !== 2 && this.state !== 1) return // 表示还没绘制完成
    if (!this.modifyHandler) this.modifyHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
    var that = this
    for (var i = 0; i < that.linePointArr.length; i++) {
      var point = that.linePointArr[i]
      if (point) point.show = true
    }
    this.modifyHandler.setInputAction(function (evt) {
      if (!that.polyline) return
      var pick = that.viewer.scene.pick(evt.position)
      if (Cesium.defined(pick) && pick.id) {
        if (!pick.id.objId) { that.modifyPoint = pick.id }
        that.forbidDrawWorld(true)
      } else {
        for (var i = 0; i < that.linePointArr.length; i++) {
          var point = that.linePointArr[i]
          if (point) point.show = false
        }
        if (that.modifyHandler) {
          that.modifyHandler.destroy()
          that.modifyHandler = null
          if (callback) callback(that.polyline)
        }
        that.state = 2
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
    this.modifyHandler.setInputAction(function (evt) {
      if (that.positions.length < 1 || !that.modifyPoint) return
      // that.modifyPrompt.updatePrompt(evt.endPosition, "鼠标拖动修改");
      var cartesian = that.getCatesian3FromPX(evt.endPosition, that.viewer, [that.polyline, that.modifyPoint])
      if (cartesian) {
        that.modifyPoint.position.setValue(cartesian)
        that.positions[that.modifyPoint.wz] = cartesian
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    this.modifyHandler.setInputAction(function (evt) {
      if (!that.modifyPoint) return
      var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.polyline, that.modifyPoint])
      that.modifyPoint.position.setValue(cartesian)
      that.positions[that.modifyPoint.wz] = cartesian
      that.modifyPoint = null
      that.forbidDrawWorld(false)
    }, Cesium.ScreenSpaceEventType.LEFT_UP)
  }
  endModify (callback) {
    for (var i = 0; i < this.linePointArr.length; i++) {
      var point = this.linePointArr[i]
      if (point) point.show = false
    }
    if (this.modifyHandler) {
      this.modifyHandler.destroy()
      this.modifyHandler = null
      if (callback) callback(this.polyline)
    }
    this.state = 2
  }
  setVisible (vis) {
    this.polyline.show = vis
  }
  forbidDrawWorld (isForbid) {
    this.viewer.scene.screenSpaceCameraController.enableRotate = !isForbid
    this.viewer.scene.screenSpaceCameraController.enableTilt = !isForbid
    this.viewer.scene.screenSpaceCameraController.enableTranslate = !isForbid
    this.viewer.scene.screenSpaceCameraController.enableInputs = !isForbid
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
export default new CreatePolyline()
