import request from "@/utils/request";

export function getOpenedWeeksRelated(relatedItem) {
  return request({
    url: `/special-open-weeks?include=${relatedItem}`,
    method: "get"
  });
}

export function createOpenedWeeks(data) {
  return request({
    url: "/special-open-weeks",
    method: "post",
    data
  });
}

// 编辑
export function editOpenedWeeks(data, id) {
  return request({
    url: `/special-open-weeks/${id}`,
    method: "put",
    data
  });
}

// 删除策略
export function deleteOpenedWeeks(id) {
  return request({
    url: `/special-open-weeks/${id}`,
    method: "delete"
  });
}
