<!-- 消息提示框 -->
<template>
  <div class="promptWrap" v-show="showPrompt">
    <div class="promptArrow"></div>
    <div class="promptInner">{{msg}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPrompt: false,
      msg: "",
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    updatePrompt(position, msg) {
      const self = this;
      self.showPrompt = true;
      self.msg = msg;
      $(".promptWrap").css({"left": position.x + 30 + "px", "top":position.y + 30 + "px"})
    },
    closePrompt() {
        const self = this;
        self.msg = "";
        self.showPrompt = false;
    }
  },
};
</script>
<style scoped>
.promptWrap {
  position: fixed;
}
.promptArrow {
  position: absolute;
  width: 0;
  height: 0;
  top: 50%;
  left: 0;
  margin-top: -5px;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 5px solid #000;
}
.promptInner {
  padding: 3px 5px;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  text-align: left;
  max-width: 200px;
  text-decoration: none;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
</style>