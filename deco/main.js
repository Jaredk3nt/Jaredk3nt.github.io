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
		}, 1300);
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
	$(document).on("mousewheel DOMMouseScroll touchmove", function (e) {
		if (!scrolling) {
			if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
				navigateUp();
			} else {
				navigateDown();
			}
		}
	});

});