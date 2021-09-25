export const common = {
  data() {
    return {
      list: [],
      // 1为新增，2为编辑
      actionType: 1,
      editIndex: 0,
      listLoading: false,
      dialogVisible: false,
      detailDialogVisible: false,
      currentPage: 1
    };
  },
  methods: {
    // 更新 dialog 标题：1. 新增  2. 编辑
    updateActionType(type, row = null, index = 0) {
      // 需要编辑目标的index
      this.editIndex = index;
      // 编辑时显示上次编辑的内容，新增时显示空，增加用户体验
      // row为null时为新增，点击新增应清空上次输入的内容
      // 赋予数组要编辑的id，使用编辑功能时才会传入row
      if (row) {
        // 此处必须使用ES6解析语法，否则temp和list会指向同一个空间，会导致temp改变list也会跟着改变
        this.temp = { ...this.list[index].attributes };
        delete this.temp["created-at"];
        delete this.temp["updated-at"];

        if (row.relationships.venue)
          // 当你发现你给对象加了一个属性，在控制台能打印出来，但是却没有更新到视图上时，也许这个时候就需要用到this.$set（）这个方法
          this.$set(this.temp, "id", row.relationships.venue.data.id);
        else this.$set(this.temp, "id", row.relationships.policy.data.id);
      }
      else for (let key in this.temp) this.temp[key] = ''
      this.actionType = type;
      this.dialogVisible = true;
    },

    // 查看详情
    checkDetails(index) {
      this.detailDialogVisible = true;
      this.editIndex = index;
    },

    onCurrentChange() {
      this.getList(this.currentPage);
      scrollTo(0, 800);
    }
  }
};
