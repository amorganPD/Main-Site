var init = function() {
	var panelTitles = ["Anton Morgan", "Web App Projects", "Embedded Projects", "Concepts et al", "Tutorials",""];

	function getAge(birthday) {
		var now = new Date();
		var Age = now.getFullYear() - birthday.getFullYear();
		var monthPassed = (now.getMonth() >= birthday.getMonth());
		var dayPassed = (now.getDate() >= birthday.getDate())
		if (!monthPassed) {
			if (!dayPassed) {
				Age--;
			}
		}
		$("#Age").html("<strong class=\"strongField\">Age</strong> " + Age);
	}
	var myBirthday = new Date(1987, 2, 6);
	getAge(myBirthday);
	
	document.getElementsByClassName('iconWrapper')[0].addEventListener( 'click', function(evt){
		var win = window.open('#Home',"_self");
	}, false);
	window.addEventListener('scroll', function(e){
		scrollVert = $(document).scrollTop();
		if (scrollVert > 240) {
			var fadeSpeed = 300;
			$(".iconMe").fadeOut(fadeSpeed, function() {
				//$(".aboutMeText").css("margin-left", "6em");
				$(".iconWrapper").fadeIn(fadeSpeed);
			});
			$(".aboutMeText").fadeOut(fadeSpeed);
			//$(".iconWrapper").css("display", "inline");
		}
		else {
			$(".iconWrapper").fadeOut(200, function() {
				//$(".aboutMeText").css("margin-left", "0em");
				$(".iconMe").fadeIn(200);
				$(".aboutMeText").fadeIn(200);
			});
		}
	}, true);
	
	// Bind the LinkedIn Icon to open a new tab
	document.getElementById('linkedIn').addEventListener( 'click', function(evt){
		var win = window.open('https://www.linkedin.com/pub/anton-morgan/68/4b0/43b', '_blank');
		win.focus();
	}, false);
	// Bind the Github Icon to open a new tab
	document.getElementById('gitHub').addEventListener( 'click', function(evt){
		var win = window.open('https://github.com/amorganPD', '_blank');
		win.focus();
	}, false);
	
	//create random background
	function getRandomBackground() {
		maxEm = $(window).width() / parseFloat($("body").css("font-size"));
		for (var i=0; i<32; i++) {
			$(".backgroundDiv").append("<div class=\"randomBgBlock\" id=\"randomBlock-" + i + "\"></div>");
			leftEm =  Math.random()*maxEm;
			leftEm = leftEm - leftEm%2; // ensure it is a mutliple of 2
			topEm = Math.random()*maxEm;
			topEm = topEm - topEm%2; // ensure it is a mutliple of 2
			$("#randomBlock-" + i).css("left", leftEm + "em");
			$("#randomBlock-" + i).css("top", topEm + "em");
		}
	};
	getRandomBackground();
	
	// Change the random background blocks every 5 secs
	// setInterval(function() { getRandomBackground();	},5000);
	// timedLoop.registerFunction(getRandomBackground);
	// timedLoop.setLoopTime(5000);
	// timedLoop.start();
	
	
	window.onresize = function(evt) {
		getRandomBackground();
	};
}

window.addEventListener('DOMContentLoaded', init, false);	