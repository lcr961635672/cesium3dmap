<!-- 空间查询 -->
<template>
  <div>
    <div class="spaceQueryWrap">
      <ul class="contentToolImgUl" v-show="firstMenuShow">
        <li
          v-for="(item, index) in $parent.selectData.children"
          :key="index"
          @click="clickQuery(item, index)"
        >
          <div v-show="selectIndex !== index">
            <img
              class="toolImg"
              :src="'./static/img/secondMenu/' + item.name + '.png'"
              alt
            />
            <div>{{ item.name }}</div>
          </div>
          <div v-show="selectIndex == index">
            <img
              class="toolImg"
              :src="'./static/img/secondMenu/' + item.name + '1.png'"
              alt
            />
            <div style="color: #55f32f">{{ item.name }}</div>
          </div>
        </li>
      </ul>
      <!-- 绑定动态组件 -->
      <component
        class="secondMenuWrap"
        v-show="!firstMenuShow"
        v-bind:is="dynamicComponents"
      ></component>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectIndex: -1,
      dynamicComponents: null,
      firstMenuShow: true,
      currentData: {}, //当前选中的值
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    //子菜单返回按钮调用的事件
    childBackMenu() {
      const self = this;
      self.firstMenuShow = true;
      self.dynamicComponents = null;
      self.currentData.active = false;
      self.selectIndex = -1;
    },
    clickQuery(item, index) {
      const self = this;
      self.dynamicComponents = null; //先清空之前赋值的组件
      item.active = !item.active;
      self.currentData = item;
      if (item.active) {
        switch (item.name) {
          case "":
            
            break;
        
          default:
            break;
        }
      }
     
    },
  },
};
</script>
<style scoped>
.spaceQueryWrap {
  overflow: hidden;
}

.secondMenuWrap {
  padding: 0 10px;
}
</style>