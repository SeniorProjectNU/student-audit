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
          component: () => import('@/views/Curriculum/List'),
        },
        {
          name: 'Students',
          path: '/students-list',
          component: () => import('@/views/Student/List'),
        },
        {
          name: 'Student Audit',
          path: '/student/:id',
          component: () => import('@/views/Student/Audit'),
        },
        {
          name: 'Compare Students',
          path: '/students-comparison/',
          query: ':id',
          component: () => import('@/views/Student/Comparison'),
        },
      ],
    },
  ],
})
