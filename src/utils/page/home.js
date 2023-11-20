export function getHeights() {
         //  高度判断
           var contentHeight = $(window).height();
           var menuHeight = $(".menubanner").outerHeight()
	   $('.orgTreeList').css('top',menuHeight)
	   $('.openTreeList').css('top',menuHeight)
}
