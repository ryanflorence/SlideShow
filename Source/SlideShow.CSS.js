/*
---

name: "SlideShow.CSS"

description: "Adds CSS transform transitions."

license: "MIT-style license."

authors: "Ryan Florence <http://ryanflorence.com>"

requires:
  - SlideShow
  - CSSAnimation/MooTools

provides:
  - CSS

...
*/

;(function(){
	function getAxis(direction){
		return {
			property: (direction == 'left' || direction == 'right') ? 'x' : 'y',
			inverted: (direction == 'left' || direction == 'up') ? 1 : -1
		};
	};
	
	function go(type, axis, data){
		var transition = {
			duration: data.duration + 'ms',
			'timing-function': 'ease',
			property: 'transform'
		};

		if (type == 'blind') data.next.setStyle('z-index', 2);
		if (type != 'slide') data.next.translate(axis.property, 100 * axis.inverted);
		setTimeout(function(){
			if (type != 'slide') data.next.setTransition(transition).translate(axis.property, 0);
			if (type != 'blind') data.previous.setTransition(transition).translate(axis.property, -(100 * axis.inverted));
		}, 100);
	};

	['left', 'right', 'up', 'down'].each(function(direction){
		var capitalized = direction.capitalize(),
			pushName = 'push' + capitalized + 'CSS',
			blindName = 'blind' + capitalized + 'CSS',
			slideName = 'slide' + capitalized + 'CSS';
			
		[
			[pushName, (function(){
				var axis = getAxis(direction);
				
				return function(data){
					go('push', axis, data);
				}
			}())],

			[blindName, (function(){
				var axis = getAxis(direction);
				
				return function(data){
					go('blind', axis, data);
				}
			}())],

			[slideName, (function(){
				var axis = getAxis(direction);
				
				return function(data){
					go('slide', axis, data);
				}
			}())]

		].each(function(transition){
			SlideShow.defineTransition(transition[0], transition[1]);
		});
	});
})();

SlideShow.implement({
	useCSS: function(){
		// Replace transitions with its CSS postfixed variant
		this.transitions.each(function(transition, name){
			var cssTransition = this.transitions[name + 'CSS'];
			if (cssTransition) {
				this.transitions[name] = cssTransition;
			}
		});

		return this;
	}
});