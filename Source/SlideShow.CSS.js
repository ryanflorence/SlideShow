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
	}

	function go(type, axis, data){
		var transition = {
			duration: data.duration + 'ms',
			'timing-function': 'ease',
			property: 'transform'
		};

		if (type == 'blind')
			data.next.setStyle('z-index', 2);

		if (type != 'slide')
			data.next.translate(axis.property, 100 * axis.inverted);

		setTimeout(function(){
			if (type != 'slide')
				data.next.setTransition(transition).translate(axis.property, 0);
			if (type != 'blind')
				data.previous.setTransition(transition).translate(axis.property, -(100 * axis.inverted));
		}, 0);

	}

	['left', 'right', 'up', 'down'].each(function(direction){

		var capitalized = direction.capitalize(),
			blindName = 'blind' + capitalized + 'CSS',
			slideName = 'slide' + capitalized + 'CSS';

		[

			['push' + capitalized + 'CSS', (function(){
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

SlideShow.useCSS = function(){
	['left', 'right', 'up', 'down'].each(function(direction){
		var capitalized = direction.capitalize(),
			blindName = 'blind' + capitalized,
			slideName = 'slide' + capitalized;
		SlideShow.transitions[blindName] = SlideShow.transitions[blindName + 'CSS'];
		SlideShow.transitions[slideName] = SlideShow.transitions[blindName + 'CSS'];
		SlideShow.transitions['push' + capitalized] = SlideShow.transitions['push' + capitalized + 'CSS'];
	});
	return this;
}
