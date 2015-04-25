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
	var carouselShift = radius*1.0;
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
			changePanel(evt.currentTarget.id[evt.currentTarget.id.length-1]);
		}, false);
		scrollTranslateY.push(0);
	}
	
	// scroll screen by translating panel
	document.body.onmousewheel = function(evt) {
		var diffHeight = (window.innerHeight*.8 - document.getElementById('panel-' + currentPanel).offsetHeight);
		if (evt.deltaY < 0) {
			scrollTranslateY[currentPanel]+=20;
		}
		else if (evt.deltaY > 0 && (scrollTranslateY[currentPanel] > diffHeight*1.2)) {
			scrollTranslateY[currentPanel]-=20;
		}
		if (scrollTranslateY[currentPanel] > 0) {
			scrollTranslateY[currentPanel]=0;
		}
		document.getElementById('panel-' + currentPanel).style[ transformProp ] = 'translateZ( ' + zTranslate[currentPanel] + 'px ) translateX( ' + xTranslate[currentPanel] + 'px ) rotateY( ' + angle*currentPanel + 'deg ) translateY(' + scrollTranslateY[currentPanel] + 'px)';
	};
	document.body.addEventListener("DOMMouseScroll", function(evt) {
		var diffHeight = (window.innerHeight*.8 - document.getElementById('panel-' + currentPanel).offsetHeight);
		if (evt.detail < 0) {
			scrollTranslateY[currentPanel]+=20;
		}
		else if (evt.detail > 0 && (scrollTranslateY[currentPanel] > diffHeight*1.2)) {
			scrollTranslateY[currentPanel]-=20;
		}
		if (scrollTranslateY[currentPanel] > 0) {
			scrollTranslateY[currentPanel]=0;
		}
		document.getElementById('panel-' + currentPanel).style[ transformProp ] = 'translateZ( ' + zTranslate[currentPanel] + 'px ) translateX( ' + xTranslate[currentPanel] + 'px ) rotateY( ' + angle*currentPanel + 'deg ) translateY(' + scrollTranslateY[currentPanel] + 'px)';
	}, false);
	// Scroll via touch move
	var previousTouchY = 0;
	var firstTouchEvtY = 0;
	document.body.addEventListener('touchmove', function(event) {
		var touch = event.touches[0];
		var deltaY=0;
		if (firstTouchEvtY==1) {
			deltaY = (previousTouchY-touch.screenY);
			firstTouchEvtY=0;
			if (deltaY < -4) {
				scrollTranslateY[currentPanel]+=10;
			}
			else if (deltaY > 4 ) {
				scrollTranslateY[currentPanel]-=10;
			}
			document.getElementById('panel-' + currentPanel).style[ transformProp ] = 'translateZ( ' + zTranslate[currentPanel] + 'px ) translateX( ' + xTranslate[currentPanel] + 'px ) rotateY( ' + angle*currentPanel + 'deg ) translateY(' + scrollTranslateY[currentPanel] + 'px)';
		}
		else {
			previousTouchY=touch.screenY;
			firstTouchEvtY=1;
		}
	}, false);
	
	/****END Scrolling Section****/
	
	// Code for swiping to next panel
	var touchStartX=0;
	document.body.addEventListener('touchstart', function(event) {
		touchStartX=event.touches[0].screenX;
	}, false);
	document.body.addEventListener('touchend', function(event) {
		var deltaX = (event.changedTouches[0].screenX - touchStartX);
		var diffHeight = (window.innerHeight*.8 - document.getElementById('panel-' + currentPanel).offsetHeight);
		// TODO: Don't like using px, need to find another method
		if (scrollTranslateY[currentPanel] > 1 ) {
			scrollTranslateY[currentPanel]=0;
			document.getElementById('panel-' + currentPanel).style[ transformProp ] = 'translateZ( ' + zTranslate[currentPanel] + 'px ) translateX( ' + xTranslate[currentPanel] + 'px ) rotateY( ' + angle*currentPanel + 'deg ) translateY(' + scrollTranslateY[currentPanel] + 'px)';
		}
		if ((scrollTranslateY[currentPanel] < diffHeight*1.2) && (diffHeight < 0)) {
			scrollTranslateY[currentPanel] = diffHeight*1.2;
			document.getElementById('panel-' + currentPanel).style[ transformProp ] = 'translateZ( ' + zTranslate[currentPanel] + 'px ) translateX( ' + xTranslate[currentPanel] + 'px ) rotateY( ' + angle*currentPanel + 'deg ) translateY(' + scrollTranslateY[currentPanel] + 'px)';
		}
		else if ((diffHeight > 0) && (scrollTranslateY[currentPanel] < -document.getElementById('panel-' + currentPanel).offsetHeight*.2)) {
			scrollTranslateY[currentPanel] = -document.getElementById('panel-' + currentPanel).offsetHeight*.2;
			document.getElementById('panel-' + currentPanel).style[ transformProp ] = 'translateZ( ' + zTranslate[currentPanel] + 'px ) translateX( ' + xTranslate[currentPanel] + 'px ) rotateY( ' + angle*currentPanel + 'deg ) translateY(' + scrollTranslateY[currentPanel] + 'px)';
		}
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