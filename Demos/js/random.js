var random;
document.addEvent('domready', function(){
	random = new SlideShow('random-slideshow', {
		autoplay: true,
		delay: 3000,
		transition: 'random'
	});	
});