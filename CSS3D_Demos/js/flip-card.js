var init = function() {
    var transformProp = Modernizr.prefixed('transform');
	
	var renderDiv = document.getElementById('renderDiv');
	var baseDiv = document.getElementsByClassName('platform').base;
	var backDiv = document.getElementsByClassName('platform').back;
	
	var offset = -baseDiv.offsetHeight/2 + (renderDiv.offsetHeight);
	baseDiv.style[ transformProp ] =  'translateY( ' + offset + 'px ) rotateX( 90deg )';
	backDiv.style[ transformProp ] =  'translateZ( ' + (-baseDiv.offsetHeight/2) + 'px )';
	
	//prepare 3D carousel
	var carousel = document.getElementsByClassName('panel');
	var angle = 360/carousel.length;
	var radius = carousel[0].offsetWidth;
	for (var i=0; i< carousel.length; i++ ) {
		//calculate the x and y
		var zTranslate = radius*Math.cos(angle*i*Math.PI/180);
		var xTranslate = radius*Math.sin(angle*i*Math.PI/180);
		carousel[i].style[ transformProp ] =  'translateZ( ' + zTranslate + 'px ) translateX( ' + xTranslate + 'px ) rotateY( ' + angle*i + 'deg ) ';
	}
	document.getElementsByClassName('carousel')[0].style[ transformProp ] = 'translateZ( ' + -radius + 'px ) translateY( 5em) ';
	
	var panels = document.getElementsByClassName('panel');
	for (i=0; i < panels.length; i++ ) {
		var index = 0;
		panels[i].addEventListener( 'click', function(evt){
			if (index >= panels.length) {
				index=0;
			}
			else {
				index++;
			}
			document.getElementsByClassName('carousel')[0].style[ transformProp ] = 'translateZ( ' + -radius + 'px ) translateY( 5em) rotateY( ' + angle*index + 'deg)';
		  }, false);
	}
};

window.addEventListener('DOMContentLoaded', init, false);