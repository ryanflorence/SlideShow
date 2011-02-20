var css;
document.addEvent('domready', function(){
	css = new SlideShow('css-transitions-slideshow', {
		autoplay: true,
		delay: 3000,
		transition: 'slideDown'
	});
});