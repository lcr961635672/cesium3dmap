<!-- 日照分析 -->
<template>
  <div class="sunshineAnalysisWrap">
    <div class="spaceChildHeaderWrap">
      <div class="leftHeader blockToLine">
        <i class="el-icon-back getCursor" @click="$parent.childBackMenu"></i>
        {{ $parent.currentData.name }}
      </div>
      <div class="rightHeader blockToLine" @click="closeSunshine">
        <i class="el-icon-delete">清除</i>
      </div>
    </div>
    <div class="tipText">提示:模拟设定时间范围内的太阳光照效果。</div>
    <div class="sunshineContentWrap elInputWrapInit">
      <el-form
        :label-position="labelPosition"
        label-width="70px"
        :model="formSunshine"
      >
        <el-form-item label="日期选择">
          <el-date-picker
            v-model="formSunshine.date"
            type="date"
            placeholder="选择日期"
            class="formItem"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-time-picker
            v-model="formSunshine.startTime"
            :value-format="timeFormat"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59',
            }"
            placeholder="任意时间点"
            class="formItem"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-time-picker
            v-model="formSunshine.endTime"
            :value-format="timeFormat"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59',
              minTime: formSunshine.startTime,
            }"
            placeholder="任意时间点"
            class="formItem"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            class="sureBtn"
            type="primary"
            size="mini"
            plain
            @click="playSunshine"
            >播放</el-button
          >
          <el-button
            class="sureBtn"
            type="primary"
            size="mini"
            plain
            @click="stopSunshine"
            v-show="showStopBtn"
            >{{ stopOrContinue ? "继续" : "暂停" }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: "left",
      formSunshine: {
        date: "",
        startTime: "08:00:00",
        endTime: "18:00:00",
      },
      timeFormat: "hh:mm:ss",
      currentTime: "",
      stopOrContinue: false, //暂停继续按钮切换开关， false为暂停， true为继续
      showStopBtn: false, //是否显示暂停继续按钮，点击播放之后显示，点击清除后隐藏
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.getNowFormatDate();
  },

  methods: {
    //播放事件
    playSunshine() {
      const self = this;
      let viewer = self.viewer;
      self.showStopBtn = true;
      let start =
        self.formSunshine.date + "T" + self.formSunshine.startTime + "Z";
      self.currentTime =
        self.formSunshine.date + "T" + self.formSunshine.endTime + "Z";
      let stop = self.formSunshine.date + "T" + self.formSunshine.endTime + "Z"; //"2017-07-11T"
      //使用太阳光也就是我们平时的光白天亮晚上黑
      viewer.clockViewModel.startTime = Cesium.JulianDate.fromIso8601(start);
      viewer.clockViewModel.stopTime = Cesium.JulianDate.fromIso8601(stop);
      viewer.clockViewModel.clockRange = Cesium.ClockRange.LOOP_STOP;
      //达到终止时间后停止:CLAMPED
      //达到终止时间后重新循环:LOOP_STOP
      //达到终止时间后继续读秒:UNBOUNDED
      viewer.clockViewModel.clockStep =
        Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER; //Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
      viewer.clockViewModel.multiplier = 5000; // 1000;
      viewer.clockViewModel.shouldAnimate = true;
      viewer.shadows = true;
      viewer.scene.globe.enableLighting = true;
      viewer.scene.globe.depthTestAgainstTerrain = true;
    },
    //暂停、继续事件
    stopSunshine() {
      const self = this;
      self.stopOrContinue = !self.stopOrContinue;
      if (self.stopOrContinue) {
        self.viewer.clockViewModel.shouldAnimate = false;
      } else {
        self.viewer.clockViewModel.shouldAnimate = true;
      }
    },
    closeSunshine() {
      const self = this;
      self.showStopBtn = false;
      let viewer = self.viewer;
      viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(
        self.formSunshine.date + "T08:00:00Z"
      );
      viewer.scene.globe.enableLighting = false;
      viewer.scene.globe.depthTestAgainstTerrain = false;
      viewer.shadows = false;
      viewer.clockViewModel.shouldAnimate = false;
    },
    //获取当前日期 YY-MM-dd hh:mm:ss
    getNowFormatDate() {
      const self = this;
      const date = new Date();
      const hengGang = "-";
      const maoHao = ":";
      let month = date.getMonth() + 1;
      let curDate = date.getDate();
      let curHours = date.getHours();
      let curMinutes = date.getMinutes();
      let curSeconds = date.getSeconds();

      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (curDate >= 0 && curDate <= 9) {
        curDate = "0" + curDate;
      }
      if (curHours >= 0 && curHours <= 9) {
        curHours = "0" + curHours;
      }
      if (curMinutes >= 0 && curMinutes <= 9) {
        curMinutes = "0" + curMinutes;
      }
      if (curSeconds >= 0 && curSeconds <= 9) {
        curSeconds = "0" + curSeconds;
      }
      self.formSunshine.date =
        date.getFullYear() + hengGang + month + hengGang + curDate;
      // var currentdate = date.getFullYear() + hengGang + month + hengGang + curDate
      //         + " " + curHours + maoHao + curMinutes
      //         + maoHao + curSeconds;
      let currentdate = curHours + maoHao + curMinutes + maoHao + curSeconds;
      return currentdate;
    },
  },
  beforeDestroy() {
    this.closeSunshine();
  },
};
</script>
<style scoped>
.tipText {
  text-align: left;
  margin: 5px 0 10px 0;
  color: #cad1d1;
}

</style>
<style >
</style>
