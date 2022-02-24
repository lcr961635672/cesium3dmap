import * as Cesium from 'cesium'

export class PitWallGeometry {
  constructor (options = {}) {
    options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT)

    let min = options.minimumArr
    let max = options.maximumArr
    Cesium.Check.defined('dingmian', max)
    Cesium.Check.defined('dimianmian', min)

    Cesium.Check.typeOf.number.greaterThanOrEquals('dingmian.length', max.length, 3)
    Cesium.Check.typeOf.number.greaterThanOrEquals('dimian.length', min.length, 3)

    let vertexFormat = new Cesium.VertexFormat({
      st: true,
      position: true,
      bitangent: false,
      normal: false,
      color: false,
      tangent: false
    })

    this._minimumArr = Cesium.clone(min)
    this._maximumArr = Cesium.clone(max)
    this._vertexFormat = vertexFormat
    this._workerName = ''
  }

  createGeometry (PitWallGeometry, topHeights, bottomHeight, maxHeight = 0) {
    let min = PitWallGeometry._minimumArr
    let max = PitWallGeometry._maximumArr
    let vertexFormat = PitWallGeometry._vertexFormat

    let attributes = new Cesium.GeometryAttributes()
    let indices
    let positions
    let minPos, maxPos
    if (Cesium.defined(vertexFormat.position) && Cesium.defined(vertexFormat.st)) {
      if (Cesium.defined(vertexFormat.position)) {
        // 8 corner points.  Duplicated 3 times each for each incident edge/face.
        positions = new Float64Array(max.length * 4 * 3)

        for (let i = 0; i < max.length; i++) {
          if (i === max.length - 1) {
            positions[i * 12 + 0] = max[i].x
            positions[i * 12 + 1] = max[i].y
            positions[i * 12 + 2] = max[i].z

            positions[i * 12 + 3] = min[i].x
            positions[i * 12 + 4] = min[i].y
            positions[i * 12 + 5] = min[i].z

            positions[i * 12 + 9] = min[0].x
            positions[i * 12 + 10] = min[0].y
            positions[i * 12 + 11] = min[0].z

            positions[i * 12 + 6] = max[0].x
            positions[i * 12 + 7] = max[0].y
            positions[i * 12 + 8] = max[0].z
          } else {
            positions[i * 12 + 0] = max[i].x
            positions[i * 12 + 1] = max[i].y
            positions[i * 12 + 2] = max[i].z

            positions[i * 12 + 3] = min[i].x
            positions[i * 12 + 4] = min[i].y
            positions[i * 12 + 5] = min[i].z

            positions[i * 12 + 9] = min[i + 1].x
            positions[i * 12 + 10] = min[i + 1].y
            positions[i * 12 + 11] = min[i + 1].z

            positions[i * 12 + 6] = max[i + 1].x
            positions[i * 12 + 7] = max[i + 1].y
            positions[i * 12 + 8] = max[i + 1].z
          }
        }

        attributes.position = new Cesium.GeometryAttribute({
          componentDatatype: Cesium.ComponentDatatype.DOUBLE,
          componentsPerAttribute: 3,
          values: positions
        })
      }

      if (Cesium.defined(vertexFormat.st)) {
        let texCoords = new Float32Array(max.length * 4 * 2)
        let maxLen = max.length
        for (let i = 0; i < max.length; i++) {
          let currX = i / maxLen
          let currMaxHeight = (topHeights && topHeights[i]) || 0
          let currY = (currMaxHeight - bottomHeight) / (maxHeight - bottomHeight)
          let nextIndex = i + 1

          let nextMaxHeight = (topHeights && topHeights[nextIndex]) || 0
          let nextX = nextIndex / maxLen
          let nextY = (nextMaxHeight - bottomHeight) / (maxHeight - bottomHeight)

          texCoords[i * 8 + 0] = currX
          texCoords[i * 8 + 1] = currY - 0.0
          texCoords[i * 8 + 2] = currX
          texCoords[i * 8 + 3] = currY - currY
          texCoords[i * 8 + 4] = nextX
          texCoords[i * 8 + 5] = nextY - 0.0
          texCoords[i * 8 + 6] = nextX
          texCoords[i * 8 + 7] = nextY - nextY
        }

        attributes.st = new Cesium.GeometryAttribute({
          componentDatatype: Cesium.ComponentDatatype.FLOAT,
          componentsPerAttribute: 2,
          values: texCoords
        })
      }

      // 12 triangles:  6 faces, 2 triangles each.
      indices = new Uint16Array(max.length * 2 * 3)
      minPos = new Cesium.Cartesian3(9999999999999, 9999999999999, 9999999999999)
      maxPos = new Cesium.Cartesian3(-9999999999999, -9999999999999, -9999999999999)
      for (let i = 0; i < max.length; i++) {
        indices[i * 6 + 0] = 4 * i + 0
        indices[i * 6 + 1] = 4 * i + 1
        indices[i * 6 + 2] = 4 * i + 2
        indices[i * 6 + 3] = 4 * i + 1
        indices[i * 6 + 4] = 4 * i + 2
        indices[i * 6 + 5] = 4 * i + 3

        if (max[i].x >= maxPos.x && max[i].y >= maxPos.y && max[i].z >= maxPos.z) {
          maxPos = max[i]
        }
        if (min[i].x <= minPos.x && min[i].y <= minPos.y && min[i].z <= minPos.z) {
          minPos = min[i]
        }
      }
    }

    let diff = Cesium.Cartesian3.subtract(maxPos, minPos, new Cesium.Cartesian3())
    let radius = Cesium.Cartesian3.magnitude(diff) * 0.5

    return new Cesium.Geometry({
      attributes: attributes,
      indices: indices,
      primitiveType: Cesium.PrimitiveType.TRIANGLES,
      boundingSphere: new Cesium.BoundingSphere(Cesium.Cartesian3.ZERO, radius)
    })
  }
}
