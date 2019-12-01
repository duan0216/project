<template>
    <div>
        <el-menu :default-active="activeCommonMenuIndex" class="commonMenu" @select="handleSelect">
            <el-menu-item index="resourceBrowsing">
                <i class="icon-zyll"></i>
                <span slot="title">资源浏览</span>
            </el-menu-item>
            <el-menu-item index="hotLayers">
                <i class="icon-rmtc"></i>
                <span slot="title">热门图层</span>
            </el-menu-item>
            <el-menu-item index="personalLayers">
                <i class="icon-grtc"></i>
                <span slot="title">个人图层</span>
            </el-menu-item>
            <el-menu-item index="gland">
                <i class="icon-ygfx"></i>
                <span slot="title">压盖分析</span>
            </el-menu-item>
            <el-menu-item index="overlapArea">
                <i class="icon-djfx"></i>
                <span slot="title">叠加分析</span>
            </el-menu-item>
            <el-menu-item index="buffer">
                <i class="icon-hcqfx"></i>
                <span slot="title">缓冲区分析</span>
            </el-menu-item>
            <el-menu-item index="layerContrast">
                <i class="icon-tcdb"></i>
                <span slot="title">图层对比</span>
            </el-menu-item>
            <el-menu-item index="thematicMapping">
                <i class="icon-tjzz"></i>
                <span slot="title">专题图制作</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    import { store,  mutation} from  '../../store'
    export default {
        name: "CommonMenu",
        components: {
        },
        data() {
            return {
                zttzz:false,
                layerContrast:false,
                bufferVisible:false,
                keyTargets: {
                }
            }
        },
        computed: {
            activeCommonMenuIndex() {
                return store.activeCommonMenuIndex
            }
        },
        mounted() {
            //设置默认菜单高亮
            for(let i in this.keyTargets){
                if(this.keyTargets[i].name == this.$route.name){
                    this.setCommonMenuIndex(this.$route.name)
                }
            }
        },
        methods: {
            setCommonMenuIndex: mutation.setCommonMenuIndex,
            handleSelect(key) {
                this.setCommonMenuIndex(key)
                if(key == "thematicMapping"){
                    this.zttzz = true
                    return
                }else if(key == "layerContrast"){
                    this.layerContrast = true
                    return
                }else if(key == "buffer"){
                    this.bufferVisible = true
                    return
                }
                if(this.keyTargets[key]){
                    this.$router.replace(this.keyTargets[key]);
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .commonMenu{
        background: #0c5898;
        position: relative;
        z-index: 1;
        height:100%;
        overflow: auto;
        padding-top: 40px;
        box-sizing: border-box;
    }
    .commonMenu .el-menu-item, .el-submenu__title{
        line-height: 30px;
        color: #a2bed6;
        font-size: 13px;
    }
    .commonMenu .el-menu-item{
        padding:10px 5px !important;
        text-align: center;
        height:74px;
        overflow: hidden;
        background: url($baseUrl + '/images/menu_line.png') no-repeat bottom center/70px 2px;
    }
    .commonMenu .el-menu-item:first-child{
        background: url($baseUrl + '/images/menu_line.png') no-repeat bottom center/70px 2px,url($baseUrl + '/images/menu_line.png') no-repeat top center/70px 2px;
    }
    .commonMenu .el-menu-item:not(.is-disabled):focus, .commonMenu .el-menu-item:not(.is-disabled):hover,.commonMenu > .el-menu-item.is-active{
        background: rgba(129,178,254,0.4);
        color: #fff;
    }
    .commonMenu .el-menu-item i{
        display: block;
        width: 26px;
        height: 26px;
        margin:0 auto;
        background: url($baseUrl + '/images/menu_icon08.png') no-repeat center center/100%;
    }
    .commonMenu .el-menu-item .icon-zyll{
        background-image: url($baseUrl + '/images/menu_icon08.png');
    }
    .commonMenu .el-menu-item .icon-rmtc{
        background-image: url($baseUrl + '/images/menu_icon09.png');
    }
    .commonMenu .el-menu-item .icon-grtc{
        background-image: url($baseUrl + '/images/menu_icon10.png');
    }
    .commonMenu .el-menu-item .icon-ygfx{
        background-image: url($baseUrl + '/images/menu_icon11.png');
    }
    .commonMenu .el-menu-item .icon-djfx{
        background-image: url($baseUrl + '/images/menu_icon12.png');
    }
    .commonMenu .el-menu-item .icon-hcqfx{
        background-image: url($baseUrl + '/images/menu_icon13.png');
    }
    .commonMenu .el-menu-item .icon-tcdb{
        background-image: url($baseUrl + '/images/menu_icon14.png');
    }
    .commonMenu .el-menu-item .icon-tjzz{
        background-image: url($baseUrl + '/images/menu_icon15.png');
    }

    @media screen and (max-width: 1919px) {
        .commonMenu {
            padding-top: 0;
            margin-top: -2px;
        }
    }
</style>
