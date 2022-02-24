/* global Cesium */
import PitWallGeometry from '../geo/PitWallGeometry.js'
class TerrainClip {
  // 创建井壁
  _createWellWall (bottom, top) {
    // logInfo('井高度', this._minHeight, this._maxHeight, this._topHeights)

    // 墙底部的高度
    let bottomHeight = this._minHeight - this.diffHeight

    let geo = new PitWallGeometry({
      minimumArr: bottom,
      maximumArr: top
    })
    geo = geo.createGeometry(geo, this._topHeights, bottomHeight, this._maxHeight)

    this._primitive = new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: geo,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.GREY)
        },
        id: this.uuid
      }),
      appearance: new Cesium.MaterialAppearance({
        translucent: false,
        flat: true,
        material: new Cesium.Material({
          fabric: {
            type: 'Image',
            uniforms: {
              image: this.style.image,
              color: Cesium.Color.WHITE.withAlpha(this.style.opacity || 1.0)
            }
          }
        })
      }),
      asynchronous: false
    })
    this.primitiveCollection.add(this._primitive)

    this.bindPickId(this._primitive)
  }
  // 创建井底
  _createBottomSurface (bottomPositions) {
    if (!bottomPositions.length) {
      return
    }

    this._bottomPrimitive = new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: Cesium.PolygonGeometry.fromPositions({
          vertexFormat: Cesium.VertexFormat.ALL,
          positions: bottomPositions,
          perPositionHeight: true
        })
      }),
      appearance: new Cesium.MaterialAppearance({
        material: Cesium.Material.fromType(Cesium.Material.ImageType, {
          image: this.style.imageBottom,
          color: Cesium.Color.WHITE.withAlpha(this.style.opacity || 1.0)
        })
      })
    })

    this.primitiveCollection.add(this._bottomPrimitive)
    this.bindPickId(this._bottomPrimitive)
  }
}
export default new TerrainClip()
