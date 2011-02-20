var navSlideShow;
document.addEvent('domready', function(){

	// cache the navigation elements
	var navs = $('navigation-slideshow').getElements('a');

	// create a basic slideshow
	navSlideShow = new SlideShow('navigation-slideshow', {
		selector: 'img', // only create slides out of the images
		onShow: function(data){
			// update navigation elements' class depending upon the current slide
			navs[data.previous.index].removeClass('current');
			navs[data.next.index].addClass('current');
		}
	});

	navs.each(function(item, index){
		// click a nav item ...
		item.addEvent('click', function(event){
			event.stop();
			// pushLeft or pushRight, depending upon where
			// the slideshow already is, and where it's going
			var transition = (navSlideShow.index < index) ? 'pushLeft' : 'pushRight';
			// call show method, index of the navigation element matches the slide index
			// on-the-fly transition option
			navSlideShow.show(index, {transition: transition});
		});
	});

	// tips, for pretty
	new Tips(navs, {
		fixed: true,
		text: '',
		offset: {
			x: -100,
			y: 20
		}
	});
	

});