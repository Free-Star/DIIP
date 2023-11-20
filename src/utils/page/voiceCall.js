export function getHeights() {
  //高度判断
  var contentHeight = $(window).height() - 80;
  var moduleListHeight = contentHeight - $("ul.choose").outerHeight() - $(".functionMenu").outerHeight() -50;
  $("#height01").slimScroll({
    height: moduleListHeight
  });
  $(".department>ul").slimScroll({
    height: moduleListHeight
  });
  $(".detailCon").slimScroll({
    height: moduleListHeight-97
  })
  $("#end").slimScroll({
    height: contentHeight - 140
  });
}

export function itemClick(e) {
  let target = e.currentTarget
  if ($(target).hasClass("online")) {
    $(".calling").removeClass("callingSelected");
    $(".waitting").removeClass("waittingSelected");
    $(".calling01").removeClass("callingSelected");
    $("ul.menuList li").removeClass("disabled");
    $("#a3").addClass("disabled");
    $("#a4").addClass("disabled");
    $("#a5").addClass("disabled");
    $("#a6").addClass("disabled");
    $("#a7").addClass("disabled");
    $("#a8").addClass("disabled");
    $(target).addClass("onlineSelected");
    var txt = $(target).children(".moduleNum").text();
    var dd = "<div class='singleFlies selectDelate'>" + txt + "</div>";
    $("#end").append(dd);
    $(".playList").removeClass("ListHide").addClass("ListShow");
  }
  else if ($(target).hasClass("calling")) {
    $(".online").removeClass("onlineSelected");
    $(".waitting").removeClass("waittingSelected");
    $(".calling01").removeClass("callingSelected");
    $("ul.menuList li").removeClass("disabled");
    $("#a1").addClass("disabled");
    $("#a2").addClass("disabled");
    $("#a6").addClass("disabled");
    $("#a7").addClass("disabled");
    $("#a8").addClass("disabled");
    $("#a9").addClass("disabled");
    $(target).addClass("callingSelected");
    $(".playList").removeClass("ListShow").addClass("ListHide");
  }
  else if ($(target).hasClass("calling01")) {
    $(".online").removeClass("onlineSelected");
    $(".waitting").removeClass("waittingSelected");
    $(".calling").removeClass("callingSelected");
    $("ul.menuList li").removeClass("disabled");
    $("#a1").addClass("disabled");
    $("#a2").addClass("disabled");
    $("#a3").addClass("disabled");
    $("#a4").addClass("disabled");
    $("#a5").addClass("disabled");
    $("#a6").addClass("disabled");
    $("#a9").addClass("disabled");
    $(target).addClass("callingSelected");
    $(".playList").removeClass("ListShow").addClass("ListHide");
  }
  else if ($(target).hasClass("waitting")) {
    $(".online").removeClass("onlineSelected");
    $(".calling").removeClass("callingSelected");
    $(".calling01").removeClass("callingSelected");
    $("ul.menuList li").removeClass("disabled");
    $("#a1").addClass("disabled");
    $("#a2").addClass("disabled");
    $("#a3").addClass("disabled");
    $("#a4").addClass("disabled");
    $("#a5").addClass("disabled");
    $("#a7").addClass("disabled");
    $("#a8").addClass("disabled");
    $("#a9").addClass("disabled");
    $(target).addClass("waittingSelected");
    $(".playList").removeClass("ListShow").addClass("ListHide");
  }
}

