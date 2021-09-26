import request from '@/utils/request'

export function getClosedWeeks_Policy(relatedItem) {
  return request({
    url: `/closed-weeks?include=${relatedItem}`,
    method: 'get',
  })
}

export function createClosedWeeks(data) {
  return request({
    url: '/closed-weeks',
    method: 'post',
    data
  })
}

// 编辑
export function editClosedWeeks(data, id) {
  return request({
    url: `/closed-weeks/${id}`,
    method: 'put',
    data
  })
}

// 删除策略
export function deleteClosedWeeks(id) {
  return request({
    url: `/closed-weeks/${id}`,
    method: 'delete',
  })
}
