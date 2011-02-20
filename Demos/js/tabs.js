var Tabs = new Class({

	Extends: SlideShow,

	options: {
		selector: '.tab',
		tabSelector: '> ul a',
		transition: 'none',
		duration: 0
	},

	initialize: function(element, options){
		this.parent(element, options);
		this.bound = { tabClick: this.tabClick.bind(this) };
		this.navs = this.element.getElements(this.options.tabSelector);
		this.addEvent('show', function(data){
			this.navs[data.previous.index].removeClass('current');
			this.navs[data.next.index].addClass('current');
		});
		this.attach();
	},

	tabClick: function(event){
		if (this.navs.contains(event.target)){
			event.preventDefault();
			this.show(this.navs.indexOf(event.target));
		}
	},

	attach: function(){
		this.element.addEvent('click', this.bound.tabClick);
		return this;
	},

	detach: function(){
		this.element.removeEvent('click', this.bound.tabClick);
		return this;
	}

});

document.addEvent('domready', function(){
	new Tabs('tabs-slideshow');
});
