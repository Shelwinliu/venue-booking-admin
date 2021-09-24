
export const common = {
  data() {
    return {
      list: [],
      actionType: 1,
      editIndex: 0,
      listLoading: false,
      dialogVisible: false,
      detailDialogVisible: false
    }
  },
  methods: {
    // 查看详情
    checkDetails(index) {
      this.detailDialogVisible = true;
      this.editIndex = index;
    },
  }
}

