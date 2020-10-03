import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
/* Layout */
import Layout from '@/views/layout/Layout'
export const constantRouterMap = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path*',
    component: () => import('@/views/redirect/index')
  }]
},
{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},
{
  path: '/auth-redirect',
  component: () => import('@/views/login/authredirect'),
  hidden: true
},
{
  path: '/404',
  component: () => import('@/views/errorPage/404'),
  hidden: true
},
{
  path: '/401',
  component: () => import('@/views/errorPage/401'),
  hidden: true
},
{
  path: '',
  component: Layout,
  redirect: 'dashboard',
  children: [{
    path: 'dashboard',
    component: () => import('@/views/dashboard/index'),
    name: 'Dashboard',
    meta: {
      title: '首页',
      icon: 'dashboard',
      noCache: true
    }
  }]
}
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/user',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'user',
    meta: {
      title: '用户管理',
      icon: 'user'
    },
    children: [{
      path: 'list',
      component: () => import('@/views/user/list'),
      name: 'list',
      meta: {
        perms: ['GET /admin/seller/list'],
        title: '用户列表',
        noCache: true
      }
    },
    {
      path: 'feedback',
      component: () => import('@/views/user/feedback'),
      name: 'feedback',
      meta: {
        perms: ['GET /admin/feedback/list'],
        title: '意见反馈',
        noCache: true
      }
    },]
  }, {
    path: '/activity',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'promotionManage',
    meta: {
      title: '活动管理',
      icon: 'form'
    },
    children: [{
      path: 'list',
      component: () => import('@/views/activity/activity'),
      name: 'list',
      meta: {
        perms: ['GET /admin/activity/list'],
        title: '活动列表',
        noCache: true
      }
    },]
  }, {
    path: '/order',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'orderManage',
    meta: {
      title: '订单管理',
      icon: 'list'
    },
    children: [{
      path: 'list',
      component: () => import('@/views/order/list'),
      name: 'list',
      meta: {
        perms: ['GET /admin/order/list'],
        title: '订单列表',
        noCache: true
      }
    },]
  }, {
    path: '/cash',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'platformManage',
    meta: {
      title: '提现管理',
      icon: 'edit'
    },
    children: [{
      path: 'list',
      component: () => import('@/views/cash/list'),
      name: 'list',
      meta: {
        perms: ['GET /admin/cash/list'],
        title: '提现列表',
        noCache: true
      }
    },
    {
      path: 'config',
      component: () => import('@/views/cash/config'),
      name: 'config',
      meta: {
        perms: ['GET /admin/config/fee'],
        title: '提现配置',
        noCache: true
      }
    },
      // {
      //   path: 'set',
      //   component: () => import('@/views/platform/set'),
      //   name: 'set',
      //   meta: {
      //     perms: ['GET /admin/config/wx', 'POST /admin/config/wx'],
      //     title: '客服设置',
      //     noCache: true
      //   }
      // },
    ]
  }, {
    path: '/ship',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'shipManage',
    meta: {
      title: '物流管理',
      icon: 'excel'
    },
    children: [{
      path: 'list',
      component: () => import('@/views/ship/list'),
      name: 'list',
      meta: {
        perms: ['GET /admin/ship/list'],
        title: '物流列表',
        noCache: true
      }
    },]
  }, {
    path: '/sys',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'sysManage',
    meta: {
      title: '系统管理',
      icon: 'tree'
    },
    children: [{
      path: 'admin',
      component: () => import('@/views/sys/admin'),
      name: 'admin',
      meta: {
        perms: ['GET /admin/admin/list', 'POST /admin/admin/create', 'POST /admin/admin/update',
          'POST /admin/admin/delete', 'GET /admin/admin/read'
        ],
        title: '管理员',
        noCache: true
      }
    },
    {
      path: 'log',
      component: () => import('@/views/sys/log'),
      name: 'log',
      meta: {
        perms: ['GET /admin/log/list'],
        title: '操作日志',
        noCache: true
      }
    },
    {
      path: 'role',
      component: () => import('@/views/sys/role'),
      name: 'role',
      meta: {
        perms: ['GET /admin/role/list', 'POST /admin/role/create', 'POST /admin/role/update',
          'POST /admin/role/delete', 'GET /admin/role/permissions', 'POST /admin/role/permissions'
        ],
        title: '角色管理',
        noCache: true
      }
    },
    {
      path: 'os',
      component: () => import('@/views/sys/os'),
      name: 'os',
      meta: {
        perms: ['POST /admin/storage/update', 'POST /admin/storage/read', 'POST /admin/storage/delete', 'POST /admin/storage/create', 'GET /admin/storage/list'],
        title: '对象存储',
        noCache: true
      }
    }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    children: [{
      path: 'password',
      component: () => import('@/views/profile/password'),
      name: 'password',
      meta: {
        title: '修改密码',
        icon: 'password',
        noCache: true
      }
    }],
    hidden: true
  },

  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
