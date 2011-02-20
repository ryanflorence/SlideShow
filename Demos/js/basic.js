var basic;
document.addEvent('domready', function(){
	basic = new SlideShow('basic-slideshow', {
		autoplay: true,
		delay: 3000,
		transition: 'slideDown'
	});
});