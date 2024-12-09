---
title: "Scaling JSON APIs in Rails using ActiveModel::Serializers, Key-Based Caching, and Rack::Cache"
date: 2013-11-03T00:00:00Z
categories: ["Ruby on Rails"]
tags: ["active-model-serializers", "rack"]
summary: "A guide on building high-scale JSON APIs in Rails using ActiveModel::Serializers, Key-Based Caching, and Rack::Cache. This post covers organizing APIs, leveraging HTTP caching, and ensuring high scalability."
---

This summer at Canvas I worked on a project which was a very dynamic and front-end heavy. In order to build this we architected it such a manner that the front-end would communicate with our servers through a JSON API. The API was responsbile for feeding the data used by the Javascript application. With this in mind we wanted the API to respond as fast as possible and be able to handle scale.

# Organizing our API

Building our API we set out to achieve a few goals:

* Make the API flexibile and decoupled from the front-end implementation
* Leverage HTTP caching whereever possible
* Ensure it could handle high scale

Making the API decoupled from it's front-end implmentation ensured that any design or data usage changes made would not require a change in 2 areas of our code base, the JavaScript application and the Rails application / API.

Leveraging HTTP caching gave us 2 gains. The first is we wanted to leverage an individual user's caching in their browser, reducing the amount of data we needed to send back to the user. The 2nd gain, which in my opinion was the bigger gain was the ability to add a caching layer in front of the entire response body through Rack::Cache.

## ActiveModel::Serializers

(ActiveModel::Serializers)[https://github.com/rails-api/active_model_serializers] is a great library for encapsulating object serialization for JSON APIs in Rails. It provides a great Object Oriented approach to serialization. If you haven't seen it before I highly recommend checking it out. Furthermore, it implements caching through Rails.cache to provide the ability to cache serialization of objects using (key based expiration)[http://37signals.com/svn/posts/3113-how-key-based-cache-expiration-works]. This provided us with some very nice, quick and easy caching of our serialized data. Thoughtbot has a great (article on ActiveModel::Serailziers and caching)[http://robots.thoughtbot.com/post/50091183897/fast-json-apis-in-rails-with-key-based-caches-and] so I'm not going to get into the details of it.

With this caching we were able to get a great method of caching our serialization. However we wanted more. Our models have a lot of associations which can be re-used through Russian doll caching. We implemented (this pull request)[https://github.com/rails-api/active_model_serializers/pull/307] in or serializers in order to benefit from side-effect free russian doll caching. With this in mind we could reuse caches just as easily across requests when possbile.

## Rack::Cache

Leveraging Rack::Cache in front of the API was one of the biggest wins for us. Rails has Rack::Cache active in production mode by default. However if you aren't using HTTP caching properly you won't see the benfits. There are many articles on the details of the various HTTP caching mechanisms that can be used. From `cache-control` headers, to `etags` and `last-modified` time stamps. Before we jump into the details let me explain why Rack::Cache was so useful.


When leveraging russian doll caching for our serialization we were able to get very fast serialization for our objects. However this typically lead to lots of memcached requests for fetcihng the individual pieces of the cache. This was not optimal. Our architecture benefited from the fact that one parent object could be used to determine the freshess of a cache. Think of the classic todo list example. Where individual todos in a list are cached as part of the entire todo list. If any individual todo-item in the list expires, then the list itself is expired. So, if we were using ActiveModel::Serialziers with caching, it would hit a cache for each item in the todo list. 

## Outline
* Weeks JSON public to all users
* Picks public because it's route is built from user ID.
* ActiveModel::Serializers
* Rack::Cache
