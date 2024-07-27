import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import Home from '../views/home.vue';
import Search from '../views/search.vue';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { unauthorized } from "../net/index.js";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: '系统首页',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard.vue'),
            },
            {
                path: '/table',
                name: 'table',
                meta: {
                    title: '学生管理',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/table.vue'),
            },
            {
                path: '/charts',
                name: 'charts',
                meta: {
                    title: '图表',
                    permiss: '3',
                },
                component: () => import(/* webpackChunkName: "charts" */ '../views/charts.vue'),
            },
           /* {
                path: '/form',
                name: 'baseform',
                meta: {
                    title: '表单',
                    permiss: '5',
                },
                component: () => import(/!* webpackChunkName: "form" *!/ '../views/form.vue'),
            },*/
            {
                path: '/tabs',
                name: 'tabs',
                meta: {
                    title: '选科管理',
                    permiss: '4',
                },
                component: () => import(/* webpackChunkName: "tabs" */ '../views/tabs.vue'),
            },
            {
                path: '/donate',
                name: 'donate',
                meta: {
                    title: '选科管理',
                    permiss: '5',
                },
                component: () => import(/* webpackChunkName: "donate" */ '../views/donate.vue'),
            },
           /* {
                path: '/permission',
                name: 'permission',
                meta: {
                    title: '权限管理',
                    permiss: '13',
                },
                component: () => import(/!* webpackChunkName: "permission" *!/ '../views/permission.vue'),
            },*/
            {
                path: '/upload',
                name: 'upload',
                meta: {
                    title: '上传插件',
                    permiss: '6',
                },
                component: () => import(/* webpackChunkName: "upload" */ '../views/upload.vue'),
            },
            {
                path: '/icon',
                name: 'icon',
                meta: {
                    title: '自定义图标',
                    permiss: '10',
                },
                component: () => import(/* webpackChunkName: "icon" */ '../views/icon.vue'),
            },
            {
                path: '/user',
                name: 'user',
                meta: {
                    title: '个人中心',
                    permiss:'7'
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/user.vue'),
            },
          /*  {
                path: '/editor',
                name: 'editor',
                meta: {
                    title: '富文本编辑器',
                    permiss: '8',
                },
                component: () => import(/!* webpackChunkName: "editor" *!/ '../views/editor.vue'),
            },*/
      /*      {
                path: '/markdown',
                name: 'markdown',
                meta: {
                    title: 'markdown编辑器',
                    permiss: '9',
                },
                component: () => import(/!* webpackChunkName: "markdown" *!/ '../views/markdown.vue'),
            },*/
            {
                path: '/export',
                name: 'export',
                meta: {
                    title: '学生管理',
                    permiss: '8',
                },
                component: () => import(/* webpackChunkName: "export" */ '../views/export.vue'),
            },
            {
                path: '/import',
                name: 'import',
                meta: {
                    title: '班主任管理',
                    permiss: '9',
                },
                component: () => import(/* webpackChunkName: "import" */ '../views/import.vue'),
            },
			/*{
				path:'/register',
				name:'Register',
				meta:{
					title:'注册',
				},
				component:()=>import(/!* webpackChunkName: "zhuce" *!/'../views/zhuce.vue'),
			}*/
        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    },
	// {
	// 	path:'forget',
	// 	name:'Forget',
	// 	meta:{
	// 		title:'忘记密码',
	// 	},
	// 	component:()=>import(/* webpackChunkName: "zhuce" */'../views/forget.vue'),
	// },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    NProgress.start();
    const isUnauthorized = unauthorized()
    const permiss = usePermissStore();
    if (isUnauthorized && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)&&!isUnauthorized) {
        // 如果没有权限，则进入403
        next('/403');
    } else {
        next();
    }
});
/*router.beforeEach((to, from, next) => {
    const isUnauthorized = unauthorized()
    if(to.name.startsWith('Login') && !isUnauthorized) {
        next('/index')
    } else if(to.fullPath.startsWith('/index') && isUnauthorized) {
        next('/')
    } else {
        next()
    }
})*/
router.afterEach(() => {
    NProgress.done()
})

export default router;
