<template>
  <div class="container">
    <div class="header">
      <el-button
        type="success"
        round
        icon="el-icon-plus"
        @click="updateActionType(1)"
        >新增</el-button
      >
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%; margin-bottom: 10px"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="id" label="ID" width="180"> </el-table-column>
      <el-table-column prop="relatedItem_1" label="关联策略"> </el-table-column>
      <el-table-column label="特殊开放时间">
        <template slot-scope="{$index}">
          {{list[$index].attributes.day | filter}}
        </template>
      </el-table-column>
      <el-table-column prop="relatedItem_2" label="开放时间段"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="{ row, $index }">
          <el-button
            icon="el-icon-edit"
            size="small"
            type="primary"
            circle
            @click="updateActionType(0, row, $index)"
          ></el-button>
          <el-button
            icon="el-icon-delete"
            size="small"
            type="danger"
            circle
            :loading="listLoading"
            @click="onDelete(row, $index)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="total, prev, pager, next, jumper"
      :total="list.length"
      :page-size="10"
      :current-page.sync="currentPage"
      @current-change="onCurrentChange"
    >
    </el-pagination>

    <!-- 新增或编辑 -->
    <el-dialog
      :visible.sync="dialogVisible"
      append-to-body
      :title="actionType ? '新增按周开放' : '编辑按周开放'"
      @closed="closeDialog"
    >
      <el-form
        :model="temp"
        ref="form"
        label-width="100px"
        style="margin-left: 50px; max-width: 500px"
        :rules="rules"
      >
        <el-form-item label="特殊开放时间" prop="day" label-width="120px"
          ><el-radio-group v-model="temp.day">
            <el-radio label="1">周一</el-radio>
            <el-radio label="2">周二</el-radio>
            <el-radio label="3">周三</el-radio>
            <el-radio label="4">周四</el-radio>
            <el-radio label="5">周五</el-radio>
            <el-radio label="6">周六</el-radio>
            <el-radio label="0">周日</el-radio>
          </el-radio-group></el-form-item
        >
        <el-form-item label="关联策略" prop="policy_id">
          <el-select v-model="temp.policy_id" placeholder="请选择" @change="loadTimePeriodOpts">
            <el-option
              v-for="item in policyOpts"
              :key="item.id"
              :label="item.attributes.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开放时间段" prop="timePeriod_id">
          <el-select v-model="temp.timePeriod_id" placeholder="请选择">
            <el-option
              v-for="(item, index) in timePeriodOpts"
              :key="index"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false"> 取消 </el-button>
        <el-button type="primary" :loading="listLoading" @click="onUpdate">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOpenedWeeksRelated,
  createOpenedWeeks,
  deleteOpenedWeeks,
  editOpenedWeeks,
} from "@/api/Policy/special-open-weeks.js";

import {
  getTimePeriodOpts,
  getSpecialAssociatedList,
  specialCreateFunc,
  specialEditFunc,
} from "@/views/error-page/utils/index.js";
import { getPolicyOpts, delFunc } from "@/utils/index";

import { common } from "@/mixin/index.js";

export default {
  name: "SpecialOpenWeeks",
  mixins: [common],
  data() {
    return {
      // 策略选项
      policyOpts: [],
      timePeriod_Policy: [],
      timePeriodOpts: [],
      isToggle: false,
      temp: {
        policy_id: null,
        timePeriod_id: null,
        day: null,
      },
      rules: {
        day: [
          { required: true, message: "请选择特殊开放时间", trigger: "blur" },
        ],
        policy_id: [
          { required: true, message: "关联策略不能为空", trigger: "blur" },
        ],
        timePeriod_id: [
          { required: true, message: "开放时间段不能为空", trigger: "blur" },
        ],
      },
    };
  },
  filters: {
    filter(day) {
      switch (day) {
        case "1":
          return "周一";
        case "2":
          return "周二";
        case "3":
          return "周三";
        case "4":
          return "周四";
        case "5":
          return "周五";
        case "6":
          return "周六";
        case "0":
          return "周日";
        default:
          break;
      }
    },
  },
  created() {
    getPolicyOpts(this);
    getTimePeriodOpts(this);
    getSpecialAssociatedList(this, getOpenedWeeksRelated, [
      "policy",
      "time-period",
    ]);
  },
  methods: {
    // 获取与策略关联的时间段
    onUpdate() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.listLoading = true;
          const temp = Object.assign({}, this.temp);
          delete temp.policy_id;
          delete temp.timePeriod_id;
          const relationships = {
            policy: {
              data: {
                type: "policies",
                id: this.temp.policy_id,
              },
            },
            "time-period": {
              data: {
                type: "time-periods",
                id: this.temp.timePeriod_id,
              },
            },
          };
          // 创建
          if (this.actionType) {
            const createData = {
              data: {
                type: "special-open-weeks",
                attributes: temp,
                relationships,
              },
            };
            specialCreateFunc(this, createOpenedWeeks, createData);
          }
          // 编辑
          else {
            const week_id = this.list[this.editIndex].id;
            let editData = {
              data: {
                type: "special-open-weeks",
                id: week_id,
                attributes: temp,
                relationships,
              },
            };
            specialEditFunc(this, editOpenedWeeks, editData);
          }
        }
      });
    },

    loadTimePeriodOpts() {
      let { policy_id } = this.temp;
      this.timePeriod_Policy.forEach((obj) => {
        if (this.isToggle) {
          // 只要切换策略就清空上一个策略所选的时间段
          this.temp.timePeriod_id = null;
          this.timePeriodOpts.length = 0;
        }
        // 判断该策略下是否存在开放时间段
        if (policy_id === obj.relationships.policy.data.id) {
          this.timePeriodOpts.push({
            id: obj.id,
            name: `${obj.attributes["start-time"]} - ${obj.attributes["stop-time"]}`,
          });
          this.isToggle = false;
        }
      });
      this.isToggle = true;
    },

    closeDialog() {
      this.isToggle = false
      this.timePeriodOpts.length = 0
    },

    onDelete(row, index) {
      delFunc(this, deleteOpenedWeeks, row, index);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../styles/tabel-layout.scss";
i {
  color: red;
  font-weight: bold;
  font-size: 20px;
  vertical-align: middle;
}
</style>
