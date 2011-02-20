// gonna shuffle some stuff
Array.implement({
	shuffle: function(){
		for (var i = this.length; i && --i;){
			var temp = this[i], r = Math.floor(Math.random() * ( i + 1 ));
			this[i] = this[r];
			this[r] = temp;
		}
		return this;
	}
});

// Define a new transition
SlideShow.defineTransition('squares', function(data){
	// data contains information about the transition like the 
	// previous and next slides as well as the duration of the transition
	var elements = data.next.getElements('span'),
		duration = data.duration / elements.length - 1;

	// after shuffling the elements, hide them, and then
	// fade them in on an increasing delay
	elements.shuffle().each(function(image, index){
		image.set('tween', { duration: duration / elements.length * 4 }).fade('hide');
		image.fade.delay(duration * index, image, ['in']);
	});

	// by default, previous has a z-index of 1 and next of 0
	// want to set the next slide on top, all of it's images
	// are hidden, so they fade in over the top
	data.next.setStyle('z-index', 2);
});


// Extend SlideShow with a Flickr class

SlideShow.Flickr = new Class({

	Extends: SlideShow,

	options: {
		delay: 1, // pretty weird, no real delay between transition
		duration: 15000, // VERY long transition, takes 10 seconds for all 12 images on a slide to fade in
		transition: 'squares', // custom transition from above
		autoplay: true,
		tags: ['san francisco', 'utah']
	},

	initialize: function(element, options){
		this.parent(element, options, true); // noSetup argument prevents slideshow from setting up
		this.imageData = [];
		this.requestsCompleted = 0;
		this.options.tags.each(function(item){
			this.requestImages(item)
		}, this);
		this.initialized = false;
		this.element.fade('hide');
	},

	requestImages: function(tags){
		// JSONP request to build up an array of images
		var self = this,
			req = new Request.JSONP({
			url: 'http://www.flickr.com/services/feeds/photos_public.gne',
			callbackKey: 'jsoncallback',
			data: { tags: tags, format: 'json', cacheBust: new Date().getTime() },
			onComplete: function(data){
				Object.each(data.items, function(item){
					self.imageData.push(item.media.m);
				});
				self.requestsCompleted++;
				if (self.options.tags.length === self.requestsCompleted){
					self.loadImages();
				}
			}
		}).send();
	},

	loadImages: function(){
		var self = this;
		this.images = Asset.images(this.imageData.shuffle(), {
			onComplete: function(){
				self.build();
			}
		});
	},

	build: function(){
		var div = new Element('div').inject(this.element),
			count = 0,
			self = this;

		this.images.each(function(img, index){
			if (count === 8) {
				div = new Element('div').inject(self.element);
				count = 0;
			}
			count++;

			var span = new Element('span').adopt(img).inject(div);
			new Wallpaper.Fill(img, { anchor: { x: 'center', y: 'center' }}).detach();
		});

		this.setup(); // now we can setup
		this.initialized = true;
		this.element.fade('in');
	},
	
	show: function(index, options){
		if (!this.initialized) return this;
		return this.parent(index, options);
	}

});

var flickr;
document.addEvent('domready', function(){
	flickr = new SlideShow.Flickr('flickr-slideshow');
});