---
layout: post
title: "Take Control of Your HTTP Caching in Rails"
description: "Get more control over HTTP caching in Rails."
date: 2015-01-26
author: Damian Galarza
keywords:
    - Rails
    - HTTP Caching
    - Performance
    - Web Development
    - Ruby on Rails
    - stale?
    - JSON API
---

This post was originally published on the [thoughtbot blog](https://thoughtbot.com/blog/take-control-of-your-http-caching-in-rails).

The Rails `fresh_when` method is a powerful tool for conditionally caching resources via HTTP. However there are some pitfalls. For one, `fresh_when` only supports the default render flow in a controller; if a client's cache is not fresh, it will just render the related view. We cannot utilize things like `render json:`.

Fortunately, Rails provides us with more tools to work with HTTP conditional caching. Some of the basics behind HTTP conditional caching are assumed in this post. If you haven't already, or you just need a refresher take a look at [Introduction to Conditional HTTP Caching with Rails](/posts/2014-11-25-introduction-to-conditional-http-caching-with-rails/).

Let's work with a simple Rails blog application which renders posts as JSON.

```ruby
# app/controllers/posts_controller.rb
class PostsController < ApplicationController
  def show
    @post = Post.find(params[:id])
    render json: @post
  end
end

# config/routes
Rails.application.routes.draw do
  resources :posts, only: [:show]
end
```

What if we wanted to allow the client to conditionally cache this content? Rails provides us with the [`stale?`](http://api.rubyonrails.org/classes/ActionController/ConditionalGet.html#method-i-stale-3F) method which takes a resource and checks to see if the ETag provided by the client via the `If-None-Matches` header matches the one which represents the resource's current state. The `stale?` method can also work with the `If-Modified-Since` header. It will check if the resource's `updated_at` has been modified since the timestamp provided by `If-Modified-Since`.  To utilize this, we just need to wrap our `render` call with a call to `stale?`.

```ruby
class PostsController < ApplicationController
  def show
    @post = Post.find(params[:id])

    if stale?(@post)
      render json: @post
    end
  end
end
```

If we make a request to the individual post we'll get something similar to the following response:

```shell
curl -i http://localhost:3000/posts/1
```

```http
HTTP/1.1 200 OK
Etag: "f049a9825a0239db3d01ead65a5ea522"
Last-Modified: Tue, 02 Dec 2014 18:31:42 GMT
Content-Type: application/json; charset=utf-8
Cache-Control: max-age=0, private, must-revalidate
Server: WEBrick/1.3.1 (Ruby/2.1.5/2014-11-13)
Date: Tue, 02 Dec 2014 18:31:48 GMT
Content-Length: 93
Connection: Keep-Alive

{"post":{"title":"Blog post 0","body":"lorem ipsum","created_at":"2014-11-12T15:30:34.025Z"}}%
```

If we take a look at our Rails server log, we'll see something similar to the following:

```plaintext
Started GET "/posts/1" for 127.0.0.1 at 2014-12-02 13:38:18 -0500
Processing by PostsController#show as */*
  Parameters: {"id"=>"1"}
  Post Load (0.2ms)  SELECT  "posts".* FROM "posts"  WHERE "posts"."id" = $1
LIMIT 1  [["id", 1]]
Completed 200 OK in 1ms (Views: 0.3ms | ActiveRecord: 0.2ms)
```

Now if we make a request with the `If-None-Match` header set to the ETag that the server provided us with earlier:

```shell
curl -i -H 'If-None-Match: "f049a9825a0239db3d01ead65a5ea522"' http://localhost:3000/posts/1
```

We'll now receive a 304 Not Modified status for our request.

```http
HTTP/1.1 304 Not Modified
Etag: "f049a9825a0239db3d01ead65a5ea522"
Last-Modified: Tue, 02 Dec 2014 18:31:42 GMT
Cache-Control: max-age=0, private, must-revalidate
Server: WEBrick/1.3.1 (Ruby/2.1.5/2014-11-13)
Date: Tue, 02 Dec 2014 18:32:53 GMT
Connection: Keep-Alive
```

If we take a look at our Rails log we'll notice that the server skipped over the process of rendering the JSON all together:

```plaintext
Started GET "/posts/1" for 127.0.0.1 at 2014-12-02 13:38:55 -0500
Processing by PostsController#show as */*
  Parameters: {"id"=>"1"}
  Post Load (0.2ms)  SELECT  "posts".* FROM "posts"  WHERE "posts"."id" = $1
LIMIT 1  [["id", 1]]
Completed 304 Not Modified in 1ms (ActiveRecord: 0.2ms)
```

In this trivial example our gain is not huge. However with more complicated JSON objects this can be a very useful. A common example is a larger JSON response built via `ActiveModel::Serializers`. Combined with key-based caching in ActiveModel::Serializers this can be a powerful tool. We can cache individual items with [russian doll caching](http://blog.remarkablelabs.com/2012/12/russian-doll-caching-cache-digests-rails-4-countdown-to-2013), and then cache the entire response via HTTP caching.

## Further Reading

- [Fast JSON APIs in Rails with Key-Based Caches and ActiveModel::Serializers](https://thoughtbot.com/blog/fast-json-apis-in-rails-with-key-based-caches-and)
- [How to Evaluate Your Rails JSON API for Performance Improvements](https://thoughtbot.com/blog/how-to-evaluate-your-rails-json-api-for-performance-improvements)