import Icon from 'ol/style/Icon'
import { Circle as CircleStyle, Fill, Stroke, Style,Text } from "ol/style.js";
import canvg from "canvg"

export class StyleMirror {
  constructor(uiconfig) {
    this.uiconfig = uiconfig;
  }

  getDrawStyle() {
    return this.createStyle(this.uiconfig.drawStyle)
  }
  getNormalStyle() {
    return this.createStyle(this.uiconfig.normalStyle)
  }
  getHighLightStyle() {
    return this.createStyle(this.uiconfig.highLightStyle)
  }
  getBufferStyle() {
    return this.createStyle(this.uiconfig.bufferStyle)
  }
  getSearchStyle(){
    return this.createStyle(this.uiconfig.searchStyle)
  }
  getMakerStyle(text){
    return new Style({
      image:this.createImage(this.uiconfig.makerStyle.image.type,this.uiconfig.makerStyle.image.options),
      text: new Text({
        text: text,
        offsetY:-0.5,
        font:"bold 12px Times New Roman",
        fill: new Fill({
            color: '#fff'
        })
      })
    })
  }
  getHighMakerStyle(text){
    return new Style({
      image:this.createImage(this.uiconfig.highMakerStyle.image.type,this.uiconfig.highMakerStyle.image.options),
      text: new Text({
        text: text,
        font:"bold 12px Times New Roman",
        fill: new Fill({
            color: '#fff'
        })
      })
    })
  }
  getSortCircleStyle(text){
    return this.createStyle(this.uiconfig.sortCircleStyle,text)
  }
  getDistributeStyle(){
    return this.createStyle(this.uiconfig.distributeStyle)
  }
  getMeasureStyle(){
    return this.createStyle(this.uiconfig.measureStyle)
  }
  getEnforcementStyle(type) {
    if(type == 0){
      return this.createStyle(this.uiconfig.enforcementStyle1)
    }else{
      return this.createStyle(this.uiconfig.enforcementStyle2)
    }
  }
  createStyle(styleData,text){
    let strokeColor =
    styleData.stroke.color ||
      this.createColorLike(styleData.stroke.pattern);
    let fillColor =
    styleData.fill.color || this.createColorLike(styleData.fill.pattern,text);
    return new Style({
      stroke:this.createStroke(strokeColor,styleData.stroke.width,styleData.stroke.lineDash),
      fill:this.createFill(fillColor),
      image:this.createImage(styleData.image.type,styleData.image.options)

    });
  }
  createCanvas(width,height) {
    let canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.width = width;
    canvas.height = height;
    document.getElementsByTagName("body")[0].appendChild(canvas);
    return canvas;
  }
  createColorLike(pattern,text) {
    let canvas = this.createCanvas(8,8);
    let ctx = canvas.getContext("2d");
    let color
    if (pattern.type == "gradientBlue") {
      ctx.fillStyle = "blue";
      ctx.fillRect(0, 0, 4, 4);
      ctx.fillRect(4, 4, 4, 4);
      ctx.fillStyle = "skyblue";
      ctx.fillRect(0, 4, 4, 4);
      ctx.fillRect(4, 0, 4, 4);
      color = ctx.createPattern(canvas, "repeat");
    }
    if (pattern.type == "gradientRed") {
      ctx.fillStyle = "rgb(53, 51, 51)";
      ctx.fillRect(0, 0, 4, 4);
      ctx.fillRect(4, 4, 4, 4);
      ctx.fillStyle = "rgb(252, 34, 6)";
      ctx.fillRect(0, 4, 4, 4);
      ctx.fillRect(4, 0, 4, 4);
      color = ctx.createPattern(canvas, "repeat");
    }
    if (pattern.type == "gradientSort") {
      if(!text){
        text = ""
      }
      canvas.width = 30;
      canvas.height = 30;
      //背景
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //圆
      ctx.fillStyle = 'rgba(102, 0, 102, 0.5)';
      ctx.beginPath();
      ctx.arc(15, 15, 8, 0, 2 * Math.PI);
      ctx.fill();
      //文字
      ctx.font="10px Arial"
      ctx.fillStyle = 'white';
      ctx.fillText(text,12, 18);
      color = ctx.createPattern(canvas, 'repeat');
    }
    return color
  }
  createStroke(color, width, lineDash) {
    return new Stroke({
      color,
      width,
      lineDash
    });
  }
  createFill(color) {
    return new Fill({
      color
    });
  }
  createImage(type, options) {
    if (type == "circle") {
      return new CircleStyle({
        radius: options.radius,
        fill: new Fill({
          color: options.color
        })
      });
    } else if (type == "location") {
      let svg = `<svg t="1573192339659" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2753" width="64" height="64">'+
        '<path stroke="white" stroke-width="20" d="M774.826667 365.226667c0 117.76-194.56 392.533333-245.76 464.213333-6.826667 8.533333-18.773333 8.533333-25.6 0C450.56 757.76 256 482.986667 256 365.226667 256 230.4 372.053333 119.466667 515.413333 119.466667s259.413333 110.933333 259.413334 245.76z" fill="${options.color}" p-id="2754"></path>'
        +'<path d="M208.213333 841.386667a307.2 76.8 0 1 0 614.4 0 307.2 76.8 0 1 0-614.4 0Z" fill="${options.color}" opacity=".7" p-id="2755"></path></svg>`
      let canvas=this.createCanvas(20,20);
      canvg(canvas,svg)
      let src = canvas.toDataURL('image/jpg')
      return new Icon({
        src ,
        // color:options.color,
        scale:0.6,
        anchor:[0.5,0.4]
      });
    }
  }
}
