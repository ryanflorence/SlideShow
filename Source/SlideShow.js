/*
---

name: SlideShow

description: Easily extendable, class-based, slideshow widget. Use any element, not just images. Comes with packaged transitions but is easy to extend and create your own transitions.  The class is built to handle the basics of a slideshow, extend it to implement your own navigation piece and custom transitions.

license: MIT-style license.

authors: Ryan Florence <http://ryanflorence.com>

requires:
  - Core/Fx.Tween
  - Core/Fx.Morph
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
		this.setOptions(options);
		this.element = document.id(element);
		this.slides = this.element.getChildren();
		this.current = this.slides[0];
		this.transitioning = false;
		this.setup();
		this.setLoop(this.show.pass('next', this), this.options.delay);
		if (this.options.autoplay) this.play();
	},

	setup: function(){
		this.setupElement().setupSlides(true);
		return this;
	},

	setupElement: function(){
		if (this.element.getStyle('position') == 'static' && this.element != document.body) this.element.setStyle('position', 'relative');
		var classes = this.element.get('class')
		, delayRegex = /delay:[0-9]+/
		, match = classes.match(delayRegex);
		this.storeTransition(this.element);
		this.options.duration = this.element.retrieve('slideshow-duration');
		this.options.transition = this.element.retrieve('slideshow-transition');
		if (match) this.options.delay = match[0].split(':')[1];
		return this;
	},

	setupSlides: function(hideFirst){
		this.slides.each(function(slide, index){
			this.storeTransition(slide).reset(slide);
			if (hideFirst && index != 0) slide.setStyle('display', 'none');
		}, this);
		return this;
	},

	storeTransition: function(slide){
		var classes = slide.get('class')
		, transitionMatch = classes.match(/transition:[a-zA-Z]+/)
		, durationMatch = classes.match(/duration:[0-9]+/)
		, transition = (transitionMatch) ? transitionMatch[0].split(':')[1] : this.options.transition
		, duration = (durationMatch) ? durationMatch[0].split(':')[1] : this.options.duration
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
		var transition = (options && options.transition) ? options.transition : slide.retrieve('slideshow-transition')
		, duration = (options && options.duration) ? options.duration : slide.retrieve('slideshow-duration')
		, previous = this.current.setStyle('z-index', 1)
		, next = this.reset(slide)
		, slideData = {
				previous: { element: previous, index: this.slides.indexOf(previous) },
				next: { element: next, index: this.slides.indexOf(next)}
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
		return slide.setStyles({
			position: 'absolute',
			'z-index': 0,
			display: 'block',
			left: 0,
			top: 0
		}).fade('show');
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
	}

});

SlideShow.plugins = {
	transitions:{},
	plugin: function(){
		var kind = Array.shift(arguments);
		if (kind == 'transition'){
			var transition = arguments[0];
			this.transitions[transition.name] = transition.effect;
			this.implement({
				transitions: this.transitions
			});
			return;
		}
	}
};

Object.append(SlideShow, SlideShow.plugins);
SlideShow.implement(SlideShow.plugins);

SlideShow.plugin('transition', {
	name: 'fade',
	effect: function(data){
		data.previous.set('tween', {duration: data.duration}).fade('out');
		return this;
	}
});


(function(SlideShow){

	var pushOrBlind = function(type, direction, data){
		var isHorizontal = ['left', 'right'].contains(direction)
		, property = (isHorizontal) ? 'left' : 'top'
		, inverted = (['left', 'up'].contains(direction)) ? 1 : -1
		, distance = data.instance.element.getSize()[(isHorizontal) ? 'x' : 'y']
		, tweenOptions = {duration: data.duration};
		if (type == 'push') data.previous.set('tween', tweenOptions).tween(property, -(distance * inverted));
		if (type == 'blind') data.next.setStyle('z-index', 2);
		data.next.set('tween', tweenOptions).setStyle(property, distance * inverted).tween(property, 0);
	};

	['left', 'right', 'up', 'down'].each(function(direction){

		var capitalized = direction.capitalize()
		, blindName = 'blind' + capitalized;

		SlideShow.plugin('transition', {
			name: 'push' + capitalized,
			effect: function(data){
				pushOrBlind('push', direction, data);
				return this;
			}
		});

		SlideShow.plugin('transition', {
			name: blindName,
			effect: function(data){
				pushOrBlind('blind', direction, data);
				return this;
			}
		});

		SlideShow.plugin('transition', {
			name: blindName + 'Fade',
			effect: function(data){
				this[blindName](data).fade(data);
				return this;
			}
		});

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
].each(function(transition){
	SlideShow.plugin('transition', {name: transition[0], effect: transition[1]});
});
