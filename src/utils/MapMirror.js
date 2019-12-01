/*地图类， 从配置*/
import {Map, View} from "ol";
import {register} from 'ol/proj/proj4';
import {get as getProjection} from 'ol/proj.js';
import proj4 from 'proj4'
import mapUtils from "./mapUtils";
import TileGrid from "ol/tilegrid/TileGrid";
import {defaults as interactionDef} from 'ol/interaction.js';


export class MapMirror {
    constructor(mapDiv, mapConfig) {
        this.mapDiv = mapDiv;
        this.mapConfig = mapConfig;
    }

    init(landType) {
        let {epsg: epsgConfig, proj: projConfig, extent: extentConfig} = this.mapConfig.projection;
        this.proj4Register(epsgConfig, projConfig);
        let projection = getProjection(epsgConfig);
        if (extentConfig && extentConfig != "none") {
            projection.setExtent(extentConfig);
        }


        let {rows, origin, lods} = this.mapConfig;
        let resolutions = []
        for(let i=0;i<lods.length;i++){
            resolutions.push(lods[i].resolution)
        }
        let tileGrid = new TileGrid({
            tileSize: rows,
            origin: origin,
            resolutions: resolutions
        });

        this.map = new Map({
            target: this.mapDiv,
            view: new View({
                projection: projection,
                displayProjection: projection,
                center: [0, 0],
                zoom: 0
            }),
            interactions: interactionDef({
                doubleClickZoom: false,   //屏蔽双击放大事件
            })
        });
        this.map.tileGrid = tileGrid;
        this.initView();
        this.generateBaseLayers(landType);
        return this.map;
    }

    async proj4Register(epsg, pro) {
        proj4.defs(epsg, pro);
        register(proj4);
    }

    initView() {
        let {center, initLevel, initExtent} = this.mapConfig;
        if (initExtent && initExtent != "none") {
            this.map.getView().fit(initExtent);
        } else {
            this.map.getView().animate({zoom: initLevel}, {center: center});
        }
    }

    generateBaseLayers(landType) {
        // 预审分类地图
        if (landType) {
            let baselayer = landType;
            this.initBaselayer(baselayer)
            return
        }
        //地图
        let {baseLayers} = this.mapConfig;
        for (let i = 0, baselayer; i < baseLayers.length; i++) {
            baselayer = baseLayers[i]
            this.initBaselayer(baselayer)
        }
    }

    initBaselayer(group) {
        let projection = this.map.getView().getProjection();
        let tileGrid = this.map.tileGrid;
        let baselayer = group.Layers
        for(let i=0;i<baselayer.length;i++){
            if (baselayer[i].type === 'WebTiledLayer') {
                mapUtils.createXYZTileLayer(this.map, {
                    url: baselayer[i].url,
                    name: baselayer[i].name,
                    projection: projection,
                    tileGrid: tileGrid
                }).then((layer)=>{
                    this.setProperty(group,layer)
                });
            } else if (baselayer[i].type === 'ArcGISTiledMapServiceLayer') {
                mapUtils.createXYZTileLayer(this.map, {
                    url: baselayer[i].url,
                    name: baselayer[i].name,
                    projection: projection, tileGrid: tileGrid
                }).then((layer)=>{
                    this.setProperty(group,layer)
                });
            } else if (baselayer[i].type === "ArcGISDynamicMapServiceLayer") {
                mapUtils.createESRIDynamicMapLayer(this.map, {
                    url: baselayer[i].url,
                    name: baselayer[i].name,
                    projection: projection
                }).then((layer)=>{
                    this.setProperty(group,layer)
                });
            } else if (baselayer[i].type === "WMSLayer") {
                // todo
            }
        }
    }
    setProperty(group,layer) {
        layer.isBaseLayer = true;
        let baselayer = group.Layers
        for(let i=0;i<baselayer.length;i++) {
            layer.layerName = baselayer[i].layerName;
            layer.layerGroup = group.GroupName ? group.GroupName : "";
            if (baselayer[i].layerName) {
                layer.id = baselayer[i].layerName;
            }
            if (baselayer[i].opacity) {
                layer.opacity = baselayer[i].opacity;
            }
        }
    }

    getMap() {
        return this.map;
    }
}
