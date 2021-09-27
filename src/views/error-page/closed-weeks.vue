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
      <el-table-column prop="related_item" label="关联策略"> </el-table-column>
      <el-table-column label="打叉代表关闭" width="180">
        <el-table-column width="50" label="周一"
          ><template slot-scope="{ row }"
            ><i
              :class="row.attributes.mon ? 'el-icon-close' : ''"
            ></i> </template
        ></el-table-column>
        <el-table-column width="50" label="周二"
          ><template slot-scope="{ row }"
            ><i
              :class="row.attributes.tue ? 'el-icon-close' : ''"
            ></i> </template
        ></el-table-column>
        <el-table-column width="50" label="周三"
          ><template slot-scope="{ row }"
            ><i :class="row.attributes.wed ? 'el-icon-close' : ''"></i>
          </template>
        </el-table-column>
        <el-table-column width="50" label="周四"
          ><template slot-scope="{ row }"
            ><i
              :class="row.attributes.thur ? 'el-icon-close' : ''"
            ></i></template
        ></el-table-column>
        <el-table-column width="50" label="周五"
          ><template slot-scope="{ row }"
            ><i
              :class="row.attributes.fri ? 'el-icon-close' : ''"
            ></i> </template
        ></el-table-column>
        <el-table-column width="50" label="周六"
          ><template slot-scope="{ row }"
            ><i
              :class="row.attributes.sat ? 'el-icon-close' : ''"
            ></i> </template
        ></el-table-column>
        <el-table-column width="50" label="周日"
          ><template slot-scope="{ row }"
            ><i
              :class="row.attributes.sun ? 'el-icon-close' : ''"
            ></i> </template
        ></el-table-column>
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
            @click="onDelete(row, $index)"
          ></el-button>
          <!-- <el-button size="small" round @click="checkDetails($index)"
            >查看详情</el-button
          > -->
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
      :title="actionType ? '新增按周关闭' : '编辑按周关闭'"
    >
      <el-form
        :model="temp"
        ref="form"
        label-width="100px"
        style="margin-left: 50px; max-width: 500px"
        :rules="rules"
      >
        <el-form-item label="关联策略" prop="id">
          <el-select v-model="temp.id" placeholder="请选择" clearable>
            <el-option
              v-for="item in policyOpts"
              :key="item.id"
              :label="item.attributes.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="* 关闭时间">
          <!-- <template v-for="(day, key, index) in temp">
            <el-radio
              :v-model="day"
              :label="true"
              :key="index"
              fill="#409EFF"
              @click.native.prevent="radioClick(true, key, day)"
              >周{{index}}{{key}}</el-radio
            >
          </template> -->
          <el-radio
            v-model="temp.mon"
            :label="true"
            @click.native.prevent="radioClick(true, 'mon')"
            >周一</el-radio
          >
          <el-radio
            v-model="temp.tue"
            :label="true"
            @click.native.prevent="radioClick(true, 'tue')"
            >周二</el-radio
          >
          <el-radio
            v-model="temp.wed"
            :label="true"
            @click.native.prevent="radioClick(true, 'wed')"
            >周三</el-radio
          >
          <el-radio
            v-model="temp.thur"
            :label="true"
            @click.native.prevent="radioClick(true, 'thur')"
            >周四</el-radio
          >
          <el-radio
            v-model="temp.fri"
            :label="true"
            @click.native.prevent="radioClick(true, 'fri')"
            >周五</el-radio
          >
          <el-radio
            v-model="temp.sat"
            :label="true"
            @click.native.prevent="radioClick(true, 'sat')"
            >周六</el-radio
          >
          <el-radio
            v-model="temp.sun"
            :label="true"
            @click.native.prevent="radioClick(true, 'sun')"
            >周日</el-radio
          >
          <!-- <el-radio v-model="temp.mon" :label="true">备选项</el-radio> -->
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false"> 取消 </el-button>
        <el-button type="primary" :loading="listLoading" @click="onUpdate">
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
  getClosedWeeks_Policy,
  createClosedWeeks,
  editClosedWeeks,
  deleteClosedWeeks,
} from "@/api/Policy/close-weeks.js";

import {
  createFunc,
  getPolicyOpts,
  getAssociatedList,
  delFunc,
  editFunc,
} from "@/utils/index";

import { common } from "@/mixin/index.js";

export default {
  name: "ClosedWeeks",
  mixins: [common],
  data() {
    return {
      // 策略选项
      policyOpts: [],
      temp: {
        id: "",
        mon: false,
        tue: false,
        wed: false,
        thur: false,
        fri: false,
        sat: false,
        sun: false,
      },
      rules: {
        id: [{ required: true, message: "关联策略不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    getPolicyOpts(this);
    getAssociatedList(this, getClosedWeeks_Policy, "policy");
  },
  methods: {
    radioClick(e, day_of_week) {
      e === this.temp[day_of_week]
        ? (this.temp[day_of_week] = false)
        : (this.temp[day_of_week] = e);
    },

    onUpdate() {
      this.$refs.form.validate((valid) => {
        for (let key in this.temp)
          if (valid && this.temp[key] === true) {
            this.listLoading = true;
            const temp = Object.assign({}, this.temp);
            delete temp.id;
            const relationships = {
              policy: {
                data: {
                  type: "policies",
                  id: this.temp.id,
                },
              },
            };
            // 创建
            if (this.actionType) {
              const createData = {
                data: {
                  type: "closed-weeks",
                  attributes: temp,
                  relationships,
                },
              };
              createFunc(this, createClosedWeeks, createData);
            }
            // 编辑
            else {
              const week_id = this.list[this.editIndex].id;
              let editData = {
                data: {
                  type: "closed-weeks",
                  id: week_id,
                  attributes: temp,
                  relationships,
                },
              };
              editFunc(this, editClosedWeeks, editData);
            }
            return;
          }
        this.$message({
          message: "请至少关闭一个时间",
          type: "warning",
        });
      });
    },

    onDelete(row, index) {
      delFunc(this, deleteClosedWeeks, row, index);
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
