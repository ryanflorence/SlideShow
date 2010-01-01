var mySlideShow;

window.addEvent('domready',function(){
	
	mySlideShow = new SlideShow('slides',{
		delay: 2000,
		autoplay: true
	});
	
	
	var toggled = [$('show'), $('showNext'), $('showPrevious')];
	
	$('pause').addEvent('click',function(){
		
		mySlideShow.pause();
		
		toggled.each(function(button){ button.set('disabled', false);	});
		this.set('disabled', true);
		$('play').set('disabled', false);
		$('reverse').set('disabled', true);
	});
	
	$('play').addEvent('click',function(){
		mySlideShow.play();
		
		toggled.each(function(button){
			button.set('disabled', true);
		});
		this.set('disabled', true);
		$('pause').set('disabled', false);
		$('reverse').set('disabled', false);
	});
	
	$('reverse').addEvent('click',function(){
		mySlideShow.reverse();
	});
	
	$('show').addEvent('click',function(){
		mySlideShow.show(mySlideShow.slides[4]);
	});
	
	$('showNext').addEvent('click',function(){
		mySlideShow.showNext();
	});
	
	$('showPrevious').addEvent('click',function(){
		mySlideShow.showPrevious();
	});
	
});