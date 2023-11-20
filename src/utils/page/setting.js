import BScroll from 'better-scroll'
export function getHeights() {
	//  高度判断
	  var windowHeight = $(window).height();
	  var maxHeight = windowHeight - $(".sysName").outerHeight(); 
	  var contentHeight = $(".content").outerHeight()
	  var popUp = $(".popUp")
	  var popUpHeight = 0
	  if (popUp.length>0){
	  popUpHeight = popUp[0].offsetTop + popUp[0].offsetHeight
          contentHeight = Math.max( contentHeight,popUpHeight)
	  }
	  
	if(popUpHeight > contentHeight)
        {
                  $(".content").css('height',popUpHeight)
        }
	  else if(contentHeight > maxHeight)
	{
		  $(".content").css('height',contentHeight)
	}
}
