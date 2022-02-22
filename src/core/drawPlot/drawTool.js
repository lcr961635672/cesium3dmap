/* global Cesium */
import CreatePolyline from './createPolyline.js'
// import CreateRectangle from './createRectangle.js'
// 动态绘制工具
class DrawTool {
  constructor () {
    this.hasEdit = true
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
      var polygon = new CreatePolygon(this.viewer, opt.style)
      polygon.start(function () {
        if (that.hasEdit) {
          that.unbindEdit()
          polygon.startModify()
          that.lastSelectEntity = polygon
        }
        if (opt.success) opt.success(polygon)
        if (that.show == false) polygon.setVisible(false)
      })
      this.toolArr.push(polygon)
    }
    if (opt.type === 'billboard') {
      var billboard = new CreateBillboard(this.viewer, opt.style)
      billboard.start(function () {
        if (that.hasEdit) {
          that.unbindEdit()
          billboard.startModify()
          that.lastSelectEntity = billboard
        }
        if (opt.success) opt.success(billboard)
        if (that.show == false) billboard.setVisible(false)
      })
      this.toolArr.push(billboard)
    }
    if (opt.type === 'circle') {
      var circle = new CreateCircle(this.viewer, opt.style)
      circle.start(function () {
        if (that.hasEdit) {
          that.unbindEdit()
          circle.startModify()
          that.lastSelectEntity = circle
        }
        if (opt.success) opt.success(circle)
        if (that.show == false) circle.setVisible(false)
      })
      this.toolArr.push(circle)
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
