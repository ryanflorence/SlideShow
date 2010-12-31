API from 1.x -> 2.0
-------------------

- `showNext` -> `show('next')`
- `showPrevious` -> `show('previous')`
- `SlideShow.add` -> `SlideShow.addTransition`
- reset method clears all styles, then sets only a few 
- `setup` method initializes everything, reinitialize on demand
- constructor takes a `noSetup` option to prevent initializing everything
- new option for which element attribute to parse
	- Slick now parses that attribute :D
	- ie: `data-slideshow="transition:fade duration:500"`
- `data` object is passed to `addTransition` instead of several args
- Slides now have `slideshow-index` stored with them
- new `index` property containing index of the current slide
