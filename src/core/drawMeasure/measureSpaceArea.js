/* global Cesium turf */
// 空间面积测量js
class MeasureSpaceArea {
  initParam (viewer, clampToGround) {
    this.objId = Number((new Date()).getTime() + '' + Number(Math.random() * 1000).toFixed(0))
    this.viewer = viewer
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)

    // 线
    this.polyline = null
    // 面
    this.polygon = null
    // 面积标签
    this.floatLabel = null
    this.filterEntityArr = [
      this.floatLabel,
      this.polyline,
      this.polygon
    ]
    this.positions = []
    this.clampToGround = clampToGround
  }
  // 开始测量
  start () {
    var that = this
    this.handler.setInputAction(function (evt) {
      var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, that.filterEntityArr)
      if (!cartesian) return
      // that.tsLabel.label.text = "单机新增点\n双击结束" ;
      if (that.positions.length === 0) {
        that.positions.push(cartesian)
        that.positions.push(cartesian.clone())
      } else {
        that.positions.push(cartesian)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    this.handler.setInputAction(function (evt) {
      if (that.positions.length < 1) return
      var cartesian = that.getCatesian3FromPX(evt.endPosition, that.viewer, that.filterEntityArr)
      if (!cartesian) return
      if (that.positions.length === 2) {
        if (!Cesium.defined(that.polyline)) {
          that.polyline = that.createLine()
        }
      }
      if (that.positions.length === 3) {
        if (!Cesium.defined(that.polygon)) {
          that.viewer.entities.remove(that.polyline)
          that.polygon = that.createGon()
          that.floatLabel = that.createLabel(cartesian, '')
        }
      }

      that.positions.pop()
      that.positions.push(cartesian)
      if (that.polygon) {
        var area = that.getAreaAndCenter(that.positions).area
        var center = that.getAreaAndCenter(that.positions).center
        var text = that.formatArea(area)
        that.floatLabel.label.text = '面积：' + text
        if (center) that.floatLabel.position.setValue(center)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    this.handler.setInputAction(function (evt) {
      if (!that.polygon) return
      that.viewer.scene.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
      that.viewer.trackedEntity = undefined
      if (that.handler) {
        that.handler.destroy()
        that.handler = null
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
    if (this.polygon) {
      this.viewer.entities.remove(this.polygon)
      this.polygon = null
    }
    if (this.floatLabel) {
      this.viewer.entities.remove(this.floatLabel)
      this.floatLabel = null
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
        clampToGround: this.clampToGround,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        material: Cesium.Color.YELLOW,
        width: 3
      }
    })
    return polyline
  }
  createGon () {
    var that = this
    var polygon = that.viewer.entities.add({
      polygon: new Cesium.PolygonGraphics({
        hierarchy: new Cesium.CallbackProperty(function () {
          return new Cesium.PolygonHierarchy(that.positions)
        }, false),
        perPositionHeight: !this.clampToGround,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        show: true,
        fill: true,
        material: Cesium.Color.YELLOW.withAlpha(0.5),
        outline: true,
        outlineColor: Cesium.Color.YELLOW
      })
    })
    return polygon
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
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      }
    })
    return label
  }
  // 调用第三方插件计算面积 turf
  getAreaAndCenter (positions) {
    if (!positions || positions.length < 1) return
    var cartographics = []
    var turfPoints = []
    for (var i = 0; i < positions.length; i++) {
      var cartesian3 = positions[i]
      var cartographic = Cesium.Cartographic.fromCartesian(cartesian3)
      cartographics.push([Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)])
      turfPoints.push(turf.point([Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)]))
    }
    if (!cartographics.length) return
    cartographics = cartographics.concat([cartographics[0]])
    var polygon = turf.polygon([cartographics])
    var area = turf.area(polygon)

    // 获取当前范围的中心点
    var features = turf.featureCollection(turfPoints)
    var turfCenter = turf.center(features)
    var center = turfCenter.geometry.coordinates

    return {
      area: area,
      center: Cesium.Cartesian3.fromDegrees(center[0], center[1])
    }
  }
  formatArea (num, dw) {
    if (!num) return
    var res = null
    if (!dw) {
      dw = '平方米'
      const n = Number(num).toFixed(2)
      res = n + dw
    }
    if (dw === '平方千米' || dw === '平方公里') {
      const n = (Number(num) / 1000000).toFixed(2)
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
export default new MeasureSpaceArea()
