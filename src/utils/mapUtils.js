/* eslint-disable */
import 'ol/ol.css';
import {Image as ImageLayer} from 'ol/layer';
import VectorLayer from 'ol/layer/VectorTile';
import VectorSource from 'ol/source/VectorTile';
import XYZ from 'ol/source/XYZ';
import {MVT} from 'ol/format'
import {ImageArcGISRest} from 'ol/source';
import fetch from "node-fetch";
import stylefunction from 'ol-mapbox-style/stylefunction';
import {applyStyle} from 'ol-mapbox-style';
import {applyBackground} from 'ol-mapbox-style';
import olms from 'ol-mapbox-style';
import TileLayer from "ol/layer/Tile";

/* 地图工具类，不要试图在本类存放任何数据并读取，本类不是地图实例类，使用时不作为单个实例运行*/

const mapConsole = (map) => {
    map.on("moveend", function (e) {
            let zoom = map.getView().getResolution();  //获取当前地图的缩放级别
            console.log(zoom);
        }
    );
    return map;
}
const createVectorTileLayer = async (map, url) => {
    const styleUrl = url;

    fetch(styleUrl).then(function (response) {
        //todo 修改projection 从地图获取
        response.json().then(function (glStyle) {
            const layer = new VectorLayer({
                projection: 'EPSG:4326',
                declutter: true,
                source: new VectorSource({
                    projection: 'EPSG:4326',
                    format: new MVT(),
                    url: glStyle.sources['emap'].tiles[0].toString(),
                    crossOrigin: 'anonymous',   //允许跨域
                })
            });

            fetch(glStyle.sprite.toString() + '.json').then(function (response) {
                response.json().then(function (spStyle) {
                    stylefunction(layer,
                        glStyle,
                        'emap',
                        [1.40625, 0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625, 0.000171661376953125, 0.0000858306884765625, 0.00004291534423828125, 0.000021457672119140625, 0.000010728836059570312, 0.000005364418029785156, 0.000002682209014892578, 0.000001341104507446289, 6.705522537231445e-7],
                        spStyle,
                        glStyle.sprite.toString() + '.png'
                    );
                    map.addLayer(layer);
                });
            });

        });
    });
    return map;
};
const createESRIDynamicMapLayer = async (map, options) => {
    let {url, projection, name} = options;
    let layer =
        new ImageLayer({
            source: new ImageArcGISRest({
                ratio: 1,
                params: {},
                url: url,
                projection: projection,
                crossOrigin: 'anonymous',   //允许跨域
            })
        })
    ;
    map.addLayer(layer);
    layer.name = name;
    return layer;
};
const createXYZTileLayer = async (map, options) => {
    let {url, projection, tileGrid, name} = options;
    let layer = new TileLayer({
        source: new XYZ({
            projection: projection,
            url: url,
            tileGrid: tileGrid,
            crossOrigin: 'anonymous',   //允许跨域
        })
    });
    map.addLayer(layer);
    layer.name = name;
    return layer;
};

export default {createVectorTileLayer, createESRIDynamicMapLayer, createXYZTileLayer};
