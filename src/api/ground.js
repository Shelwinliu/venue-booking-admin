import request from '@/utils/request'

// 获取所有场地列表
export function getGroundList() {
  return request({
    url: '/grounds',
    method: 'get',
  })
}

// 获取有场馆关联的所有场地列表
export function getVenue_GroundList(relatedItem) {
  return request({
    url: `/grounds?include=${relatedItem}`,
    method: 'get',
  })
}

// 新增场地
export function addGroundItem(data) {
  return request({
    url: '/grounds',
    method: 'post',
    data
  })
}

// 删除场地
export function deleteGroundItem(id) {
  return request({
    url: `/grounds/${id}`,
    method: 'delete',
  })
}

// 编辑场地
export function editGroundItem(data, id) {
  return request({
    url: `/grounds/${id}`,
    method: 'put',
    data
  })
}
