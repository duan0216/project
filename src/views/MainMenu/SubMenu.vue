<template>
    <div class="subMenuPage">
        <!--统计汇总-->
        <el-tabs v-if="activeMenuIndex=='summaryStatistics'" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane name="comprehensiveQuery">
                <span slot="label"><i class="fa fa-search"></i>综合查询</span>
            </el-tab-pane>
        </el-tabs>
        <!--数据分析-->
        <el-tabs v-else v-model="activeName" @tab-click="handleClick">
            <el-tab-pane name="glandAnalysis">
                <span slot="label"><b class="icon-sqsx"></b>压盖分析</span>
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label"><b class="icon-present"></b>流向分析</span>
            </el-tab-pane>
            <el-tab-pane name="3">
                <span slot="label"><b class="icon-plan"></b>关联分析</span>
            </el-tab-pane>
            <el-tab-pane name="4">
                <span slot="label"><b class="icon-approval"></b>结构分析</span>
            </el-tab-pane>
            <el-tab-pane name="5">
                <span slot="label"><b class="icon-ytgz"></b>专项分析</span>
            </el-tab-pane>
            <el-tab-pane name="6">
                <span slot="label"><b class="icon-kfly"></b>耕地保护应用分析</span>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import {store} from '../../store'
    export default {
        name: "SubMenu",
        data() {
            return {
                keyTargets:{
                    summaryStatistics: {
                        comprehensiveQuery:{name: 'comprehensiveQuery'}
                    },
                    dataAnalysis:{
                        glandAnalysis:{name:'glandAnalysis'}
                    }
                },
                activeName:"",
            }
        },
        computed: {
            activeMenuIndex() {
                return store.activeMenuIndex
            },
        },
        watch: {
            activeMenuIndex() {
                //console.log(this.activeMenuIndex)
                //二级菜单状态
                for(let i in this.keyTargets){
                    if(this.activeMenuIndex == i){
                        for (let j in this.keyTargets[i]){
                            this.activeName = this.keyTargets[i][j].name
                            return
                        }
                    }
                }
            }
        },
        mounted() {
            //console.log(this.activeMenuIndex)
        },
        methods: {
            handleClick(key) {
                //菜单路由配置
                for(let i in this.keyTargets){
                    if(this.keyTargets[i][key.name]){
                        this.$router.replace(this.keyTargets[i][key.name]);
                    }
                }
            },
        }
    }
</script>
<style scoped lang="scss">
    .el-tabs__item b{
        font-size: 16px;
        display: inline-block;
        width: 22px;
        height: 22px;
        vertical-align: middle;
        margin-bottom: 2px;
        margin-right:5px;
        background: url($baseUrl + '/images/AR_icon01.png') no-repeat center center/contain;
    }
    .el-tabs__item .icon-present{
        background-image: url($baseUrl + '/images/AR_icon01.png');
    }
    .el-tabs__item .icon-plan{
        background-image: url($baseUrl + '/images/AR_icon02.png');
    }
    .el-tabs__item .icon-approval{
        background-image: url($baseUrl + '/images/AR_icon03.png');
    }
    .el-tabs__item .icon-sqsx{
        background-image: url($baseUrl + '/images/AR_icon04.png');
    }
    .el-tabs__item .icon-ytgz{
        background-image: url($baseUrl + '/images/AR_icon05.png');
    }
    .el-tabs__item .icon-kfly{
        background-image: url($baseUrl + '/images/AR_icon06.png');
    }
    .el-tabs__item .icon-slzy{
        background-image: url($baseUrl + '/images/AR_icon07.png');
    }
    .el-tabs__item .icon-znxz{
        background-image: url($baseUrl + '/images/AR_icon08.png');
    }
</style>
<style lang="scss">
    .subMenuPage .el-tabs{
        width:100%;
    }
    .subMenuPage .el-tabs__header{
        margin-bottom: 0;
    }
    .subMenuPage .el-tabs__active-bar{
        background: 0;
    }
    .subMenuPage .el-tabs__item{
        padding: 0 12px!important;
    }
    .subMenuPage .el-tabs__item.is-active{
        background: #e7edf7;
    }
    .subMenuPage .el-tabs__item i{
        margin-right:5px;
    }
    .subMenuPage .el-tabs__item i.fa{
        font-size: 24px;
        color: #69A5D8;
        vertical-align: middle;
    }
    .subMenuPage .el-tabs__nav-next, .subMenuPage .el-tabs__nav-prev{
        font-size:16px;
    }
    .subMenuPage .el-icon-arrow-right:before{
        content: "\E6DC";
    }
    .subMenuPage .el-icon-arrow-left:before{
        content: "\E6DD";
    }
</style>

