/*
---

script: SlideShow.js

description: Easily extendable, class-based, slideshow widget. Use any element, not just images. Comes with packaged transitions but is easy to extend and create your own transitions.  The class is built to handle the basics of a slideshow, extend it to implement your own navigation piece and custom transitions.

license: MIT-style license.

authors: Ryan Florence www.clockfour.com



requires:
  - Loop

provides: [SlideShow]

...
*/


var SlideShow = new Class({
	
	Implements: [Options, Events, Loop],
		
		options: {
			/*
			onShow: $empty,
			onShowComplete: $empty,
			onReverse: $empty,
			onPlay: $empty,
			onPause: $empty,
			onLoop: $empty,
			onLoopShowComplete: $empty
			*/
			delay: 7000,
			transition: 'crossFade',
			duration: '500',
			autoplay: false
		},
	
	initialize: function(element, options){
		this.setOptions(options);
		this.setLoop(this.showNext, this.options.delay);
		this.element = document.id(element);
		this.slides = this.element.getChildren();
		this.current = this.slides[0];
		this.transitioning = false;
		this.setup();
		if (this.options.autoplay) this.startLoop();
	},
	
	setup: function(){
	  this.setupElement();
	  this.setupSlides(true);
		return this;
	},
	
	setupElement: function(){
		var el = this.element;
		if (el.getStyle('position') != 'absolute' && el != document.body) el.setStyle('position','relative');
		return this;
	},
	
	setupSlides: function(hideFirst){
		this.slides.each(function(slide, index){
			this.storeTransition(slide).reset(slide);
			if (hideFirst && index != 0) slide.setStyle('display','none');
		}, this);
		return this;
	},
	
	storeTransition: function(slide){
		var classes = slide.get('class');
		var transitionRegex = /transition:[a-zA-Z]+/;
		var durationRegex = /duration:[0-9]+/;
		var transition = (classes.match(transitionRegex)) ? classes.match(transitionRegex)[0].split(':')[1] : this.options.transition;
		var duration = (classes.match(durationRegex)) ? classes.match(durationRegex)[0].split(':')[1] : this.options.duration;
		slide.store('ssTransition', transition);
		slide.store('ssDuration', duration);
		return this;
	},
	
	resetOptions: function(options){
		this.options = $merge(this.options, options);
		this.setupSlides(false);
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
			var transition = (options && options.transition) ? options.transition: this.getTransition(slide);
			var duration = (options && options.duration) ? options.duration: this.getDuration(slide);
			var previous = this.current.setStyle('z-index', 1);
			var next = this.reset(slide);
			var looped = this.slides.indexOf(next) == 0; // need to check previous slide too
			if (looped) this.fireEvent('loop');
			this.fireEvent('show', [
				previous, 
				this.slides.indexOf(previous), 
				next, 
				this.slides.indexOf(next)
			]);
			this.transitions[transition](previous, next, duration, this);
			(function() { 
				previous.setStyle('display','none');
				this.fireEvent('showComplete', [
					previous, 
					this.slides.indexOf(previous), 
					next, 
					this.slides.indexOf(next)
				]);
				if (looped) this.fireEvent('loopShowComplete');
				this.transitioning = false;
			}).bind(this).delay(duration);
			this.current = next;
		}
		return this;
	},
	
	reset: function(slide){
		return slide.setStyles({
			'position': 'absolute',
			'z-index': 0,
			'display': 'block',
			'left': 0,
			'top': 0
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
		var slideshow = this.retrieve('slideshow');
		if (slideshow) slideshow.pause();
		return this.eliminate('slideshow').store('slideshow:options', options);
	},

	get: function(options){
		if (options || !this.retrieve('slideshow')){
			if (options || !this.retrieve('slideshow:options')) this.set('slideshow', options);
			this.store('slideshow', new SlideShow(this, this.retrieve('slideshow:options')));
		}
		return this.retrieve('slideshow');
	}

};


Element.implement({
	
	play: function(options){
		this.get('slideshow', options).play();
		return this;
	},
	
	pause: function(options){
		this.get('slideshow', options).pause();
		return this;
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
	
	addAllThese : function(transitions){
		$A(transitions).each(function(transition){
			this.add(transition[0], transition[1]);
		}, this);
	}
	
}

$extend(SlideShow, SlideShow.adders);
SlideShow.implement(SlideShow.adders);

SlideShow.add('fade', function(previous, next, duration, instance){
	previous.set('tween',{duration: duration}).fade('out');
	return this;
});

(function(){

var _moveElement = function(direction,instance){
	
};

var _push = function(direction, previous, next, duration, instance){
	var horizontal = (direction == 'left' || direction == 'right');
	var	coordinate = (horizontal) ? 'x' : 'y';
	var ops = {
		style: (horizontal) ? 'left' : 'top',
		invert: (direction == 'left' || direction == 'up'),
		distance: instance.element.getSize()[coordinate]
	};
	next.setStyle(ops.style, (ops.invert) ? ops.distance : -ops.distance);
	[next, previous].each(function(slide){
		var start = slide.getStyle(ops.style).toInt();
		var to = (ops.invert) ? start - ops.distance : start + ops.distance;
		slide.set('tween',{duration: duration}).tween(ops.style, to);
	});
	
};

var _blind = function(direction)

SlideShow.addAllThese([

	['none', function(previous, next, duration, instance){
		previous.setStyle('display','none');
		return this;
	}],

	['crossFade', function(previous, next, duration, instance){
		previous.set('tween',{duration: duration}).fade('out');
		next.set('tween',{duration: duration}).fade('in');
		return this;
	}],

	['fadeThroughBackground', function(previous, next, duration, instance){
		var half = duration/2;
		next.set('tween',{ duration: half	}).fade('hide');
		previous.set('tween',{
			duration: half,
			onComplete: function(){
				next.fade('in');
			}
		}).fade('out');
	}],

	['pushLeft', function(p,n,d,i){
		_push('left',p,n,d,i);
		return this;
	}],

	['pushRight', function(p,n,d,i){
		_push('right',p,n,d,i);
		return this;
	}],

	['pushDown', function(p,n,d,i){
		_push('down',p,n,d,i);
		return this;
	}],

	['pushUp', function(p,n,d,i){
		_push('up',p,n,d,i);
		return this;
	}],

	['blindLeft', function(previous, next, duration, instance){
		var distance = instance.element.getSize().x;
		next
			.setStyles({
				'left': distance,
				'z-index': 1
			})
			.set('tween',{duration: duration})
			.tween('left', 0);
		return this;
	}],

	['blindRight', function(previous, next, duration, instance){
		var distance = instance.element.getSize().x;
		next
			.setStyles({
				'left': -distance,
				'z-index': 1
			})
			.set('tween',{duration: duration})
			.tween('left', 0);
		return this;
	}],

	['blindUp', function(previous, next, duration, instance){
		var distance = instance.element.getSize().y;
		next
			.setStyles({
				'top': distance,
				'z-index': 1
			})
			.set('tween',{duration: duration})
			.tween('top', 0);
		return this;
	}],

	['blindDown', function(previous, next, duration, instance){
		var distance = instance.element.getSize().y;
		next
			.setStyles({
				'top': -distance,
				'z-index': 1
			})
			.set('tween',{duration: duration})
			.tween('top', 0);
		return this;
	}],

	['blindDownFade', function(p,n,d,i){
		this.blindDown(p,n,d,i).fade(p,n,d,i);
	}],

	['blindUpFade', function(p,n,d,i){
		this.blindUp(p,n,d,i).fade(p,n,d,i);
	}],

	['blindLeftFade', function(p,n,d,i){
		this.blindLeft(p,n,d,i).fade(p,n,d,i);
	}],

	['blindRightFade', function(p,n,d,i){
		this.blindRight(p,n,d,i).fade(p,n,d,i);
	}]

]);
	
})();

