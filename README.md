SlideShow
=========

![SlideShow](http://github.com/rpflorence/SlideShow/raw/master/logo.png)

The ultimate, class-based, slideshow class. Use any element, not just images. so it's prefect for galleries, newstickers, whatever.  Comes with packaged transitions but is ridiculously easy to extend and create your own transitions.

How to use
----------

#### html

    <div id="slides">
    	<div class="transition:crossFade duration:1000">1</div>
    	<div class="transition:blindLeft duration:500">2</div>
    	<div class="transition:blindRightFade duration:400">3</div>
    	<div class="transition:fade duration:1000">4</div>
    	<div class="transition:pushUp duration:2000">5</div>
    	<div class="transition:pushDown duration:500">6</div>
    </div>

#### css

    div#slides {
    	position: relative;
    	width: 500px;
    	height: 280px;
    	overflow: hidden;
    }

    div#slides div {
    	position: absolute;
    	width: 500px;
    	height: 280px;
    }

#### javascript
    mySlideShow = new SlideShow('slides',{
    	delay: 2000
    }).startLoop();
    
    

Extending SlideShow with your own transitions
---------------------------------------------

    SlideShow.add('fade', function(previous, next, duration, instance){
    	previous.set('tween',{duration: duration}).fade('out');
    	return this;
    });
    
    SlideShow.add('blindLeft', function(previous, next, duration, instance){
      var distance = instance.element.getStyle('width').toInt();
      next.setStyles({
        'left': distance,
        'z-index': 1
      }).set('tween',{duration: duration}).tween('left', 0);
      return this;
    });
    
    SlideShow.add('blindLeftFade',function(previous, next, duration, instance){
      this.blindLeft(previous, next, duration, instance).fade(previous, next, duration, instance);
    });
    
That's it!  The class will handle resetting just about anything you might to to the previous tween's styles.

Yes, that last one combines the previous two effects into one.

View the [MooDoc](http://moodocs.net/rpflo/mootools-rpflo/SlideShow) for more usage and examples.
