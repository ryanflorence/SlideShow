Class: SlideShow {#SlideShow}
=============================

<big>Easily extendable, class-based, slideshow widget. Use any element, not just images. Comes with packaged transitions but is easy to extend and create your own transitions.  The class is built to handle the _basics_ of a slideshow, extend it to implement your own navigation piece and custom transitions.</big>

### Demo

<iframe src="http://mootools.net/shell/g3nTM/embedded/result,js,html,css/" style="width: 100%; height:500px"></iframe>

### Implements:

Options, Events, [Loop][http://moodocs.net/rpflo/mootools-rpflo/Loop]

### Example

#### html

SlideShow gets the transition information from the class attribute of your slide.  It will only grab the immediate children of the container (`slideshow` in this case).  You can put whatever element type you want as the slides, and put anything inside of the slides.

    #HTML
    <div id="slideshow">
    	<div class="transition:crossFade duration:1000">1</div>
    	<div>2</div> <!-- gets default transition/duration -->
    	<div class="transition:blindRightFade duration:400">3</div>
    	<div class="transition:fade duration:1000">4</div>
    	<div class="transition:pushUp duration:2000">5</div>
    	<div class="transition:pushDown duration:500">6</div>
    </div>

#### javascript

###### constructor

Just pass in the slideshow container element to the constructor (and a few options, if you'd like) and you're set.

    #JS
    mySlideShow2 = new SlideShow('slideshow');
    
    // or

    mySlideShow = new SlideShow('slideshow',{
    	delay: 2000,
    	transition: 'fade',
    	duration: 500,
    	autoplay: true
    });
    
##### Controlling the slideshow

By default, `autoplay` is false and you can control the slide show.

    // show the 4th slide
    mySlideShow.show(mySlideShow.slides[3]);
    
    // or just grab the element if you know it's already in the slideshow
    var el = $('someSlide');
    mySlideShow.show(el);
    
SlideShow implements [Loop](http://mootools.net/forge/p/loop) (also on the forge) so it inherits `startLoop` and `stopLoop`.  SlideShow creates aliases for these as `play` and `pause`.

    mySlideShow.play();
    
    // later
    mySlideShow.pause();
    
If you wanted a navigation piece you could do something like:

    var slideLabels = $$('some-elements-in-the-same-order-as-the-slides');
    
    slideLabels.each(function(el, index){
      el.store('slide', mySlideShow.slides[index]);
    
      el.addEvent('click',function()
        mySlideShow.show(el.retrieve('slide'));
      });
    
    });
    
#### css

SlideShow will set the position of your container to `relative` if it is not already positioned `absolute`.  It will also set all of your slides to `position: absolute`, `display: block`, and `z-index: 0`.  Because they are positioned absolutely you'll need to give them a width.  Also, you'll usually want to set the container overflow to hidden in your CSS.

    #CSS
    div#slideshow {
    	width: 500px;
    	height: 280px;
    	overflow: hidden;
    }

    div#slideshow div {
      width: 500px
    	height: 280px;
    }    


### Adding your own transitions

Adding transitions is a snap.  The Class itself has an `add` function that takes two arguments: the name of the transition, and the function to control it.

The function signature:

  function(previous, next, duration, instance)

* `previous` is the previous slide element reference
* `next` is the next slide element reference
* `duration` is how long the transition should last.
* `instance` is the instance of SlideShow, handy to find the size of the container (`instance.element`) or any other information.

When writing your own transitions there are a few things to note:

1. The previous slide's `z-index` is `1` so it's on top.
2. The next slide's `z-index` is `0` so it's behind.
3. Both slides have `top: 0` and `left:0`, so you'll need to reposition `next` for any fancy movement.
4. All other slides have `display:none`
5. When the `duration` is met, the previous slide will be reset to `display: none`, `top:0`, `left:0`.
 
So here are a few examples:

    SlideShow.add('fade', function(previous, next, duration, instance){
    	previous.set('tween',{duration: duration}).fade('out');
    	return this;
    });

Pretty simple.  Since the next slide is directly behind the previous, we can just fade out the previous slide and there's our new one.

    SlideShow.add('blindLeft', function(previous, next, duration, instance){
      var distance = instance.element.getStyle('width').toInt();
      next.setStyles({
        'left': distance,
        'z-index': 2
      }).set('tween',{duration: duration}).tween('left', 0);
      return this;
    });

A bit more complicated.  First we have to measure the distance our slide needs to travel, then we set it's `left` style to be totally out of the slideshow view and change it's `z-index` from `0` to `2` so it's above the previous slides `z-index: 1`.  Once it's all setup we just tween left back to 0.  Our slide smoothly slides over the the previous slide.
    
    SlideShow.add('blindLeftFade',function(p, n, d, i){
      this.blindLeft(p,n,d,i).fade(p,n,d,i);
    });
    
`this` references the object containing all of the transitions _so you can chain effects_.


SlideShow Method: constructor {#SlideShow:constructor}
-------------------------------------------------------


### Syntax:

	var mySlideShow = new SlideShow(element, options);

### Arguments:

1. element - (element) The string for an id of an element of an element reference.
2. options - (object) See below,


### Options:

* delay - (*number*: defaults to `7000`) Milliseconds between slide transitions
* transition - (*string*: defaults to `crossfade`) Default transition for slides with none specified in the `class` attribute.
* duration - (*number*: defaults to `7000`) Default transisition duration for slides with none specified in the `class` attribute.
* autoplay - (*boolean*: defaults to `false`) Calls `play` method in the contructor if false.

### Events:

* show - (*function*) The function to execute when a slide transition begins.
* showComplete - (*function*) The function to execute when a slide transition finishes.
* play - (*function*) The function to execute when the slide show starts playing.
* pause - (*function*) The function to execute when the slide show pauses.
* reverse - (*function*) The function to execute when the slideshow is reversed.

SlideShow Method: show {#SlideShow:show}
-----------------------------------------

<big>Shows the slide passed in as an argument</big>

### Syntax:

    mySlideShow.show(mySlideShow.slides[2]);

### Arguments:

1. slide - (element) Must be an element reference, not just the string for an id.

### Returns:

This SlideShow instance.


SlideShow Method: showNext {#SlideShow:showNext}
-------------------------------------------------

<big>Shows the next slide</big>

### Syntax:

    mySlideShow.showNext();

### Returns:

This SlideShow instance.

SlideShow Method: showPrevious {#SlideShow:showPrevious}
-------------------------------------------------

<big>Shows the previous slide</big>

### Syntax:

    mySlideShow.showPrevious();

### Returns:

This SlideShow instance.

SlideShow Method: reverse {#SlideShow:reverse}
-----------------------------------------

<big>Reverses the autoplay.</big>

### Syntax:

    mySlideShow.reverse();

### Example:

    mySlideShow.play();
    mySlideShow.reverse(); // going backwards now
    mySlideShow.reverse(); // going forward now

### Returns:

This SlideShow instance.

