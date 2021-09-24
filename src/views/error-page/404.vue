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
      <el-table-column prop="id" label="策略ID" width="180"> </el-table-column>
      <el-table-column prop="attributes.name" label="策略名称">
      </el-table-column>
      <el-table-column
        prop="attributes.open-reservation-days"
        label="开放预约天数"
        width="180"
      >
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
            @click="onDeletePolicy(row, $index)"
          ></el-button>
          <el-button size="small" round @click="checkDetails($index)"
            >查看详情</el-button
          >
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
      :title="actionType ? '新增策略' : '编辑策略'"
    >
      <el-form
        :model="temp"
        ref="form"
        label-width="auto"
        style="margin-left: 50px; max-width: 500px"
        :rules="rules"
      >
        <el-form-item label="策略名称" prop="name">
          <el-select v-model="temp.name" placeholder="请选择">
            <el-option
              v-for="item in policyOps"
              :key="item.id"
              :label="item.attributes.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="描述">
          <date-picker
            type="time"
            placeholder="选择开始时间"
            format="HH : mm"
            :minute-step="30"
            prefix-class="xmx"
          ></date-picker>
          <span style="padding: 0 10px">至</span>
          <date-picker
            type="time"
            placeholder="选择结束时间"
            format="HH : mm"
            :minute-step="30"
            prefix-class="xmx"
          ></date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          :loading="listLoading"
          @click="onUpdatePolicy"
        >
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog
      title="策略详情"
      :visible.sync="detailDialogVisible"
      append-to-body
      v-if="list[editIndex]"
    >
      <el-form label-width="auto" style="margin-left: 50px; max-width: 500px">
        <el-form-item label="策略名称">
          {{ list[editIndex].attributes.name }}
        </el-form-item>
        <el-form-item label="开放预约天数">
          {{ list[editIndex].attributes["open-reservation-days"] }}
        </el-form-item>
        <el-form-item label="描述">
          {{ list[editIndex].attributes.description }}
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPolicyList,
  createPolicy,
  editPolicy,
  deletePolicy,
} from "@/api/policy.js";

import { notifySuccess, notifyFail } from "@/utils/notify.js";
import { delFunc } from "@/utils/index";

import { common } from "@/mixin/index.js";

import DatePicker from "vue2-datepicker";
import "@/styles/datepicker.scss";
import "vue2-datepicker/locale/zh-cn";

export default {
  mixins: [common],
  components: { DatePicker },
  data() {
    return {
      policyOps: [],
      temp: {
        name: "",
        "open-reservation-days": null,
        description: "",
      },
      rules: {
        name: [
          { required: true, message: "策略名称不能为空", trigger: "blur" },
        ],
        "open-reservation-days": [
          {
            validator: (rule, value, callback) => {
              if (value === null || value === "" || Number.isInteger(value))
                callback();
              else callback(new Error("必须为 0 ~ 999 之间的整数"));
            },
          },
        ],
      },
    };
  },
  created() {
    this.getPolicyOps();
    this.getList();
  },
  methods: {
    getPolicyOps() {
      getPolicyList().then((res) => {
        console.log(res);
        this.policyOps = res.data;
      });
    },

    getList() {
      getPolicyList().then((res) => {
        console.log(res);
        this.list = res.data;
      });
    },

    onUpdatePolicy() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.listLoading = true;
          // 创建策略
          if (this.actionType) {
            let createData = {
              data: {
                type: "policies",
                attributes: this.temp,
              },
            };
            createPolicy(createData).then((res) => {
              console.log(res);
              notifySuccess(this, "创建策略成功");
              this.listLoading = false;
              this.dialogVisible = false;
              this.list.push(res.data);
            });
          }
          // 编辑策略
          else {
            let editData = {
              data: {
                type: "policies",
                id: this.temp.id,
                attributes: this.temp,
              },
            };
            editPolicy(editData, this.temp.id).then((res) => {
              console.log(res);
              this.listLoading = false;
              this.dialogVisible = false;
              notifySuccess(this, "编辑策略信息成功");
              this.list[this.editIndex] = res.data;
            });
          }
        }
      });
    },

    onDeletePolicy(row, index) {
      delFunc(this, deletePolicy, row, index);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../styles/tabel-layout.scss";
</style>
