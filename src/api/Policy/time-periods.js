import request from '@/utils/request'

// 获取所有策略列表
export function getTimePeriod() {
  return request({
    url: '/time-periods',
    method: 'get',
  })
}

// 获取有策略关联的所有时间段列表
export function getPolicy_TimePeriod(relatedItem) {
  return request({
    url: `/time-periods?include=${relatedItem}`,
    method: 'get',
  })
}

// 创建开放时间段
export function createTimePeriod(data) {
  return request({
    url: '/time-periods',
    method: 'post',
    data
  })
}

// 编辑开放时间段
export function editTimePeriod(data, id) {
  return request({
    url: `/policies/${id}`,
    method: 'put',
    data
  })
}

// 删除开放时间段
export function deleteTimePeriod(id) {
  return request({
    url: `/time-periods/${id}`,
    method: 'delete',
  })
}
