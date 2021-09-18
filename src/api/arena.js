import request from '@/utils/request'

// 获取场所列表
export function getArenaList(query) {
  return request({
    url: '/vue-element-admin/arena/list',
    method: 'get',
    params: query
  })
}

// 新增场所
export function addArenaItem(body) {
  return request({
    url: '/vue-element-admin/arena/add',
    method: 'post',
    data: body
  })
}

// 删除场所
export function deleteArenaItem(query) {
  return request({
    url: '/vue-element-admin/arena/delete',
    method: 'delete',
    params: query
  })
}
