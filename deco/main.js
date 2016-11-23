$(document).ready(function () {
	var $wrap = $(".slides-wrapper"), slides = $(".slide").length, scrolling = false, currentSlide = 1;

	// update active classes and control scroll timing
	function manageClasses() {
		$wrap.removeClass(function (index, css) {
			return (css.match(/(^|\s)active-slide\S+/g) || []).join(' ');
		});
		$wrap.addClass("active-slide" + currentSlide);

		scrolling = true;
		setTimeout(function () {
			scrolling = false;
		}, 1300);
	}
	// go up a slide
	function navigateUp() {
		if (currentSlide > 1) {
			currentSlide -= 1;
			manageClasses();
		}
	}
	// go down a slide
	function navigateDown() {
		if (currentSlide < slides) {
			currentSlide += 1;
			manageClasses();
		}
	}

  	var touchStartPos;
	$(document).on("mousewheel DOMMouseScroll", function (e) {
		if (!scrolling) {
			if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
				navigateUp();
			} else {
				navigateDown();
			}
		}
	});

	$(document).bind('touchstart', function (e){
   		touchStartPos = e.originalEvent.touches[0].clientY;
	});

	$(document).bind('touchend', function (e){
	   var touchEndPos = e.originalEvent.changedTouches[0].clientY;
	   if(!scrolling) {
		   if(touchStartPos > touchEndPos+5){
		      navigateDown();
		   }else if(touchStartPos < touchEndPos-5){
		      navigateUp();
		   }
		}
	});

});