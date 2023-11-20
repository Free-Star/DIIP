export function getHeights() {
  //高度判断
  var contentHeight = $(window).height() - 184;
  $("#height01").height(contentHeight);
  $("#height02").height(contentHeight);
}

export function itemClick(e) {
  $(".singleDevice").removeClass("moveRightMiddle").addClass("moveLeftMiddle");
  $(".allDevice").removeClass("moveRightDev").addClass("moveLeftDev");
}
