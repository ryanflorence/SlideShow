API from 1.0 -> 2.0
-------------------

- Add transitions with `SlideShow.addTransition`, instead of `add`.
- `data` object is passed to `addTransition` instead of several args
- `showNext` -> `show('next')`
- `showPrevious` -> `show('previous')`
- reset method clears all styles
- Slides now have `slideshow-index` stored with them