// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery'
//引入cesium插件
import * as Cesium from "cesium/Cesium";
import "cesium/Widgets/widgets.css";
//引入element ui 插件
import ElementUI from "element-ui";
import 'element-ui/lib/theme-chalk/index.css'
//引入公共css样式
import './assets/style/init.css'


Vue.config.productionTip = false
Vue.prototype.Cesium = Cesium
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
