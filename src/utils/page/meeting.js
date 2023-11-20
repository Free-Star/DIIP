export function getHeights() {

  //弹窗内元素高度判断
 var contentHeight = $(window).height() - 80;
  var moduleListHeight = contentHeight - $("ul.choose").outerHeight() - $(".functionMenu").outerHeight() - 50;
  var songListheight = contentHeight/2 - 105;
  $("#height01").slimScroll({
    height: moduleListHeight
  });
  $(".department>ul").slimScroll({
    height: moduleListHeight
  });
  $(".detailCon").slimScroll({
    height: moduleListHeight - 47
  })
}

export function itemClick(e) {
  let target = e.currentTarget
  if($(target).hasClass('online')) {
    debugger
    if($(target).hasClass("onlineSelected")) {
      $(target).removeClass("onlineSelected");
    }else {
      $(target).addClass("onlineSelected");
    }
  }else if($(target).hasClass("calling")) {
    if($(target).hasClass("callingSelected")) {
      $(target).removeClass("callingSelected");
    }else {
      $(target).addClass("callingSelected");
    }
  }else if($(target).hasClass("waitting")) {
    if($(target).hasClass("waittingSelected")) {
      $(target).removeClass("waittingSelected");
    }else {
      $(target).addClass("waittingSelected");
    }
  }

}



