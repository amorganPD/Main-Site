var init = function() {
    var transformProp = Modernizr.prefixed('transform');
	
	var renderDiv = document.getElementById('renderDiv');
	var baseDiv = document.getElementsByClassName('platform').base;
	var backDiv = document.getElementsByClassName('platform').back;
	
	var offset = -baseDiv.offsetHeight/2 + (renderDiv.offsetHeight);
	baseDiv.style[ transformProp ] =  'translateY( ' + offset + 'px ) rotateX( 90deg )';
	backDiv.style[ transformProp ] =  'translateZ( ' + (-baseDiv.offsetHeight/2) + 'px ) translateY( ' + (renderDiv.offsetHeight*0.1) + 'px )';
	
	//prepare 3D carousel
	var carousel = document.getElementsByClassName('panel');
	var angle = 360/carousel.length;
	var radius = window.innerWidth*.8;
	var carouselShift = radius*1 + 1; // add 1 px to it so make it behind the panelFooter
	var zTranslate = [];
	var xTranslate = [];
	
	if (window.innerWidth < 600) {
		document.getElementsByClassName('carousel')[0].style[ 'left' ] = '0';
		document.getElementsByClassName('carousel')[0].style[ 'right' ] = '0';
	}
	
	document.getElementsByClassName('carousel')[0].style[ transformProp ] = 'translateZ( ' + -carouselShift + 'px ) translateY( 4.5em) ';
	for (var i=0; i< carousel.length; i++ ) {
		//calculate the x and y
		zTranslate.push(radius*Math.cos(angle*i*Math.PI/180));
		xTranslate.push(radius*Math.sin(angle*i*Math.PI/180));
		carousel[i].style[ transformProp ] =  'translateZ( ' + zTranslate[i] + 'px ) translateX( ' + xTranslate[i] + 'px ) rotateY( ' + angle*i + 'deg ) ';
	}
	document.getElementById('panelDot-0').toggleClassName('panelDotSelected');
	
	var panels = document.getElementsByClassName('panel');
	var currentPanel = 0;
	var panelTitles = ["", "Web App Projects", "Embedded Projects", "Concepts et al", "Tutorials",""];
	
	// change function to change a panel to index
	var changePanel = function(index) {
		// Check bounds
		index = parseInt(index); // cleanse it!
		if (index >= panels.length) {
			index=0;
		}
		else if (index < 0) {
			index = parseInt(panels.length - 1);
		}
		document.getElementById('panelDot-' + parseInt(currentPanel)).toggleClassName('panelDotSelected');
		currentPanel = index;
		document.getElementById('panelDot-' + parseInt(currentPanel)).toggleClassName('panelDotSelected');
		document.getElementsByClassName('carousel')[0].style[ transformProp ] = 'translateZ( ' + parseInt(-carouselShift) + 'px ) translateY( 4.5em) rotateY( ' + parseInt(-angle*currentPanel) + 'deg)';
		document.getElementById('titleHeader').innerHTML = panelTitles[currentPanel];
	}
	
	/****START Scrolling Section****/
	
	var scrollTranslateY = []; // used to maintain scroll height/translation
	// create click event for panel dots
	panelDotClass = document.getElementsByClassName('panelDot');
	for (i=0; i < panelDotClass.length; i++ ) {
		panelDotClass[i].addEventListener( 'click', function(evt){
			changePanel(parseInt(evt.currentTarget.id[evt.currentTarget.id.length-1]));
		}, false);
		scrollTranslateY.push(0);
	}
	
	// function to scroll to specified Y translation
	var scrollPanelTo = function(translateY) {
		// set currentPanel scroll Height
		scrollTranslateY[currentPanel]=translateY;
		// execute
		document.getElementById('panel-' + currentPanel).style[ transformProp ] = 'translateZ( ' + zTranslate[currentPanel] + 'px ) translateX( ' + xTranslate[currentPanel] + 'px ) rotateY( ' + angle*currentPanel + 'deg ) translateY(' + scrollTranslateY[currentPanel] + 'px)';
	}
	
	// scroll screen by translating panel
	document.body.onmousewheel = function(evt) {
		var diffHeight = (window.innerHeight*.8 - document.getElementById('panel-' + currentPanel).offsetHeight);
		if (evt.deltaY < 0) {
			scrollPanelTo(scrollTranslateY[currentPanel]+40);
		}
		else if (evt.deltaY > 0 && (scrollTranslateY[currentPanel] > diffHeight*1.2)) {
			scrollPanelTo(scrollTranslateY[currentPanel]-40);
		}
		if (scrollTranslateY[currentPanel] > 0) {
			scrollPanelTo(0);
		}
	};
	document.body.addEventListener("DOMMouseScroll", function(evt) {
		var diffHeight = (window.innerHeight*.8 - document.getElementById('panel-' + currentPanel).offsetHeight);
		if (evt.detail < 0) {
			scrollPanelTo(scrollTranslateY[currentPanel]+40);
		}
		else if (evt.detail > 0 && (scrollTranslateY[currentPanel] > diffHeight*1.2)) {
			scrollPanelTo(scrollTranslateY[currentPanel]-40);
		}
		if (scrollTranslateY[currentPanel] > 0) {
			scrollPanelTo(0);
		}
	}, false);
	// Scroll via touch move
	var previousTouchY = 0;
	var previousTouchX = 0;
	var firstTouchEvtY = 0;
	document.body.addEventListener('touchmove', function(event) {
		var touch = event.touches[0];
		var deltaY=0;
		var deltaX=0;
		if (firstTouchEvtY==1) {
			deltaY = (previousTouchY-touch.screenY);
			deltaX = (previousTouchX-touch.screenX);
			firstTouchEvtY=0;
			// only scroll if the gesture matches a scroll
			if (Math.abs(deltaY) > Math.abs(deltaX*.8)) {
				if (deltaY < -4) {
					scrollPanelTo(scrollTranslateY[currentPanel]+10);
				}
				else if (deltaY > 4 ) {
					scrollPanelTo(scrollTranslateY[currentPanel]-10);
				}
			}
		}
		else {
			previousTouchY=touch.screenY;
			previousTouchX=touch.screenX;
			firstTouchEvtY=1;
		}
	}, false);
	
	var KEYS = {
		LEFTARROW: 37,
		UPARROW: 38,
		RIGHTARROW: 39,
		DOWNARROW: 40,
		PAGEUP: 33,
		PAGEDOWN: 34
	};
	window.addEventListener('keydown', function(evt) {
		switch (evt.keyCode) {   
			case KEYS.LEFTARROW:
				changePanel(parseInt(currentPanel-1));
				break;
				//right      
			case KEYS.RIGHTARROW:
				changePanel(parseInt(currentPanel+1));
				break;
			case KEYS.DOWNARROW:
				var diffHeight = (window.innerHeight*.8 - document.getElementById('panel-' + currentPanel).offsetHeight);
				scrollDiff = 20;
				if ((scrollTranslateY[currentPanel]-scrollDiff < diffHeight*1.2) && (diffHeight < 0)) {
					// If past bottom and panel greater than window height, reset to bottom
					scrollPanelTo(diffHeight*1.2);
				}
				else if ((diffHeight > 0) && (scrollTranslateY[currentPanel]-scrollDiff < -document.getElementById('panel-' + currentPanel).offsetHeight*.2)) {
					// If past bottom and panel less than window height, reset to bottom
					scrollPanelTo(-document.getElementById('panel-' + currentPanel).offsetHeight*.2);
				}
				else {
					scrollPanelTo(scrollTranslateY[currentPanel]-scrollDiff);
				}
				break;
			case KEYS.UPARROW:
				if (scrollTranslateY[currentPanel]+20 >= 0 ) {
					// If over top, reset
					scrollPanelTo(0);
				}
				else {
					scrollPanelTo(scrollTranslateY[currentPanel]+20);
				}
				break;
			case KEYS.PAGEDOWN:
				var diffHeight = (window.innerHeight*.8 - document.getElementById('panel-' + currentPanel).offsetHeight);
				scrollDiff = 80;
				if ((scrollTranslateY[currentPanel]-scrollDiff < diffHeight*1.2) && (diffHeight < 0)) {
					// If past bottom and panel greater than window height, reset to bottom
					scrollPanelTo(diffHeight*1.2);
				}
				else if ((diffHeight > 0) && (scrollTranslateY[currentPanel]-scrollDiff < -document.getElementById('panel-' + currentPanel).offsetHeight*.2)) {
					// If past bottom and panel less than window height, reset to bottom
					scrollPanelTo(-document.getElementById('panel-' + currentPanel).offsetHeight*.2);
				}
				else {
					scrollPanelTo(scrollTranslateY[currentPanel]-scrollDiff);
				}
				break;
			case KEYS.PAGEUP:
				if (scrollTranslateY[currentPanel]+80 >= 0 ) {
					// If over top, reset
					scrollPanelTo(0);
				}
				else {
					scrollPanelTo(scrollTranslateY[currentPanel]+80);
				}
				break;
		}
	}, false);
	
	// Set click function to arrows for scrolling back to top or bottom
	document.getElementById('toTop').addEventListener( 'click', function(evt){
		scrollPanelTo(0);
	}, false);
	document.getElementById('toBottom').addEventListener( 'click', function(evt){
		var diffHeight = (window.innerHeight*.8 - document.getElementById('panel-' + currentPanel).offsetHeight);
		if (diffHeight < 0) {
			// If panel greater than window height, reset to bottom
			scrollPanelTo(diffHeight*1.2);
		}
		else if (diffHeight > 0) {
			// If panel less than window height, reset to bottom
			scrollPanelTo(-document.getElementById('panel-' + currentPanel).offsetHeight*.2);
		}
	}, false);
	
	/****END Scrolling Section****/
	
	// Code for swiping to next panel
	var touchStartX=0;
	var touchStartY=0;
	document.body.addEventListener('touchstart', function(event) {
		touchStartX=event.touches[0].screenX;
		touchStartY=event.touches[0].screenY;
	}, false);
	document.body.addEventListener('touchend', function(event) {
		var deltaX = (event.changedTouches[0].screenX - touchStartX);
		var deltaY = (event.changedTouches[0].screenY - touchStartY);
		var diffHeight = (window.innerHeight*.8 - document.getElementById('panel-' + currentPanel).offsetHeight);
		// TODO: Don't like using px, need to find another method
		if (scrollTranslateY[currentPanel] > 1 ) {
			// If over top, reset
			scrollPanelTo(0);
		}
		if ((scrollTranslateY[currentPanel] < diffHeight*1.2) && (diffHeight < 0)) {
			// If past bottom and panel greater than window height, reset to bottom
			scrollPanelTo(diffHeight*1.2);
		}
		else if ((diffHeight > 0) && (scrollTranslateY[currentPanel] < -document.getElementById('panel-' + currentPanel).offsetHeight*.2)) {
			// If past bottom and panel less than window height, reset to bottom
			scrollPanelTo(-document.getElementById('panel-' + currentPanel).offsetHeight*.2);
		}
		// block from swiping if the gesture is a scroll gesture and not a swipe
		if (Math.abs(deltaX) > Math.abs(deltaY)) {
			var swipeX=80;
			if (window.innerWidth < 600 && window.innerWidth > 200) {
				swipeX=200;
			}
			if (deltaX < -swipeX) {
				changePanel(parseInt(currentPanel+1));
			}
			else if (deltaX > swipeX){
				changePanel(parseInt(currentPanel-1));
			}
		}
		document.getElementById('panelFooter').style[ transformProp ] =  'translateZ( 1px )'; // to fix the panelFooter to be on top (clickable)
	}, false);
	
		
	// create on resize event to re-adjust transformations
	window.onresize = function(evt) {
		// translate new radius for 3D Carousel
		radius = window.innerWidth*.8;
		carouselShift = radius*1.0;
		for (var i=0; i< carousel.length; i++ ) {
			//calculate the x and y
			zTranslate[i] = radius*Math.cos(angle*i*Math.PI/180);
			xTranslate[i] = radius*Math.sin(angle*i*Math.PI/180);
			carousel[i].style[ transformProp ] =  'translateZ( ' + zTranslate[i] + 'px ) translateX( ' + xTranslate[i] + 'px ) rotateY( ' + angle*i + 'deg ) ';
		}
		document.getElementsByClassName('carousel')[0].style[ transformProp ] = 'translateZ( ' + -carouselShift + 'px ) translateY( 4.5em) rotateY( ' + -angle*currentPanel + 'deg)';
		
		// translate base platform
		offset = -baseDiv.offsetHeight/2 + (renderDiv.offsetHeight);
		baseDiv.style[ transformProp ] =  'translateY( ' + offset + 'px ) rotateX( 90deg )';
		backDiv.style[ transformProp ] =  'translateZ( ' + (-baseDiv.offsetHeight/2) + 'px ) translateY( ' + (renderDiv.offsetHeight*0.1) + 'px )';
	};
	
	document.getElementById('panelFooter').style[ transformProp ] =  'translateZ( 1px )'; // to fix the panelFooter to be on top (clickable)
	
	document.getElementById('linkedIn').addEventListener( 'click', function(evt){
		var win = window.open('https://www.linkedin.com/pub/anton-morgan/68/4b0/43b', '_blank');
		win.focus();
	}, false);
	document.getElementById('gitHub').addEventListener( 'click', function(evt){
		var win = window.open('https://github.com/amorganPD', '_blank');
		win.focus();
	}, false);
};

window.addEventListener('DOMContentLoaded', init, false);