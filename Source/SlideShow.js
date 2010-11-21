/*
---

name: SlideShow

description: "Extensible mid-level class that manages transitions of elements that share the same space, typically for slideshows, tabs, and galleries."

license: MIT-style license.

authors: Ryan Florence <http://ryanflorence.com>

requires:
  - Core/Fx.Tween
  - Core/Fx.Morph
  - Core/Element.Dimensions
  - Core/Slick.Parser
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
		autoplay: false,
		dataAttribute: 'data-slideshow',
		selector: '> *'
	},

	transitioning: false,
	reversed: false,

	initialize: function(element, options, noSetup){
		this.element = document.id(element);
		if (!noSetup) this.setup(options);
	},

	setup: function(options){
		this.setOptions(options);
		this.slides = this.element.getElements(this.options.selector);
		this.setupElement().setupSlides();
		this.current = this.current || this.slides[0];
		this.index = this.current.retrieve('slideshow-index');
		this.setLoop(this.show.pass(this.reversed ? 'previous' : 'next', this), this.options.delay);
		if (this.options.autoplay) this.play();
		return this;
	},

	setupElement: function(){
		this.storeData(this.element);
		this.options.duration = this.element.retrieve('slideshow-duration');
		this.options.transition = this.element.retrieve('slideshow-transition');
		this.options.delay = this.element.retrieve('slideshow-delay');
		return this;
	},

	setupSlides: function(){
		this.slides.each(function(slide, index){
			slide.store('slideshow-index', index);
			this.storeData(slide);
			if (this.current || index == 0) return;
			this.reset(slide);
			slide.setStyle('display', 'none');
		}, this);
		return this;
	},

	storeData: function(element){
		var ops = this.options;
		// default options
		element.store('slideshow-transition', ops.transition);
		element.store('slideshow-duration', ops.duration);
		if (element == this.element) element.store('slideshow-delay', ops.delay);
		// override from data attribute
		var data = element.get(this.options.dataAttribute);
		if (!data) return this;
		Slick.parse(data).expressions.each(function(expression){
			element.store('slideshow-' + expression[0].tag, expression[0].pseudos[0].key);
		});
		return this;
	},

	show: function(slide, options){
		if (slide == 'next' || slide == 'previous') slide = this[slide + 'Slide']();
		if (typeof slide == 'number') slide = this.slides[slide];
		if (slide == this.current || this.transitioning) return this;

		this.transitioning = true;
		var transition = (options && options.transition) ? options.transition : slide.retrieve('slideshow-transition'),
			duration = (options && options.duration) ? options.duration : slide.retrieve('slideshow-duration'),
			previous = this.current.setStyle('z-index', 1),
			next = this.reset(slide),
			nextIndex = this.index = next.retrieve('slideshow-index')
			slideData = {
				previous: { element: previous, index: previous.retrieve('slideshow-index') },
				next:     { element: next,     index: nextIndex }
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

	reset: function(slide){
		return slide.set('style', '');
	},

	nextSlide: function(){
		return this.slides[this.index + 1] || this.slides[0];
	},

	previousSlide: function(){
		return this.slides[this.index - 1] || this.slides.getLast();
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
		this.get('slideshow').setup(options);
		return this;
	},

	get: function(){
		var instance = this.retrieve('slideshow');
		if (!instance){
			instance = new SlideShow(this, {}, true);
			this.store('slideshow', instance);
		}
		return instance;
	}

};


Element.implement({

	playSlideShow: function(options){
		this.get('slideshow').setup(options).play();
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
