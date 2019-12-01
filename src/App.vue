<template>
    <div id="app">
        <div class="header">
            <div class="logo"></div>
            <div class="title">{{bannerTitle}}</div>
            <div class="menu">
                <main-menu></main-menu>
                <!--<a href="javascript:;" class="loginBox" @click="logout" title="退出登录">
                    <i class="el-icon-switch-button"></i><br>
                    退出
                </a>-->
            </div>
        </div>
        <div class="conBox">
            <CommonMenu></CommonMenu>
            <div class="conBoxCon">
                <SubMenu></SubMenu>
                <div class="conBoxConCon">
                    <olmap />
                    <CommonArea />
                    <router-view></router-view>
                </div>
            </div>
        </div>
        <div class="copyright"></div>
    </div>
</template>

<script>
    import MainMenu from "./views/MainMenu/MainMenu"
    import CommonMenu from "./views/MainMenu/CommonMenu"
    import SubMenu from "./views/MainMenu/SubMenu"
    import olmap from './olmap/olmap'
    // 公用组件
    import CommonArea from './views/common/CommonArea'
    export default {
        name: 'app',
        data() {
            return {
                map: null,
                bannerTitle:"",
                // Bus: new Vue()
            }
        },
        components: {
            MainMenu,
            CommonMenu,
            SubMenu,
            olmap,
            CommonArea
        },
        mounted() {
            // debugger;
            let {bannerTitle,pageTitle }= this.$appconfig.title;
            this.bannerTitle = bannerTitle;
            document.title = pageTitle;
        },
        methods: {
            logout() {
                let curUrl = window.location.href
                //console.log(curUrl)
                window.location.href = this.$interfaceconfig.logout.value+"?service="+curUrl
                //window.location.href = "http://112.94.224.249:9011/icas-nosql/logout?service=http://localhost:8080/dynr-emap"
            }
        },
        computed: {
        }
    }
</script>
<style src="./assets/comment.css"></style>
<style>

    html, body, .mapview, #app {
        height: 100%;
        width: 100%;
        margin: 0 0;
        padding: 0 0;
        /* overflow: hidden; */
    }
    /* 滚动条整体样式 */
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
    width: 9px;
    height: 9px
}
/*定义滚动条轨道*/
::-webkit-scrollbar-track {
    background-color: transparent;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
    background-color: #0093ff;
    background-image: -webkit-linear-gradient(45deg,rgba(255,255,255,.4) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.4) 50%,rgba(255,255,255,.4) 75%,transparent 75%,transparent);
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em
}
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #333;
        display: flex;
        flex-direction: column;
    }

    .header {
        height: 72px;
        background: url("../public/images/nav-bg.png") no-repeat left center;
        /* box-shadow: 2px 2px 10px #909090; */
        width: 100%;
        z-index: 1;
        position: relative;
    }

    .main-map {
        position: absolute;
        top: 70px;
        bottom: 0;
        width: 100%;
        background-color: #d8cdd3;
    }

    .logo {
        height: 72px;
        width: 72px;
        margin-left: 10px;
        display: inline-block;
        float: left;
        background: url("../public/images/logo.png") no-repeat left center;
        background-size: auto 60px;
    }

    .title {
        display: inline-block;
        float: left;
        line-height: 72px;
        font-size: 22px;
        /*text-indent: 5px;*/
        color: #FFF;
        background-size: auto 60px;
        margin-left: -3px;
    }

    .menu {
        display: inline-block;
        height: 100%;
        position: absolute;
        right:5px;
    }

    .loginBox {
        display: inline-block;
        vertical-align: top;
        color: #B1D1F5 ;
        cursor: pointer;
        padding:12px 5px;
        line-height: 22px;
        text-align: center;
        margin-left: 30px;
    }
    .loginBox i{
        font-size:22px;
    }
    .conBox{
        flex: 1;
        position: relative;
        overflow: hidden;
    }
    .conBox>div{
        float: left;
        width:80px;
        height:100%;
    }
    .conBox .conBoxCon{
        width:auto;
        position: absolute;
        left:80px;
        right:0;
        height:100%;
        display: flex;
        flex-direction: column;
    }
    .conBox .conBoxCon .conBoxConCon{
        flex: 1;
        position: relative;
    }
</style>
