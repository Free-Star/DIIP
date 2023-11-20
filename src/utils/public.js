/** 2018-1-16
 * author: Legal High
 * function: 全局公用方法
 */
import vue from 'vue'
import $ from 'jquery'

// 1、公用分页切换方法
vue.prototype.tabClick = function (e) {
  $(e.target).addClass('on').siblings().removeClass('on');
  var index = $('[data-name=title]').children().index(e.target);
  $('[data-name=con]').children().eq(index).show().siblings().hide();
}

// 2、按钮点击样式

vue.prototype.$btnMousedown = (event) => {
  let target = event.currentTarget
  $(target).css('background', '#575E64')
}

vue.prototype.$btnMouseup = (event) => {
  let target = event.currentTarget
  $(target).css('background', 'none')
}

// 3、公用表格单行点击方法
vue.prototype.TrClick = function(index) {
  debugger
  console.log($(".table>tbody>tr"))
  $(".table>tbody>tr").eq(index).toggleClass("selected")
}

