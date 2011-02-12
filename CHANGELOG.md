### 1.x -> 2.0

This release brings with it lots of new features, better performance, and less code, what more could you ask for?

- [New] SlideShow.CSS, transitions and method to use CSS3 transitions
- [Changed] `showNext` -> `show('next')`
- [Changed] `showPrevious` -> `show('previous')`
- [Changed] `SlideShow.add` -> `SlideShow.defineTransition`
- [Changed] `SlideShow.add` -> `SlideShow.defineTransition`
- [New] `SlideShow.defineTransitions` - define multiple transitions at once
- [New] `setup` method initializes everything, reinitialize on-demand
- [New] constructor takes a `noSetup` option to prevent initializing everything
- [New] `dataAttribute` option for which element attribute to parse
- [New] `selector` option, select whichever elements you want instead of just immediate children
- [Changed] `data` object is passed to `defineTransition` instead of several args
- [New] Slide Elements now have `slideshow-index` stored with them
- [New] `index` property containing index of the current slide
