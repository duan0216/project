import vue from 'vue'
// 公有变量

export const store =  vue.observable({
  //导航状态
  activeMenuIndex:'approvalDecision',
  activeCommonMenuIndex:'resourceBrowsing',
  // 行政选择组件切换
  xingzheng: false,
  //资源浏览已加载图层
  RBLoadedLayers:[],
  //资源浏览已选择tree
  RBLoadedTree:[],
  //属性查询组件切换
  layerOption:false,
  //监听清除
  clearLayersChange:0
});
export const mutation = {
  setMenuIndex(activeMenuIndex) {
    store.activeMenuIndex = activeMenuIndex
  },
  setCommonMenuIndex(activeCommonMenuIndex) {
    store.activeCommonMenuIndex = activeCommonMenuIndex
  },
  setXingzheng( xingzheng ){
    store.xingzheng = xingzheng;
  },
  setRBLoadedLayers(RBLoadedLayers){
    store.RBLoadedLayers = RBLoadedLayers
  },
  setRBLoadedTree(RBLoadedTree){
    store.RBLoadedTree = RBLoadedTree
  },
  setLayerOption(layerOption){
    store.layerOption = layerOption
  },
  setClearLayersChange(clearLayersChange){
    store.clearLayersChange = clearLayersChange
  },
}
// 引入
// import { store,  mutation} from  '../../store'
// 取值
// 定义
// computed: {
//   testCount(){
//       return store.count
//   }
// },
// 方法
// console.log(this.testCount)
// console.log(store.count1)


// 改值
// 定义
// setCount: mutation.setCount,
// 方法
// this.setCount(123)


// 多用途方法
// var a = this.testCount
// this.testCount.push(a)
// this.testCount = a
