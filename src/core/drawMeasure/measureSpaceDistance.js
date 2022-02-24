/* global Cesium */
// 空间距离量算js
class MeasureSpaceDistance {
  initParam (viewer, clampToGround) {
    this.objId = Number((new Date()).getTime() + '' + Number(Math.random() * 1000).toFixed(0))
    this.viewer = viewer
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
    this.ts_handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
    // 线
    this.polyline = null
    // 线坐标
    this.positions = []
    // 标签数组
    this.labels = []
    this.floatLable = null
    this.lastCartesian = null
    this.allDistance = 0
    this.clampToGround = clampToGround
  }
  // 开始测量
  start () {
    var that = this
    this.handler.setInputAction(function (evt) { // 单机开始绘制
      var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.polyline, that.floatLable])
      if (!cartesian) return
      if (that.positions.length === 0) {
        const label = that.createLabel(cartesian, '起点')
        that.labels.push(label)
        that.floatLable = that.createLabel(cartesian, '')
        that.floatLable.show = false
        that.positions.push(cartesian)
        that.positions.push(cartesian.clone())
        that.lastCartesian = cartesian
      } else {
        that.floatLable.show = false
        that.positions.push(cartesian)
        if (!that.lastCartesian) return
        var distance = that.getLength(cartesian, that.lastCartesian)
        that.allDistance += distance
        var text = that.formatLength(distance)
        const label = that.createLabel(cartesian, text)
        that.labels.push(label)
      }
      that.lastCartesian = cartesian
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    this.handler.setInputAction(function (evt) {
      if (that.positions.length < 1) return
      that.floatLable.show = true
      var cartesian = that.getCatesian3FromPX(evt.endPosition, that.viewer, [that.polyline, that.floatLable])
      if (!cartesian) return
      if (that.positions.length === 2) {
        if (!Cesium.defined(that.polyline)) {
          that.polyline = that.createLine()
        }
      }
      if (that.polyline) {
        that.positions.pop()
        that.positions.push(cartesian)
        if (!that.lastCartesian) return
        var distance = that.getLength(cartesian, that.lastCartesian)
        that.floatLable.show = true
        that.floatLable.label.text = that.formatLength(distance)
        that.floatLable.position.setValue(cartesian)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    this.handler.setInputAction(function (evt) {
      if (!that.polyline) return
      that.floatLable.show = false
      that.viewer.scene.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
      that.viewer.trackedEntity = undefined

      var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.polyline, that.floatLable])
      var distanceLast = that.getLength(cartesian, that.lastCartesian)
      that.allDistance += distanceLast
      var allDistance = that.formatLength(that.allDistance)

      var label = that.createLabel(cartesian, '')
      if (!cartesian) return
      that.labels.push(label)
      that.labels[that.labels.length - 1].label.text = '总长：' + allDistance
      if (that.handler) {
        that.handler.destroy()
        that.handler = null
      }
      if (that.tsLabel) {
        that.viewer.entities.remove(that.tsLabel)
      }
      if (that.ts_handler) {
        that.ts_handler.destroy()
        that.ts_handler = null
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }
  // 清除测量结果
  clear () {
    if (this.polyline) {
      this.viewer.entities.remove(this.polyline)
      this.polyline = null
    }
    for (var i = 0; i < this.labels.length; i++) {
      this.viewer.entities.remove(this.labels[i])
    }
    this.labels = []
    if (this.floatLable) {
      this.viewer.entities.remove(this.floatLable)
      this.floatLable = null
    }
    this.floatLable = null
  }
  createLine () {
    var that = this
    var polyline = this.viewer.entities.add({
      polyline: {
        positions: new Cesium.CallbackProperty(function () {
          return that.positions
        }, false),
        show: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        material: Cesium.Color.YELLOW,
        width: 3,
        clampToGround: this.clampToGround
      }
    })
    polyline.objId = this.objId
    return polyline
  }
  createLabel (c, text) {
    if (!c) return
    var label = this.viewer.entities.add({
      position: c,
      label: {
        text: text || '',
        font: '16px Helvetica',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        showBackground: true,
        pixelOffset: new Cesium.Cartesian2(-10.0, -10),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
          1.5e2,
          3.0,
          1.5e7,
          0.5
        )
      }
    })

    return label
  }
  getLength (c1, c2) {
    if (!c1 || !c2) return 0
    // 贴地
    if (this.clampToGround) {
      let distance = 0
      let a = Cesium.Cartographic.fromCartesian(c2)
      let b = Cesium.Cartographic.fromCartesian(c1)
      let geodesic = new Cesium.EllipsoidGeodesic()
      geodesic.setEndPoints(a, b)
      let s = geodesic.surfaceDistance
      s = Math.sqrt(Math.pow(s, 2) + Math.pow(a.height - b.height, 2))
      distance += s
      return distance
    } else { // 不贴地
      return Cesium.Cartesian3.distance(c1, c2)
    }
  }
  formatLength (num, dw) {
    if (!num) return
    var res = null
    if (!dw) {
      dw = '米'
      const n = Number(num).toFixed(2)
      res = n + dw
    }
    if (dw === '千米' || dw === '公里') {
      const n = (Number(num) / 1000).toFixed(2)
      res = n + dw
    }
    return res
  }
  // 兼容模型和地形上坐标拾取
  getCatesian3FromPX (px, viewer, noPickEntityArr) {
    var picks = viewer.scene.drillPick(px)
    viewer.render()
    var getOnModel = false
    var that = this
    var cartesian
    if (viewer.scene.pickPositionSupported) { // 检测是否支持拾取坐标
      for (var i = 0; i < picks.length; i++) {
        var pickedObject = picks[i]
        for (var j = 0; j < noPickEntityArr.length; j++) {
          var noPickEntity = noPickEntityArr[j]
          if (that.hasPickedModel(pickedObject, noPickEntity)) {
            getOnModel = true
          }
        }
      }
    }
    if (getOnModel) {
      cartesian = viewer.scene.pickPosition(px)
    } else {
      var ray = viewer.camera.getPickRay(px)
      if (!ray) return null
      cartesian = viewer.scene.globe.pick(ray, viewer.scene)
    }
    return cartesian
  }
  // 过滤拾取 屏蔽对某个entity的拾取
  hasPickedModel (pickedObject, noPickEntity) {
    if (!noPickEntity) return true
    if (Cesium.defined(pickedObject.id)) {
      var entity = pickedObject.id
      if (noPickEntity && entity === noPickEntity) return false
    }

    if (Cesium.defined(pickedObject.primitive)) {
      var primitive = pickedObject.primitive
      if (noPickEntity && primitive === noPickEntity) return false
    }
    return true
  }
}

export default new MeasureSpaceDistance()
