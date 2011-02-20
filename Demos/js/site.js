// This mess of code checks the scroll position every second (or so)
// and plays or pauses the autoplaying slideshows accordingly.
// This way, the browser isn't animating stuff you can't even see.

var watcher = {

	init: function(slideshows){
		watcher.slideshows = slideshows;
		watcher.setPositions().attach().check();
		return watcher;
	},

	check: function (){
		var scroll = window.getScroll().y;
		watcher.slideshows.each(function(item){
			if (item.position.stop <= scroll || item.position.start > scroll){
				if (item.isLooping) item.pause();
				return;
			}

			if (item.position.start <= scroll){
				if (!item.isLooping) item.show('next').play();
			}
		});
		setTimeout(watcher.check, 500);
		return watcher;
	},

	setPositions: function (){
		watcher.slideshows.each(function(item){
			var el = $(item),
				top = el.getPosition().y;

			item.position = {
				start: top - window.getSize().y,
				stop: top + el.getSize().y
			};
		});
		return watcher;
	},

	attach: function (){
		window.addEvent('resize', watcher.setPositions);
		return watcher;
	}
}


document.addEvent('domready', function(){
	$$('html')[0].removeClass('not-ready').removeClass('no-js');
	watcher.init([
		flickr, basic.pause(), 
		css.pause(), 
		declarative.pause()
	]);
});