var declarative;
document.addEvent('domready', function(){
	$('declarative-slideshow').playSlideShow();

	// used for this site, unneccessary
	declarative = $('declarative-slideshow').get('slideshow');
});