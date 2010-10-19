/*
---

name: SlideShow.Nav

description: Mixin for slideshow.  Dynamically generates labels for each slide.

license: MIT-style license.

authors: Ryan Florence <http://ryanflorence.com>

requires:
  - /SlideShow
  - More/Element.Delegation

provides:
  - SlideShow.Nav

...
*/

SlideShow.Nav = new Class({

	options: {
		label: false,
		navClassName: 'slideshow-nav',
		inject: function(element, relativeElement){
			element.inject(relativeElement, 'after');
		}
	},

	buildNav: function(){
		this.nav = new Element('ul.' + this.options.navClassName);
		this.slides.each(function(slide, index){
			var item = new Element('li').inject(this.nav);
			if (this.options.label) item.set('html', slide.get(this.options.label));
			slide.store('slideshow-nav-label', item);
			item.store('slideshow-nav-slide', slide);
		}, this);
		this.options.inject(this.nav, this.element);
		this.attachNav();
		return this;
	},

	destroyNav: function(){
		this.nav.destroy();
		delete this.nav;
		return this;
	},

	attachNav: function(){
		var bound = this.navClick.bind(this);
		this.nav.store('slideshow-nav-handler', bound);
		this.nav.addEvent('click:relay(li)', this.nav.retrieve('slideshow-nav-handler'));
	},

	detachNav: function(){
		this.nav.removeEvent('click:relay(li)', this.nav.retrieve('slideshow-nav-handler'));
		return this;
	},

	navClick: function(event, target){
		this.show(target.retrieve('slideshow-nav-slide'));
	}

});

SlideShow.Nav.mix = function(){ this.buildNav(); };
