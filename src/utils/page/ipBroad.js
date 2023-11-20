export function getHeights() {
  //高度判断
  var contentHeight = $(window).height() - 80;
  var moduleListHeight = contentHeight - $("ul.choose").outerHeight() - $(".functionMenu").outerHeight() - 50 ;
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
  $("#end").slimScroll({
    height: contentHeight - 140
  })
  $("#songListHeight").slimScroll({
    height: songListheight - 50
  })
  $(".hh").slimScroll({
    height: songListheight-40
  })
  $("span.songSheetTool").click(function () {
    $(this).parents("songSheetName").toggleClass("songSheetNameSelect");

  })
}

export function itemClicks(e) {
  let target = e.currentTarget
  if ($(target).hasClass("online")) {
    $(".calling").removeClass("callingSelected");
    $(target).addClass("onlineSelected");
    var txt = $(target).children(".moduleNum").text();
    var dd = "<div class='singleFlies selectDelate'>" + txt + "</div>";
    $("#end").append(dd);
    $(".playList").removeClass("ListHide").addClass("ListShow");
  }
  else if ($(target).hasClass("calling")) {
    $(".online").removeClass("onlineSelected");
    $("#a2").addClass("disabled");
    $("#a3").addClass("disabled");
    $(target).addClass("callingSelected");
    $(".playList").removeClass("ListShow").addClass("ListHide");

  }


}
