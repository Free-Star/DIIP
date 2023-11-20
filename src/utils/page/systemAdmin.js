export function getHeights() {

  //高度判断
  var contentHeight = $(window).height() - 190;
  $("#textarea01").height(contentHeight - 300)
  $("#height08").slimScroll({
    height: contentHeight - 66
  });
  $("#height09").slimScroll({
    height: contentHeight - 355
  });
}
