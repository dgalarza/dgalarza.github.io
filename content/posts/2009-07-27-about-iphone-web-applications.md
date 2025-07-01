---
title: "About iPhone Web Applications"
date: 2009-07-27T13:53:37Z
categories: ["Mobile"]
tags: [web-development, javascript, css, tutorial]
---

<p>Let me start by this post by specifying that it actually originated from another post that I’m working on right now, but while writing it I went off on quite a tangent that I decided it was time to make it into a completely separate post, and start off with it. So this is part one of an iPhone web application piece that I am working on. While I am it, let me point out what the scope of this article is. This article is not about how to write an iPhone web application. It does not go into details on the syntax or use of technologies for the iPhone. It does explain some of the misconceptions between iPhone applications, iPhone targeted websites, and finally, iPhone Web Applications. I do plan to write more about the iPhone web application technologies and provide some examples and working code, but that is all currently beyond the scope of this article.</p>

<p>While researching on the topic over the last few weeks, I discovered what I believe is a misconception of an iPhone web application, and my goal is to hopefully, clear things up.</p>

<p>Let’s start by defining some of the possible ways of targeting an iPhone user, which actually diverges into two separate categories of its own.  The first and probably the most popular way of targeting an iPhone user is through an iPhone app, sold through the iTunes App store. Coding and compiling Objective C/Cocoa based native iPhone applications.</p>
<p>Yet there are still other ways of creating a custom user experience for a user on the iPhone.</p>






<!--more-->
<h2>Mobile Web Sites and Web Applications</h2>

<p>With Smart Phones becoming so widespread companies are working harder towards providing users with access to their websites with mobile phone designed websites.</p>

<p>WAP (Wireless Application Protocol) sites have been around for several years; the WAP was established in 1998 and was created for less powerful, smaller phones that had limited web browsers. Today’s smart phones, however, are becoming more and more powerful and now provide users with a fully fledged web browser such as the iPhone’s mobile Safari.</p>

<p>So with this in mind, websites have two options. Leaving things alone and letting the phone’s browser do the work, which may work well in some cases; or create a smart phone targeted version of their website. One of the biggest issues though with leaving a website as is for mobile device users is the bandwidth that a user has. Sure, the page may render correctly and work just fine, but that doesn't mean it may not take a while to load all the resources used on the page. Many of those same resources just aren't needed on the mobile device.</p>

<p>Through the power of HTML 5, CSS 3, Javascript and CSS Webkit extensions a developer has incredible tools at their disposal to work with in order to make a mobile friendly page.</p>

<h2>Webkit</h2>
<p>One of the things I am most impressed with so far is the power that CSS3 and webkit extensions provide. More specifically, CSS based gradients, shadows, and animations. These are really amazing pieces of technology allowing to cut down on bandwidth issues created from using images for certain elements just because of a gradient or other effect, or eliminating the need of Flash or special javascript libraries for animations.</p>

<p>Let's take a closer look at the benefits of using CSS gradients to cut down on the number of images that are required to download. Perhaps you have a consistent gradient used on several buttons on a site. If you were to use images, you would have to re-cut each variation of button, which leads to longer page loads which is a major concern when working on a mobile device. Now with a CSS gradient, we can define it as a single class and apply it to any buttons that use the gradient, making much better use of our resources.</p>

<p>Finally, with these tools in hand we can diverge into two sections, the general purpose mobile website, or an iPhone web application. Now by no means do I mean to downplay the power of the mobile website, I simply want to talk about something that’s less known, and that’s the iPhone Web Application.</p>

<h2>So what is an iPhone Web Application</h2>

<p>An iPhone Web Application in its simplest form is actually a website which is created with the same technologies web developers are already familiar with, but are created with the goal of emulating a native application on the iPhone.</p>
<p>HTML5, CSS3, Javascript, and CSS Webkit extensions provide a developer with rich tools to create power applications for an iPhone. Users can bookmark a web page to their home screen and right there, they can see one of the first signs of a web application, a custom home screen icon. Just like the application icon created for the home screen for a native iPhone application, through the use of Meta tags a developer can define a custom icon to be shown on the home screen for their web application. Furthermore, the developer can define another Meta tag which can hide the whole Safari UI including the address bar, and the navigation bar at the bottom of the screen. These are only some of the simpler things a developer can do.</p>

<p>Through javascript alone a developer has access to many of the events that an iPhone application developer would have, such as touch events, gesture events orientation changes, viewport settings and more.</p>

<p>Furthermore, the local storage engine, powered by SQLite, allows local databases to be created from a web application, which can be accessed through javascript. A popular example of local database storage is Gmail's offline mode, which uses the local storage to keep emails stored locally.</p>

<p>Not only can we create a local database on the user’s phone, we can work with more powerful caching functionality through the use of Manifest files which we can use to define a set of files to cache on the phone which can then be accessed later if the user tries to access the web application without an internet connection. So a developer can specify to cache CSS files and images to make sure the user enjoys the same UI experience while offline just like a native application. Manifest caches and the SQLite local databases are what I consider some of the most important tools at a developer's belt when writing an iPhone web application because it really blurs the line between an iPhone application and an iPhone web application.</p>

<p>Stay tuned as I plan to get into some more specifics relating to all aspects of iPhone web application development.</p>
