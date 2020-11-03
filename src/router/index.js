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
      title: '客户管理',
      icon: 'user'
    },
    children: [
      {
        path: 'listClient',
        component: () => import('@/views/user/listClient'),
        name: 'listClient',
        meta: {
          perms: ['GET /admin/user/list'],
          title: '买家管理',
          noCache: true
        }
      },
      {
        path: 'listServer',
        component: () => import('@/views/user/listServer'),
        name: 'listServer',
        meta: {
          perms: ['GET /admin/seller/list'],
          title: '卖家管理',
          noCache: true
        }
      },

    ]
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
        title: '订单查询管理',
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
        title: '收款活动管理',
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
      title: '结算管理',
      icon: 'edit'
    },
    children: [{
      path: 'list',
      component: () => import('@/views/cash/list'),
      name: 'list',
      meta: {
        perms: ['GET /admin/cash/list'],
        title: '提现申请审核',
        noCache: true
      }
    }]
  }, {
    path: '/data',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'dataManage',
    meta: {
      title: '数据查询',
      icon: 'table'
    },
    children: [{
      path: 'export',
      component: () => import('@/views/data/export'),
      name: 'export',
      meta: {
        perms: ['GET /admin/data/list'],
        title: '导入数据查询',
        noCache: true
      }
    }]
  }, {
    path: '/config',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'configManage',
    meta: {
      title: '参数设置',
      icon: 'excel'
    },
    children: [
      {
        path: 'cash',
        component: () => import('@/views/config/cash'),
        name: 'cash',
        meta: {
          perms: ['GET /admin/config/fee'],
          title: '提现服务费设置',
          noCache: true
        }
      },
      {
        path: 'ship',
        component: () => import('@/views/config/ship'),
        name: 'ship',
        meta: {
          perms: ['GET /admin/ship/list'],
          title: '物流设置',
          noCache: true
        }
      },
      {
        path: 'close',
        component: () => import('@/views/config/close'),
        name: 'close',
        meta: {
          perms: ['GET /admin/close/list'],
          title: '关闭原因维护',
          noCache: true
        }
      },
    ]
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
      path: 'feedback',
      component: () => import('@/views/sys/feedback'),
      name: 'feedback',
      meta: {
        perms: ['GET /admin/feedback/list'],
        title: '意见反馈',
        noCache: true
      }
    },
      // {
      //   path: 'log',
      //   component: () => import('@/views/sys/log'),
      //   name: 'log',
      //   meta: {
      //     perms: ['GET /admin/log/list'],
      //     title: '操作日志',
      //     noCache: true
      //   }
      // },
      // {
      //   path: 'os',
      //   component: () => import('@/views/sys/os'),
      //   name: 'os',
      //   meta: {
      //     perms: ['POST /admin/storage/update', 'POST /admin/storage/read', 'POST /admin/storage/delete', 'POST /admin/storage/create', 'GET /admin/storage/list'],
      //     title: '对象存储',
      //     noCache: true
      //   }
      // }
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
