import { notifySuccess, notifyFail } from "@/utils/notify.js";
import { getPolicy_TimePeriod } from "@/api/Policy/time-periods.js";

// 获取与策略关联的时间段
export function getTimePeriodOpts(that) {
  getPolicy_TimePeriod("policy").then(res => {
    // console.log(res);
    that.timePeriod_Policy = res.data;
  });
}

export function getSpecialAssociatedList(that, getInclude_api, type) {
  that.listLoading = true;
  // console.log(type);
  type.forEach(element => {
    getInclude_api(element).then(
      res => {
        console.log(res);
        that.listLoading = false;
        if (that.list.length === 0 && res.data.length) that.list = res.data;
        // 显示tabel关联策略
        if (res.included) {
          if (element === "policy") {
            res.included.forEach(included => {
              for (let i in res.data) {
                that.list[i].relationships[element] =
                  res.data[i].relationships[element];
                // 匹配策略名称
                if (that.list[i].relationships[element].data.id === included.id)
                  that.$set(
                    that.list[i],
                    "relatedItem_1",
                    included.attributes.name
                  );
              }
            });
          } else
            res.included.forEach(included => {
              for (let i in res.data) {
                that.list[i].relationships[element] =
                  res.data[i].relationships[element];
                // 显示tabel开放时间段
                if (that.list[i].relationships[element].data.id === included.id)
                  that.$set(
                    that.list[i],
                    "relatedItem_2",
                    `${included.attributes["start-time"]} - ${included.attributes["stop-time"]}`
                  );
              }
            });
        }
      },
      err => {
        console.log(err);
        that.listLoading = false;
        that.$message.error("获取信息失败");
      }
    );
  });
}

// 抽取新增方法
export function specialCreateFunc(
  that,
  create_api,
  createData,
  relatedType = null
) {
  create_api(createData).then(
    res => {
      console.log(res);
      that.list.push(res.data);
      // 往新增加的场所中添加所属策略属性，因为获取与新增返回的数据结构不同
      if (res.included) {
        // 关联策略
        that.list[that.list.length - 1].relatedItem_1 =
          res.included[0].attributes.name;
        // 关联时间段
        that.list[
          that.list.length - 1
        ].relatedItem_2 = `${res.included[1].attributes["start-time"]} - ${res.included[1].attributes["stop-time"]}`;
      }
      that.listLoading = false;
      that.dialogVisible = false;
      notifySuccess(that, "创建信息成功");
    },
    err => {
      console.log(err);
      notifyFail(that, "创建信息失败");
      that.listLoading = false;
    }
  );
}

// 抽取编辑方法
export function specialEditFunc(that, edit_api, editData) {
  edit_api(editData, editData.data.id).then(
    res => {
      console.log(res);
      that.list[that.editIndex] = res.data;
      // 往新增加的场所中添加所属策略属性，因为获取与新增返回的数据结构不同
      if (res.included) {
        // 返回策略
        that.list[that.editIndex].relatedItem_1 =
          res.included[0].attributes.name;
        // 返回时间段
        that.list[
          that.editIndex
        ].relatedItem_2 = `${res.included[1].attributes["start-time"]} - ${res.included[1].attributes["stop-time"]}`;
      }
      that.listLoading = false;
      that.dialogVisible = false;
      notifySuccess(that, "更新信息成功");
    },
    err => {
      console.log(err);
      notifyFail(that, "更新信息失败");
      that.listLoading = false;
    }
  );
}
