<template>
  <div class="container">
    <!-- 新增 -->
    <el-dialog
      :title="actionType ? '新增场馆': '编辑场馆'"
      :visible.sync="dialogVisible"
      append-to-body
      @close="closeDialog"
    >
      <el-form label-width="auto" style="margin-left: 50px;max-width: 500px">
        <el-form-item label="场馆名称">
          <el-input v-model="temp.name" placeholder="例如：篮球馆"></el-input>
        </el-form-item>
        <!-- <el-form-item label="场馆预约开放周期">
         <div style="display:flex">
          <el-select placeholder="年限">
            <el-option
             v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
          </el-select>
         </div>
        </el-form-item> -->

        <el-form-item label="场馆图片">
          <image-upload v-model="temp.pic" ref="imageUpload"></image-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="onUpdateVenue"
          :loading="listLoading"
        >确定</el-button>
      </div>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog
      title="场馆详情"
      :visible.sync="detailDialogVisible"
      append-to-body
      v-if="list[editIndex]"
    >
      <el-form label-width="auto" style="margin-left: 50px;max-width: 500px">
        <el-form-item label="场馆名称">
          {{ list[editIndex].attributes.name }}
        </el-form-item>
        <el-form-item label="场馆预约开放周期">
         {{ list[editIndex].attributes.pic }}
        </el-form-item>

        <el-form-item label="场馆图片">
          <el-image :src="list[editIndex].attributes.pic"></el-image>

          <!-- <el-image>
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>
    </el-image> -->
        </el-form-item>
      </el-form>
    </el-dialog>

    <div class="header">
        <el-select
          v-model="value1"
          filterable
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
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

    <el-card style="margin-top: 20px"
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;margin-bottom: 10px">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column property="name" label="场馆ID" width="120"><template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="场馆名称" width="120">
          <template slot-scope="scope">{{ scope.row.attributes.name }}</template>
        </el-table-column>
        <el-table-column
          property="address"
          label="场馆预约开放周期"
          show-overflow-tooltip
        >
        <template slot-scope="scope">{{ scope.row.attributes.pic }}</template>
        </el-table-column>
        <el-table-column
          property="address"
          label="场馆开放时间"
          show-overflow-tooltip
        >
        <template slot-scope="scope">{{ scope.row.open_time }}</template>
        </el-table-column>
        <!-- <el-table-column
          property="address"
          label="场馆可预约时间"
          show-overflow-tooltip
        >
        </el-table-column> -->
        <!-- <el-table-column label="场馆图片" width="120">
          <template slot-scope="scope"><el-image :src="scope.row.venue_image"></el-image></template>
        </el-table-column> -->
        <el-table-column label="操作">
          <template slot-scope="{row,$index}">
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
              :loading="listLoading"
              circle
              @click="onDeleteVenue(row, $index)"
            ></el-button>
            <el-button size="small" round @click="checkDetails($index)">查看详情</el-button>
            <el-button size="small" round @click="setOpenTime(row)">设置时间段</el-button>
            <!-- <el-dropdown>
            <el-button type="success">
              编辑时间
              <i class="el-icon-arrow-down el-icon--right" size="small"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>场馆开放时间</el-dropdown-item>
              <el-dropdown-item>场馆可预约时间</el-dropdown-item>
            </el-dropdown-menu>
            </el-dropdown> -->
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
    </el-card>
  </div>
</template>

<script>
import {
  getVenueList,
  addVenueItem,
  deleteVenueItem,
  editVenueItem,
} from "@/api/venue";

import ImageUpload from "./components/image-upload.vue";
import {common} from "./components/mixin.js"

import { scrollTo } from "@/utils/scroll-to";

export default {
  name: "ComplexTable",
  components: { ImageUpload },
  props: {},
  mixins: [common],
  data() {
    return {
      value1: "",
      value2: "",
      options: [
        {
          value: "1",
          label: "1",
        },
        {
          value: "2",
          label: "2",
        },
        {
          value: "3",
          label: "3",
        },
        {
          value: "4",
          label: "4",
        },
      ],
      venue: {},
      venueName: "",
      openCycle: null,
      total: 0,
      currentPage: 1,
      temp: {
        name: "",
        pic: "",
      },
      // 新增或编辑图片时是否显示上次上传的图片
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    // getList(currentPage = 1) {
    //   this.listLoading = true;
    //   getVenueList({
    //     currentPage,
    //     page_size: 10
    //     }).then((res) => {
    //     console.log(res.data.items);
    //     this.list = res.data.items;
    //     this.total = res.data.total
    //     this.listLoading = false;
    //   });
    // },

    getList() {
      this.listLoading = true;
      getVenueList().then((res) => {
        console.log(res.data);
        // this.list = res.data.items;
        // this.total = res.data.total
        this.list = res.data;
        this.listLoading = false;
      });
    },

    // 更新 dialog 标题：1. 新增  2. 编辑
    updateActionType(type, row = null, index = 0) {
      // 需要编辑的场馆的index
      this.editIndex = index;
      // const { name, pic } = this.list[index].attributes;
      // 编辑时显示上次编辑的内容，新增时显示空，增加用户体验
      // this.temp.name = row ? name : "";
      // 赋予数组要编辑场馆的id，使用编辑功能时才会传入row
      if (row) this.temp.id = row.id;
      this.actionType = type;
      this.dialogVisible = true;
    },

    // 新增或编辑
    onUpdateVenue() {
      this.listLoading = true;
      this.dialogVisible = false;
      let temp = Object.assign({}, this.temp);

      if (this.actionType) {
        let createData = {
          data: {
            type: "venues",
            attributes: temp,
          },
        };
        addVenueItem(createData).then(
          (res) => {
            console.log(res);
            this.list.push(res.data);
            this.listLoading = false;
            // this.getList()
            this.$notify({
              title: "成功",
              message: "新增场馆信息成功",
              type: "success",
            });
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        let id = temp.id;
        delete temp.id;
        let editData = {
          data: {
            type: "venues",
            id,
            attributes: temp,
          },
        };
        editVenueItem(editData, this.temp.id).then(
          (res) => {
            console.log(res);
            this.listLoading = false;
            this.list[this.editIndex] = res.data;
            this.$notify({
              title: "成功",
              message: "编辑场馆信息成功",
              type: "success",
            });
          },
          (err) => {
            console.log(err);
          }
        );
      }
    },

    closeDialog() {
      // 重新点击新增会重置url
      this.$refs.imageUpload.previewURL = "";
      this.$refs.imageUpload.isShowPlusIcon = true;
      // const { name, pic } = this.temp;
      this.temp.name = "";
      this.temp.pic = "";
    },

    onDeleteVenue(row, index) {
      this.actionType = "编辑场馆";
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.listLoading = true;
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          deleteVenueItem(row.id).then((res) => {
            this.list.splice(index, 1);
            this.listLoading = false;
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
          this.listLoading = false;
        });
    },

    onCurrentChange() {
      this.getList(this.currentPage);
      scrollTo(0, 800);
    },

    // 设置开放时间
    setOpenTime(row) {
      console.log(row);
      this.$router.push({
        path: "/venue-management/open-time",
        query: {
          venue_id: row.id,
          venue_name: row.venue_name,
        },
      });
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
