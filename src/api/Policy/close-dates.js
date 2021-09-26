import request from '@/utils/request'

export function getClosedDates_Policy(relatedItem) {
  return request({
    url: `/closed-dates?include=${relatedItem}`,
    method: 'get',
  })
}

export function createClosedDates(data) {
  return request({
    url: '/closed-dates',
    method: 'post',
    data
  })
}

// 编辑
export function editClosedDates(data, id) {
  return request({
    url: `/closed-dates/${id}`,
    method: 'put',
    data
  })
}

// 删除策略
export function deleteClosedDates(id) {
  return request({
    url: `/closed-dates/${id}`,
    method: 'delete',
  })
}
