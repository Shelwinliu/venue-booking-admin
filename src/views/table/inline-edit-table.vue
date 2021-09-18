<template>
  <div class="container">
    <el-dialog
      title="新增场地"
      :visible.sync="dialogVisible"
      append-to-body
    >
      <el-form label-width="auto"
        style="margin-left: 50px;max-width: 500px">
        <el-form-item label="场地名称">
          <el-input v-model="arenaName"  placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="场馆类别">
          <el-select
            v-model="arenaItem"
            placeholder="请选择"
            clearable
            value-key="id">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.venue_name"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="场馆图片">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
            :limit="3"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="addNewArena"
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
            @click="dialogVisible = true"
            >新增</el-button
          >
        </div>
      </div>

    <el-card style="margin-top: 20px"
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" :lazy="true">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="场地ID" width="120">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column property="name" label="场地名称" width="120">
          <template slot-scope="scope">{{ scope.row.arenaName }}</template>
        </el-table-column>
        <el-table-column property="name" label="所属分类" width="120">
          <template slot-scope="scope">{{ scope.row.venue_name }}</template>
        </el-table-column>
        <el-table-column
          property="address"
          label="场馆开放时间"
          show-overflow-tooltip
        >
        <template slot-scope="scope">{{ scope.row.open_time }}</template>
        </el-table-column>
        <!-- <el-table-column property="name" label="已预约人数/可容纳人数" width="120">
        </el-table-column> -->
        <!-- <el-table-column label="场地图片" width="120">
          <template slot-scope="scope"><el-image :src="scope.row"></el-image></template>
        </el-table-column> -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              size="small"
              type="primary"
              circle
            ></el-button>
            <el-button
              icon="el-icon-delete"
              size="small"
              type="danger"
              circle
              :loading="listLoading"
              @click="onDeleteArena(scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getVenueList } from "@/api/venue";
import { getArenaList } from "@/api/arena";

export default {
  name: "InlineEditTable",
  components: {},
  props: {},
  data() {
    return {
      tableData: [
        {
          date: "2016-05-03",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          date: "2016-05-02",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          date: "2016-05-04",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          date: "2016-05-01",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          date: "2016-05-08",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          date: "2016-05-06",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          date: "2016-05-07",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
      ],
      list: [],
      listLoading: false,
      options: [],
      arenaItem: [{}],
      arenaName: '',
      value1: "",
      value2: "",
      dialogVisible: false,
      activeName: "first",
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getClassifiedInfo()
    // this.getList()
  },
  mounted() {},
  methods: {
    getClassifiedInfo() {
      getVenueList().then(res => {
        this.options = res.data.items
      })
    },

    getList() {
      getArenaList().then(res => {
        console.log(res.data);
        this.list = res.data.items
      })
    },

    addNewArena() {
      this.listLoading = true
      this.dialogVisible = false
      this.arenaItem.arenaName = this.arenaName
      this.list.push(this.arenaItem)
      this.listLoading = false
    },

    onDeleteArena(index) {
      this.listLoading = true
      console.log(index)
      this.list.splice(index, 1)
      this.listLoading = false
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
