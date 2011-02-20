Class: SlideShow {#SlideShow}
=============================

Extensible mid-level class that manages transitions of elements that share the same space, typically for slideshows, tabs, and galleries.

### [Demos](http://ryanflorence.com/slideshow)

### Implements:

Options, Events, [Loop](https://github.com/rpflorence/Loop)


SlideShow Method: constructor {#SlideShow:constructor}
-------------------------------------------------------

### Syntax:

	var mySlideShow = new SlideShow(element[, options, noSetup]);

### Arguments:

1. element - (element) The string for an id of an element of an element reference.
2. options - (object) See below
3. noSetup - (boolean) Prevents the slideshow from initializing (useful for loading dynamic data before initializing)

### Options:

* delay - (*number*: defaults to `7000`) Milliseconds between slide transitions.
* transition - (*string*: defaults to `crossfade`) The transition animation for all slides.
* duration - (*number*: defaults to `7000`) Duration of the transition animation.
* autoplay - (*boolean*: defaults to `false`) Calls `play` upon initialization.
* dataAttribute - (*string*: defaults to `data-slideshow`) The element attribute from which to pull transition options.
* selector - (*CSS string*: defaults to `> *`) The selector used to find the slides relative to the slideshow element.

### Events:

* show - (*function*) The function to execute when a slide transition begins.
* showComplete - (*function*) The function to execute when a slide transition finishes.
* play - (*function*) The function to execute when the slide show starts playing.
* pause - (*function*) The function to execute when the slide show pauses.
* reverse - (*function*) The function to execute when the slideshow is reversed.

SlideShow Event: onShow {#SlideShow:onShow}
-------------------------------------------

* (*function*) Executes when a slide transition begins.

### Signature

    onShow(slideData)

### Arguments

*   slideData - (*object*) An object containing slide data that looks like

### Example

    mySlideShow.addEvent('show', function(slideData){
      slideData.next.element; // the actual DOM element
      slideData.next.index; // the index of the element in the slideshow
      slideData.previous.element;
      slideData.prevoius.index;
    });

SlideShow Event: onShowComplete {#SlideShow:onShowComplete}
-------------------------------------------

* (*function*) Executes when a slide transition ends.

### Signature

    onShowComplete(slideData)

### Arguments

*   slideData - (*object*) An object containing slide data the same as `onShow`.

SlideShow Method: show {#SlideShow:show}
-----------------------------------------

Transitions from one slide to another.

### Syntax:

    mySlideShow.show(what, [options]);

### Arguments:

1. what - (*mixed*) Accepts the following arguments:
  - *string* `next` - shows the next slide
  - *string* `previous` - shows the previous slide
  - *number* - the index of a slide to show
  - *element* - slide element to show
2. options - (*object*) An object literal containing a duration and transition to use instead of what's already defined for the element, same format as the class options.

### Returns:

This SlideShow instance.

### Examples:

    mySlideShow.show('next');
    mySlideShow.show('previous');
    mySlideShow.show(2); // index
    mySlideShow.show($('some-slide')); // element reference
    
    // change the duration and transition
    mySlideShow.show('next', {
      duration: '4000',
      transition: 'pushLeft'
    });

SlideShow Method: setup {#SlideShow:setup}
-----------------------------------------

Called automatically in the constructor, unless the `noSetup` argument is provided.  Initializes the slideshow, you can reinitialize on demand.  Mostly useful when slides are dynamically added.

### Syntax:

    mySlideShow.setup([options]);

### Arguments:

1. options - (*object*) Same options as the constructor.

### Returns:

This SlideShow instance.

### Example:

    mySlideShow.setup({
      delay: 5000
    });



SlideShow Method: play {#SlideShow:play}
-----------------------------------------

Auto-plays the slideshow on the `options.delay`.

### Syntax:

    mySlideShow.play();

### Returns:

This SlideShow instance.



SlideShow Method: pause {#SlideShow:pause}
-----------------------------------------

Pauses the auto-play.

### Syntax:

    mySlideShow.pause();

### Returns:

This SlideShow instance.



SlideShow Method: reverse {#SlideShow:reverse}
-----------------------------------------

Reverses the slideshow auto-play direction.

### Example:

    mySlideShow.play();
    mySlideShow.reverse(); // going backward now
    mySlideShow.reverse(); // going forward now

### Returns:

This SlideShow instance.




SlideShow function: defineTransition {#SlideShow:defineTransition}
------------------------------------------------------------

Adds a custom transition to the SlideShow class to be used in any instances.

### Syntax:

    SlideShow.defineTransition(name, function(data){
      // code
    });

### Signature:

    function(data)

* `data.previous` the previous slide element
* `data.next` the next slide element
* `data.duration` how long the transition should last
* `data.instance` the instance of SlideShow

### Example:

    SlideShow.defineTransition('flash', function(data){
      // hide the "current" slide immediately
      data.previous.setStyle('display', 'none');

      // fade out the next slide immediately
      data.next.setStyle('opacity', 0);

      // fade the next slide in, creating a "flash" effect
      new Fx.Tween(data.next, {
        duration: data.duration,
        property: 'opacity'
      }).start(1);
    });

### Notes

When a transition starts:

1. The previous slide's `z-index` is `1` so it's on top.
2. The next slide's `z-index` is `0` so it's behind.
3. All other slides have `display:none`
4. When the `duration` is met, the previous slide will be reset to `display: none`, and all other styles wiped out, so you don't need to worry about removing styles you've changed during the transition.


SlideShow function: defineTransition {#SlideShow:defineTransition}
------------------------------------------------------------

Same as `defineTransition` except that it takes an object map of transition names and functions.

### Example:

    SlideShow.defineTransitions({
      flash: function(){
        // code
      },
      'bounce-slide': function(){
        // code
      }
    });


SlideShow property: current {#SlideShow:current}
------------------------------------------------

Contains an element reference to the current slide.

### Syntax:

    slideshow.current

SlideShow property: index {#SlideShow:index}
--------------------------------------------

Contains the index of the current slide.  Useful when varying transitions dependent upon the current slide.

### Syntax:

    slideshow.index

SlideShow property: slides {#SlideShow:slides}
----------------------------------------------

A collection of element references of all slides.

### Syntax

    slideshow.slides

Native: Element {#Element}
==========================

Custom Native to allow all of its methods to be used with any DOM element via the dollar function $.


Element method: playSlideShow {#Element:playSlideShow}
------------------------------------------------------

Element shortcut method to create a slideshow instance with this element.

### Syntax:

    $('slide-container').playSlideShow(options);

### Arguments:

1. options (*object*) - Same options as the constructor except `autoplay` will be ignored.

Element method: pauseSlideShow {#Element:pauseSlideShow}
------------------------------------------------------

Element shortcut method to pause a slideshow instance created with the `playSlideShow` method.

### Syntax:

    $('slide-container').pauseSlideShow();

Element storage: slideshow-index #{Element:slideshow-index}
-----------------------------------------------------------

Each slide has its index stored with it.

### Syntax

    element.retrieve('slideshow-index');

Deprecated
==========

SlideShow Method: showNext {#Deprecated:showNext}
-------------------------------------------------

Deprecated, use `show('next')`.

SlideShow Method: showPrevious {#Deprecated:showPrevious}
-------------------------------------------------

Deprecated, use `show('previous')`.

SlideShow Method: resetOptions {#Deprecated:resetOptions}
--------------------------------------------------------

Deprecated, use `setup(options)`.

SlideShow function: add {#Deprecated:add}
----------------------------------------

Deprecated, use `addTransition`

SlideShow changelog {#SlideShow:changelog}
------------------------------------------

### 1.x -> 2.0

This release brings with it lots of new features, better performance, and less code, what more could you ask for?

- [New] SlideShow.CSS, transitions and method to use CSS3 transitions
- [Changed] `showNext` -> `show('next')`
- [Changed] `showPrevious` -> `show('previous')`
- [Changed] `SlideShow.add` -> `SlideShow.defineTransition`
- [New] `SlideShow.defineTransitions` - define multiple transitions at once
- [New] `setup` method initializes everything, reinitialize on-demand
- [New] constructor takes a `noSetup` argument to prevent initializing everything
- [New] `dataAttribute` option for which element attribute to parse
- [New] `selector` option, select whichever elements you want instead of just immediate children
- [Changed] `data` object is passed to `defineTransition` instead of several args
- [New] Slide Elements now have `slideshow-index` stored with them
- [New] `index` property containing index of the current slide
