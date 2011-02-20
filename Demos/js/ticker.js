/*

// without all the JSONP fancy pants this would be as simple as:

$('ticker-slideshow').playSlideShow({
	transition: 'pushUp',
	delay: 3000,
	duration: 250,
	autoplay: true
});

*/

document.addEvent('domready', function(){

	var el = $('ticker-slideshow');

	var ticker = new SlideShow(el, {
		transition: 'pushUp',
		delay: 3000,
		duration: 250,
		autoplay: true
	}, true); // don't setup until the JSONP request is done

	new Request.JSONP({
		url: 'https://ajax.googleapis.com/ajax/services/search/news',
		callbackKey: 'callback',
		data: { q: 'HTML5', v: '1.0', rsz: 8 },
		onComplete: handleJSON
	}).send();

	function handleJSON(data){
		// creates some very simple html, just a bunch of links
		var template = '<a class=item href={href}><i></i>{title}</a>',
			html = '';

		data.responseData.results.each(function(item){
			html += template.substitute({
				href: item.unescapedUrl,
				title: item.titleNoFormatting
			});
		});

		// dump the html into the slideshow element
		el.set('html', html);

		// setup the slideshow now that we've got some slides
		// the actual slideshow is quite simple
		ticker.setup();

		// some usability considerations
		el.addEvents((function(){
			var timer;
			return {
				mouseenter: function(){
					clearTimeout(timer);
					ticker.pause();
				},
				mouseleave: function(){
					timer = (function(){
						ticker.show('next').play()
					}).delay(1500);
				}
			}
		}()));

	}

});