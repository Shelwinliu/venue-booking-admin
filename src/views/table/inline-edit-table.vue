<template>
  <div class="container">
    <el-dialog
      :title="actionType ? '新增场所': '编辑场所'"
      :visible.sync="dialogVisible"
      append-to-body
      @closed="closeDialog"
    >
      <el-form label-width="100px"
        style="margin-left: 50px;max-width: 500px">
        <el-form-item label="场地名称">
          <el-input v-model="temp.name"  placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="场馆类别">
          <el-select
            v-model="temp.id"
            placeholder="请选择"
            clearable>
            <el-option
              v-for="item in venueOptions"
              :key="item.id"
              :label="item.attributes.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="场馆图片">
          <image-upload v-model="temp.pic" ref="imageUpload"></image-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="onUpdateGround"
          :loading="listLoading"
        >
          确定
        </el-button>
      </div>
    </el-dialog>

    <div class="header">
        <el-select
          v-model="value1"
          filterable
          placeholder="请选择"
          clearable
        >
          <el-option label="场地名称" value="1"></el-option>
          <el-option label="所属分类" value="2"></el-option>
          <el-option label="场馆开放时间" value="3"></el-option>
        </el-select>
        <el-select
          v-if="value1"
          v-model="value2"
          slot="prepend"
          filterable
          placeholder="请选择"
          clearable
        >
          <el-option label="1" value="1"></el-option>
          <el-option label="2" value="2"></el-option>
          <el-option label="3" value="3"></el-option>
        </el-select>

        <div>
          <el-button type="primary" round icon="el-icon-search">搜索</el-button>
          <el-button
            type="success"
            round
            icon="el-icon-plus"
            @click="updateActionType(1)"
            >新增</el-button
          >
        </div>
      </div>

    <!-- 表格 -->
    <el-card style="margin-top: 20px"
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" :lazy="true">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="场地ID" width="120">
          <template slot-scope="{row}">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="场地名称" width="120">
          <template slot-scope="{row}">{{ row.attributes.name }}</template>
        </el-table-column>
        <el-table-column label="所属分类" width="120">
          <template slot-scope="{row}">{{ row.venue_name }}</template>
        </el-table-column>
        <el-table-column
          property="address"
          label="场馆开放时间"
          show-overflow-tooltip
        >
        <template slot-scope="{row}">{{ row.open_time }}</template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="{row, $index}">
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
              @click="deleteGround(row, $index)"
            ></el-button>
            <el-button size="small" round @click="checkDetails($index)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 详情 -->
    <el-dialog
      title="场地详情"
      :visible.sync="detailDialogVisible"
      append-to-body
      v-if="list[editIndex]"
    >
      <el-form label-width="auto" style="margin-left: 50px;max-width: 500px">
        <el-form-item label="场所名称">
          {{ list[editIndex].attributes.name }}
        </el-form-item>
        <el-form-item label="所属分类">
         {{ list[editIndex].venue_name }}
        </el-form-item>

        <el-form-item label="场馆图片">
          <el-image :src="list[editIndex].attributes.pic"></el-image>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getVenueList } from "@/api/venue";
import {
  getGroundList,
  getVenue_GroundList,
  addGroundItem,
  deleteGroundItem,
  editGroundItem,
} from "@/api/ground";

import ImageUpload from "./components/image-upload.vue";

import { common } from "@/mixin/index.js";

import { delFunc } from "@/utils/index";

export default {
  name: "InlineEditTable",
  components: { ImageUpload },
  props: {},
  mixins: [common],
  data() {
    return {
      // 记录用户输入的场所内容
      temp: {
        name: "",
        pic: "",
        // 记录场馆id
        id: "",
      },
      venueOptions: [],
      value1: "",
      value2: "",
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getClassifiedInfo();
    this.getList();
  },
  mounted() {},
  methods: {
    // 获取场馆分类
    getClassifiedInfo() {
      getVenueList().then((res) => {
        // console.log(res);
        // this.options = res.data.items
        res.data.forEach((element) => {
          this.venueOptions.push(element);
        });
      });
    },

    // 获取场所列表
    getList() {
      // getGroundList().then((res) => {
      //   console.log(res);
      // });
      getVenue_GroundList("venue").then((res) => {
        console.log(res);
        // 存入了场地id
        this.list = res.data;
        // 匹配场地所属场馆类别
        res.included.forEach((included) => {
          res.data.forEach((data, i) => {
            if (included.id === data.relationships.venue.data.id)
              this.list[i].venue_name = included.attributes.name;
          });
        });
      });
    },

    onUpdateGround() {
      this.listLoading = true;
      // this.temp 含有id，temp 没有
      let temp = Object.assign({}, this.temp);
      delete temp.id;
      if (this.actionType) {
        let createData = {
          data: {
            type: "grounds",
            attributes: temp,
            relationships: {
              venue: {
                data: { type: "venues", id: this.temp.id },
              },
            },
          },
        };
        addGroundItem(createData).then((res) => {
          console.log(res);
          this.listLoading = false;
          this.dialogVisible = false;
          this.list.push(res.data);
          console.log(this.list[this.list.length - 1]);
          // 往新增加的场所中添加场馆类别属性，因为获取与新增返回的数据结构不同
          this.list[this.list.length - 1].venue_name =
            res.included[0].attributes.name;
          this.$notify({
            title: "成功",
            message: "新增场地信息成功",
            type: "success",
          });
        });
      } else {
        const ground_id = this.list[this.editIndex].id;
        let editData = {
          data: {
            type: "grounds",
            id: ground_id,
            attributes: temp,
            relationships: {
              venue: {
                data: { type: "venues", id: this.temp.id },
              },
            },
          },
        };
        editGroundItem(editData, ground_id).then((res) => {
          console.log(res);
          this.listLoading = false;
          this.dialogVisible = false;
          this.list[this.editIndex] = res.data;
          this.list[this.editIndex].venue_name =
            res.included[0].attributes.name;
          this.$notify({
            title: "成功",
            message: "编辑场地信息成功",
            type: "success",
          });
        });
      }
    },

    closeDialog() {
      // 重新点击新增会重置url
      this.$refs.imageUpload.previewURL = "";
      this.$refs.imageUpload.isShowPlusIcon = true;
    },

    deleteGround(row, index) {
      delFunc(this, deleteGroundItem, row, index);
    },
  },
};
</script>

<style lang='scss' scoped>
.container {
  margin: 20px;
  .header {
    display: flex;
    margin: 10px 0;
  }
  .el-select {
    margin-right: 10px;
  }
}
</style>
