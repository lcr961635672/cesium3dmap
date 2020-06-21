# cesium-demo

> a vue-cesium example lcr create it from 2020/06/10 23:03

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report 
npm run build --report

# vue-cesium集成配置步骤
1、创建Vue项目
使用Vue-cli工具创建一个Vue项目：
vue init webpack CesiumExample
安装cesium：
npm install cesium --save


2、Cesium环境配置
这里需要修改webpack.base.conf.js,webpack.dev.conf.js,webpack.prod.conf.js三个文件

2.1配置webpack.base.conf.js
 1、定义Cesium源码路径：
 const cesiumSource = '../node_modules/cesium/Source'
 2、让webpack正确处理多行字符串 在output中添加sourcePrefix:''
 output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath,
      sourcePrefix: ' '
  },
  3、设置Cesium别名
  需要在resolve中设置Cesium别名，这样在引入的时候就可以根据别名找到Cesium的包（注：也可以不设置别名，导包是直接导入'cesium/Source/Cesium.js'就行。其实设置别名的目的就是让"别名"指向/node_modules/cesium/Source目录）
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      cesium: path.resolve(__dirname, cesiumSource)
    }
  },
  4、阻止以来警告
  module里添加unknownContextCritical:false
  module: {
	rules:[
	...
	],
	unknownContextCritical: false,
  }
2.2配置webpack.dev.conf.js
  1、定义路径：
  const cesiumSource = 'node_modules/cesium/Source'
  const cesiumWorkers = '../Build/Cesium/Workers'
  2、在plugins下面添加如下插件：
  new CopyWebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }]),
  new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]),
  new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]),
  new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers' }]),
  new webpack.DefinePlugin({
   // Define relative base path in cesium for loading assets
   CESIUM_BASE_URL: JSON.stringify('')
  })
2.3配置webpack.prod.conf.js文件
  1、定义路径
  const cesiumSource = 'node_modules/cesium/Source'
  const cesiumWorkers = '../Build/Cesium/Workers'
  2、在plugins下面添加如下插件
  new CopyWebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }]),
  new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]),
  new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]),
  new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers' }]),
  new webpack.DefinePlugin({
   // 注意这里和dev的配置不同
   // 定义Cesium从哪里加载资源，如果使用默认的''，却变成了绝对路径了，所以这里使用'./'，使用相对路径
   CESIUM_BASE_URL: JSON.stringify('./')
  })
3、开始使用
  导入Cesium
  import * as Cesium from 'cesium/Cesium'
  import 'cesium/Widgets/widgets.css'

#vue组件
<template>
  <div class="container">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import * as Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
export default {
  name: "cesiumPage",
  data() {
    return {};
  },
  mounted() {
    let viewer = new Cesium.Viewer("cesiumContainer",{
        animation: false,  //是否创建动画小部件（左下角）
        timeline: false,   //是否粗昂见时间轴小部件（底部）
        baseLayerPicker: false, //是否创建底图切换小部件（右上）
        fullscreenButton: false, //是否创建全屏小部件（右上）
        geocoder: false, //是否创建搜索小部件（右上）
        homeButton: false, //是否创建默认位置小部件（右上）
        navigationHelpButton: false, //是否创建导小部件（右上）
        sceneModePicker: false, //是否设置维度选择小部件，二维，三维，2,5维（右上）
    });
    //隐藏cesium版权信息
    viewer.cesiumWidget.creditContainer.style.display = "none";
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
}
#cesiumContainer {
  width: 100%;
  height: 100vh;
}
</style>



 


