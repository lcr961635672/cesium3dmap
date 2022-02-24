
/* global Cesium */
class CreatePolygon {
  constructor () {
    const that = this
    that.objId = Number((new Date()).getTime() + '' + Number(Math.random() * 1000).toFixed(0))
    that.polygon = null
    that.polyline = null
    that.positions = []
    that.state = 0 // 1为新增 2为编辑 0为清除
    that.gonPointArr = []
    that.modifyPoint = null
  }
  initPolygon (viewer, style, prompt) {
    const that = this
    that.viewer = viewer
    that.prompt = prompt
    that.handler = new Cesium.ScreenSpaceEventHandler(that.viewer.scene.canvas)
    that.modifyHandler = new Cesium.ScreenSpaceEventHandler(that.viewer.scene.canvas)
    that.style = style
  }
  start (callBack) {
    var that = this
    that.handler.setInputAction(function (evt) { // 单机开始绘制
      var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.polygon])
      if (that.positions.length === 0) {
        that.positions.push(cartesian.clone())
      }
      that.positions.push(cartesian)
      var point = that.createPoint(cartesian)
      point.wz = that.gonPointArr.length
      that.gonPointArr.push(point)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    that.handler.setInputAction(function (evt) { // 移动时绘制面
      if (that.positions.length < 1) {
        that.prompt.updatePrompt(evt.endPosition, '单击开始绘制')
        return
      }
      that.prompt.updatePrompt(evt.endPosition, '单击新增，右键结束')
      var cartesian = that.getCatesian3FromPX(evt.endPosition, that.viewer, [that.polygon])
      if (that.positions.length === 2) {
        if (!Cesium.defined(that.polyline)) that.polyline = that.createPolyline()
      } else {
        if (!Cesium.defined(that.polygon)) {
          that.polygon = that.createPolygon(that.style)
          that.polygon.isFilter = true
          that.polygon.objId = that.objId
          if (that.polyline) that.viewer.entities.remove(that.polyline)
        }
      }
      that.positions.pop()
      that.positions.push(cartesian)
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    that.handler.setInputAction(function (evt) {
      if (!that.polygon) return
      var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.polygon])
      that.state = 1
      that.handler.destroy()
      if (that.floatPoint) {
        if (that.floatPoint) that.floatPoint.show = false
        that.floatPoint = null
      }
      that.positions.pop()
      that.positions.push(cartesian)
      var point = that.createPoint(cartesian)
      point.wz = that.gonPointArr.length
      that.gonPointArr.push(point)
      if (that.prompt) {
        that.prompt.closePrompt()
        that.prompt = null
      }
      callBack(that.polygon)
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }
  createByPositions (lnglatArr, callBack) { // 通过传入坐标数组创建面
    const that = this
    if (!lnglatArr) return
    var positions = that.getCatesian3FromPX.lnglatArrToCartesianArr(lnglatArr)
    if (!positions) return
    that.polygon = that.createPolygon()
    that.positions = positions
    callBack(that.polygon)
    for (var i = 0; i < positions.length; i++) {
      var point = that.createPoint(positions[i])
      point.isFilter = true
      point.wz = that.gonPointArr.length
      that.gonPointArr.push(point)
    }
    that.state = 1
    that.polygon.objId = that.objId
  }
  startModify () {
    const that = this
    if (that.state !== 1 && that.state !== 2) return // 表示还没绘制完成
    if (!that.modifyHandler) that.modifyHandler = new Cesium.ScreenSpaceEventHandler(that.viewer.scene.canvas)
    for (var i = 0; i < that.gonPointArr.length; i++) {
      var point = that.gonPointArr[i]
      if (point) point.show = true
    }
    that.modifyHandler.setInputAction(function (evt) {
      var pick = that.viewer.scene.pick(evt.position)
      if (Cesium.defined(pick) && pick.id) {
        if (!pick.id.objId) { that.modifyPoint = pick.id }
        that.forbidDrawWorld(true)
      } else {
        for (var i = 0; i < that.gonPointArr.length; i++) {
          var point = that.gonPointArr[i]
          if (point) point.show = false
        }
        if (that.modifyHandler) {
          that.modifyHandler.destroy()
          that.modifyHandler = null
        }
        that.state = 2
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
    that.modifyHandler.setInputAction(function (evt) { // 移动时绘制面
      if (that.positions.length < 1 || !that.modifyPoint) return
      var cartesian = that.getCatesian3FromPX(evt.endPosition, that.viewer, [that.polygon, that.modifyPoint])
      if (cartesian) {
        that.modifyPoint.position.setValue(cartesian)
        that.positions[that.modifyPoint.wz] = cartesian
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    that.modifyHandler.setInputAction(function (evt) {
      that.forbidDrawWorld(false)
      if (!that.modifyPoint) return
      var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.polygon, that.modifyPoint])
      that.modifyPoint.position.setValue(cartesian)
      that.positions[that.modifyPoint.wz] = cartesian
      that.modifyPoint = null
      that.forbidDrawWorld(false)
    }, Cesium.ScreenSpaceEventType.LEFT_UP)
  }
  endModify (callback) {
    const that = this
    for (var i = 0; i < that.gonPointArr.length; i++) {
      var point = that.gonPointArr[i]
      if (point) point.show = false
    }
    if (that.modifyHandler) {
      that.modifyHandler.destroy()
      that.modifyHandler = null
    }
    that.state = 2
    if (callback) callback(that.polygon)
  }
  createPoint (position) {
    const that = this
    if (!position) return
    return that.viewer.entities.add({
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
  createPolygon () {
    var that = this
    return that.viewer.entities.add({
      polygon: {
        hierarchy: new Cesium.CallbackProperty(function () {
          return new Cesium.PolygonHierarchy(that.positions)
        }, false),
        clampToGround: that.style.clampToGround !== undefined,
        show: true,
        fill: that.style.fill || true,
        material: that.style.material.withAlpha(0.5) || Cesium.Color.WHITE.withAlpha(0.5),
        width: that.style.width || 2,
        outlineColor: that.style.outlineColor || Cesium.Color.WHITE,
        outlineWidth: that.style.outlineWidth || 2,
        outline: that.style.outline

      }

    })
  }
  createPolyline () {
    var that = this
    return that.viewer.entities.add({
      polyline: {
        positions: new Cesium.CallbackProperty(function () {
          return that.positions
        }, false),
        clampToGround: false,
        material: that.style.material || Cesium.Color.RED,
        width: 3
      }
    })
  }
  getPositions () {
    return this.positions
  }
  getLnglats () {
    return Cesium.caratesianArrToLnglatArr(this.positions)
  }
  setStyle (obj) {}
  remove () {
    const that = this
    if (that.polygon) {
      that.state = 0
      that.viewer.entities.remove(that.polygon)
      that.polygon = null
    }
  }
  setVisible (vis) {
    this.polygon.show = vis
  }
  forbidDrawWorld (isForbid) {
    const that = this
    that.viewer.scene.screenSpaceCameraController.enableRotate = !isForbid
    that.viewer.scene.screenSpaceCameraController.enableTilt = !isForbid
    that.viewer.scene.screenSpaceCameraController.enableTranslate = !isForbid
    that.viewer.scene.screenSpaceCameraController.enableInputs = !isForbid
  }
  destroy () {
    const that = this
    if (that.handler) {
      that.handler.destroy()
      that.handler = null
    }
    if (that.modifyHandler) {
      that.modifyHandler.destroy()
      that.modifyHandler = null
    }
    if (that.polygon) {
      that.viewer.entities.remove(that.polygon)
      that.polygon = null
    }
    if (that.polyline) {
      that.viewer.entities.remove(that.polyline)
      that.polyline = null
    }
    that.positions = []
    that.style = null
    if (that.modifyPoint) {
      that.viewer.entities.remove(that.modifyPoint)
      that.modifyPoint = null
    }
    for (var i = 0; i < that.gonPointArr.length; i++) {
      var point = that.gonPointArr[i]
      that.viewer.entities.remove(point)
    }
    that.gonPointArr = []
    that.state = 0
    if (that.prompt) that.prompt.closePrompt()
    if (that.polyline) {
      that.polyline = null
      that.viewer.entities.remove(that.polyline)
    }
  }
  getCatesian3FromPX (px, viewer, entitys) {
    const that = this
    that.viewer.scene.render()
    var cartesian
    var ray = viewer.camera.getPickRay(px)
    if (!ray) return null
    cartesian = viewer.scene.globe.pick(ray, viewer.scene)
    return cartesian
  }
}
export default new CreatePolygon()
