<template>
  <div id="app">
    <cesium></cesium>
  </div>
</template>

<script>
import cesium from './components/layout/cesium.vue'
export default {
  name: 'App',
  components: {cesium}
}
</script>

<style>
#app,html,body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  font-size: 14px;
}
</style>
