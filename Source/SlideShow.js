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
		var classes = slide.get('class');
		var transitionRegex = /transition:[a-zA-Z]+/;
		var durationRegex = /duration:[0-9]+/;
		var transition = (classes.match(transitionRegex)) ? classes.match(transitionRegex)[0].split(':')[1] : this.options.transition;
		var duration = (classes.match(durationRegex)) ? classes.match(durationRegex)[0].split(':')[1] : this.options.duration;
		slide.store('ssTransition', transition).store('ssDuration', duration);
		return this;
	},
	
	resetOptions: function(options, hideFirst){
		this.options = Object.merge(this.options, options);
		this.loopDelay = this.options.delay;
		this.setupSlides(hideFirst);
		return this;
	},
	
	getTransition: function(slide){
		return slide.retrieve('ssTransition');
	},
	
	getDuration: function(slide){
		return slide.retrieve('ssDuration');
	},
	
	show: function(slide, options){
		slide = (typeof slide == 'number') ? this.slides[slide] : slide;
		if (slide != this.current && !this.transitioning){
			this.transitioning = true;
			var transition = (options && options.transition) ? options.transition: this.getTransition(slide),
				duration = (options && options.duration) ? options.duration: this.getDuration(slide),
				previous = this.current.setStyle('z-index', 1),
				next = this.reset(slide);
			var slideData = {
				previous: {
					element: previous,
					index: this.slides.indexOf(previous)
				}, 
				next: {
					element: next,
					index: this.slides.indexOf(next)
				}
			};
			this.fireEvent('show', slideData);
			this.transitions[transition](previous, next, duration, this);
			(function(){ 
				previous.setStyle('display', 'none');
				this.fireEvent('showComplete', slideData);
				this.transitioning = false;
			}).bind(this).delay(duration);
			this.current = next;
		}
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
	
	showNext: function(options){
		this.show(this.nextSlide(), options);
		return this;
	},
	
	showPrevious: function(options){
		this.show(this.previousSlide(), options);
		return this;
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
		var fn = (this.loopMethod == this.showNext) ? this.showPrevious : this.showNext;
		this.setLoop(fn, this.options.delay);
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

SlideShow.adders = {
	
	transitions:{},
	
	add: function(className, fn){
		this.transitions[className] = fn;
		this.implement({
			transitions: this.transitions
		});
	},
	
	addAllThese: function(transitions){
		Array.clone(transitions).each(function(transition){
			this.add(transition[0], transition[1]);
		}, this);
	}
	
}

Object.append(SlideShow, SlideShow.adders);
SlideShow.implement(SlideShow.adders);

SlideShow.add('fade', function(previous, next, duration, instance){
	previous.set('tween', {duration: duration}).fade('out');
	return this;
});

SlideShow.addAllThese([

	['none', function(previous, next, duration, instance){
		previous.setStyle('display', 'none');
		return this;
	}],

	['crossFade', function(previous, next, duration, instance){
		previous.set('tween', {duration: duration}).fade('out');
		next.set('tween', {duration: duration}).fade('in');
		return this;
	}],

	['fadeThroughBackground', function(previous, next, duration, instance){
		var half = duration / 2;
		next.set('tween', {duration: half}).fade('hide');
		previous.set('tween',{
			duration: half,
			onComplete: function(){
				next.fade('in');
			}
		}).fade('out');
	}],
	
	['pushLeft', function(previous, next, duration, instance){
		var distance = instance.element.getSize().x;
		next.setStyle('left', distance).set('tween', {duration: duration}).tween('left', 0);;
		previous.set('tween', {duration: duration}).tween('left', -distance);
		return this;
	}],

	['pushRight', function(p, n, d, i){
		var distance = i.element.getSize().x;
		n.setStyle('left', -distance).set('tween', {duration: d}).tween('left', 0);
		p.set('tween', {duration: d}).tween('left', distance);
		return this;
	}],

	['pushUp', function(p, n, d, i){
		var distance = i.element.getSize().y;
		n.setStyle('top', distance).set('tween', {duration: d}).tween('top', 0);
		p.set('tween', {duration: d}).tween('top', -distance);
		return this;
	}],

	['pushDown', function(p, n, d, i){
		var distance = i.element.getSize().y;
		n.setStyle('top', -distance).set('tween', {duration: d}).tween('top', 0);
		p.set('tween', {duration: d}).tween('top', distance);
		return this;
	}],

	['blindRight', function(p, n, d, i){
		var distance = i.element.getSize().x;
		n.setStyles({
			left: -distance,
			'z-index': 2
		}).set('tween', {duration: d}).tween('left', 0);
		return this;
	}],

	['blindLeft', function(p, n, d, i){
		var distance = i.element.getSize().x;
		n.setStyles({
			left: distance,
			'z-index': 2
		}).set('tween', {duration: d}).tween('left', 0);
		return this;
	}],

	['blindUp', function(p, n, d, i){
		var distance = i.element.getSize().y;
		n.setStyles({
			top: distance,
			'z-index': 2
		}).set('tween', {duration: d}).tween('top', 0);
		return this;
	}],

	['blindDown', function(p, n, d, i){
		var distance = i.element.getSize().y;
		n.setStyles({
			top: -distance,
			'z-index': 2
		}).set('tween', {duration: d}).tween('top', 0);
		return this;
	}],

	['blindDownFade', function(p, n, d, i){
		this.blindDown(p, n, d, i).fade(p, n, d, i);
	}],

	['blindUpFade', function(p, n, d, i){
		this.blindUp(p, n, d, i).fade(p, n, d, i);
	}],

	['blindLeftFade', function(p, n, d, i){
		this.blindLeft(p, n, d, i).fade(p, n, d, i);
	}],

	['blindRightFade', function(p, n, d, i){
		this.blindRight(p, n, d, i).fade(p, n, d, i);
	}]

]);
