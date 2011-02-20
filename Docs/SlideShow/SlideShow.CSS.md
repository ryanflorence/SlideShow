SlideShow.CSS {#SlideShow-CSS}
==============================

Adds CSS3 transitions to SlideShow.  Experimental!

### Dependencies

* [CSSAnimation](http://github.com/rpflorence/cssanimation)

SlideShow function: useCSS {#SlideShow:useCSS}
--------------------------------------------

Overrides the default transitions with CSS transitions.

### Syntax:

    SlideShow.useCSS();

### Example:

You'll first want to verify if the browser supports CSS transitions and transforms, I typically use Modernizr:

    #JS
    if (Modernizr.csstransitions && Modernizr.csstransforms){
      SlideShow.useCSS();
    }

Browsers that (think they) support transitions and transforms will use the new CSS transitions instead of the JavaScript transitions.
