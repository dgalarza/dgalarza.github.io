---
title: "CSS3 Transition Idiom"
date: 2012-04-02T02:58:25Z
categories: ["CSS3"]
tags: ["css3-transitions", "css3"]
summary: "Exploring the use of CSS3 transitions, including browser feature detection, graceful degradation, and a simple idiom for applying transitions with fallbacks to JavaScript animations. Discusses the benefits of CSS transitions and methods for detecting browser support."
---

As more browsers are starting to support CSS3 transitions I've found myself trying to take advantage of their
availability more and more. The issue often that comes with this the fact that many times, we need to support
transitions in browsers which do not support them through JavaScript. While some people question the
extra work being performed in order to get CSS transitions working, I feel that the effort isn't as great as it seems.  The benefits of using CSS transitions are great and I feel the effort is well worth it.

* **Smoother Experience** CSS transitions offer a smoother experience when compared to JavaScript animations. Since everything is being handled natively by the browser engine, we can get much smoother transitions.
* **Mobile Performance** This subcategory to the first note. While CSS transitions will most always provide a smoother experience in regular browsers, mobile devices will benefit from this the most. Since mobile devices lack the power that our desktops have, taking advantage of the browser engine for transitions is a must.

## Gracefully Degrading

In most cases front end developers will err on the side of progressive enhancement. That is, to provide users who support newer technologies an experience with these technologies and user's who do not support it
will be left behind, in a usable state just without the bells and whistles. I consider this following method to be graceful degradation instead. The reason behind this is that we will not be removing the transition effects
all together from the page, but rather the method that we are using to apply the transition will be different, degrading to JavaScript animations when CSS transitions are not available (More on this later).

### Detecting our features

Moving forward with our graceful degradation, we must determine how to apply the transition effect for the user. This should almost never be done via browser agent detection but rather through feature detection. Instead of only serving
CSS transitions to certain versions of a browser we should instead detect whether or not the user supports our feature, in this case, CSS transitions. This can be done through JavaScript early on before trying to transition. One option is to
use the open source JavaScript library [Modernizr](http://www.modernizr.com/). Modernizr will detect the HTML5 and CSS3 features that the browser has and you have the option to populate your HTML tag with classes which describe support. Along with these CSS classes,
a Modernizr object is created which you can check with JavaScript to see features that are supported. Modernizr even supports the ability for you to customize the features it detects. If you plan on using a lot of feature detection, then I highly recommend using
Modernizr.

However, in some cases you may not need all of the features that Modernizr provides and it would be wasteful to add the bloat it provides or we simply may not be able to add Modernizr to our page. In this case we can detect features ourselves. For our transitions example we will need to detect whether or not a CSS3 property is available in the user's browser.  Since as of this writing the transition property is prefixed by the vendor we will need to run through and check each vendor prefix version of the transition property to see if the users' browser supports it or not.

``` javascript
// Check for CSS3 Transition Support
var doc = document;

var css_transitions = function() {
    var el = doc.createElement('div');
    var vendors = ['', 'Khtml', 'Ms', 'Moz',' Webkit','O'];

    for (var i = 0, len = vendors.length; i < len; i++) {
        var prop = vendors[i] + 'Transition';
        if (prop in el.style) return true;
    }

    return false;
}();
```

First, we create a test element in memory to test against. Then we create an array of vendor prefixes `['', 'Khtml', 'Ms', 'Moz', 'Webkit', 'O']`. Note that our first entry is a blank string. This is so that when browsers have fully implemented the transition spec and vendor prefixes are no longer used, we detect the feature correctly. Now we loop through the array. For each iteration we create a property to test which is a combination of the vendor prefix and our base property, in this case Transition. So for example. we will test `MozTransition`.
We test to see if the property exists as part of the test elements style property. If this comes back true, then our browser supports CSS transitions. In the case of our example we execute our function immediately and store the result in a variable called `css_transitions`.

### Putting our css_transitions variable to use

Now that we've determined whether or not the user's browser supports CSS transitions we need to go put it to work. In this case, let's transition the opacity of an element:

``` html
<style type="text/css">
    .transition-me {
        -o-transition(opacity 0.25s linear 0s);
        -moz-transition(opacity 0.25s linear 0s);
        -webkit-transition(opacity 0.25s linear 0s);
        -ms-transition(opacity 0.25s linear 0s);
        transition(opacity 0.25s linear 0s);
    }
</style>
```

In this example we will use jQuery which provides us with a rather handy syntax for changing CSS properties on an element or calling an animation on an element.  The syntax for each
actually matches exactly when used which allows us to use a pretty simple idiom to transition with.

``` javascript
// Fade out .transition-me elements
var method = (css_transitions) ? 'css' : 'method';
$('.transition-me')[method]({
    opacity: 0
});
```

If you visit the jQuery documentation both the [css](http://api.jquery.com/css/) and [animate](http://api.jquery.com/animate/) support a map syntax which allows us to send an object to the
method call with a property we want to transition as the key and the value to transition to as the value. With this in mind, we can simply call the appropriate method (css or transition) on
the element we want to transition.

## A note on Progressive Enhancement

While this particular post discusses how to apply graceful degradation to CSS transitions there is still room for some progressive enhancement. What I mean by this is there are certain times where
a transition or animation is key to the user's experience. Transitions help guide the user through changes on the page. There are times however where transitions are just applied to add a certain level
of eye candy. It is this class of transition that I would simply not provide in browsers which do not support it since they are not key to the user's experience with the page.

