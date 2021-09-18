<template>
  <div>
    <el-card>
      <div class="header">
        <el-select v-model="value1" filterable placeholder="请选择" clearable>
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
          <el-option label="1" value2="1"></el-option>
          <el-option label="2" value2="2"></el-option>
          <el-option label="3" value2="3"></el-option>
        </el-select>
        <div>
          <el-button type="primary" round icon="el-icon-search">搜索</el-button>
          <!-- <el-button
            type="success"
            round
            icon="el-icon-plus"
            @click="dialogVisible = true"
            >新增</el-button
          > -->
        </div>
      </div>
      <el-table ref="multipleTable" :data="tableData" style="width: 100%">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          property="name"
          label="用户ID"
          width="120"
        ></el-table-column>
        <el-table-column label="场馆名称" width="120">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column property="name" label="场地名称" width="120">
        </el-table-column>
        <el-table-column
          property="address"
          label="预约时间段"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column property="name" label="场馆开放时间" width="120">
        </el-table-column>
        <el-table-column label="场地图片" width="120">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column label="创建时间"" width="120">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
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
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="margin-top: 20px"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="新增场地"
      :visible.sync="dialogVisible"
      append-to-body
    >
      <el-form label-width="auto"
        style="width: 400px; margin-left: 50px">
        <el-form-item label="场地名称">
          <el-input  placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="场馆类别">
          <el-select v-model="value1" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
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
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ArticleList",
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
      options: [
        {
          value: "用户ID",
          label: "用户ID",
        },
        {
          value: "场馆ID",
          label: "角色",
        },
        {
          value: "场馆开放时间",
          label: "场地ID",
        },
        {
          value: "Option4",
          label: "场馆ID",
        },
        {
          value: "Option5",
          label: "预约时间段",
        },
      ],
      value1: "",
      value2: "",
      dialogVisible: false,
      activeName: "first",
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang='scss' scoped>
.header {
  display: flex;
  margin: 10px 0;
  .el-select {
    margin-right: 10px;
  }
}
</style>
