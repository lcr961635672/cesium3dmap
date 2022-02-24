/* global Cesium */
import CreatePolyline from './createPolyline.js'
// import CreateRectangle from './createRectangle.js'
import CreatePolygon from './createPolygon.js'
import CreateBillboard from './createBillboard.js'
import CreateCircle from './createCircle.js'
// 动态绘制工具
class DrawTool {
  constructor () {
    this.hasEdit = false
    this.toolArr = []
    this.toolArr = []
    this.show = true
    this.viewer = null
    this.handler = null
    this.prompt = null
  }
  initParam (viewer, prompt) {
    this.prompt = prompt
    this.viewer = viewer
    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  }
  // 开始绘制
  startDraw (opt) {
    var that = this
    that.hasEdit = opt.style.hasEdit
    if (opt.type === 'polyline') {
      CreatePolyline.initPolyline(this.viewer, opt.style, this.prompt)
      CreatePolyline.start(function (positions) {
        if (that.hasEdit) {
          that.unbindEdit()
          CreatePolyline.startModify(opt.modifySuccess)
          that.lastSelectEntity = CreatePolyline
        }
        if (opt.success) opt.success(positions)
        if (that.show === false) CreatePolyline.setVisible(false)
      })
      this.toolArr.push(CreatePolyline)
    }
    if (opt.type === 'polygon') {
      CreatePolygon.initPolygon(this.viewer, opt.style, this.prompt)
      CreatePolygon.start(function () {
        if (that.hasEdit) {
          that.unbindEdit()
          CreatePolygon.startModify()
          that.lastSelectEntity = CreatePolygon
        }
        if (opt.success) opt.success(CreatePolygon)
        if (that.show === false) CreatePolygon.setVisible(false)
      })
      this.toolArr.push(CreatePolygon)
    }
    if (opt.type === 'billboard') {
      CreateBillboard.initillboard(this.viewer, opt.style, this.prompt)
      CreateBillboard.start(function () {
        if (that.hasEdit) {
          that.unbindEdit()
          CreateBillboard.startModify()
          that.lastSelectEntity = CreateBillboard
        }
        if (opt.success) opt.success(CreateBillboard)
        if (that.show === false) CreateBillboard.setVisible(false)
      })
      this.toolArr.push(CreateBillboard)
    }
    if (opt.type === 'circle') {
      CreateCircle.initCircle(this.viewer, opt.style, this.prompt)
      CreateCircle.start(function () {
        if (that.hasEdit) {
          that.unbindEdit()
          CreateCircle.startModify()
          that.lastSelectEntity = CreateCircle
        }
        if (opt.success) opt.success(CreateCircle)
        if (that.show === false) CreateCircle.setVisible(false)
      })
      this.toolArr.push(CreateCircle)
    }
    if (opt.type === 'rectangle') {
      // CreateRectangle.initRectangle(this.viewer, opt.style, this.prompt);
      // rectangle.start(function () {
      //     if (that.hasEdit) {
      //         that.unbindEdit();
      //         CreateRectangle.startModify();
      //         that.lastSelectEntity = CreateRectangle;
      //     }
      //     if (opt.success) opt.success(CreateRectangle);
      //     if (that.show == false) rectangle.setVisible(false);
      // });
      // this.toolArr.push(CreateRectangle);
    }
    // 重写材质
    if (opt.type === 'flowPolyline') {
      var polyline = new CreatePolyline(this.viewer, opt.style)
      polyline.start(function () {
        if (that.hasEdit) {
          that.unbindEdit()
          polyline.startModify()
        }
        if (opt.success) opt.success(polyline)
      })
      this.toolArr.push(polyline)
    }
  }
  unbindEdit () {
    for (var i = 0; i < this.toolArr.length; i++) {
      this.toolArr[i].endModify()
    }
  }
}
export default new DrawTool()
