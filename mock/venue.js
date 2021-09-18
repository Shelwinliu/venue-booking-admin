const Mock = require('mockjs')

const List = []
const count = 20

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    venue_name: '@cword(3, 5)',
    open_cycle: '@integer(1, 7)',
    open_time: '@datetime',
    venue_image: '@image(100, #ffcc33, #FFF,png)',
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/venue/list',
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
    url: '/vue-element-admin/venue/add',
    type: 'post',
    response: config => {
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
  {
    url: '/vue-element-admin/venue/edit',
    type: 'put',
    response: config => {
      const {venue_name, open_cycle, edit_index} = config.query
      List[edit_index].venue_name = venue_name
      List[edit_index].open_cycle = open_cycle

      return {
        code: 20000,
        List
    }
  }
  },
]

