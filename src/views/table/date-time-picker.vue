<template>
  <div style="padding: 20px">
    <!-- <h3>当前时间：{{ showDate }}</h3> -->

    <div style="display: flex; justify-content: center">
      <el-button type="text">选择月份</el-button>
      <el-pagination
        background
        :current-page="currentMonth"
        :page-size="1"
        layout="prev, pager, next"
        :total="12"
        :pager-count="13"
        @current-change="onChangeMonth"
      >
      </el-pagination>
    </div>

    <el-row>
      <el-col :span="2" v-for="item in currentMonth_days" :key="item"
        ><div class="date" @click="onOpenDrawer(item)">
          {{ item }}
          <el-tag type="success" size="mini">{{ weeks[item] }}</el-tag>
          <!-- <i class="el-icon-time"></i> -->
        </div></el-col
      >
    </el-row>

    <el-drawer :visible.sync="drawerVisible" :with-header="false" ref="drawer">
      <div class="drawer-container">
        <div style="margin-bottom: 20px">
          当前所选日期：{{ currentMonth }} 月 {{ dateChosen }} 日
        </div>
        <div
          v-for="(item, index) in timePeriod"
          :key="index"
          style="margin-bottom: 20px; display: flex; align-items: center"
        >
          <date-picker
            v-model="startTime[index]"
            type="time"
            placeholder="选择开始时间"
            format="HH : mm"
            :minute-step="30"
            prefix-class="xmx"
          ></date-picker>
          <span style="padding: 0 10px">至</span>
          <date-picker
            v-model="endTime[index]"
            type="time"
            placeholder="选择结束时间"
            format="HH : mm"
            :minute-step="30"
            prefix-class="xmx"
          ></date-picker>

          <!-- <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            circle
            @click="delTimePeriod"
            style="margin-left:10px"
          ></el-button> -->
        </div>

        <el-button
          style="margin-bottom: 30px"
          icon="el-icon-plus"
          type="success"
          @click="addTimePeriod"
          >新增可预约时间段</el-button
        >

        <div>
          <el-button @click="$refs.drawer.closeDrawer()">取 消</el-button>
          <el-button type="primary" @click="confirmPeriod">确 定</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { formatDate } from "@/utils/time-format";
import getWeek from "@/utils/get-week";

import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

import DatePicker from "vue2-datepicker";
import "@/styles/datepicker.scss";
import "vue2-datepicker/locale/zh-cn";

export default {
  name: "DateTimePicker",
  components: { flatPickr, DatePicker },
  props: {},
  data() {
    return {
      currentMonth: 1,
      currentMonth_days: 0,
      drawerVisible: false,
      dateChosen: 1,
      weeks: [],
      startTime: [],
      endTime: [],
      timePeriod: [{}],
      addIndex: 0,
      // config: {
      //   enableTime: true,
      //   noCalendar: true,
      //   dateFormat: "H:i",
      //   time_24hr: true,
      // },
    };
  },
  computed: {
    // showDate() {
    //   let date = new Date();
    //   return formatDate(date, "yyyy-MM-dd");
    // },
  },
  watch: {},
  created() {
    this.getMonth_Days();
  },
  mounted() {},
  methods: {
    getMonth_Days() {
      let date = new Date();
      let year = date.getFullYear();
      let d = new Date(year, this.currentMonth, 0);
      this.currentMonth_days = d.getDate();

      for (let i = 1; i <= this.currentMonth_days; i++) {
        // 获取某天是星期几
        this.weeks[i] = getWeek(this.currentMonth, i);
      }
    },

    onChangeMonth(value) {
      this.currentMonth = value;
      this.getMonth_Days();
    },
    onOpenDrawer(date) {
      this.drawerVisible = true;
      this.dateChosen = date;
    },
    addTimePeriod() {
      const st = this.startTime;
      const et = this.endTime;
      const slen = st.length;
      const elen = et.length;

      if (st[this.addIndex] && et[this.addIndex]) {
        this.timePeriod.push({
          startTime: st[slen - 1],
          endTime: et[elen - 1],
        });
        this.addIndex++;
      } else if (!st[this.addIndex] && !et[this.addIndex]) {
        this.$message({
          message: `请选择开始和结束时间`,
          type: "error",
        });
      } else {
        this.$message({
          message: `请选择${st[this.addIndex] ? "结束" : "开始"}时间`,
          type: "warning",
        });
      }
    },
    confirmPeriod() {
      this.startTime = this.startTime.filter((item) => {
        return item !== null;
      });
      this.endTime = this.endTime.filter((item) => {
        return item !== null;
      });

      const slen = this.startTime.length;
      const elen = this.endTime.length;

      if (slen === elen && slen !== 0 && elen !== 0) {
        this.$message({
          message: "设置时间段成功",
          type: "success",
        });
        this.drawerVisible = false;
      } else
        this.$message({
          message: "请选择完整时间段后确定",
          type: "error",
        });
    },
  },
};
</script>

<style lang='scss' scoped>
.el-row {
  margin-top: 20px;
  .date {
    display: flex;
    justify-content: space-between;
    min-height: 36px;
    padding: 10px;
    border: 1px solid rgba(204, 201, 201, 0.5);
    height: 100px;
  }
  .date:hover {
    background-color: #f2f8fe;
  }
}

.drawer-container {
  margin: 20px;
}
</style>
