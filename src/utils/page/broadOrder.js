export function getHeights() {
  //高度判断
  var contentHeight = $(window).height() - 130;
  $("#textarea01").height(contentHeight - 300)
  $("#songListHeight").slimScroll({
    height: contentHeight  - 320
  });
  $(".gaodu>ul").slimScroll({
    height: contentHeight / 2 - 220
  });

	  $("#height07").slimScroll({
		      height: contentHeight / 2 - 220
		    });
          $("#height10").slimScroll({
                      height: contentHeight / 2 - 170
                    });
          $("#height11").slimScroll({
                      height: contentHeight / 2 - 170
                    });
          $("#height12").slimScroll({
                      height: contentHeight / 2 - 170
                    });
	  $("#height04").slimScroll({
		      height: contentHeight / 2 - 170
		    });
	  $("#height05").slimScroll({
		      height: contentHeight / 2 - 170
		    });
	  $("#height06").slimScroll({
		      height: contentHeight / 2 - 170
		    });
	  $("#height08").slimScroll({
		      height: contentHeight - 138
		    });
	  $("#height09").slimScroll({
		      height: contentHeight - 257
		    });
}
