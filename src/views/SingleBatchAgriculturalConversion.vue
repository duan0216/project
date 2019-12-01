<template>
  <!-- 单个详情单个详情单个详情 -->
  <!-- 详情详情详情详情详情详情 -->
  <div class="customDialog" v-if="detailVisible" :class="!detailBodyVisible?'hideBody':''">
    <!-- 土地供应对应的详情页 -->
    <template >
      <div class="dialogHead">
        土地供应详情
        <span class="titleBtn">
                <i class="el-icon-full-screen" title="收缩" @click="closeDialog(1)"></i>
                <i class="el-icon-close" title="关闭" @click="closeDialog(0)"></i>
            </span>
      </div>
      <div class="dialogBody" v-show="detailBodyVisible">
          <el-form class="lineTwoForm" :label-position="labelPosition" label-width="160px" size="mini">
            <el-form-item>


            </el-form-item>
          </el-form>
      </div>
    </template>
  
   
 
    <div class="dialogFoot" v-show="detailBodyVisible">
      <div class="btnBox">
        <el-button @click="reback" style="margin-left: 20px;">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<script>


import axios from "axios"
export default {
  components: {
    // olmap
  },
  props: [
    'isShowDialog',
    'toggleBody',
    'result'
  ],
  data() {
    return {
      // 表单与对齐
      labelPosition: "right",
      detailData: {},
      detailVisible:true,
      detailBodyVisible:this.toggleBody,

    };
  },
  filters: {

  },
  computed: { 
    // 土地整治
   
    
   
  },
  mounted() {
    this.getCodesName()

  },
  methods: {
      getCodesName() {
          //获取行政区
          
          //获取名称代码


      },
    closeDialog(type) {
      if(type == 0){
        this.$emit('close');
      }
      if(type == 1){
        this.detailBodyVisible = !this.detailBodyVisible
        this.$emit('update:toggleBody',this.detailBodyVisible);
      }
    },
    //返回
    reback() {
      this.$emit('close');
    },
    // 进入组件获取盒子高度
    getData() {
      this.detailData = this.result;
    },
  }
};
</script>

<style scoped lang="scss">
  .customDialog{
    left:426px;
    right:0;
    transform: translate(0,0);
    bottom: 0;
  }
  .customDialog .dialogBody{
      padding:15px 30px;
  }
.xiangqing > p {
  font-size: 16px;
  /* line-height: 28px; */
  color: #1c65b9;
  font-weight: 900;
  margin: 5px 0 5px 5px;
}
.xiangqing > p > span {
  display: inline-block;
  width: 28px;
  height: 28px;
  background: rgb(255, 187, 0);
  text-align: center;
  margin-right: 5px;
}
</style>
