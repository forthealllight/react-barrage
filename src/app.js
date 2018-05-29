import './common/css/common.css';
import React from 'react';
import {render} from 'react-dom';
import Barrage from './components/barrage';
import Barra from './components/barra';
//Mobile terminal adaptive
import initialSize from './utils/flexiable';
initialSize(window, window['lib'] || (window['lib'] = {}));
const list=[
  "微信公众号smallBj520",
  "今晚有没有LOL的一块啊？",
  "这种烟真心不好抽",
  "星期天我想去爬长城",
  "边喝酒边看电影",
  "春天来咯一块爬山去，谁去啊？"
];
const colorConfig={
  random:false,
  colorList:['red']
}
render(<Barra barrageList={list} color={colorConfig}/>,document.getElementById('app'));
