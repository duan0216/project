<template>
    <div class="shousuoBox">
        <div class="leftAside">
            <div class="mTitleBox">
                <h3>综合查询</h3>
            </div>
            <div class="queryCon">
                <h3>空间查询</h3>
                <span class="kjcx_s1">绘制</span>
               
                
            </div>
            <div class="analyBtn">
                <el-button type="primary" @click="analysis">分析<i v-show="showLoad" class="el-icon-loading"></i></el-button>
            </div>
        </div>
        <!--分析弹窗-->
        <div class="customDialog" v-if="resultVisible" :class="!resultBodyVisible?'hideBody':''">
            <div class="dialogHead">
                综合查询
                <span class="titleBtn">
                        <i class="el-icon-full-screen" title="收缩" @click="resultBodyVisible = !resultBodyVisible"></i>
                        <i class="el-icon-close" title="关闭" @click="handleRemove"></i>
                    </span>
            </div>
            <template v-if="!showDetail&&!showChart">
              <div class="dialogBody" v-show="resultBodyVisible">
                <template v-if="!showChart">
                    <div style="padding-bottom:10px">
                        <div style="margin-bottom: 10px;width:20%;display:inline-block">
                        地类编码：
                        <el-input v-model="filterCode" placeholder="" style="width:60%;"></el-input>
                    </div>
                      <div style="margin-bottom: 10px;width:24%;display:inline-block">
                        坐落单位代码：
                        <el-input  placeholder="" v-model="ZLCode" style="width:60%;"></el-input>
                    </div>
                     <div style="margin-bottom: 10px;width:24%;display:inline-block">
                        权属单位名称：
                        <el-input  placeholder="" style="width:60%;"></el-input>
                    </div>
                     <div style="margin-bottom: 10px;width:24%;display:inline-block">
                        权属单位代码：
                        <el-input  placeholder="" style="width:60%;"></el-input>
                    </div>
                    <el-button size="mini" type="primary" 
                    style="margin-left:20px;height:30px;line-height:30px;padding:0 10px"
                    @click="handleFilter">筛选查询</el-button>
                    </div>
                    
                    <el-table stripe :data="tableData" height="100%" style="width: 100%;">
                         <el-table-column label="操作" width="160" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" size="mini"  @click.native.prevent="handleLocation(scope.row.gid)" >定位</el-button>
                                    <el-button
                                    @click.native.prevent="detailRow(scope.row.gid)"
                                    type="text"
                                    size="mini">
                                    查看
                                    </el-button>
                                </template>
                            </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" align="center" prop="dlbm" label="地类编码"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" align="center" prop="dlmc" label="地类名称"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" align="center" prop="qsdwdm" label="权属单位代码" ></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" align="center" prop="qsdwmc" label="权属单位名称" ></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" align="center" prop="zldwdm" label="坐落单位代码" ></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" align="center" prop="zldwmc" label="坐落单位名称" ></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" align="center" prop="tbmj" label="图斑面积(㎡)" width="80"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" align="center" prop="tbdlmj" label="图斑地类面积(㎡)" width="80"></el-table-column>
                    </el-table>
                    <div class="btnPage">
                        <el-pagination background
                                       @size-change="handleSizeChange"
                                       @current-change="handleCurrentChange"
                                       :current-page="currentPage"
                                       :page-sizes="[10, 20, 30, 40]"
                                       :page-size="currentSize"
                                       layout="total, sizes, prev, pager, next, jumper"
                                       :total="total">
                        </el-pagination>
                    </div>
                </template>
               
               

              </div>
              <div class="dialogFoot" v-show="resultBodyVisible">
                <div class="btnBox">
                    <el-button type="primary" size="mini" @click="searchChart" >数据图</el-button>
                    
                </div>
              </div>
            </template>
            <template v-if="showDetail">
              <div class="dialogBody" v-show="resultBodyVisible">
                <el-form class="lineTwoForm"  label-width="160px" size="mini">
                  <el-form-item label="标识码">
                    <el-input :value="detailData.bsm" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="要素代码">
                    <el-input :value="detailData.ysdm" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="图斑预编号">
                    <el-input :value="detailData.tbybh" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="图斑编号">
                    <el-input :value="detailData.tbbh" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="地类编码">
                    <el-input :value="detailData.dlbm" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="权属性质">
                    <el-input :value="detailData.qsxz" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="权属单位代码">
                    <el-input :value="detailData.qsdwdm" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="权属单位名称">
                    <el-input :value="detailData.qsdwmc" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="坐落单位代码">
                    <el-input :value="detailData.zldwdm" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="坐落单位名称">
                    <el-input :value="detailData.zldwmc" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="图斑面积">
                    <el-input :value="detailData.tbmj" readonly></el-input>
                  </el-form-item>
                  <!-- <el-form-item label="扣除地类编码">
                    <el-input :value="detailData.kcdlbm" readonly></el-input>
                  </el-form-item> -->
                  <el-form-item label="扣除地类系数">
                    <el-input :value="detailData.kcxs" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="扣除面积">
                    <el-input :value="detailData.kcmj" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="图斑地类面积">
                    <el-input :value="detailData.tbdlmj" readonly></el-input>
                  </el-form-item>
                  <!-- <el-form-item label="耕地类型">
                    <el-input :value="detailData.gdlx" readonly></el-input>
                  </el-form-item> -->
                  <!-- <el-form-item label="耕地坡度级别">
                    <el-input :value="detailData.gdpdjb" readonly></el-input>
                  </el-form-item> -->
                  <el-form-item label="线状地物面积">
                    <el-input :value="detailData.xzdwkd" readonly></el-input>
                  </el-form-item>
                  <!-- <el-form-item label="图斑细化代码">
                    <el-input :value="detailData.tbxhdm" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="图斑细化名称">
                    <el-input :value="detailData.tbxhmc" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="耕地种植属性代码">
                    <el-input :value="detailData.zzsxdm" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="耕地种植属性名称">
                    <el-input :value="detailData.zzsxmc" readonly></el-input>
                  </el-form-item> -->
                  <el-form-item label="耕地等级">
                    <el-input :value="detailData.gddb" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="备注">
                    <el-input :value="detailData.bz" readonly></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div class="dialogFoot" v-show="resultBodyVisible">
                <div class="btnBox">
                  <el-button @click="reback" style="margin-left: 20px;">返回上一页</el-button>
                </div>
              </div>
            </template>
            <template v-if="showChart">
               <div class="dialogBody" v-show="resultBodyVisible">
                <div class="chartBox" ref="echart" v-show="showChart"></div>
                </div>
                <div class="dialogFoot" v-show="resultBodyVisible">
                <div class="btnBox">
                   
                    <el-button size="mini" @click="handlechart" >返回</el-button>
                </div>
              </div>
            </template>

            
           
 
        </div>
        <!-- <Details></Details> -->
    </div>
</template>

<script>
// import { boundingExtent, getCenter } from "ol/extent.js";
    import Draw, { createRegularPolygon } from "ol/interaction/Draw.js";
    import { Vector as VectorLayer } from "ol/layer.js";
    import { Vector as VectorSource } from "ol/source.js";
    import { fromCircle } from "ol/geom/Polygon.js";
    import GeoJSON from "ol/format/GeoJSON";
    import MapboxDraw from '@mapbox/mapbox-gl-draw'
    import axios from 'axios'
    let draw
    export default {
        name: "ComprehensiveQuery",
        data() {
            return {
                hzType: 0,
                drawTool: null,
                drawSource: null,
                drawVector: null,
                jeojoin: null,
                showLoad:false,
                resultVisible:false,
                resultBodyVisible:true,
                resultList:"",
                tableData:[],
                currentPage:1,
                currentSize:10,
                total:0,
                showChart:false,
                jeojson:"",
                filterCode:"",
                detailBodyVisible:true,
                showDetail:true,
                detailData:{},
                ZLCode:""
            }
        },
        destroyed(){
        //   切换时销毁
          this.$map.removeControl(draw)
          if(this.$map.getLayer('maine'))  this.$map.removeLayer('maine')
          if(this.$map.getSource('queryland'))  this.$map.removeSource('queryland')

        },
        mounted() {
            //绘制图层
          // 绘图得到geojson
         
        draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
            polygon: true,
            point:true,
            line_string:true,
            trash: true
            },
            styles: [
            // ACTIVE (being drawn)
            // line stroke
             
             
              {
                "id": "gl-draw-line",
                "type": "line",
                "filter": ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
                "layout": {
                  "line-cap": "round",
                  "line-join": "round"
                },
                "paint": {
                "line-color": "#D20C0C",
                "line-dasharray": [0.2, 2],
                "line-width": 4
                }
              },
              // polygon fill
              {
                "id": "gl-draw-polygon-fill",
                "type": "fill",
                "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
                "paint": {
                  "fill-color": "#D20C0C",
                  "fill-outline-color": "#D20C0C",
                  "fill-opacity": 0.1
                }
              },
              // polygon outline stroke
              // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
              {
               "id": "gl-draw-polygon-stroke-active",
               "type": "line",
               "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
               "layout": {
                 "line-cap": "round",
                 "line-join": "round"
               },
               "paint": {
                 "line-color": "#D20C0C",
                 "line-dasharray": [0.2, 2],
                 "line-width": 4
                 }
              },
              {
      "id": "gl-draw-polygon-and-line-vertex-halo-active",
      "type": "circle",
      "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
      "paint": {
        "circle-radius": 5,
        "circle-color": "red"
      }
    }
            

            ]
          });
        this.$map.addControl(draw) 
        const collectDraw = (e)=>{
          let data = draw.getAll()
          console.log(data)
          if(data.features.length == 0){
            return
          }
          let features = data.features
          let geometry = features[features.length-1].geometry
          let json = JSON.stringify(geometry)
          this.jeojson = json
        }          
        this.$map.on('draw.create',collectDraw);
        this.$map.on('draw.delete',collectDraw);
        this.$map.on('draw.update',collectDraw);

        },
        methods: {
            // 查询结果接口方法
            queryInfo(){
                let params = {}
               
                //   queryAddress = this.$interApi.filterWithCode
                  params = {
                    geojson: this.jeojson,
	                limit: this.currentSize,
                    offset:this.currentSize*(this.currentPage-1),
                    dlbm:this.filterCode,
                    zldwdm:this.ZLCode
                  }
                // 全部采用按地类编码查询的接口
                axios.post(this.$interApi.queryAll,params).then(res=>{
                      console.log(res.data.result.data)
                      this.tableData = res.data.result.data
                   //    this.total = this.tableData.length
                        this.resultVisible = true
                        this.resultBodyVisible = true
                        this.showDetail = false
                  }).catch(err=>{
                      console.log(err)
                }) 
            },          
            //点击分析按钮
            analysis() {
                if(!this.jeojson){
                    this.$message('请绘制图形！');
                    return
                }
                //禁止多次点击
                if(this.showLoad){
                    return
                }
                if(this.$map.getLayer('maine'))  this.$map.removeLayer('maine')
                if(this.$map.getSource('queryland'))  this.$map.removeSource('queryland')
                this.filterCode = ""
                this.currentSize = 10
                this.currentPage = 1
                this.showChart = false
                this.showDetail = false
                let params = {}
                this.showLoad = true
                axios.post(this.$interApi.queryCount,{geojson: this.jeojson})
                .then(res=>{
                  this.showLoad = false
                    if(res.data.res==1){
                       console.log(res)
                       this.total = res.data.result.data
                       console.log(this.total)
                       this.queryInfo()
                        
                    }else{
                      this.$message.success("loading...")
                    }    
                })
                .catch(err=>{
                  this.showLoad = false
                    console.log(err)
                })
                //this.showLoad = true
               
            },
            // 点击筛选查询按钮
            handleFilter(){

                if(this.filterCode == ""&&this.ZLCode==""){
                    this.analysis()
                }
                axios.post(this.$interApi.queryCount,{geojson: this.jeojson,dlbm:this.filterCode,zldwdm:this.ZLCode})
                .then(res=>{
                    if(res.data.res==1){
                       console.log(res)
                       this.total = res.data.result.data
                       console.log(this.total)
                       this.queryInfo()
                    }else{
                      this.$message.success("loading...")
                    }    
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            //改变每页条数
            handleSizeChange(val) {
                this.currentSize = val
                this.currentPage = 1
                this.queryInfo()
            },
            //切换页码
            handleCurrentChange(val) {
                this.currentPage = val
                this.queryInfo()
            },
            // 查看详情
            detailRow(gid){
              this.showDetail = true
              console.log(gid)
              axios.post(this.$interApi.queryDetails,{gid})
              .then(res=>{
                if(res.data.res == 1){
                  console.log(res)
                  this.detailData = res.data.result.data
                  
                }else{
                  this.$message.success("loading...")
                }  
              })
              .catch(err=>{
                console.log(err)  
              })
            },
            // 详情点击返回
            reback(){
              this.showDetail = false
            },
            // 点击定位
            handleLocation(gid){
               axios.post(this.$interApi.queryDetails,{gid})
              .then(res=>{
                if(res.data.res == 1){
                  console.log(res)
                  let geometry = res.data.result.data.geom
                  if(this.$map.getSource('queryland')){
                      this.$map.removeLayer('maine')
                      this.$map.removeSource('queryland')

                  }
                  this.$map.addSource('queryland', {
                    "type": "geojson",
                    "data": geometry
                  })
                  this.$map.addLayer({
                    'id': 'maine',
                    'type': 'fill',
                    'source':  'queryland',
                    'layout': {},
                    'paint': {
                       'fill-color': 'red',
                       'fill-opacity': 0.8
                     }
                  })
                  this.fitExtend(geometry)
                  this.resultBodyVisible = false

                }else{
                  this.$message.success("loading...")
                }  
              })
              .catch(err=>{
                console.log(err)  
              })
            },
            // 定位geometry的方法
            fitExtend(geometry){
              
              // bounds [xMin, yMin][xMax, yMax]
              var bounds = [[], []];
              var polygon;
              var latitude;
              var longitude
              var coordinates = JSON.parse(JSON.stringify(geometry.coordinates))
              if(geometry.type == "MultiPolygon"){
                  coordinates = coordinates[0]
                 if(geometry.coordinates.length>0){
                      coordinates = [coordinates[0]]
                 }
              }
              // console.log(coordinates)
              for (var i = 0; i <coordinates.length; i++) {
                if (coordinates.length === 1) {
                    // Polygon coordinates[0][nodes]
                  polygon = coordinates[0];
                  
                } else {
                    // Polygon coordinates[poly][0][nodes]
                  polygon = coordinates[i][0];

                }

                for (var j = 0; j < polygon.length; j++) {
                  longitude = polygon[j][0];
                  latitude = polygon[j][1];
                  bounds[0][0] = bounds[0][0] <= longitude ? bounds[0][0] : longitude;
                  bounds[1][0] = bounds[1][0] >= longitude ? bounds[1][0] : longitude;
                  bounds[0][1] = bounds[0][1] <= latitude ? bounds[0][1] : latitude;
                  bounds[1][1] = bounds[1][1] >= latitude ? bounds[1][1] : latitude;
 
                }
              }
              //   console.log(bounds,"+++++")
          
              this.$map.fitBounds(bounds, { padding: 100 });
            },
            searchChart() {
                this.showChart = true
                setTimeout(()=>{let chart = document.querySelector('.chartBox')
                
                this.countChart = this.$echarts.init(chart);
                axios.post(this.$interApi.landCodeStatistics,{geojson: this.jeojson,zldwdm:this.ZLCode})
                .then(res=>{
                  console.log(res)
                  let result = res.data.result.data
                  let codeArray = result.map(item=>item.dlbm)
                  let countArray = result.map(item=>item.total)
                  axios.get("config/zidian.json", { responseType: "json" })
                  .then(res=>{
                    let arr = []
                    codeArray.forEach(e=> {
                      let flag = false
                      for (var key in res.data){
                        if(key == e){
                          arr.push(res.data[key])
                          flag = true
                        }
                      }
                      if(!flag){
                        arr.push('其他')
                      }
                    });
                    let nameData = arr,areaData = countArray;
                    //图表-地类编码统计
                  let countOption = {
                      color: ['#5e9df7', '#ad2f2d'],
                      title : {
                          text: null,
                          x:'center'
                      },
                      tooltip: {
                          trigger: 'axis',
                          axisPointer: {
                              type: 'cross',
                              crossStyle: {
                                  color: '#999'
                              }
                          }
                      },
                      grid: {
                          bottom:100
                      },
                      legend: {
                          x: 'center',
                          y: 'bottom',
                          data:['面积']
                      },
                      xAxis: [
                          {
                              type: 'category',
                              data: nameData,
                              axisPointer: {
                                  type: 'shadow'
                              },
                              axisLine: {
                                  lineStyle:{
                                      color:'#333',
                                      width:1
                                  }
                              },
                              splitLine:{
                                  show: false
                              },
                              axisLabel:{
                                  interval:0,
                                  rotate:30
                              },
                          }
                      ],
                      yAxis: [
                          {
                              type: 'value',
                              name: '数量',
                              min: 0,
                              axisLabel: {
                                  formatter: '{value}'
                              },
                              axisLine: {
                                  lineStyle:{
                                      color:'#333',
                                      width:1
                                  }
                              }
                          },
                      ],
                      series: [
                          {
                              name:'数量',
                              type:'bar',
                              data:areaData,
                              barMaxWidth:50
                          },
                      ]
                    };
                    // if(this.countChart){
                    //     return
                    // }
                    setTimeout(()=>{
                       
                        // this.countChart.clear()
                        this.countChart.setOption(countOption);
                    })
                  })
                
                         })
                
                },1000)
                
                //  this.$refs.echart.Style.display = "block"
                // this.countChart.setOption(countOption)
                
                  
                  
    
           
                
            },
            handleRemove(){
              this.resultVisible=false
              if(this.$map.getLayer('maine'))  this.$map.removeLayer('maine')
              if(this.$map.getSource('queryland'))  this.$map.removeSource('queryland')
            },
            handlechart(){
              this.countChart.clear();
              this.showChart = false;
              
              this.$refs.echart.style.display = "none"
              
            }
        }
    }
</script>

<style scoped>
    .queryCon{
        padding:0 15px;
    }
    .queryCon h3{
        line-height: 40px;
        color: #20509a;
    }
    .analyBtn{
        margin-top:30px;
    }
    .customDialog{
        left:426px;
        right:0;
        transform: translate(0,0);
        bottom: 0;
    }
    .customDialog .dialogBody{
        display: flex;
        flex-direction: column;
    }
    .chartBox{
        flex: 1;
    }
    .dialogBody::v-deep .el-input__inner{
        height: 30px;
    }
</style>
