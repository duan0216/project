<template>
    <!-- 工具箱 -->
    <div class="olmapPage">
        <div class="mapMenu">
            <i class="fa diming" title="地名定位" @click="locationNameLocation" :class="showPlacesSearch?'active':''"><span class="mm_wz">地名定位</span></i>
            <!-- <i class="fa quhua" title="区划定位" @click="xingzheng()" :class="testCount?'active':''"><span class="mm_wz">区划</span></i> -->
            <i class="fa zuobiao" title="坐标定位" @click="handleCoordinates"><span class="mm_wz">坐标定位</span></i>
            <!-- <i @click="enlargeMap" class="fa fa-search-plus" title="放大"><span class="mm_wz">放大</span></i> -->
            <!-- <i @click="narrowMap" class="fa fa-search-minus" title="缩小"><span class="mm_wz">缩小</span></i>
            <i class="fa quanjing" title="全景" @click="globeMap"><span class="mm_wz">全景</span></i> -->
            <i class="fa shuxing" title="属性查询" :class="showLayerOption || drawLayerOption?'active':''"><span class="mm_wz">属性查询</span></i>
            <i class="fa shuqian" title="书签管理" @click="openLayerLabel" :class="showLayerLabel?'active':''"><span class="mm_wz">书签管理</span></i>
            <i class="fa ceju" title="测量距离" @click="measureLength" :class="measurableLine?'active':''"><span class="mm_wz">测量距离</span></i>
            <i class="fa cemian" title="测量面积" @click="measureArea" :class="measurableArea?'active':''"><span class="mm_wz">测量面积</span></i>
            <i class="fa qingchu" title="清除要素" @click="clearFeatures"><span class="mm_wz">清除要素</span></i>
            <i class="fa qctuceng" title="清除图层" @click="clearLayers"><span class="mm_wz">清除图层</span></i>
            <!--<i class="fa tuli" title="图例"><span class="mm_wz">图例</span></i>
            <i class="fa tckongzhi" title="图层控制" @click="openLayerControl" :class="showLayerControl?'active':''"><span class="mm_wz">图层控制</span></i>-->
            <!--<i class="fa huanchong" title="缓冲区" @click="openBuffer" :class="showBuffer?'active':''"><span class="mm_wz">缓冲区</span></i>-->
        </div>
        <el-dialog :visible.sync="dialogVisible" width="550px" center>
            <div slot="title">
                <i class="el-icon-setting"></i>根据坐标查找定位
            </div>
            <el-form label-position="right" label-width="80px" >
                <el-form-item label="横坐标" prop="xCoordinate">
                <el-input v-model="xCoordinate"></el-input>
                </el-form-item >
                <el-form-item label="纵坐标" prop="yCoordinate">
                <el-input v-model="yCoordinate"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="btnLoading" @click="validateForm">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { store,  mutation} from '../../store'
import axios from 'axios'
import {Draw,Select} from 'ol/interaction';
import {Vector as VectorSource} from 'ol/source.js';
import {Vector as VectorLayer} from 'ol/layer.js';
import GeoJSON from 'ol/format/GeoJSON';
  import Overlay from 'ol/Overlay';
  import {unByKey} from 'ol/Observable';
  import {Polygon ,LineString,Point}from 'ol/geom';
  import {getArea, getLength} from 'ol/sphere';
  import {Style,Icon,Fill, Stroke,  Circle as CircleStyle} from 'ol/style';
  import Feature from 'ol/Feature';

export default {
    components:{
    },
    data() {
        return {
            //   xingzheng: false
            xzqu: false,
            drawLayerOption:null,
            sourceLayerOption:null,
            mapLayerOption:{},
            geometriesLayerOption:null,
            layerOptionData:null,
            layerList:[],
            showLayerLabel:false,
            showPlacesSearch:false,
            btnLoading:false,
            dialogVisible:false,
            targetIconLayers:'',//坐标的图层
            xCoordinate:39647336.544539325,
            yCoordinate:4146040.901064621,
            isClear:0,
            measurableLine:false,
            measurableArea:false
        }
    },
    computed: {
        testCount(){
            return store.xingzheng
        },
        /*showBuffer(){
            return store.buffer
        },*/
        loadedLayers(){
            return store.RBLoadedLayers
        },
        //已加载tree
        loadedTree(){
            return store.RBLoadedTree
        },
        showLayerOption(){
            return store.layerOption
        },
        /*showLayerControl(){
            return store.layerControl
        },*/
    },
    watch: {
        showLayerOption(){
            //属性弹窗关闭清除绘制功能
            if(!this.showLayerOption){
                this.$olmap.removeInteraction(this.drawLayerOption)
                this.drawLayerOption = null
                return
            }
        },
        loadedLayers() {
            if(this.loadedLayers.length == 0){
                this.layerList = []
            }
        }
    },
    mounted() {

    },
    methods: {
        setXingzheng: mutation.setXingzheng,
        setLayerOption: mutation.setLayerOption,
        setClearLayersChange: mutation.setClearLayersChange,
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
        xingzheng(){
            this.setXingzheng(true)
            this.xzqu = !this.xzqu
        },
        //图形属性
        drawPoint() {
            this.$olmap.removeLayer(this.mapLayerOption);
            this.$olmap.removeInteraction(this.drawLayerOption)
            if(this.layerOptionData && JSON.stringify(this.layerOptionData) != "{}"){
                this.setLayerOption(!this.showLayerOption)
            }
            //初始化图层
            this.sourceLayerOption = new VectorSource({wrapX: false});
            this.mapLayerOption = new VectorLayer({
                source: this.sourceLayerOption,
            })
            this.$olmap.addLayer(this.mapLayerOption)
            //用于区别绘制图形
            this.mapLayerOption["drawType"] = "draw"
            this.mapLayerOption.setZIndex(9999)
            //初始化绘图工具
            this.drawLayerOption = new Draw({
                source: this.sourceLayerOption,
                type: "Point",
                stopClick:true
            });
            this.$olmap.addInteraction(this.drawLayerOption);
            this.drawLayerOption.on("drawstart", () => {
                this.sourceLayerOption.clear()
            }, this);
            this.drawLayerOption.on("drawend", (evt) => {
                if (evt.feature != null) {
                    let geometry = evt.feature.getGeometry()
                    this.geometriesLayerOption = (new GeoJSON()).writeGeometry(geometry)
                    this.searchLayerOption()
                }
            }, this);
        },
        //图形属性查询
        searchLayerOption() {
            let tcList = []
            this.layerList = []
            for(let i in this.loadedLayers){
                let option = this.loadedLayers[i]
                tcList.push(option.code)
                this.layerList.push({
                    code:option.code,
                    name:option.name
                })
            }
            if(tcList.length==0){
                this.$message('请先勾选资源浏览图层！');
                this.sourceLayerOption.clear()
                return
            }
            //const loading = this.$loading();
            let params = {
                geojson:this.geometriesLayerOption,
                codes:tcList
            }
            axios.post(this.$interApi.locateQueryMap,params).then( (res)=>{
                if(res.data.res == 1){
                    this.layerOptionData = res.data.result
                    this.setLayerOption(true)
                    //清除绘制
                    // this.$olmap.removeLayer(this.mapLayerOption);
                    // this.$olmap.removeInteraction(this.drawLayerOption)
                    // this.drawLayerOption = null
                }else{
                    // this.$message.warning(res.data.resMsg);
                    this.$message.warning('Loading ..');
                }
                //loading.close()
            }).catch(()=> {
                //loading.close()
                // this.$message.error('请求失败，请稍后再试！');
                this.$message.error('Loading ..');
            });
        },
        //清除
        clearFeatures() {
            this.clearLayer()
            //this.$olmap.once('rendercomplete', (event)=> {
            //let layers = event.target.getLayers().getArray()
            let layers = this.$olmap.getLayers().getArray()
            for(let i=layers.length-1;i>=0;i--){
                if(layers[i].drawType){
                    this.$olmap.removeLayer(layers[i]);
                }
            }
            //移除行为
            //let interact = event.target.getInteractions().getArray()
            let interact = this.$olmap.getInteractions().getArray()
            for(let i=interact.length-1;i>=0;i--){
                if(interact[i] instanceof Select || interact[i] instanceof Draw){
                    this.$olmap.removeInteraction(interact[i]);
                }
            }
            //});
            this.$olmap.renderSync();
            this.setClearLayersChange(++this.isClear)
        },
        //清除图层
        clearLayers() {
            this.clearLayer();
            //this.$olmap.once('rendercomplete', (event)=> {
            //let layers = event.target.getLayers().getArray()
            let layers = this.$olmap.getLayers().getArray()
            for(let i=layers.length-1;i>=0;i--){
                if(!layers[i].isBaseLayer){
                    //移除已选图层
                    for (let j = this.loadedLayers.length-1; j >= 0; j--) {
                        if (layers[i].id == this.loadedLayers[j].id) {
                            this.loadedLayers.splice(j, 1)
                        }
                    }
                    //移除已选tree存储
                    for(let j=this.loadedTree.length-1;j>=0;j--){
                        if(layers[i].id == this.loadedTree[j].id){
                            this.loadedTree.splice(j,1)
                        }
                    }
                    this.$olmap.removeLayer(layers[i]);
                }
            }
            //移除行为
            //let interact = event.target.getInteractions().getArray()
            let interact = this.$olmap.getInteractions().getArray()
            for(let i=interact.length-1;i>=0;i--){
                if(interact[i] instanceof Select || interact[i] instanceof Draw){
                    this.$olmap.removeInteraction(interact[i]);
                }
            }
            //});
            this.$olmap.renderSync();
            this.setClearLayersChange(++this.isClear)
        },
        // 测距
        measureLength(){
            this.measurableLine = !this.measurableLine;
            this.measurableArea = false
            if(this.measurableLine==true){
                this.measure('LineString');
            }
            else{
                this.clearLayer();
            }
        },
        // 侧面
        measureArea(){
            this.measurableArea = !this.measurableArea;
            this.measurableLine = false
            if(this.measurableArea==true){
                this.measure('area');
            }
            else{
                this.clearLayer();
            }
        },
        //清除
        clearLayer() {
            for (let layerTmp of this.$olmap.getLayers().getArray()) {
                if (layerTmp.get("name") == "feature") {
                    // layer = layerTmp;
                    // layerTmp.setSource(null)
                    layerTmp.getSource().clear();
                }
            }
            this.$olmap.removeInteraction(this.draw);
            let doms = document.getElementsByClassName('tooltip');
            if(doms.length > 0) {
                for (let i = doms.length-1; i >= 0 ; i--) {
                    doms[i].remove();
                }
            }
            this.$olmap.removeLayer(this.targetIconLayers);
        },
        //测距测面
        measure(measureType) {
            let that = this;
            //Currently drawn feature.
            let sketch;
            let helpTooltipElement;
            let helpTooltip;
            let measureTooltipElement;
            let measureTooltip;
            let continuePolygonMsg = '继续点击绘制多边形';
            let continueLineMsg = '继续点击绘制线';
                const vectorSource = new VectorSource({ wrapX: false });
                const vectorLayer = new VectorLayer({
                    source: vectorSource,
                    name: "feature",
                    style:that.$style.getMeasureStyle()
                });
                this.$olmap.addLayer(vectorLayer);
            //用于区别绘制图形
            vectorLayer["drawType"] = "draw"
            vectorLayer.setZIndex(9999)
            createMeasureTooltip();
            createHelpTooltip();

            /**
             * Handle pointer move.
             * @param {module:ol/MapBrowserEvent~MapBrowserEvent} evt The event.
             */
            let pointerMoveHandler = function (evt) {
                if (evt.dragging) {
                    return;
                }
                let helpMsg = '请点击开始绘制';

                if (sketch) {
                    let geom = (sketch.getGeometry());
                    if (geom instanceof Polygon) {
                        helpMsg = continuePolygonMsg;
                    } else if (geom instanceof LineString) {
                        helpMsg = continueLineMsg;
                    }
                }

                helpTooltipElement.innerHTML = helpMsg;
                helpTooltip.setPosition(evt.coordinate);

                helpTooltipElement.classList.remove('hidden');
            };

            this.$olmap.on('pointermove', pointerMoveHandler);

            this.$olmap.getViewport().addEventListener('mouseout', function () {
                helpTooltipElement.classList.add('hidden');

            });

            // let draw;
            let formatLength = function (line) {
                let length = getLength(line);
                let output;
                if (length > 100) {
                    output = (Math.round(length / 1000 * 100) / 100) +
                    ' ' + 'km';
                } else {
                    output = (Math.round(length * 100) / 100) +
                    ' ' + 'm';
                }
                return output;
            };
            let formatArea = function (polygon) {
                let area = getArea(polygon);
                let output;
                if (area > 10000) {
                    output = (Math.round(area / 1000000 * 100) / 100) +
                    ' ' + 'km<sup>2</sup>';
                } else {
                    output = (Math.round(area * 100) / 100) +
                    ' ' + 'm<sup>2</sup>';
                }
                return output;
            };
            let source;
            // let layer ;
            console.info(this.$olmap.getLayers().getArray())
            // 获取存放feature的vectorlayer层。map初始化的时候可以添加好了
            for (let layerTmp of this.$olmap.getLayers().getArray()) {
                console.info(layerTmp.get('name'));
                if (layerTmp.get("name") === "feature") {
                    // layer = layerTmp;
                    // layerTmp.setSource(null)
                    source = layerTmp.getSource();
                }
            }

            // const vectorSource = new VectorSource({ wrapX: false });
            // const vectorLayer = new VectorLayer({
            //   source: vectorSource,
            //   name: "feature"
            // });
            // this.$olmap.addLayer(vectorLayer);

            function addInteraction() {
            console.info(source);
            let type = (measureType === 'area' ? 'Polygon' : 'LineString');
            that.draw = new Draw({
                source: source,
                type: type
            });
            that.$olmap.addInteraction(that.draw);

            let listener;
            // 绘制开始
            that.draw.on('drawstart',
                function (evt) {
                    // set sketch
                    sketch = evt.feature;

                    /** @type {module:ol/coordinate~Coordinate|undefined} */
                    let tooltipCoord = evt.coordinate;

                    listener = sketch.getGeometry().on('change', function (evt) {
                        let geom = evt.target;
                        let output;
                        if (geom instanceof Polygon) {
                            output = formatArea(geom);
                            tooltipCoord = geom.getInteriorPoint().getCoordinates();
                        } else if (geom instanceof LineString) {
                            output = formatLength(geom);
                            tooltipCoord = geom.getLastCoordinate();
                        }
                        measureTooltipElement.innerHTML = output;
                        measureTooltip.setPosition(tooltipCoord);
                    });
                }, this);

            // 绘制完成
            that.draw.on('drawend',
                function () {
                    console.info(that.vectorSource);

                    measureTooltipElement.className = 'tooltip tooltip-static';
                    measureTooltip.setOffset([0, -7]);
                    // unset sketch
                    sketch = null;
                    // unset tooltip so that a new one can be created
                    measureTooltipElement = null;
                    createMeasureTooltip();
                    unByKey(listener);
                    that.$olmap.un('pointermove', pointerMoveHandler);
                    that.$olmap.removeInteraction(that.draw);
                    helpTooltipElement.classList.add('hidden');
                    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
                    that.measurableLine = false
                    that.measurableArea = false
                }, this);
            }

            function createHelpTooltip() {
            if (helpTooltipElement) {
                helpTooltipElement.parentNode.removeChild(helpTooltipElement);
            }
            helpTooltipElement = document.createElement('div');
            helpTooltipElement.className = 'tooltip hidden';
            helpTooltip = new Overlay({
                element: helpTooltipElement,
                offset: [15, 0],
                positioning: 'center-left'
            });
            that.$olmap.addOverlay(helpTooltip);
            }

            function createMeasureTooltip() {
                if (measureTooltipElement) {
                    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
                }
                measureTooltipElement = document.createElement('div');
                measureTooltipElement.className = 'tooltip tooltip-measure';
                measureTooltip = new Overlay({
                    element: measureTooltipElement,
                    offset: [0, -15],
                    positioning: 'bottom-center'
                });
                that.$olmap.addOverlay(measureTooltip);
            }
            // 量测调用
            addInteraction();
        },
        //坐标
        handleCoordinates(){
            //39647336.544539325,4146040.901064621
            this.resetFormData();
            this.dialogVisible=true;
            this.$olmap.removeLayer(this.targetIconLayers);
        },
        resetFormData(){
            this.xCoordinate=39647336.544539325,
            this.yCoordinate=4146040.901064621
        },
        validateForm(){
            this.btnLoading = true;
            this.dialogVisible=false;
            let targetCenter=[this.xCoordinate,this.yCoordinate];
            //坐标点为红点
            // let iconStyle = new Style({
            //   image: new CircleStyle({
            //     radius:8,
            //     fill:new Fill({
            //       color:"red"
            //     })
            //   })
            // });

            let iconFeature = new Feature({
            geometry: new Point(targetCenter),
            });
            iconFeature.setStyle(this.$style.getMakerStyle());

            let iconLayer = new VectorLayer({
                source: new VectorSource({
                    features: [iconFeature]
                }),
                name: "feature",
            });
            this.targetIconLayers=iconLayer
            this.$olmap.addLayer(this.targetIconLayers);
            //用于区别绘制图形
            this.targetIconLayers["drawType"] = "draw"
            this.targetIconLayers.setZIndex(9999)
            // this.$olmap.getView().fit(this.targetIconLayers,{minResolution:100});
            this.$olmap.getView().setCenter([this.xCoordinate,this.yCoordinate])
            this.btnLoading = false;
        },
        //书签
        openLayerLabel(){
            this.clearLayer();
            this.showLayerLabel= !this.showLayerLabel
        },
        // 地名定位
        locationNameLocation(){
            this.clearLayer();
            this.showPlacesSearch = !this.showPlacesSearch
        }

    },
    destroyed() {
        this.$olmap.removeInteraction(this.drawLayerOption)
        this.$olmap.removeLayer(this.mapLayerOption);
    }
}
</script>

<style scoped lang="scss">
    /*地图菜单*/
    .mapMenu{
        color: #5B6268;
        padding: 2px 2px;
        font-size: 16px;
        border-radius: 5px;
        width: 100px;
        box-shadow: 1px 0px 10px #ccc;
        background: #fff;
    }
    .mapMenu i{
        display: block;
        cursor: pointer;
        padding: 15px 15px;
        font-size: 12px;
        position: relative;
        border-radius: 3px;
        height: 12px;
    }
    .mapMenu i:hover{
        color: #1c65b9;
    }
    .mapMenu i.active{
        color: #1c65b9;
    }
    .diming{
        background: url($baseUrl + "/images/diming.png") no-repeat 11px center;
    }
    .diming:hover,.diming.active{
        background: url($baseUrl + "/images/diming-.png") no-repeat 11px center;
    }

    .quhua{
        background: url($baseUrl + "/images/quhua.png") no-repeat 11px center;
    }
    .quhua:hover,.quhua.active{
        background: url($baseUrl + "/images/quhua-.png") no-repeat 11px center;
    }

    .zuobiao{
        background: url($baseUrl + "/images/zuobiao.png") no-repeat 11px center;
    }
    .zuobiao:hover,.zuobiao.active{
        background: url($baseUrl + "/images/zuobiao-.png") no-repeat 11px center;
    }

    .quanjing{
        background: url($baseUrl + "/images/quantu.png") no-repeat 11px center;
    }
    .quanjing:hover,.quanjing.active{
        background: url($baseUrl + "/images/quantu-.png") no-repeat 11px center;
    }

    .shuxing{
        background: url($baseUrl + "/images/shuxing.png") no-repeat 11px center;
    }
    .shuxing:hover,.shuxing.active{
        background: url($baseUrl + "/images/shuxing-.png") no-repeat 11px center;
    }

    .shuqian{
        background: url($baseUrl + "/images/shuqian.png") no-repeat 11px center;
    }
    .shuqian:hover,.shuqian.active{
        background: url($baseUrl + "/images/shuqian-.png") no-repeat 11px center;
    }

    .ceju{
        background: url($baseUrl + "/images/changdu.png") no-repeat 11px center;
    }
    .ceju:hover,.ceju.active{
        background: url($baseUrl + "/images/changdu-.png") no-repeat 11px center;
    }

    .cemian{
        background: url($baseUrl + "/images/mianji.png") no-repeat 11px center;
    }
    .cemian:hover,.cemian.active{
        background: url($baseUrl + "/images/mianji-.png") no-repeat 11px center;
    }

    .qingchu{
        background: url($baseUrl + "/images/qingchu.png") no-repeat 11px center;
    }
    .qingchu:hover,.qingchu.active{
        background: url($baseUrl + "/images/qingchu-.png") no-repeat 11px center;
    }

    .qctuceng{
        background: url($baseUrl + "/images/qingchutc.png") no-repeat 11px center;
    }
    .qctuceng:hover,.qctuceng.active{
        background: url($baseUrl + "/images/qingchutc-.png") no-repeat 11px center;
    }

    .tuli{
        background: url($baseUrl + "/images/tuli.png") no-repeat 11px center;
    }
    .tuli:hover,.tuli.active{
        background: url($baseUrl + "/images/tuli-.png") no-repeat 11px center;
    }

    .qingchu{
        background: url($baseUrl + "/images/qingchu.png") no-repeat 11px center;
    }
    .qingchu:hover,.qingchu.active{
        background: url($baseUrl + "/images/qingchu-.png") no-repeat 11px center;
    }

    .tckongzhi{
        background: url($baseUrl + "/images/kongzhi.png") no-repeat 11px center;
    }
    .tckongzhi:hover,.tckongzhi.active{
        background: url($baseUrl + "/images/kongzhi-.png") no-repeat 11px center;
    }

    .huanchong{
        background: url($baseUrl + "/images/icon-chongdie.png") no-repeat 11px center;
    }
    .huanchong:hover,.huanchong.active{
        background: url($baseUrl + "/images/icon-chongdie-.png") no-repeat 11px center;
    }

    .mapMenu .mm_wz{
        position: absolute;
        width: 60%;
        right: 0;
        text-align: left;
    }
    /*自定义弹窗*/
    .mapDialog{
        position: fixed;
        right: 100px;
        top: 180px;
        background: #fff;
        border-radius: 8px;
    }
    .AdministrativeRegion{
        position: absolute;
        left: 0;
        top: 0;
    }
</style>
