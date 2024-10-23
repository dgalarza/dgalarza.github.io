---
title: "Bringing back the image map"
date: 2010-12-27T18:34:59Z
categories: ["JavaScript"]
tags: []
summary: "A look at using image maps in modern web development, including a case study on creating clickable triangular areas, handling multiple instances of the same image map, and using JavaScript to determine which image was clicked."
---

I've just finished working with an image map for the first time in a while. Now, you may be thinking, "Why in the world would anyone want to touch an image map?", but they still do serve a purpose. Image maps are still in fact part of the [HTML5 specification](http://www.whatwg.org/specs/web-apps/current-work/multipage/the-map-element.html#image-map).

### Case Study
So why the image map? Take a look at the following image:

![Case Study](/images/map-case-study.gif)

So our image above is triangular, and is intended to be clickable.  The expectation is that only the triangular area should be clickable. So in order to accomplish this, I've decided to move forward with using an image map.

Things get a bit more complicated, though. The image above is actually repeated many times on a page. It acts as a flag to being a favorite of sorts. Furthermore, we are not simply sending the user to a page link, we are looking to use JavaScript events on the image map (and unobtrusively at that). This unobtrusive JavaScript must send an ajax request to the server depending on which instance of the image is actually being clicked. So we have our work cut out for us.

### Setting up the image map
Getting the image map set up is pretty simple. Let's start with defining the map:

``` html
<map name="my-map">
    <area id="fav-area" shape=poly, coords="0,0, 46,0, 46,46" href="#fav"> 
</map>
```

We've defined a map named `my-map` with some coordinates. Note our shape is set to poly and the coordinates provided. In order to determine these coordinates I simply opened up Photoshop and grabbed the x and y coordinates of the 3 corners of the triangle. Along with that, since we have no intent on passing the user to an actual link we've provided a dummy hash on the href.

### Setting up the image
So now the the map is defined we'll create an instance of the image and have it use the map we made:

``` html
<img src="/images/map-case-study.gif" usemap="#my-map">
```

### Adding an event handler
Adding an event handler is pretty straight forward as you might expect. I'll be using jQuery for the demonstration.

``` javascript
$(function() {
	$('map[name=my-map] #fave-area').click(function (e) {
		e.preventDefault();
		alert('Clicked!');
	});
});
```

So we can still target and add an event as you normally would to the area.

### Multiple instances of the same image and image map
Now that we have our image map set up, let's move forward with the more complicated setup.  Take the HTML structure below:

``` html
<div id="node-1" class="my-node">
	<img id="study-1" src="/images/map-case-study.gif" usemap="#my-map">
</div>

<div id="node-2" class="my-node">
	<img id="study-2" src="/images/map-case-study.gif" usemap="#my-map">
</div>

<div id="node-3" class="my-node">
	<img id="study-3" src="/images/map-case-study.gif" usemap="#my-map">
</div>

<map name="my-map">
	<area id="fav-area" shape=poly, coords="0,0, 46,0, 46,46" href="#fav">
</map>
```

We have multiple nodes which aim to make use of the same case-study image and they all use the same image map to define the clickable area. Now the problem is, how do we determine which image was actually clicked?

Well first, we can make use of a DOM method called `elementFromPoint`. This method allows you to pass in x and y coordinates and retrieve the element that is found at the given coordinates. I never knew that this method existed until today and it's a pretty interesting find.

### Putting elementFromPoint to use

``` javascript
$(function() {
	$('map[name=my-map] #fave-area').click(function (e) {
		e.preventDefault();
		var trigger = document.elementFromPoint(e.clientX, e.clientY);
		alert(trigger.id);
	});
});
```

So we take the coordinates of the actual click event and pass it to the elementFromPoint function to grab the actual element the user was trying to click.  One problem still exists though: This works fine in Firefox and Safari but Chrome (and IE as some have reported) will still return the map area when using elementFromPoint.  In order to counter this, I've found that disabling the image map before running elementFromPoint will then yield our expected element. Of course, once we're done finding the element we must re-enable the image map.

So how do we do this? Take a look at the final JavaScript:

``` javascript
$(function() {
	$('map[name=my-map] #fave-area').click(function (e) {
		e.preventDefault();
		
		// Cache all instances of the image
		var $all_instances = $('.my-node img');
		
		// Store the usemap in order to re-enable later
		var usemap = $all_instances.attr('usemap');
		
		// Reset the use of an image map on all instances of it
		$all_instances.attr('usemap', '');
		
		// Grap the actual trigger we were looking for
		var trigger = document.elementFromPoint(e.clientX, e.clientY);
		
		// Re-enable the image map on all the instances we disabled it on
		$all_instances.attr('usemap', usemap);
		
		// Do something useful with the information
		alert(trigger.id);
	});
});
```
