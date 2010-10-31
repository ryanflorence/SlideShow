/*
---

name: SlideShow

description: Easily extendable, class-based, slideshow widget. Use any element, not just images. Comes with packaged transitions but is easy to extend and create your own transitions.  The class is built to handle the basics of a slideshow, extend it to implement your own navigation piece and custom transitions.

license: MIT-style license.

authors: Ryan Florence <http://ryanflorence.com>

requires:
  - Core/Fx.Tween
  - Core/Fx.Morph
  - Core/Element.Dimensions
  - Loop/Loop

provides:
  - SlideShow
  - Element.playSlideShow
  - Element.pauseSlideShow

...
*/


var SlideShow = new Class({

	Implements: [Options, Events, Loop],

	options: {
		/*
		onShow: function(){},
		onShowComplete: function(){},
		onReverse: function(){},
		onPlay: function(){},
		onPause: function(){},
		*/
		delay: 7000,
		transition: 'crossFade',
		duration: 500,
		autoplay: false
	},

	transitioning: false,
	reversed: false,

	initialize: function(element, options){
		this.element = document.id(element);
		this.setOptions(options);
		this.setup();
	},

	setup: function(){
		this.slides = this.element.getChildren();
		this.current = this.slides[0];
		if (this.options.autoplay) this.play();
		this.setupElement().setupSlides(true);
		this.setLoop(this.show.pass('next', this), this.options.delay);
		return this;
	},

	setupElement: function(){
		var classes = this.element.get('class'),
		 	match = classes.match(/delay:[0-9]+/);
		if (match) this.options.delay = match[0].split(':')[1];
		this.storeTransition(this.element);
		this.options.duration = this.element.retrieve('slideshow-duration');
		this.options.transition = this.element.retrieve('slideshow-transition');
		return this;
	},

	setupSlides: function(hideFirst){
		this.slides.each(function(slide, index){
			slide.store('slideshow-index', index);
			this.storeTransition(slide).reset(slide);
			if (hideFirst && index != 0) slide.setStyle('display', 'none');
		}, this);
		return this;
	},

	storeTransition: function(slide){
		var classes = slide.get('class'),
			transitionMatch = classes.match(/transition:[a-zA-Z]+/),
			durationMatch = classes.match(/duration:[0-9]+/),
			transition = (transitionMatch) ? transitionMatch[0].split(':')[1] : this.options.transition,
			duration = (durationMatch) ? durationMatch[0].split(':')[1] : this.options.duration;
		slide.store('slideshow-transition', transition).store('slideshow-duration', duration)
		return this;
	},

	resetOptions: function(options, hideFirst){
		this.options = Object.merge(this.options, options);
		this.loopDelay = this.options.delay;
		this.setupSlides(hideFirst);
		return this;
	},

	show: function(slide, options){
		if (slide == 'next') slide = this.nextSlide();
		if (slide == 'previous') slide = this.previousSlide();
		if (typeof slide == 'number') slide = this.slides[slide];

		if (slide == this.current || this.transitioning) return;

		this.transitioning = true;
		var transition = (options && options.transition) ? options.transition : slide.retrieve('slideshow-transition'),
			duration = (options && options.duration) ? options.duration : slide.retrieve('slideshow-duration'),
			previous = this.current.setStyle('z-index', 1),
			next = this.reset(slide),
			slideData = {
				previous: { element: previous, index: previous.retrieve('slideshow-index') },
				next:     { element: next,     index: next.retrieve('slideshow-index') }
			};

		this.fireEvent('show', slideData);
		this.transitions[transition]({previous: previous, next: next, duration: duration, instance: this});
		(function(){
			previous.setStyle('display', 'none');
			this.fireEvent('showComplete', slideData);
			this.transitioning = false;
		}).bind(this).delay(duration);

		this.current = next;
		return this;
	},

	resetStyles: {
		position: 'absolute',
		'z-index': 0,
		display: 'block',
		left: 0,
		top: 0
	},

	reset: function(slide){
		return slide.setStyles(this.resetStyles).fade('show');
	},

	nextSlide: function(){
		var next = this.current.getNext();
		return (next) ? next : this.slides[0];
	},

	previousSlide: function(){
		var previous = this.current.getPrevious();
		return (previous) ? previous : this.slides.getLast();
	},

	play: function(){
		this.startLoop();
		this.fireEvent('play');
		return this;
	},

	pause: function(){
		this.stopLoop();
		this.fireEvent('pause');
		return this;
	},

	reverse: function(){
		this.setLoop(this.show.pass(this.reversed ? 'next' : 'previous', this), this.options.delay);
		this.reversed = !this.reversed;
		this.fireEvent('reverse');
		return this;
	},

	toElement: function(){
		return this.element;
	},
	
	mixin: function(klass, args){
		if (klass.prototype.options) Object.merge(klass.prototype.options, this.options);
		Object.append(this, klass.prototype);
		klass.mix.apply(this, args);
		return this;
	}

});

Element.Properties.slideshow = {

	set: function(options){
		this.get('slideshow').resetOptions(options, true);
		return this;
	},

	get: function(){
		var instance = this.retrieve('slideshow');
		if (!instance){
			instance = new SlideShow(this);
			this.store('slideshow', instance);
		}
		return instance;
	}

};


Element.implement({

	playSlideShow: function(options){
		this.get('slideshow').resetOptions(options, true).play();
		return this;
	},

	pauseSlideShow: function(){
		this.get('slideshow').pause();
		return this;
	}

});

SlideShow.transitions = {};
SlideShow.addTransition = function(name, fn){
	SlideShow.transitions[name] = fn;
	SlideShow.implement({ transitions: SlideShow.transitions });
};

SlideShow.addTransition('fade', function(data){
	data.previous.set('tween', {duration: data.duration}).fade('out');
	return this;
});

(function(SlideShow){

	// todo: init branching so all this checking doesn't happen every transition
	var pushOrBlind = function(type, direction, data){
		var isHorizontal = ['left', 'right'].contains(direction),
			property = (isHorizontal) ? 'left' : 'top',
			inverted = (['left', 'up'].contains(direction)) ? 1 : -1,
			distance = data.instance.element.getSize()[(isHorizontal) ? 'x' : 'y'],
			tweenOptions = {duration: data.duration};
		if (type == 'blind') data.next.setStyle('z-index', 2);
		if (type != 'slide') {
			data.next.set('tween', tweenOptions).setStyle(property, distance * inverted);
			data.next.tween(property, 0);
		}
		if (type != 'blind') data.previous.set('tween', tweenOptions).tween(property, -(distance * inverted));
	};

	['left', 'right', 'up', 'down'].each(function(direction){

		var capitalized = direction.capitalize(),
			blindName = 'blind' + capitalized,
			slideName = 'slide' + capitalized;

		[
			['push' + capitalized, function(data){
				pushOrBlind('push', direction, data);
				return this;
			}],
			[blindName, function(data){
				pushOrBlind('blind', direction, data);
				return this;
			}],
			[slideName, function(data){
				pushOrBlind('slide', direction, data);
				return this;
			}],
			[blindName + 'Fade', function(data){
				this[blindName](data).fade(data);
				return this;
			}]
		].each(function(transition){ SlideShow.addTransition(transition[0], transition[1]); });

	});

})(SlideShow);

[
	['none', function(data){
		data.previous.setStyle('display', 'none');
		return this;
	}],
	['crossFade', function(data){
		data.previous.set('tween', {duration: data.duration}).fade('out');
		data.next.set('tween', {duration: data.duration}).fade('in');
		return this;
	}],
	['fadeThroughBackground', function(data){
		var half = data.duration / 2;
		data.next.set('tween', {duration: half}).fade('hide');
		data.previous.set('tween',{
			duration: half,
			onComplete: function(){ data.next.fade('in'); }
		}).fade('out');
		return this;
	}]
].each(function(transition){ SlideShow.addTransition(transition[0], transition[1]); });
