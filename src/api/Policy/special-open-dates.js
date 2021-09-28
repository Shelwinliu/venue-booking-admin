import request from "@/utils/request";

export function getOpenedDatesRelated(relatedItem) {
  return request({
    url: `/special-open-dates?include=${relatedItem}`,
    method: "get"
  });
}

export function createOpenedDates(data) {
  return request({
    url: "/special-open-dates",
    method: "post",
    data
  });
}

// 编辑
export function editOpenedDates(data, id) {
  return request({
    url: `/special-open-dates/${id}`,
    method: "put",
    data
  });
}

// 删除策略
export function deleteOpenedDates(id) {
  return request({
    url: `/special-open-dates/${id}`,
    method: "delete"
  });
}
