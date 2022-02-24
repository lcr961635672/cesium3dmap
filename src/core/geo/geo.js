/* global Cesium */
/**
 * 获取 坐标数组 中 最高高程值
 *
 * @export
 * @param {Cartesian3[]} positions 笛卡尔坐标数组
 * @param {Number} [defaultVal=0] 默认高程值
 * @return {Number} 最高高程值
 */
export function getMaxHeight (positions, defaultVal = 0) {
  if (positions == null || positions.length === 0) {
    return defaultVal
  }

  let maxHeight = defaultVal
  for (let i = 0; i < positions.length; i++) {
    let tempCarto = Cesium.Cartographic.fromCartesian(positions[i])
    if (i === 0) {
      maxHeight = tempCarto.height
    }
    if (tempCarto.height > maxHeight) {
      maxHeight = tempCarto.height
    }
  }
  return formatNum(maxHeight, 1)
}

/**
 * 获取 坐标数组 中 最低高程值
 *
 * @export
 * @param {Cartesian3[]} positions 笛卡尔坐标数组
 * @param {Number} [defaultVal=0] 默认高程值
 * @return {Number} 最低高程值
 */
export function getMinHeight (positions, defaultVal = 0) {
  if (positions == null || positions.length === 0) {
    return defaultVal
  }

  let minHeight = defaultVal
  for (let i = 0; i < positions.length; i++) {
    let tempCarto = Cesium.Cartographic.fromCartesian(positions[i])
    if (i === 0) {
      minHeight = tempCarto.height
    }
    if (tempCarto.height < minHeight) {
      minHeight = tempCarto.height
    }
  }
  return formatNum(minHeight, 1)
}

/**
 * 格式化数字，返回指定小数位的数字
 *
 * @export
 * @param {Number} num 数字
 * @param {Int} [digits=0] 小数位数
 * @return {Number} 返回digits指定小数位的数字
 */
export function formatNum (num, digits = 0) {
  let pow = Math.pow(10, digits)
  return Math.round(num * pow) / pow
}
