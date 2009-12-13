var mySlideShow;

window.addEvent('domready',function(){
	
	mySlideShow = new SlideShow('slides',{
		delay: 2000
	}).startLoop();
	
});