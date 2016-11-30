$(document).ready(function () {
	var $wrap = $(".slides-wrapper"), slides = $(".slide").length, scrolling = false, currentSlide = 1;

  /*****************************
  ***** NAVIGATE FUNCTIONS *****
  *****************************/
	function manageClasses() {
		$wrap.removeClass(function (index, css) {
			return (css.match(/(^|\s)active-slide\S+/g) || []).join(' ');
		});
		$wrap.addClass("active-slide" + currentSlide);

		scrolling = true;
		setTimeout(function () {
			scrolling = false;
		}, 1200);
	}
	function navigateUp() {
		if (currentSlide > 1) {
			currentSlide -= 1;
			manageClasses();
		}
	}

	function navigateDown() {
		if (currentSlide < slides) {
			currentSlide += 1;
			manageClasses();
		}
	}

  /*********************
  ***** MOUSEWHEEL *****
  *********************/
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
	
	$(document).on('touchstart', function (e){
   		touchStartPos = e.originalEvent.touches[0].clientY;
   		console.log("start");
	});

	$(document).on('touchend', function (e){
	   var touchEndPos = e.originalEvent.changedTouches[0].clientY;
	   console.log("end");
	   if(!scrolling) {
		   if(touchStartPos > touchEndPos+5){
		      navigateDown();
		   }else if(touchStartPos < touchEndPos-5){
		      navigateUp();
		   }
		}
	});

});