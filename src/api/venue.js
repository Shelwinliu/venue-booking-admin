import request from '@/utils/request'

// 获取所有场馆
export function getVenueList() {
  return request({
    url: '/venues',
    method: 'get'
  })
}
// export function getVenueList(query) {
//   return request({
//     url: '/vue-element-admin/venue/list',
//     method: 'get',
//     params: query
//   })
// }

// 获取场馆
export function getVenue(id) {
  return request({
    url: `/venues/${id}`,
    method: 'get'
  })
}



// 新增场馆
// export function addVenueItem(body) {
//   return request({
//     url: '/vue-element-admin/venue/add',
//     method: 'post',
//     data: body
//   })
// }
export function addVenueItem(data) {
  return request({
    url: '/venues',
    method: 'post',
    data
  })
}

// 删除场馆
export function deleteVenueItem(id) {
  return request({
    url: `/venues/${id}`,
    method: 'delete',
  })
}

// 编辑场馆
export function editVenueItem(data, id) {
  return request({
    url: `/venues/${id}`,
    method: 'put',
    data
  })
}
