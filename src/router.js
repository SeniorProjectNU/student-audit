import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('@/views/Index'),
      children: [
        // Dashboard
        {
          name: 'Dashboard',
          path: '',
          component: () => import('@/views/Dashboard'),
        },
        {
          name: 'Curriculums',
          path: '/curriculums-list',
          component: () => import('@/views/tables/RegularTables'),
        },
        {
          name: 'Students',
          path: '/students-list',
          component: () => import('@/views/Students'),
        },
        {
          name: 'Template mails',
          path: '/mails-list',
          component: () => import('@/views/tables/RegularTables'),
        }
      ],
    },
  ],
})
