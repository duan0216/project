<template>
    <div class="commonAreaPage">
<!--        <div class="sousuoqu">-->
<!--            <el-input placeholder="项目信息快速检索" v-model="input1" class="input-with-select" size="small">-->
<!--                <el-button slot="append" icon="el-icon-search"></el-button>-->
<!--            </el-input>-->
<!--        </div>-->
        <div class="controlBox">
            <i class="fa fa-globe" title="全景" @click="globeMap"></i>
            <div>
                <i class="icon-layer" title="图层控制" @click="openLayerControl" :class="showLayerControl?'active':''"></i>
            </div>
            <i class="el-icon-plus" title="放大" @click="enlargeMap"></i>
            <i class="el-icon-minus" title="缩小" @click="narrowMap"></i>
        </div>


        <div class="holdBox">
            <!--<div>
                <el-button @click="quhuaClick" :class="testCount?'active':''"><i class="icon-locate"></i>东营市</el-button>
            </div>-->
            <div>
                <!--图例-->
                <el-button @click="showBox('legendVisible')" :class="legendVisible?'active':''"><i class="icon-legend"></i>图例</el-button>
            </div>
            <div>
                <el-button @click="showBox('gongju')" :class="gongju?'active':''"><i class="icon-gongju"></i>工具箱</el-button>
                <!-- 工具箱 -->
                <HoldAll v-if="gongju"/>
            </div>
        </div>

    </div>
</template>

<script>
    // 工具箱
    import HoldAll from './HoldAll'
    import { store,  mutation} from '../../store'
    export default {
        name: "",
        components:{
            HoldAll,
        },
        data() {
            return {
                ziyuan: false,
                gongju: false,
                legendVisible:false,
                input1: '',
                zttzz: false,
                showLayerControl:false,
                quhuaOL: false
            }
        },
        computed: {
            testCount(){
                return store.xingzheng
            },
        },
        mounted() {
            //点击地图隐藏
            /*this.$olmap.on('click', ()=> {
                //this.gongju = false
                this.legendVisible = false
                this.showLayerControl = false
            })*/
        },

        methods: {
            setXingzheng: mutation.setXingzheng,
            quhuaClick(){
                this.setXingzheng(!this.testCount)
            },
            //显示工具箱、图例等
            showBox(val) {
                this[val] = !this[val]
                if(val == "gongju"){
                    this.legendVisible = false
                }else if(val == "legendVisible"){
                    this.gongju = false
                }
            },
            //点击放大地图
            enlargeMap() {
                const view = this.$olmap.getView()
                //console.log(view.getZoom())
                if(view.getZoom()<view.getMaxZoom()){
                    view.animate({zoom: view.getZoom() + 1});
                }
            },
            //点击缩小地图
            narrowMap() {
                const view = this.$olmap.getView()
                if(view.getZoom()>view.getMinZoom()){
                    view.animate({zoom: view.getZoom() - 1});
                }
            },
            //全景
            globeMap(){
                this.$olmap.getView().fit(this.$mapconfig.initExtent)
            },
            openLayerControl() {
                this.showLayerControl = !this.showLayerControl
            },
        },
        // 销毁
        destroyed(){

        },
    }
</script>

<style scoped lang="scss">
    /*按钮组*/
    .holdBox{
        position: absolute;
        right:10px;
        top:10px;
    }
    .holdBox>div{
        display: inline-block;
        margin-right: 10px;
        position: relative;
    }
    .holdBox>div>div{
        position: absolute;
        right:0;
        top:45px;
    }
    .holdBox .el-button{
        padding: 10px 15px;
        cursor: pointer;
        border-radius: 3px;
        background-size: 16% 52%;
        box-shadow: 1px 0px 10px #ccc;
        color: #333;
    }
    .holdBox .el-button.active{
        color: #1c65b9;
    }
    .holdBox .el-button i{
        display: inline-block;
        vertical-align: middle;
        width:16px;
        height:16px;
        margin-right:10px;
        background: url($baseUrl + "/images/zuobiao.png") no-repeat center center/contain;
    }
    .holdBox .el-button.active i{
        background-image: url($baseUrl + "/images/zuobiao-.png");
    }
    .holdBox .el-button .icon-locate{
        background-image: url($baseUrl + "/images/zuobiao.png");
    }
    .holdBox .el-button.active .icon-locate{
        background-image: url($baseUrl + "/images/zuobiao-.png");
    }
    .holdBox .el-button .icon-gongju{
        background-image: url($baseUrl + "/images/gongjuxiang1.png");
    }
    .holdBox .el-button.active .icon-gongju{
        background-image: url($baseUrl + "/images/gongjuxiang.png");
    }
    .holdBox .el-button .icon-legend{
        background-image: url($baseUrl + "/images/tuli.png");
    }
    .holdBox .el-button.active .icon-legend{
        background-image: url($baseUrl + "/images/tuli-.png");
    }
    .controlBox{
        position: absolute;
        right:10px;
        bottom: 80px;
        width:30px;
    }
    .controlBox>div{
        display: inline-block;
        margin-bottom: 15px;
        position: relative;
        width:30px;
        height:30px;
    }
    .controlBox>div i{
        margin-bottom: 0;
    }
    .controlBox>div>div{
        position: absolute;
        right:40px;
        bottom:0;
    }
    .controlBox i{
        display: inline-block;
        margin-bottom: 15px;
        width:30px;
        height:30px;
        background: #fff;
        font-size: 18px;
        box-shadow: 0 0 8px #999;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        color: #93a3b0;
    }
    .controlBox .icon-layer{
        background: #fff url($baseUrl + "/images/kongzhi.png") no-repeat center center/16px 16px;
    }
    .controlBox .icon-layer.active{
        background-image: url($baseUrl + "/images/kongzhi-.png");
    }
    .sousuoqu{
        display: inline-block;
        vertical-align:top;
        position: absolute;
        right: 350px;
        top: 10px;
    }
    .sousuoqu .el-input-group{
        line-height: normal;
        display: inline-table;
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        box-shadow: 1px 0px 10px #ccc;
    }
    .sousuoqu ::v-deep .el-input__inner{
        border: none !important;
        width: 246px;
        height: 42px;
    }
    .sousuoqu ::v-deep .el-input-group__append{
        border: none !important;
        border-left: none;
        color: #fff;
        background: #347BCD;
    }
    .sousuoqu ::v-deep .el-icon-search{
        content: none;
        width: 18px;
        height: 18px;
        background: url($baseUrl + '/images/search.png');
    }
</style>
