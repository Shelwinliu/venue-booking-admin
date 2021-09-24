import request from '@/utils/request'

// 获取所有策略列表
export function getPolicyList() {
  return request({
    url: '/policies',
    method: 'get',
  })
}

// 创建策略
export function createPolicy(data) {
  return request({
    url: '/policies',
    method: 'post',
    data
  })
}

// 编辑策略
export function editPolicy(data, id) {
  return request({
    url: `/policies/${id}`,
    method: 'put',
    data
  })
}

// 删除场地
export function deletePolicy(id) {
  return request({
    url: `/policies/${id}`,
    method: 'delete',
  })
}
