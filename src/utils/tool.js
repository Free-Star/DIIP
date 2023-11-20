/** 2018-3-29 0029
  * author: Legal High
  * function: 通用工具
  */
import vue from 'vue'
// 是否为数组
export function isArray(obj)  {
  if(Array.isArray){
    return Array.isArray(obj);
  }else{
    return Object.prototype.toString.call(obj) === "[object Array]";
  }
}
// 是否为对象
export function isObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}
// 是否为字符串
export function isString(obj) {
  return Object.prototype.toString.call(obj) === "[object String]";
}

// 返回状态
vue.prototype.returnClass = function(deviceState) {
  switch (deviceState) {
    case 'registered':
      return 'online';
    case 'ringing':
      return 'waitting';
    case 'active':
      return 'calling'
    default:
      return 'online';
  }
}
// 返回class
vue.prototype.returnState = function(deviceState) {
  switch (deviceState) {
    case 'registered':
      return '在线';
    case 'ringing':
      return '振铃';
    case 'active':
      return '通话'
    default:
      return '在线'
  }
}
// 控制录音播放状态  
vue.prototype.recordPlay = function(recordState) {
  switch (recordState) {
    case '播放':
      return 'fa fa-play';
    case '暂停':
      return 'fa fa-pause';
    default:
      return 'fa fa-play';
  }
}
// 控制音乐播放状态
vue.prototype.ifPlay = function(playState) {
  switch (playState) {
    case '继续播放':
      return 'fa fa-play fa-2x';
    case '暂停':
      return 'fa fa-pause fa-2x';
    default:
      return 'fa fa-pause fa-2x';
  }
}
//
vue.prototype.songlist = function(listid) {
  return listid;
}
