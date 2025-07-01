---
title: "FB.ui Dialog Position bug in Webkit"
date: 2012-06-02T21:14:30Z
categories: ["JavaScript"]
tags: [facebook, javascript, bug-fixes, webkit, browser-compatibility]
summary: "Fix a centering issue of FB.Dialog's within scrolled pages in Webkit."
---

Recently while working with the Facebook app requests with the Facebook JavaScript SDK I ran into a slight issue when working with long scrolling pages.

By design, the Facebook dialog should open within the middle of the user's screen which works great in Firefox and IE. However due to a bug in webkit (that appears to have been around for some time now) the dialog does not take into account the user's scroll position. This is because webkit always returns 0 when calling document.documentElement.scrollTop no matter where the user has scrolled on the page.

The fix lies within the FB.Dom module, specifically the [getViewportInfo method](https://github.com/facebook/facebook-js-sdk/blob/master/src/common/dom.js#L213-229). Instead of relying on document.documentElement for the scrollTop position in all CSS1Compat browsers that have it, degrade to the document.body if no value is found.

I've submitted a [pull request](https://github.com/facebook/facebook-js-sdk/pull/3) on Facebook's Github repository with a fix but in the meantime if you need to fix this yourself you can overwrite the existing FB.Dom.getViewportInfo method:

```javascript
FB.Dom.getViewportInfo: function() {
	// W3C compliant, or fallback to body
	var root = (document.documentElement && document.compatMode == 'CSS1Compat')
	  ? document.documentElement
	  : document.body;
	return {
	  scrollTop  : root.scrollTop || document.body.scrollTop,
	  scrollLeft : root.scrollLeft,
	  width      : self.innerWidth  ? self.innerWidth  : root.clientWidth,
	  height     : self.innerHeight ? self.innerHeight : root.clientHeight
	};
}
```
