Class: SlideShow.CSS {#SlideShow-CSS}
=====================================

Adds CSS3 transitions to SlideShow.

### Extends:

SlideShow

SlideShow.CSS Method: constructor {#SlideShow-CSS:constructor}
-------------------------------------------------------

### Syntax:

	var mySlideShow = new SlideShow.CSS(element, options);

### Arguments:

1. element - (element) The string for an id of an element of an element reference.
2. options - (object) The same options as `SlideShow` plus the following:

### Options:

* useCSS - (*boolean*: defaults to `false`) If true, will override the default transitions with CSS transitions.

### Example:

You'll first want to verify if the browser supports CSS transitions and transforms, I typically use Modernizr:

    #JS
    new SlideShow.CSS('slideshow', {
      useCSS: (Modernizr.csstransitions && Modernizr.csstransforms)
    });

Browsers that support transitions and transforms will use the new CSS transitions instead of the JavaScript transitions.
