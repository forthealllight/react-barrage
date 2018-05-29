import './index.less'
import React from 'react';
import {findDOMNode} from 'react-dom';
export default class Barrage extends React.Component{
  constructor(props){
    super(props);
    this.myCanvas=React.createRef();
  }
  componentDidMount(){
    let _this=this;
    let canvas=findDOMNode(_this.myCanvas.current);
    let rect=canvas.getBoundingClientRect();
    let width=rect.right-rect.left;
    let height=rect.bottom-rect.top;
    let ctx=canvas.getContext('2d');
    ctx.font='20px Microsoft YaHei';
    _this.width=width;
    _this.height=height;
    _this.ctx=ctx;
    _this.barrageList=[];
    requestAnimationFrame(_this.draw.bind(_this));
    const textList = ['弹幕', '666', '233333333',
      'javascript', 'html', 'css', '前端框架', 'Vue', 'React',
      'Angular','测试弹幕效果'
    ];
    textList.forEach((t) => {
        _this.shoot(t);
    });
  }
  // add barrage
  shoot(value){
    let _this=this;
    let top=_this.getTop();
    let color=_this.getColor();
    let offset=_this.getOffset();
    let barrageList=_this.barrageList;
    let width=Math.ceil(_this.ctx.measureText(value).width);
    let barrage={
      value:value,
      top:top,
      left:_this.width,
      color:color,
      offset:offset,
      width:width
    }
    barrageList.push(barrage);
  }
  //draw
  draw(){
    let _this=this;
    let barrageList=_this.barrageList;
    if(barrageList.length){
      _this.ctx.clearRect(0,0,_this.width,_this.height);
      for(let i=0;i<barrageList.length;i++){
        let b=barrageList[i];
        if(b.left+b.width<=0){
          _this.shoot(barrageList[i].value);
          barrageList.splice(i,1);
          continue;
        }
        b.left-=b.offset;
        _this.drawText(b);
        _this.ctx.restore();
      }

    }
    requestAnimationFrame(_this.draw.bind(_this));
  }
  //start draw
  drawText(barrage){
    let _this=this;
    let _ctx=_this.ctx;
    _ctx.fillStyle=barrage.color;
    _ctx.fillText(barrage.value,barrage.left,barrage.top);
    // _ctx.strokeStyle=barrage.color;
    // _ctx.strokeRect(barrage.left,barrage.top,barrage.width,-30);
  }
  //color
  getColor(){
    //random
    return '#'+Math.floor(Math.random()*0xffffff).toString(16);
  }
  //be relative to the Top Left corner
  getTop(){
    return 30
  }
  // offset
  getOffset(){
    //random
    return +(Math.random()*4).toFixed(1)+1;
  }
  render(){
    return <div className="m-barrage">
             <canvas className="m-barrage-canvas" ref={this.myCanvas}></canvas>
           </div>
  }

}
