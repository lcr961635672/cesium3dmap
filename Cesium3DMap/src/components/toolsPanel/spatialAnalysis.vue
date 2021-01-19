<!-- 空间分析 -->
<template>
  <div>
    <div class="spaceAnalysisWrap">
      <ul class="spaceAnalysisUl">
        <li
          v-for="(item, index) in $parent.selectData.children"
          :key="index"
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
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
        selectIndex: -1,
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {},
};
</script>
<style scoped>
.spaceAnalysisWrap {
  overflow: hidden;
}
.spaceAnalysisWrap li {
  float: left;
}
.toolImg {
  width: 3vw;
  height: 3vw;
  margin: 1vh 1.1vw 0;
  cursor: pointer;
}
</style>