<template>
    <div class="style-wrapper" :class="{ 'expand': isExpand }" @mouseover="isExpand = true" @mouseout="isExpand = false">
        <div id="styleSwitch" class="map-style" :style="{'width':isExpand?100*data.length+10+'px':'110px'}">
            <div v-for='(item, index) in data' :key="index" class="style-card" :style="{'background-image':'url('+item.src+')','right':isExpand?100*(data.length-index-1)+10+'px':1*(data.length-index-1)+10+'px'}" :class="{active:activeIndex == index}" @click="switchEvent(index,item)">
                <span>{{ item.text }}</span>
                <i v-if="isExpand" :class="{'el-icon-success':activeIndex == index}"></i>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SwitchMap",
        data() {
            return {
                isExpand: false,
                activeIndex: 0,
                data: []
            }
        },
        mounted() {
            //默认底图
            this.switchBaseLayer()
            this.activeIndex = 0
        },
        methods: {
            switchBaseLayer(text) {
                this.data = []
                //设置显示的底图
                let {baseLayers} = this.$mapconfig;
                for (let i = 0, baselayer; i < baseLayers.length; i++) {
                    baselayer = baseLayers[i];
                    //初始化data
                    this.data.push({
                        text:baselayer.GroupName.replace("地图",""),
                        src:baselayer.GroupImage
                    })
                    if(!text){
                        text = baseLayers[0].GroupName.replace("地图","")
                    }
                    if(text == baselayer.GroupName.replace("地图","")){
                        let layers = this.$olmap.getLayers().getArray()
                        for (let j = 0;j<layers.length; j++) {
                            //图层创建async有延迟
                            setTimeout(()=>{
                                if(layers[j].isBaseLayer){
                                    if(layers[j].layerGroup == baselayer.GroupName){
                                        layers[j].setVisible(true)
                                    }else{
                                        layers[j].setVisible(false)
                                    }
                                    layers[j].setZIndex(0)
                                }
                            },200)
                        }
                    }
                }

            },
            switchEvent(index,item) {
                /*if (e.target.nodeName.toLowerCase() === 'div') {
                    const $index = parseInt(e.target.dataset.index)
                    this.activeIndex = $index
                }*/
                this.activeIndex = index
                this.switchBaseLayer(item.text)
            }
        }
    }
</script>

<style scoped lang="scss">
    .style-wrapper {
        position: absolute;
        right: 0;
        bottom: 0;
        z-index: 1;
    }
    .map-style {
        height: 80px;
        cursor: pointer;
        -webkit-transition-property: width,background-color;
        transition-property: width,background-color;
        -webkit-transition-duration: .6s;
        transition-duration: .6s;
        width: 110px;
        background-color: #ffffff00;
    }
    .map-style .style-card {
        height: 60px;
        width: 86px;
        position: absolute;
        border-radius: 2px;
        top: 10px;
        box-sizing: border-box;
        border: 1px solid transparent;
        border: 1px solid #9999996b;
        background:#fff url($baseUrl + "/images/map_bg01.png") no-repeat center center/contain;
        -webkit-transition-property: right;
        transition-property: right;
        -webkit-transition-duration: .4s;
        transition-duration: .4s;
        box-shadow: 0 0 3px #ccc;
    }
    .expand .map-style {
        background-color: #ffffffcc;
    }
    .expand .map-style .style-card {
        border: 1px solid rgba(255,255,255,0);
    }
    .expand .map-style .style-card.active, .expand .map-style .style-card:hover {
        border: 1px solid #3385FF;
    }
    .expand .map-style .style-card.active i {
        position: absolute;
        top: 0;
        left: 0;
        width: 18px;
        height: 18px;
        color: #3385FF;
    }
    .map-style .style-card span {
        position: absolute;
        bottom: 0;
        right: 0;
        display: inline-block;
        padding: 3px 3px 2px 4px;
        font-size: 12px;
        height: 12px;
        line-height: 12px;
        color: #FFF;
        border-top-left-radius: 2px;
        background-color: #3385FF;
    }
    .map-style .style-card.active{
        z-index: 3;
    }
    .map-style .style-card.active span, .map-style .style-card:hover span {
        background-color: #3385FF;
    }
</style>
