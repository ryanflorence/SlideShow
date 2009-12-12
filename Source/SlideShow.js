var SlideShow = new Class({
	
	Implements: [Options, Events, Loop],
		
		options: {
			delay: 4000
		},
	
	transitions: {},
		
	initialize: function(container, options){
		this.setOptions(options);
		this.setLoop(this.showNext, this.options.delay);
		this.container = document.id(container);
		this.slides = this.container.getChildren();
		this.current = this.slides[0];
		this.setup();
	},
	
	setup: function(){
		this.slides.each(function(slide, index){
			this.storeTransition(slide);
			if(index != 0) slide.setStyle('display','none');
		}, this);
	},
	
	storeTransition: function(slide){
		var classes = slide.get('class');
		var transitionRegex = /transition:[a-zA-Z]+/;
		var durationRegex = /duration:[0-9]+/;
		var transition = classes.match(transitionRegex)[0].split(':')[1];
		var duration = classes.match(durationRegex)[0].split(':')[1];
		slide.store('ssTransition', transition);
		slide.store('ssDuration', duration);
		return this;
	},
	
	getTransition: function(slide){
		return slide.retrieve('ssTransition');
	},
	
	getDuration: function(slide){
		return slide.retrieve('ssDuration');
	},
	
	show: function(slide){
		var transition = this.getTransition(slide);
		var duration = this.getDuration(slide);

		var previous = this.current.setStyle('z-index',2);
		var next = this.makeVisible(slide);

		SlideShow.transitions[transition](previous, next, duration, this);
		(function() { previous.setStyle('display','none'); }).bind(this).delay(duration);
		this.current = next;
	},
	
	makeVisible: function(slide){
		return slide.setStyles({
			'z-index': 1,
			'display': 'block'
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
	
	showNext: function(){
		this.show(this.nextSlide());
		return this;
	}
	
});

SlideShowTransitions = {
	
	crossfade: function(previous, next, duration, instance){
		previous.set('tween',{duration: duration}).fade('out');
		next.set('tween',{duration: duration}).fade('in');
		console.log(instance);
		return instance;
	},
	
	fade: function(previous, next, duration, instance){
		previous.set('tween',{duration: duration}).fade('out');
		console.log(instance);
		return instance;
	},
	
	pushLeft: function(previous, next, duration, instance){
		next.setStyle('left', instance.container.getSize().x);
		[next, previous].each(function(slide){
			slide.set('tween',{duration: duration});
		});
		return instance;
	}
	
};