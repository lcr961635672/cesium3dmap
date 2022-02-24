<!-- 多图对比 -->
<template>
  <div class="multiGraphCompareWrap">
    <div class="multiImgWrap">
      <ul>
        <li
          v-for="(item, index) in $parent.selectData.children"
          :key="index"
          @click="clickTool(item,index)"
        >
          <img v-show="selectMenuIndex!=index" class="toolImg" 
          :src="'./static/img/rightChild/'+item.name+'.png'"
           alt />
          <img
            v-show="selectMenuIndex==index"
            class="toolImg"
            :src="'./static/img/rightChild/'+item.name+'1.png'"
            alt
          />
        </li>
      </ul>
    </div>
    <component v-bind:is="dynamicComponents"></component>
  </div>
</template>

<script>
import Globe from "../../core/globe";
export default {
  data() {
    return {
      imgPre: "../../../static/img/rightChild/",
      selectMenuIndex: -1,
      dynamicComponents: null,
      roolingState: false
    };
  },

  components: {},

  computed: {},

  mounted() {
    const self = this;
    self.$parent.selectData;
    console.log(self.$parent.selectData);
  },

  methods: {
    clickTool(data, index) {
      const self = this;
      self.selectMenuIndex = index;
      self.roolingState = !self.roolingState;
      switch (data.name) {
        // case "双图对比":
        //   self.$nextTick(() => {
        //     self.dynamicComponents = resolve =>
        //       require(["./multiGraphCompareChild/twoGraphCompare.vue"], resolve);
        //   });
        //   self.$parent.$parent.twoGraphFlag = true;
        //   break;
        case "卷帘对比":
          if (self.roolingState) {
            self.$nextTick(() => {
              self.dynamicComponents = resolve =>
                require(["./multiGraphCompareChild/rollingCurtainCompare.vue"], resolve);
            });
          } else {
            self.dynamicComponents = null;
            self.selectMenuIndex = -1
          }
          break;
        default:
          break;
      }
    }
  }
};
</script>
<style scoped>
.multiImgWrap {
  overflow: hidden;
}
.multiImgWrap li {
  float: left;
}
.toolImg {
  width: 3.5vw;
  height: 3.5vw;
  margin: 1vh 0.8vw;
  cursor: pointer;
}
</style>