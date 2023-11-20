export function getHeights() {
        //  高度判断
          var windowHeight = $(window).height();
          var maxHeight = windowHeight - $(".sysName").outerHeight();
          var contentHeight = $(".table").outerHeight()
          var popUp = $(".popUp")
          var popUpHeight = 0
          if (popUp.length>0){
	  console.log(popUp,maxHeight,contentHeight,popUpHeight)
          popUpHeight = popUp[0].offsetTop + popUp[0].offsetHeight
          contentHeight = Math.max( contentHeight,popUpHeight)
	  console.log(popUp,maxHeight,contentHeight,popUpHeight)
          }

          if( contentHeight > maxHeight)
        {
		  console.log(popUp,maxHeight,contentHeight,popUpHeight)
                  $(".content").css('height',contentHeight)
        }
}
