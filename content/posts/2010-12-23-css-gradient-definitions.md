---
title: "CSS Gradient Definitions"
date: 2010-12-23T03:26:19Z
categories: ["CSS3"]
tags: [web-development, css, tutorial]
summary: "An update to the CSS3 Gradient Generator that changes how the code sample is generated, moving from the 'background' property to 'background-image' to resolve issues with default values for other background properties."
---

I've just released an update to the <a href="http://gradients.glrzad.com">CSS3 Gradient Generator</a> which changes the way the code sample is generated for users to copy and paste.

The sample has moved to using the `background-image` property instead of the `background` property alone. This change has been made to resolve issues that occur when defining a background with the CSS based gradient but leaving out the other properties common to a background such as position or repeat.  When these attributes are left out, browsers define default values which can yield unexpected results with the CSS gradients.

So, the following:

``` css
background: -webkit-gradient(
    linear,
    left bottom,
    left top,
    color-stop(0.33, rgb(99,168,125)),
    color-stop(0.67, rgb(129,202,163)),
    color-stop(0.84, rgb(155,243,196))
);

background: -moz-linear-gradient(
    center bottom,
    rgb(99,168,125) 33%,
    rgb(129,202,163) 67%,
    rgb(155,243,196) 84%
);
```

Becomes,

``` css
background-image: -webkit-gradient(
    linear,
    left bottom,
    left top,
    color-stop(0.33, rgb(99,168,125)),
    color-stop(0.67, rgb(129,202,163)),
    color-stop(0.84, rgb(155,243,196))
);

background-image: -moz-linear-gradient(
    center bottom,
    rgb(99,168,125) 33%,
    rgb(129,202,163) 67%,
    rgb(155,243,196) 84%
);
```

The live sample on the page also makes use of background-image as well, so you can view that as another reference to this update as well.

Thanks to Avi Mahbubani for pointing out the issue and helping come to a resolution.

