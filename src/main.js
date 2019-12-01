import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import 'font-awesome/css/font-awesome.min.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
// 模块化必须显式使用Vue.use来加载路由功能
Vue.use(VueRouter);
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import echarts from 'echarts'  //引入echarts
import 'echarts-gl'
import './css/common.css'
Vue.prototype.$echarts = echarts  //注册组件

Vue.use(ElementUI);
Vue.config.productionTip = false;
import olMap from './olmap/olmap'
// Vue.prototype.$olmap = olMap;

Vue.use(olMap)

let configRequester = (url) => {
    return axios.get(url, {responseType: 'json'});
};
// 空的实例放到根组件下，所有的子组件都能调用
let bus = new Vue()
Vue.prototype.$Bus = bus
import {StyleMirror} from "./utils/StyleMirror"
axios.get("config/uiconfig.json", { responseType: "json" })
.then(res=>{
  let uiconfig = res.data
  let Style = new StyleMirror(uiconfig)
  Vue.prototype.$style = Style
})



axios.all([configRequester('config/appconfig.json'), configRequester('config/mapconfig.json'), configRequester('config/interfaceconfig.json')])
    .then(function ([appconfig, mapconfig, interfaceconfig]) {
        Vue.prototype["$appconfig"] = appconfig.data;
        Vue.prototype["$mapconfig"] = mapconfig.data;
        Vue.prototype["$interfaceconfig"] = interfaceconfig.data;
        let urlIndex = Vue.prototype["$interfaceconfig"].openapi.value
        let inter = Vue.prototype["$interfaceconfig"].interfaces
        let placeSearch =  Vue.prototype["$interfaceconfig"].placeSearch.value
        Vue.prototype["$interApi"] = inter
        Vue.prototype["$placeSearch"]= placeSearch
        for(let key in inter){
            inter[key] = urlIndex+inter[key].value
        }
        //console.log(inter)
        Vue.prototype["$interApi"] = inter


        new Vue({
            router,
            render: h => h(App),
        }).$mount('#app');
    }).catch(function (error) {
    if (error.response) {
        console.error("获取配置文件失败。");
    }
});

/*登录*/
Vue.prototype.$userId = "5db156d2e4b060d18a6088c8";
Vue.prototype.$userName = "chenjunhong";
Vue.prototype.$loginName = "chenjunhong";
Vue.prototype.$organName = "";
/*axios.get("config/userinfo.jsp").then(res=>{
    if(res.data.indexOf("<%@") > -1){
        return ;
    }
    res = res.data.split("|");
    Vue.prototype.$userId = res[0];
    Vue.prototype.$userName = res[1];
    Vue.prototype.$loginName = res[2];
    Vue.prototype.$organName = res[3];
})*/


