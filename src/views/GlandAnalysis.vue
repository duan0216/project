<template>
    <div class="shousuoBox">
        <div class="leftAside">
            <div class="mTitleBox">
                <h3>压盖分析</h3>
            </div>
            <div class="queryCon">
                <h3>导入项目界址点</h3>
                 <!--<div class="btnBox">
                    <label>图斑类型：</label>
                    <el-select size="mini" v-model="txtType" style="width:77%">
                        <el-option label="点状图斑" :value="0"></el-option>
                        <el-option label="线状图斑" :value="1"></el-option>
                        <el-option label="面状图斑" :value="2"></el-option>
                    </el-select>
                </div>
                <div class="btnBox">
                    <label>文件格式：</label>
                    <el-radio-group v-model="txtFormat" @change="changeFormat">
                        <el-radio :label="0">默认格式</el-radio>
                        <el-radio :label="1">标准格式</el-radio>
                        <el-radio :label="2">自定义</el-radio>
                    </el-radio-group>
                </div>
                <el-row v-if="txtFormat==2">
                    <el-col :span="12">
                        <label>跳过</label>
                        <el-input size="mini" v-model="myParams.pass"></el-input>
                        <span>行</span>
                    </el-col>
                    <el-col :span="12">
                        <label>分隔符</label>
                        <el-input size="mini" v-model="myParams.split"></el-input>
                    </el-col>
                    <el-col :span="12">
                        <label>X坐标：第</label>
                        <el-input size="mini" v-model="myParams.xIdx"></el-input>
                        <span>列</span>
                    </el-col>
                    <el-col :span="12">
                        <label>Y坐标：第</label>
                        <el-input size="mini" v-model="myParams.yIdx"></el-input>
                        <span>列</span>
                    </el-col>
                </el-row>
                <el-input v-else class="mb-10" type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="txtValue" readonly></el-input>
                
                          -->

                <el-upload
                        name="txtFile"
                        :data="{txtType:txtType,format:format}"
                        :action="$interApi.importTxtAll"
                        :before-upload="clearTxt"
                        :on-success="showTxt"
                        :on-error="showError"
                        :file-list="fileList"
                        >
                    <el-button size="small" type="primary">导入<i v-show="loading" class="el-icon-loading"></i></el-button>
                </el-upload>
                <h3>缓冲区生成</h3>
                <div class="btnBox">
                    <label>宽度（米）：</label>
                    <el-input placeholder="请输入数字" size="mini" v-model="widthNum" style="width:72%">
                        <template slot="append">
                            <el-button @click="computBuffer">生成</el-button>
                        </template>
                    </el-input>
                </div>
                <h4>地类图斑叠加，地类占用分析</h4>
            </div>
            <div class="analyBtn">
                <el-button type="primary" @click="analysis">叠加分析<i v-show="showLoad" class="el-icon-loading"></i></el-button>
            </div>
        </div>
        <!--分析弹窗-->
        <div class="customDialog" v-if="resultVisible" :class="!resultBodyVisible?'hideBody':''">
            <div class="dialogHead">
                分析结果列表
                <span class="titleBtn">
                        <i class="el-icon-full-screen" title="收缩" @click="resultBodyVisible = !resultBodyVisible"></i>
                        <i class="el-icon-close" title="关闭" @click="resultVisible=false"></i>
                </span>
            </div>
            <template v-if="!showDetail">
              <div class="dialogBody" v-show="resultBodyVisible">
                <template v-if="!showChart">
                    <div style="padding-bottom:10px">
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
                        <el-table-column :show-overflow-tooltip="true" align="center" prop="yzmj" label="压占面积(m²)" min-width="120"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" align="center" prop="qsdwdm" label="权属单位代码" width="120"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" align="center" prop="qsdwmc" label="权属单位名称" width="120"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" align="center" prop="zldwdm" label="坐落单位代码" width="120"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" align="center" prop="zldwmc" label="坐落单位名称" width="120"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" align="center" prop="tbmj" label="图斑面积(㎡)" min-width="120"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" align="center" prop="tbdlmj" label="图斑地类面积(㎡)" min-width="120"></el-table-column>
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
                <div v-show="showChart">
                   <div class="chartBox" ref="echart" v-show="showChart"></div>
                <div class="tablebox" v-show="showChart" style="height:500px">
                   <el-table
                    :data="tableData2"
                    style="width: 100%">
                    <el-table-column
                      prop="dlbm"
                      label="地类名称"
                      width="180"
                      align="center">
                    </el-table-column>
                    <el-table-column
                      prop="yzmj"
                      label="面积"
                      >
                    </el-table-column>

                   </el-table>
                </div>
                </div>
               
              </div>
              <div class="dialogFoot" v-show="resultBodyVisible">
                <div class="btnBox">
                    <el-button type="primary" size="mini" @click="searchChart" v-if="!showChart">地类统计</el-button>
                    <el-button size="mini" @click="showChart = false" v-if="showChart">返回</el-button>
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
            
        </div>
    </div>
</template>

<script>
    import GeoJSON from 'ol/format/GeoJSON';
    import axios from "axios"
    import * as turf from "@turf/turf"

    export default {
        name: "GlandAnalysis",
        data() {
            return {
                mapLayer:{},
                txtType:2,
                txtFormat: 0,
                format:'',
                myParams:{},
                txtValue:"40506713.815,329654.432;\n" +
                    "40506433.213,329134.321;",
                currentFile:'',
                fileList:[],
                widthNum:200,
                loading:false,
                // geometries:null,
                showLoad:false,
                resultVisible:false,
                resultBodyVisible:true,
                resultList:"",
                tableData:[],
                showDetail:false,
                showChart:false,
                currentPage:1,
                currentSize:10,
                total:0,
                detailData:{},
                tableData2:[]
            }
        },
        mounted() {
            this.geometries = {
                "coordinates":[[[112.63859975752041,27.737956961170376],[112.72164445749468,27.66768836887948],[112.81107721130746,27.750733068859617],[112.63859975752041,27.737956961170376]]],
                "type":"Polygon"
            }
            
            //this.uploadFile();
        },
        methods: {
            // 查询结果接口方法
            queryInfo(){
                let params = {}

             
                  params = {
                    geojson:JSON.stringify(this.realGeo),
	                limit: this.currentSize,
                    offset:this.currentSize*(this.currentPage-1),
                    meter:this.widthNum
                  }
                
                // 全部采用按地类编码查询的接口
                axios.post(this.$interApi.querybuffer,params).then(res=>{
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
            //格式
            changeFormat(val) {
                if(val == 0){
                    this.txtValue = "40506713.815,329654.432;\n" +
                        "40506433.213,329134.321;"
                }else if(val == 1){
                    this.txtValue = "例如：\n" +
                        "[属性描述]\n" +
                        "格式版本号=\n" +
                        "数据生产单位=\n" +
                        "数据生产日期=\n" +
                        "坐标系=大地坐标系\n" +
                        "几度分带=\n" +
                        "投影类型=\n" +
                        "计量单位=米\n" +
                        "带号=\n" +
                        "精度=\n" +
                        "转换参数=,,,,,,\n" +
                        "[地块坐标]\n" +
                        "8,,,,,,,,@\n" +
                        "J1,1,88928.461,77628.843\n" +
                        "J2,1,88930.117,77644.314\n" +
                        "J3,1,88933.564,77676.521\n" +
                        "J4,1,88913.204,77678.350\n" +
                        "J5,1,8889*.***,****3.838\n" +
                        "J6,1,8888*.***,****4.748\n" +
                        "J7,1,8888*.***,****0.605\n" +
                        "J1,1,88928.461,77628.843\n"
                }else{
                    this.format = JSON.parse(JSON.stringify(this.myParams))
                }
            },
            //上传前重置文件列表，单选文件
            clearTxt(file) {
                this.fileList = [file]
                this.loading = true
            },
            //上传成功
            showTxt(response) {
                if(response.res ==1 ){
                    console.log(response.result)
                    this.geometries = response.result.geom4490   //为GeoJSON，
                    this.realGeo = response.result.geom
                    this.uploadFile();
                }else{
                    this.geometries = null
                }
                this.loading = false
            },
            //上传失败
            showError() {
                // this.$message.error('请求失败，请稍后再试！');
                this.$message.error('Loading ..');
                this.loading = false
            },
            uploadFile() {
                //隐藏图层
                if (this.$map.getLayer('bufferLayer')){
                    this.$map.setLayoutProperty("bufferLayer", 'visibility', 'none');
                    //this.$map.removeLayer("bufferLayer");
                }
                if(this.geometriesBuffer){
                    this.geometriesBuffer = null
                }
                if (this.$map.getLayer('uploadLayer')){
                    this.$map.getSource('uploadid').setData(this.geometries);
                }else{
                    //this.$map.on('load', ()=> {
                        this.$map.addSource('uploadid', {
                            'type': 'geojson',
                            'data': {
                                'type': 'Feature',
                                'geometry': this.geometries
                            }
                        });
                        let layer = {
                            'id': 'uploadLayer',
                            'type': 'fill',
                            'source': 'uploadid',
                            'layout': {},
                            'paint': {
                                'fill-color': 'red',
                                'fill-opacity': 0.8
                            }
                        };
                        this.$map.addLayer(layer)
                        this.fitExtend(this.geometries)
                    //})
                }

            },
            //计算缓冲
            computBuffer() {
                if(this.geometries == null){
                    return
                }
                let width = parseInt(this.widthNum)
                console.log(width)
                // let jsts = require("jsts");
                // let geom = JSON.stringify(this.realGeo)
                // console.log(geom)
                // let geoJSONReader = new jsts.io.GeoJSONReader();
                // let geoJst = geoJSONReader.read(geom);
                // // console.log(geoJst)
                // // debugger
                // let bufferGeo = geoJst.buffer(width);
                // // //jsts数据转openlayer数据
                // let geoJSONWriter = new jsts.io.GeoJSONWriter();
                // this.geometriesBuffer = geoJSONWriter.write(bufferGeo)
                
          
                let feature = turf.buffer(this.geometries, width, {
                    units: 'meters'
                });
                this.geometriesBuffer = feature.geometry

                console.log(JSON.stringify(this.geometriesBuffer))
                if (this.$map.getLayer('bufferLayer')){
                    this.$map.setLayoutProperty("bufferLayer", 'visibility', 'visible');
                    this.$map.getSource('bufferid').setData(this.geometriesBuffer);
                }else{
                    this.$map.addSource('bufferid', {
                        'type': 'geojson',
                        'data': this.geometriesBuffer
                    });
                    let layer = {
                        'id': 'bufferLayer',
                        'type': 'fill',
                        'source': 'bufferid',
                        'layout': {},
                        'paint': {
                            'fill-color': '#088',
                            'fill-opacity': 0.8
                        }
                    };
                    this.$map.addLayer(layer)

                }
            },
            //分析
            analysis() {
                if(!this.geometries){
                    this.$message('请导入图形！');
                    return
                }
                //禁止多次点击
                if(this.showLoad){
                    return
                }
                this.showLoad = true
                this.searchData()
            },
            searchData() {
               
                if(this.$map.getLayer('maine'))  this.$map.removeLayer('maine')
                if(this.$map.getSource('queryland'))  this.$map.removeSource('queryland')
                this.currentSize = 10
                this.currentPage = 1
                this.showChart = false
                this.showDetail = false
                 let params = {
                    geojson:JSON.stringify(this.realGeo),
                    meter:this.widthNum,

                }
                this.showLoad = true
                axios.post(this.$interApi.querybuffercount,params)
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
                // axios.post(this.$interApi.glandList,params).then((res)=>{
                //     this.showLoad = false
                //     if(res.data.res == 1){
                //         this.resultVisible = true
                //         this.resultBodyVisible = true
                //         this.tableData = res.data.result.data
                //     }else{
                //         this.$message.warning('Loading ..');
                //     }
                // }).catch(()=> {
                //     this.showLoad = false
                //     this.$message.error('Loading ..');
                // })
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
            // 定位图形
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
                let params = {
                    geojson:JSON.stringify(this.realGeo),
                    meter:this.widthNum,

                }
                this.showChart = true
                axios.post(this.$interApi.glandList,params)
                .then(res=>{
                 let result = res.data.result.data
                  let codeArray = result.map(item=>item.dlbm)
                  let countArray = result.map(item=>item.yzmj)
                  axios.get("config/zidian.json", { responseType: "json" })
                  .then(res=>{
                    let arr = []
                    let arr2 = []
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
                    result.forEach(e=>{
                       let flag = false
                      for (var key in res.data){
                        if(key == e.dlbm){
                          arr2.push({dlbm:res.data[key],yzmj:e.yzmj})
                          flag = true
                        }
                      }
                      if(!flag){
                        arr2.push({dlbm:"其他",yzmj:e.yzmj})
                      }
                    })
                    let nameData = arr,areaData = countArray;
                    this.tableData2 = arr2
                    //图表-地类编码统计
                  let countOption = {
                      color: ['#5e9df7', '#ad2f2d'],
                      title : {
                          text: '地类统计',
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
                      // legend: {
                      //     x: 'center',
                      //     y: 'bottom',
                      //     data:['面积']
                      // },
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
                              name: '面积',
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
                              name:'面积',
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
                        this.countChart = this.$echarts.init(this.$refs.echart);
                        
                        this.countChart.setOption(countOption);
                    })
                  })
                    })
                
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
            }
        },
        destroyed() {
            if(this.$map.getLayer('bufferLayer')) this.$map.removeLayer("bufferLayer");
            if(this.$map.getLayer('uploadLayer')) this.$map.removeLayer("uploadLayer");
            if(this.$map.getSource('bufferid')) this.$map.removeSource("bufferid");
            if(this.$map.getSource('uploadid')) this.$map.removeSource("uploadid");
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
        margin-top:15px;
    }
    .queryCon .btnBox{
        text-align: left;
    }
    .queryCon .btnBox .el-radio{
        margin-right:5px;
    }
    .queryCon .el-row .el-col{
        margin-bottom: 10px;
    }
    .queryCon .el-row label{
        display: inline-block;
        width: 40%;
        text-align: right;
        padding-right:5px;
        box-sizing: border-box;
        font-size: 12px;
    }
    .queryCon .el-row .el-input{
        width:40%;
    }
    .queryCon .el-row span{
        padding-left:5px;
        font-size: 12px;
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
        justify-content: space-between;
        height: 600px;
    }
    
</style>
