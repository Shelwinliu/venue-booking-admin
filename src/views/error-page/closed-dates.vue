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
      <el-table-column prop="related_item" label="关联策略" width="180">
      </el-table-column>
      <el-table-column label="关闭日期">
        <template slot-scope="{ row }">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ row.attributes.date }}</span>
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
      :title="actionType ? '新增关闭日期' : '编辑关闭日期'"
    >
      <el-form
        :model="temp"
        ref="form"
        label-width="100px"
        style="margin-left: 50px; max-width: 500px"
        :rules="rules"
      >
        <el-form-item label="关联策略">
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

        <el-form-item label="* 关闭日期">
          <div style="margin-bottom: 20px; display: flex; align-items: center">
            <date-picker
              v-model="temp.date"
              type="date"
              value-type="YYYYMMDD"
              placeholder="选择关闭日期"
              format="YYYY-MM-DD"
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
import {
  getClosedDates_Policy,
  createClosedDates,
  editClosedDates,
  deleteClosedDates,
} from "@/api/Policy/close-dates.js";

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
  name: "ClosedDates",
  mixins: [common],
  components: { DatePicker },
  data() {
    return {
      policyOpts: [],
      temp: {
        // 记录关联id
        id: "",
        date: null,
      },
      rules: {
        id: [{ required: true, message: "策略名称不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    getPolicyOpts(this);
    getAssociatedList(this, getClosedDates_Policy, "policy");
  },
  methods: {
    onUpdateTimePeriod() {
      this.$refs.form.validate((valid) => {
        if (valid && this.temp.date) {
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
                type: "closed-dates",
                attributes: temp,
                relationships,
              },
            };
            createFunc(this, createClosedDates, createData);
          }
          // 编辑时间段
          else {
            const date_id = this.list[this.editIndex].id;
            let editData = {
              data: {
                type: "closed-dates",
                id: date_id,
                attributes: temp,
                relationships,
              },
            };
            editFunc(this, editClosedDates, editData);
          }
          return;
        }
        this.$message({
          message: "请选择关闭日期",
          type: "warning",
        });
      });
    },

    onDeleteTimePeriod(row, index) {
      delFunc(this, deleteClosedDates, row, index);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../styles/tabel-layout.scss";
</style>
