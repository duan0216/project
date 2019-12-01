<template>
    <div id="map" ref="rootmap" ></div>
</template>
<script>
import Vue from 'vue'
import "ol/ol.css"
import {MapMirror} from "../utils/MapMirror";
// import {store, mutation} from  '../store'
import SwitchMap from './SwitchMap'
// import mapboxgl from 'mapbox-gl'



export default {
    components: {
        // SwitchMap
    },
    data() {
        return {
            map: null,

        }
    },
    mounted() {
        //初始化地图
        let styles = {
            "conventional" : 'mapjson/basic.json',
            "molv" : 'mapjson/molv.json',
            "kehuan" : 'mapjson/kehuan.json',
            "danzi" : 'mapjson/danzi.json',
            "qinxin" : 'mapjson/qinxin.json'
        }
        mapboxgl.accessToken = 'pk.eyJ1IjoieGlhb2R1YW4iLCJhIjoiY2szaDcxNTY1MDh0ZjNicXR4MWozYWxyeCJ9.bjuObhZc8CWU7nW5Y2j4fg'
        var map = new mapboxgl.Map({
            container: 'map',
            // style: styles["conventional"],
            style:'mapbox://styles/mapbox/streets-v10',
            center: [112.533675375868, 27.4192424326351],
            zoom: 7,
        });


        Vue.prototype.$map = map
        // map.setMaxZoom(14.8);

        var nav = new mapboxgl.NavigationControl({
            showCompass: true,
            showZoom: true
        });
        map.addControl(nav, 'bottom-right');

        // 使用定位模块

         function getPolygonBoundingBox(feature) {
            // bounds [xMin, yMin][xMax, yMax]
            var bounds = [[], []];
            var polygon;
            var latitude;
            var longitude
            for (var i = 0; i < feature.geometry.coordinates.length; i++) {
                if (feature.geometry.coordinates.length === 1) {
                    // Polygon coordinates[0][nodes]
                    polygon = feature.geometry.coordinates[0];
                } else {
                    // Polygon coordinates[poly][0][nodes]
                    polygon = feature.geometry.coordinates[i][0];
                }
 
                for (var j = 0; j < polygon.length; j++) {
                    longitude = polygon[j][0];
                    latitude = polygon[j][1];
                    bounds[0][0] = bounds[0][0] < longitude ? bounds[0][0] : longitude;
                    bounds[1][0] = bounds[1][0] > longitude ? bounds[1][0] : longitude;
                    bounds[0][1] = bounds[0][1] < latitude ? bounds[0][1] : latitude;
                    bounds[1][1] = bounds[1][1] > latitude ? bounds[1][1] : latitude;
                }
            }
 
            return bounds;
        }
        let feature = {
        type: 'Feature',
        geometry:{
        type:"Polygon",
        coordinates:[[[112.03580479109,28.1142260688939],[112.03580479109,28.3341205439797],[112.416517613627,28.3341205439797],[112.416517613627,28.1142260688939],[112.03580479109,28.1142260688939]]]
        }
       }
        map.on('load',()=>{
          let boundingBox = getPolygonBoundingBox(feature)
        map.fitBounds(boundingBox, { padding: 20 });
        // map.addSource('geojson', {
        // "type": "geojson",
        // "data": feature
        // });
        // setTimeout(()=>{
        //   map.addLayer({
        //   'id': 'maine',
        //   'type': 'fill',
        //   'source':  'geojson',
        //   'layout': {},
        //   'paint': {
        //    'fill-color': 'red',
        //    'fill-opacity': 0.8
        //    }
        //  })

       
        // },1000)
        })




        // 加载geojson
        

   
    





    },

    methods: {

        // setMapSubject: mutation.setMapSubject,
    },
    computed: {
        // testCount(){
        //     return store.mapSubject
        // }
    }
}
</script>
<style lang="scss">

    @import url('https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css');
    #map{position: absolute;height: 100%;left:346px;right:0;background-color: #EDF1F4}
    /*隐藏ol的一些自带元素*/
    .ol-attribution,.ol-zoom { display: none;}
    // 绘图工具栏样式
    .mapboxgl-ctrl-top-right>.mapboxgl-ctrl-group{
        width: 140px;
        justify-content: space-around;
        display: flex;
        position: fixed;
        left: 165px;
        top: 182px;
    }
</style>

