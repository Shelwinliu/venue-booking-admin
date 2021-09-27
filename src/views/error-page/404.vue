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
      <el-table-column prop="id" label="时间段ID" width="180">
      </el-table-column>
      <el-table-column prop="related_item" label="关联策略" width="180">
      </el-table-column>
      <el-table-column label="开始时间 - 结束时间">
        <template slot-scope="{ row }">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px"
            >{{ row.attributes["start-time"] }} -
            {{ row.attributes["stop-time"] }}</span
          >
        </template>
      </el-table-column>

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
            @click="onDeleteTimePeriod(row, $index)"
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
      :title="actionType ? '新增开放时间段' : '编辑开放时间段'"
    >
      <el-form
        :model="temp"
        ref="form"
        label-width="100px"
        style="margin-left: 50px; max-width: 500px"
        :rules="rules"
      >
        <el-form-item label="关联策略" prop="id">
          <el-select v-model="temp.id" placeholder="请选择">
            <el-option
              v-for="item in policyOpts"
              :key="item.id"
              :label="item.attributes.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="* 开放时间段">
          <div style="margin-bottom: 20px; display: flex; align-items: center">
            <date-picker
              v-model="temp['start-time']"
              type="time"
              value-type="HH:mm:ss"
              placeholder="选择开始时间"
              format="HH : mm"
              :minute-step="30"
              prefix-class="xmx"
            ></date-picker>
            <span style="padding: 0 10px">至</span>
            <date-picker
              v-model="temp['stop-time']"
              type="time"
              value-type="HH:mm:ss"
              placeholder="选择结束时间"
              format="HH : mm"
              :minute-step="30"
              prefix-class="xmx"
            ></date-picker>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          :loading="listLoading"
          @click="onUpdateTimePeriod"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPolicyList, editPolicy } from "@/api/Policy/policy.js";
import {
  getTimePeriod,
  getPolicy_TimePeriod,
  createTimePeriod,
  deleteTimePeriod,
  editTimePeriod,
} from "@/api/Policy/time-periods.js";

import { notifySuccess, notifyFail } from "@/utils/notify.js";
import {
  getPolicyOpts,
  getAssociatedList,
  delFunc,
  createFunc,
  editFunc,
} from "@/utils/index";

import { common } from "@/mixin/index.js";

import DatePicker from "vue2-datepicker";
import "@/styles/datepicker.scss";
import "vue2-datepicker/locale/zh-cn";

export default {
  mixins: [common],
  components: { DatePicker },
  data() {
    return {
      policyOpts: [],
      temp: {
        // 记录策略
        id: "",
        "start-time": "",
        "stop-time": "",
      },
      rules: {
        id: [{ required: true, message: "策略名称不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    getPolicyOpts(this);
    getAssociatedList(this, getPolicy_TimePeriod, "policy");
  },
  methods: {
    onUpdateTimePeriod() {
      this.$refs.form.validate((valid) => {
          if (valid && this.temp['start-time'] && this.temp['stop-time']) {
            this.listLoading = true;
            let temp = Object.assign({}, this.temp);
            delete temp.id;
            const relationships = {
              policy: {
                data: {
                  type: "policies",
                  id: this.temp.id,
                },
              },
            };

            // 创建开放时间段
            if (this.actionType) {
              let createData = {
                data: {
                  type: "time-periods",
                  attributes: temp,
                  relationships,
                },
              };
              createFunc(this, createTimePeriod, createData);
            }
            // 编辑时间段
            else {
              const period_id = this.list[this.editIndex].id;
              let editData = {
                data: {
                  type: "time-periods",
                  id: period_id,
                  attributes: temp,
                  relationships,
                },
              };
              editFunc(this, editTimePeriod, editData);
            }
            return;
          }
        this.$message({
          message: "请选择完整开放时间段",
          type: "warning",
        });
      });
    },

    onDeleteTimePeriod(row, index) {
      delFunc(this, deleteTimePeriod, row, index);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../styles/tabel-layout.scss";
</style>
