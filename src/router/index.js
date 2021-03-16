import Vue from 'vue'
import VueRouter from 'vue-router';
import i18n from '@/lang';

/* Layout */
import Layout from '@/layout'

Vue.use(VueRouter);

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (resolve) => require(['@/views/redirect'], resolve)
      }
    ]
  },
  {
    path: '/login',
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/error/401'], resolve),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: (resolve) => require(['@/views/index'], resolve),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    name: '订单管理',
    meta: { title: '订单管理', icon: 'list' },
    redirect: 'noredirect',
    children: [
      {
        path: 'list',
        component: (resolve) => require(['@/views/order/orderList'], resolve),
        name: '订单列表',
        meta: { title: '订单列表', icon: 'radio' }
      },
      {
        path: 'waitingAccept',
        component: (resolve) => require(['@/views/order/waitingAccept'], resolve),
        name: '待接单',
        meta: { title: '待接单', icon: 'radio' }
      },
      {
        path: 'waitingPrint',
        component: (resolve) => require(['@/views/order/waitingPrint'], resolve),
        name: '待取件',
        meta: { title: '待取件', icon: 'radio' }
      },
      {
        path: 'cancel',
        component: (resolve) => require(['@/views/order/cancel'], resolve),
        name: '已取消',
        meta: { title: '已取消', icon: 'radio' }
      },
      {
        path: 'detail/:id',
        hidden: true,
        component: (resolve) => require(['@/views/order/orderDetail'], resolve),
        name: '订单详情',
        meta: { title: '订单详情', icon: 'radio' }
      }
    ]
  },
  {
    path: '/shopSet',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'list',
        component: (resolve) => require(['@/views/shopSet'], resolve),
        name: '店铺设置',
        meta: { title: '店铺设置', icon: 'system' }
      }
    ]
  },
  // {
  //   path: '/price',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'list',
  //       component: (resolve) => require(['@/views/price'], resolve),
  //       name: '价格设置',
  //       meta: { title: '价格设置', icon: 'user' }
  //     }
  //   ]
  // },
  // {
  //   path: '/order',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'type/data/:dictId(\\d+)',
  //       component: (resolve) => require(['@/views/system/dict/data'], resolve),
  //       name: 'Data',
  //       meta: { title: '字典数据', icon: '' }
  //     }
  //   ]
  // }
]


let Router = new VueRouter({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return {
        x: 0,
        y: to.meta.savedPosition || 0
      }
    }
  },
  routes: [],
  mode: 'hash'
});
//ViewsRouter.install(Vue, Router, store, i18n);
//Router.$viewsRouter.formatRoutes(store.state.user.menu, true);
Router.addRoutes([...constantRoutes]);
export default Router;
