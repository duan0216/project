<template>
    <div class="MainMenu">
        <el-menu background-color="#237fcd00" text-color="#FFFFFF" :default-active="activeMenuIndex" class="el-menu-demo"
                 mode="horizontal"
                 @select="handleSelect">
            <el-menu-item v-for="item in menuData" :key="item.name" :index="item.name"><i :class="item.icon"></i>{{item.title}}</el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    import {store,mutation} from '../../store'
    export default {
        name: "MainMenu",
        data() {
            return {
                menuData:[],
                keyTargets: {
                    summaryStatistics: {
                        comprehensiveQuery:{name: 'comprehensiveQuery'}
                    },
                    dataAnalysis:{
                        glandAnalysis:{name:'glandAnalysis'}
                    }
                }
            };
        },
        computed: {
            activeMenuIndex() {
                return store.activeMenuIndex
            }
        },
        mounted() {
            //获取菜单
            this.menuData = this.$appconfig.menu.value
            //设置默认菜单高亮
            for(let i in this.keyTargets){
                for(let j in this.keyTargets[i]){
                    if(this.keyTargets[i][j].name == this.$route.name){
                        this.setMenuIndex(i)
                        this.setCommonMenuIndex("")
                    }
                }
            }
        },
        methods: {
            setMenuIndex: mutation.setMenuIndex,
            setCommonMenuIndex: mutation.setCommonMenuIndex,
            handleSelect(key) {
                this.setMenuIndex(key)
                this.setCommonMenuIndex("")
                //菜单路由配置
                if(this.keyTargets[key]){
                    for(let i in this.keyTargets[key]){
                        this.$router.replace(this.keyTargets[key][i]);
                        return
                    }
                }
            }
        },
    };
</script>
<style lang="scss">
    @import 'MainMenu';
</style>
