/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/venue-management',
  component: Layout,
  redirect: '/venue-management/venue',
  name: 'Table',
  meta: {
    title: '场馆管理',
    icon: 'table'
  },
  children: [
    // {
    //   path: 'dynamic-table',
    //   component: () => import('@/views/table/dynamic-table/index'),
    //   name: 'DynamicTable',
    //   meta: { title: 'Dynamic Table' }
    // },
    // {
    //   path: 'drag-table',
    //   component: () => import('@/views/table/drag-table'),
    //   name: 'DragTable',
    //   meta: { title: 'Drag Table' }
    // },
    {
      path: 'venue',
      component: () => import('@/views/table/complex-table'),
      name: 'ComplexTable',
      meta: { title: '场馆' },
    },
    {
      path: 'open-time',
      component: () => import('@/views/table/date-time-picker'),
      name: 'EditTimePeriod',
      meta: { title: '场馆开放时间' },
      hidden: true
    },
    {
      path: 'arena',
      component: () => import('@/views/table/inline-edit-table'),
      name: 'InlineEditTable',
      meta: { title: '场地' }
    },
  ]
}
export default tableRouter
