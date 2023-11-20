import Vue from 'vue'
import Router from 'vue-router'
import store from 'store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { getToken } from '../utils/auth' // 验权
import { mapGetters } from 'vuex'
const _import = require('./_import_' + process.env.NODE_ENV)
Vue.use(Router)

const routes = [
    { path: '/login', name: 'login', component: _import('login/index') },
    {
        path: '*',
        redirect: '/404'
    },
    {
        path: '/',
        redirect: '/voiceCall',
        component: _import('home/index'),
        children: [
            {
                path: '/voiceCall',
                name: '调度管理',
                component: _import('voiceCall/index'),
            },
            {
                path: '/ipBroad',
                name: '会议管理',
                component: _import('ipBroad/index'),
            },
            // {
            //     path: '/video',
            //     name: '视频',
            //     component: _import('video/index'),
            // },
            // {
            //     path: '/meeting',
            //     name: '会议',
            //     component: _import('meeting/index'),
            // }
            // {
            //     path: '/radio',
            //     name: '对讲',
            //     component: _import('radio/index'),
            //                 },
            // {
            //     path: '/alarm',
            //     name: '视频联动',
            //     component: _import('alarm/index'),
            // },
            // {
            //     path: '/broadOrder',
            //     name: '会议预约',
            //     component: _import('broadOrder/index'),
            // },
            {
                path: '/systemAdmin',
                name: '系统管理',
                redirect: '/recordManage',
                component: _import('systemAdmin/index'),
                children: [{
                    path: '/fileManage',
                    name: '文件管理',
                    component: _import('systemAdmin/fileManage/index')
                },
                {
                    path: '/recordManage',
                    name: '呼叫管理',
                    component: _import('systemAdmin/recordManage/index')
                },
                ]
            },
        ]
    },
    {
        path: '/setting',
        name: '系统设置',
        redirect: '/setting/userManage',
        component: _import('setting/index'),
        children: [{
            path: '/setting/userManage',
            name: '组织管理',
            component: _import('setting/userManage/index')
        },
        /*
              {
                  path: '/setting/userGroupManage',
                  name: '用户组管理',
                  component: _import('setting/userGroupManage/index')
              },
        */
        {
            path: '/setting/deviceManage',
            name: '设备管理',
            component: _import('setting/deviceManage/index')
        },
        {
            path: '/setting/routeManage',
            name: '路由管理',
            component: _import('setting/routeManage/index'),
        },
        {
            path: '/setting/photoManage',
            name: '图片管理',
            component: _import('setting/photoManage/index')
        },
				{
						path: '/setting/authorization',
						name: '正版授权',
						component: _import('setting/authorization/index')
				},
        
        
            /*
                {
                    path: '/setting/deviceGroupManage',
                    name: '设备组管理',
                    component: _import('setting/deviceGroupManage/index')
                }
                /* ,
                
                            {
                                path: '/setting/organizationManage',
                                name: '机构管理',
                                component: _import('setting/organizationManage/index')
                            } */
        ]
    }
]

const router = new Router({
    routes,
    mode: 'hash' // default: hash ,history
})
// 全局路由配置
// 路由开始之前的操作
/* const whiteList = ['/login']
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      next()
    }

  }else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next('/login')
        NProgress.done()
      }

    }
  }
}) */

router.beforeEach((to, from, next) => {
    NProgress.done().start()
    let toName = to.name
    // let fromName = from.name
    let is_login = store.state.user_info.login
    if (!is_login && toName !== 'login') {
        next({
            name: 'login'
        })
    } else {
        if (is_login && toName === 'login') {
            next({
                path: '/'
            })
        } else {
            next()
        }
    }
})

//路由完成之后的操作
router.afterEach(route => {
    NProgress.done() // 结束Progress
})

export default router
