import Vue  from 'vue'

/*
 $("document").ready(function () {//高度判断
 var contentHeight;
 var numListHeight;//拨号显示区
 var moduleListHeight;//设备显示区
 var orgList//视频成员列表显示区
 if ($(window).width() > 996) {
 contentHeight = $(window).height() - 130;
 numListHeight = contentHeight - $(".phoneTitle").outerHeight() - $(".phoneDial").outerHeight() - 20;

 orgList = contentHeight - 142;

 } else {
 contentHeight = $(window).height() - 50;
 numListHeight = contentHeight - $(".phoneDial").outerHeight() - $(".functionMenu").outerHeight()-50;

 }

 $(".content").height(contentHeight);
 $(".numList>div").slimScroll({
 height: numListHeight
 });

 $(".orgList").slimScroll({
 height: orgList
 })

 $(".dialDisplay>div").click(function () {
 var aa = "";
 aa += $(this).html();
 $("#bb").append(aa);
 })
 $(".headMenu>i").click(function () {//手机菜单
 if ($("ul.headMenuList").hasClass("menuShow")) {
 $("ul.headMenuList").removeClass("menuShow").addClass("menuHide");
 } else {
 $("ul.headMenuList").removeClass("menuHide").addClass("menuShow");
 }
 })
 })*/
  /* $("document").ready(function (){

   function ui(item,activeStyle,normalStyle) {
     $(item).onmousedown(function(){
       $(this).css(style);
     })
     $(item).onmouseup(function(){
       $(this).css(style);
     })}
     ui(".dial","'background','#575E64'","'background,none'");
     ui("ul.nav li","'color','#575E64'","'background,none'")

    }
  ) */


function menu() {
  $(".span_large").click(function () {
    $(this).toggleClass("span_largeSelected");
    $(".deviceStatus").slideToggle();
  })
}

/*
 $(function () {
 //tab切换
 function tabs(tabTit, on, tabCon) {
 $(tabCon).each(function () {
 $(this).children().hide();
 $(this).children().eq(0).show();
 });
 $(tabTit).each(function () {
 $(this).children().eq(0).addClass(on);
 });
 $(tabTit).children().click(function () {
 $(this).addClass(on).siblings().removeClass(on);
 var index = $(tabTit).children().index(this);
 $(tabCon).children().eq(index).show().siblings().hide();
 });
 }
 tabs("[data-name=title]", "on", "[data-name=con]");
 });
 */
