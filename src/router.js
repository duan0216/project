import Vue from 'vue'
import VueRouter from 'vue-router'
// 模块化必须显式使用Vue.use来加载路由功能
Vue.use(VueRouter)

/*综合查询*/
import ComprehensiveQuery from './views/ComprehensiveQuery'
/*压盖分析*/
import GlandAnalysis from './views/GlandAnalysis'
// 定义路由
const routes = [
     // 设置默认重定向
    {
        path: '/',
        redirect:{
            name: 'comprehensiveQuery'
        }
     },
    //综合查询
    {
        path: '/comprehensiveQuery',
        name: 'comprehensiveQuery',
        component: ComprehensiveQuery
    },
    {
        path: '/glandAnalysis',
        name: 'glandAnalysis',
        component: GlandAnalysis
    }
]
// 实例化路由
const router = new VueRouter({
    // mode:'history',
    routes
})

// 暴露路由对象，为后续挂载容器做准备
export default router
