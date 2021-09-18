import request from '@/utils/request'

// 获取场馆列表
export function getVenueList(query) {
  return request({
    url: '/vue-element-admin/venue/list',
    method: 'get',
    params: query
  })
}

// 新增场馆
export function addVenueItem(body) {
  return request({
    url: '/vue-element-admin/venue/add',
    method: 'post',
    data: body
  })
}

// 删除场馆
export function deleteVenueItem(query) {
  return request({
    url: '/vue-element-admin/venue/delete',
    method: 'delete',
    params: query
  })
}

// 编辑场馆
export function editVenueItem(query) {
  return request({
    url: '/vue-element-admin/venue/edit',
    method: 'put',
    params: query
  })
}
