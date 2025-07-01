---
title: "Getting Started with iOS Development"
date: 2015-06-12T00:00:00Z
categories: ["iOS"]
tags: [ios-development, swift, xcode, mobile-development, tutorial]
summary: "I've recently started learning iOS and Swift and I wanted to share my experiences so far."
description: "Complete beginner's guide to iOS development with Swift. Learn Xcode setup, iOS development fundamentals, and start building iPhone apps with practical examples."
---

Around April I started digging into iOS and Swift. I figured it would
be helpful to share my experience with others who may also want to learn it.
Note, this comes from the perspective of someone who already has a programming
background and previously spent time becoming familiar with Objective-C and
Apple's Cocoa Touch frameworks.

When I first got started, I decided to search for some online iOS with Swift
courses. I was hoping to find some courses on Code School or something similar.
Unfortunately, I couldn't find a course like this. The courses that I found
were focused around learning iOS with Objective-C. I decided if I was going to
start learning iOS, I wanted to learn it with the modern Swift language rather
than Objective-C.

That's not to say that having Objective-C knowledge isn't valuable. It's
especially important to have Objective-C experience to work with older
applications. For example, [Tropos](http://troposweather.com/) is built with
Objective-C. In order to contribute to this project, I needed to think back to
my Objective-C learnings. The specifics around iOS development tend to be the
frameworks that Apple provides to its developers. These frameworks have great
documentation and are in both, Swift and Objective-C. If you're learning how to
use these libraries and the concepts behind iOS, it shouldn't be difficult to
apply them to Objective-C.

Initially I was disappointed to see that there weren't many resources to get
started in iOS from a beginner's perspective with Swift. Then after spending
some more time searching I found that Stanford University has a free course on
iTunes university titled [Developing iOS 8 Apps with
Swift](https://itunes.apple.com/us/course/developing-ios-8-apps-swift/id961180099).
This has been an immensely useful resource. Paul Hegarty is a great instructor.
He is really good at explaining the concepts and demonstrating things in real
time. I highly recommend checking it out.

These are a few of the important things I've learned so far:

* **[Read the iOS Human Interface
  Guidelines](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/)**
  This may go without saying but Apple has done a ton of research behind the
  user experience of iOS and its native applications. A fun fact that I learned
  was the loading screen for an iOS application shouldn't be used as a splash
  page. Instead, it should be a representation of the inactive application to
  give the illusion of a quick load.

* **Have a project idea** While reading and following the Stanford online course
  was immensely useful to start learning, I always feel that I need a concrete
  project to work on to apply my learnings. Without this, I usually can't keep
  sustained interest. I recommend coming up with a simple app idea to work on
  while learning.

* **Read through Apple's developer documentation** While developing for iOS you
  have a large number of frameworks provided by Apple at your disposal.
  Apple also provides excellent documentation around all of these frameworks;
  XCode even has a documentation browser built in. I recommend taking the time
  to familiarize yourself with these documents and learn to navigate them, it
  will be a huge benefit in the long run.

* **Use the Apple developer forums** I wasn't immediately aware of how useful
  the Apple developer forums would be. I was running into trouble getting an
  archive of my app sent to iTunes connect and spent hours if not days searching
  for support. Most of my searching turned up various StackOverflow posts which
  were not helpful, but after checking in the thoughtbot XCode slack channel I
  found that someone else had recently run into a similar issue. They lead me to
  the specific post on the Apple developer forums regarding the issue and I was
  able to work around it in a few minutes. Lesson I learned; search the Apple
  developer forums.

## Recommended Reading

* [Swift Programming Series (iBooks
  Store)](https://developer.apple.com/swift/resources/) This is the offical
Swift book by Apple. It is a great resource on getting started with learning
swift.
* [Beginning iPhone Development with
  Swift](http://www.amazon.com/Beginning-iPhone-Development-Swift-Exploring/dp/1484204107/ref=sr_1_1?ie=UTF8&qid=1433530778&sr=8-1&keywords=iPhone+Development+with+Swift)
  This is a great book to get started with learning iOS and Swift.
* [RayWenderlich](http://www.raywenderlich.com/) Great blog with tutorials on
  iOS and Swift
* [AppCoda](http://www.appcoda.com/) Great resource for various tutorials
* [Giant Robots Smashing into Other Giant
  Robots](https://robots.thoughtbot.com/tags/ios) There may not be as many
  beginner content here but there has been very useful blog posts on Swift and
  functional programming in Swift.

## Design Resources

* [The iOS Design Guidelines](http://iosdesign.ivomynttinen.com/) Guide to
  design apps around the Apple HIG.
* [iOS 8 GUI PSD (iPhone 6)](http://www.teehanlax.com/tools/iphone/) Template of
  the GUI elements found in iOS 8
* [Using Vector Images in XCode
  6](http://martiancraft.com/blog/2014/09/vector-images-xcode6/) Turns out you
no longer have to generate several versions of an image asset to use within your
app. XCode supports vector images which it will scale appropriately for various
sizes. IE: @1x, @2x, @3x
