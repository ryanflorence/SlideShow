SlideShow.CSS {#SlideShow-CSS}
==============================

Adds CSS3 transitions to SlideShow.

SlideShow Method: useCSS {#SlideShow:useCSS}
--------------------------------------------

Overrides the default transitions with CSS transitions.

### Syntax:

    mySlideShow.useCSS();

### Example:

You'll first want to verify if the browser supports CSS transitions and transforms, I typically use Modernizr:

    #JS
    var slideshow = new SlideShow('slideshow');
    if (Modernizr.csstransitions && Modernizr.csstransforms){
      slideshow.useCSS();
    }

Browsers that support transitions and transforms will use the new CSS transitions instead of the JavaScript transitions.
