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
      <el-table-column prop="policy" label="所属策略" width="180">
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
        label-width="auto"
        style="margin-left: 50px; max-width: 500px"
        :rules="rules"
      >
        <!-- <el-form-item label="时间段名称">
          <el-input v-model="temp.name" placeholder=""></el-input>
        </el-form-item> -->
        <el-form-item label="策略名称" prop="id">
          <el-select
            v-model="temp.id"
            placeholder="请选择"
          >
            <el-option
              v-for="item in policyOpts"
              :key="item.id"
              :label="item.attributes.name + '(' + item.id + ')'"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="开放时间段">
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
    this.getPolicyOps();
    this.getList();
  },
  methods: {
    getPolicyOps() {
      getPolicyList().then((res) => {
        console.log(res);
        this.policyOpts = res.data;
      });
    },

    getList() {
      getPolicy_TimePeriod("policy").then((res) => {
        console.log(res);
        this.list = res.data;
        res.included.forEach((included) => {
          res.data.forEach((data, i) => {
            if (included.id === data.relationships.policy.data.id)
              this.list[i].policy = included.attributes.name;
          });
        });
      });
    },

    onUpdateTimePeriod() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.listLoading = true;
          let temp = Object.assign({}, this.temp);
          delete temp.id;
          // 创建开放时间段
          if (this.actionType) {
            let createData = {
              data: {
                type: "time-periods",
                attributes: temp,
                relationships: {
                  policy: {
                    data: {
                      type: "policies",
                      id: this.temp.id,
                    },
                  },
                },
              },
            };
            createTimePeriod(createData).then((res) => {
              console.log(res);
              notifySuccess(this, "创建开放时间段成功");
              this.listLoading = false;
              this.dialogVisible = false;
              this.list.push(res.data);
            });
          }
          // 编辑策略
          else {
            const policy_id = this.list[this.editIndex].id;
            let editData = {
              data: {
                type: "grounds",
                id: policy_id,
                attributes: temp,
                relationships: {
                  policy: {
                    data: { type: "policies", id: this.temp.id },
                  },
                },
              },
            };
            editTimePeriod(editData, this.temp.id).then((res) => {
              console.log(res);
              this.listLoading = false;
              this.dialogVisible = false;
              notifySuccess(this, "编辑时间段信息成功");
              this.list[this.editIndex] = res.data;
            });
          }
        }
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
