Class: SlideShow {#SlideShow}
=============================

<big>The ultimate, class-based, slideshow class. Use any element, not just images. so it's prefect for galleries, newstickers, whatever.  Comes with packaged transitions but is ridiculously easy to extend and create your own transitions</big>

### Demo

<iframe src="http://mooshell.net/QqFPw/embedded/result,js,html,css" style="width: 100%; height:400px"></iframe>

### Example

#### html

    <div id="slides">
    	<div class="transition:crossFade duration:1000">1</div>
    	<div class="transition:blindLeft duration:500">2</div>
    	<div class="transition:blindRightFade duration:400">3</div>
    	<div class="transition:fade duration:1000">4</div>
    	<div class="transition:pushUp duration:2000">5</div>
    	<div class="transition:pushDown duration:500">6</div>
    </div>

#### javascript
    mySlideShow = new SlideShow('slides',{
    	delay: 2000
    }).startLoop();

### Implements:

Options, Events, [Loop][http://moodocs.net/rpflo/mootools-rpflo/Loop]

### Note:

Your slideshow container needs to have either `position: absolute` or `relative`.

SlideShow Method: constructor {#SlideShow:constructor}
-------------------------------------------------------


### Syntax:

	var mySlideShow = new SlideShow(element, options);

### Arguments:

1. element - (element) The string for an id of an element of an element reference.
2. options - (object) See below

### Options:

* delay - (number: defaults to 7000)


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


