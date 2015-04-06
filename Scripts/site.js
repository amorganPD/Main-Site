var init = function() {
    var transformProp = Modernizr.prefixed('transform');
	
	var renderDiv = document.getElementById('renderDiv');
	var baseDiv = document.getElementsByClassName('platform').base;
	var backDiv = document.getElementsByClassName('platform').back;
	
	var offset = -baseDiv.offsetHeight/2 + (renderDiv.offsetHeight);
	baseDiv.style[ transformProp ] =  'translateY( ' + offset + 'px ) rotateX( 90deg )';
	backDiv.style[ transformProp ] =  'translateZ( ' + (-baseDiv.offsetHeight/2) + 'px ) translateY( ' + (-renderDiv.offsetHeight*0.1) + 'px )';
	
	//prepare 3D carousel
	var carousel = document.getElementsByClassName('panel');
	var angle = 360/carousel.length;
	var radius = window.innerWidth*.8;
	document.getElementsByClassName('carousel')[0].style[ transformProp ] = 'translateZ( ' + -radius + 'px ) translateY( 4.5em) ';
	for (var i=0; i< carousel.length; i++ ) {
		//calculate the x and y
		var zTranslate = radius*Math.cos(angle*i*Math.PI/180);
		var xTranslate = radius*Math.sin(angle*i*Math.PI/180);
		carousel[i].style[ transformProp ] =  'translateZ( ' + zTranslate + 'px ) translateX( ' + xTranslate + 'px ) rotateY( ' + angle*i + 'deg ) ';
	}
	document.getElementById('panel-0').style['backgroundColor'] = '#282828';
	document.getElementById('panel-0').style['borderColor'] = '#686868';
	
	var panels = document.getElementsByClassName('panel');
	var currentAngle = 0;
	var function = changePanel(index) {
		
	}
	for (i=0; i < panels.length; i++ ) {
		panels[i].addEventListener( 'click', function(evt){
			document.getElementById('panel-' + currentAngle).style['backgroundColor'] = '#EFEFEF';
			document.getElementById('panel-' + currentAngle).style['borderColor'] = '#EFEFEF';
			currentAngle++;
			if (currentAngle >= panels.length) {
				currentAngle=0;
			}
			document.getElementById('panel-' + currentAngle).style['backgroundColor'] = '#282828';
			document.getElementById('panel-' + currentAngle).style['borderColor'] = '#686868';
			document.getElementsByClassName('carousel')[0].style[ transformProp ] = 'translateZ( ' + -radius + 'px ) translateY( 4.5em) rotateY( ' + angle*currentAngle + 'deg)';
		  }, false);
	}
	
	window.onresize = function(evt) {
		// translate new radius for 3D Carousel
		radius = window.innerWidth*.8;
		for (var i=0; i< carousel.length; i++ ) {
			//calculate the x and y
			var zTranslate = radius*Math.cos(angle*i*Math.PI/180);
			var xTranslate = radius*Math.sin(angle*i*Math.PI/180);
			carousel[i].style[ transformProp ] =  'translateZ( ' + zTranslate + 'px ) translateX( ' + xTranslate + 'px ) rotateY( ' + angle*i + 'deg ) ';
		}
		document.getElementsByClassName('carousel')[0].style[ transformProp ] = 'translateZ( ' + -radius + 'px ) translateY( 4.5em) rotateY( ' + angle*currentAngle + 'deg)';
		
		// translate base platform
		offset = -baseDiv.offsetHeight/2 + (renderDiv.offsetHeight);
		baseDiv.style[ transformProp ] =  'translateY( ' + offset + 'px ) rotateX( 90deg )';
		backDiv.style[ transformProp ] =  'translateZ( ' + (-baseDiv.offsetHeight/2) + 'px ) translateY( ' + (-renderDiv.offsetHeight*.1) + 'px )';
		
	};
};

window.addEventListener('DOMContentLoaded', init, false);