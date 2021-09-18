<template>
  <div class="container">
    <!-- 新增 -->
    <el-dialog
      :title="actionType ? '新增场馆': '编辑场馆'"
      :visible.sync="dialogVisible"
      append-to-body
    >
      <el-form label-width="auto" style="margin-left: 50px;max-width: 500px">
        <el-form-item label="场馆名称">
          <el-input v-model="venueName" placeholder="例如：篮球馆"></el-input>
        </el-form-item>
        <el-form-item label="场馆预约开放周期">
         <div style="display:flex">
          <el-select v-model="openCycle" placeholder="年限">
            <el-option
             v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
          </el-select>
         </div>
        </el-form-item>

        <el-form-item label="场馆图片">
          <el-upload
            class="upload-demo"
            action="/vue-element-admin/venue/add"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="onUpdateVenue"
          :loading="listLoading"
        >确定</el-button>
      </div>
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
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column property="name" label="场馆ID" width="120"><template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="场馆名称" width="120">
          <template slot-scope="scope">{{ scope.row.venue_name }}</template>
        </el-table-column>
        <el-table-column
          property="address"
          label="场馆预约开放周期"
          show-overflow-tooltip
        >
        <template slot-scope="scope">{{ scope.row.open_cycle }}</template>
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
              @click="updateActionType(0, $index)"
            ></el-button>
            <el-button
              icon="el-icon-delete"
              size="small"
              type="danger"
              :loading="listLoading"
              circle
              @click="onDeleteVenue($index)"
            ></el-button>
            <el-button size="small" round>查看详情</el-button>
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
      :total="total"
      :page-size="10"
      :current-page.sync="currentPage"
      @current-change="onCurrentChange"
    >
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getVenueList, addVenueItem, deleteVenueItem, editVenueItem } from "@/api/venue";

import { scrollTo } from '@/utils/scroll-to'

export default {
  name: "ComplexTable",
  components: {},
  props: {},
  data() {
    return {
      value1: '',
      value2: '',
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
      dialogVisible: false,
      editDialogVisible:false,
      list: [],
      listLoading: false,
      venue: {},
      venueName: '',
      openCycle: null,
      total: 0,
      currentPage: 1,
      actionType: 1,
      editIndex: 0
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    getList(currentPage = 1) {
      this.listLoading = true;
      getVenueList({
        currentPage,
        page_size: 10
        }).then((res) => {
        console.log(res.data.items);
        this.list = res.data.items;
        this.total = res.data.total
        this.listLoading = false;
      });
    },

    // 更新 dialog 标题
    updateActionType(type, index = 0) {
      this.editIndex = index
      this.actionType = type
      this.dialogVisible = true
    },

    onUpdateVenue() {
      this.listLoading = true
      this.dialogVisible = false
      if(this.actionType) {
        addVenueItem({
        venue_name: this.venueName,
        open_cycle: this.openCycle
      }).then(res => {
        console.log(res)
        this.listLoading = false
        this.getList()
        this.$notify({
          title: '成功',
          message: '新增场馆信息成功',
          type: 'success'
        });
      })
      }
      else {
        editVenueItem({
        venue_name: this.venueName,
        open_cycle: this.openCycle,
        edit_index: this.editIndex
      }).then(res => {
        console.log(res)
        this.listLoading = false
        this.getList()
        this.$notify({
          title: '成功',
          message: '编辑场馆信息成功',
          type: 'success'
        });
      })
      }
    },

    onDeleteVenue(index) {
      this.actionType = '编辑场馆'
      this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          deleteVenueItem({index}).then(res => {
          this.getList()
          this.listLoading = false
      })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


    },

    onCurrentChange() {
      this.getList(this.currentPage)
      scrollTo(0, 800)
    },

    // 设置开放时间
    setOpenTime(row) {
      console.log(row);
      this.$router.push({
          path: "/venue-management/open-time", query: {
            venue_id: row.id,
            venue_name: row.venue_name
          }
        });
    }

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
