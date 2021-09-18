const Mock = require('mockjs')

const List = []
const count = 2

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    arena_name: '@cword(3, 5)',
    open_time: '@datetime',
    arena_image: '@image(100, #ffcc33, #FFF,png)',
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/arena/list',
    type: 'get',
    response: config => {
      const {currentPage, page_size} = config.query
      if(currentPage) {
      const start = (currentPage - 1) * page_size
      const end = currentPage * page_size
      const list = List.slice(start, end)

      return {
        code: 20000,
        data: {
          total: List.length,
          items: list
        }
      }
    }

      return {
        code: 20000,
        data: {
          total: List.length,
          items: List
        }
      }
    }
  },
  {
    url: '/vue-element-admin/arena/add',
    type: 'post',
    response: config => {
      // const { venue_name, open_cycle } = config.data
      const len = List.length
      config.body.id = List[len-1].id + 1
      const venue_item = config.body
      List.push(venue_item)

      return {
        code: 20000,
        venue_item
    }
  }
  },
  {
    url: '/vue-element-admin/venue/delete',
    type: 'delete',
    response: config => {
      const {index} = config.query
      List.splice(index, 1)
      console.log(index)
      return {
        code: 20000,
        List
    }
  }
  },
]

