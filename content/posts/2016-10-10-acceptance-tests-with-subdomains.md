---
layout: post
title: "Acceptance Tests with Subdomains"
description: "How to use subdomains in your feature specs."
date: 2016-10-10
author: Damian Galarza
keywords:
    - Ruby
    - Testing
    - Capybara
    - RSpec
    - Feature Specs
    - Subdomains
    - Rails Testing
---

This post was originally published on the [thoughtbot blog](https://thoughtbot.com/blog/acceptance-tests-with-subdomains).

You're excited about building a new application which allows users to sign up and host their own blog. You decide that each blog will have their own space by providing a subdomain.

Let's start off with a feature spec.

```ruby
require "rails_helper"

feature "user views a blog" do
  scenario "homepage" do
     blog = create(
      :blog,
      subdomain: "bobloblaw",
      title: "Bob Loblaw's Law Blog",
      description: "Welcome to my new blog.",
    )

    visit root_path

    expect(page).to have_content blog.title
    expect(page).to have_content blog.description
  end
end
```

In our app we render the blog homepage using the following:

```ruby
# config/routes.rb
Rails.application.routes.draw do
  root to: "blogs#show"
end
```

```ruby
# app/controllers/blogs_controller.rb
class BlogsController < ApplicationController
  def show
    @blog = current_blog
  end

  private

  def current_blog
    @_current_blog ||= Blog.find_by(subdomain: request.subdomains.first)
  end
end
```

```html
<!-- app/views/blogs/show.html.erb -->
<h1><%= @blog.title %></h1>
<p><%= @blog.description %></p>
```

In order to visit the homepage via a subdomain in our test we need to set the `app_host` property for Capybara. We could try to use `myblog.localhost` but Rails will think that localhost is the top level domain and therefore won't see myblog as a subdomain. Instead we'll use a fake host name `example.com`. We can set it by adding the following to our spec before calling `visit`.

```ruby
Capybara.app_host = "http://myblog.example.com"
```

If we run the test with the default Capybara driver, `rack-test` it should be green.  `rack-test` interacts directly with Rack which means it never uses the external URL. If we need to use a JavaScript driver however we will need to use an actual accessible URL. Add the `:js` metadata to the scenario and you should see a failure occur.

In order to accommodate a driver like Selenium or capybara-webkit we'll need to do some more work. To start, we will not be able to use our fake host `example.com`. Instead we need a host name which will point to `127.0.0.1`. There is one readily available to us for use through `lvh.me`. Its DNS records are set up so that `lvh.me` and all of its subdomains resolve to your local machine at `127.0.0.1`.

So update `app_host` from `http://myblog.example.com` to `http://myblog.lvh.me`. We're still not done yet though.

Next, we need to instruct Capybara to include the port number for the Capybara server in all requests to work correctly. We can do that by adding the following to `spec/rails_helper.rb`:

```ruby
Capybara.configure do |config|
  config.always_include_port = true
end
```

If you're using the capybara-webkit driver and configuring it to block all unknown URLs [as we do in Suspenders](https://github.com/thoughtbot/suspenders/blob/master/templates/capybara_webkit.rb#L4) then you'll need to do one more thing. In the configuration for capybara-webkit you'll need to add the `lvh.me` host to the URL whitelist. If you're using a Suspenders based app then open up `spec/support/capybara_webkit.rb` or whichever file you have configured capybara-webkit in. Update the configuration to look like:

```ruby
Capybara::Webkit.configure do |config|
  config.block_unknown_urls
  config.allow_url("myblog.lvh.me")
end
```

This will allow Capybara to access our blog through `lvh.me` and not block it. With this in place we can run our tests and things should be green again.

## Allowing more subdomains

Things are working great with the above but we realize that we are coupled to the `myblog` subdomain within all of our tests. We will finish things off by making this more flexible.

Let's start by updating our capybara-webkit configuration to allow all subdomains on lvh.me and not just limiting it to `myblog`. We can do this by changing `myblog` to `*`.

```ruby
Capybara::Webkit.configure do |config|¬
  config.block_unknown_urls¬
  config.allow_url("*.lvh.me")¬
end
```

Next, let's extract a helper method to make testing subdomains easier.

We'll add the following method to our feature spec:

```ruby
def visit_blog(blog, path = '/')
  app_host = URI.join("http://#{blog.subdomain}.lvh.me", path).to_s
  using_app_host(app_host) do
    visit path
  end
end

def using_app_host(host)
  original_host = Capybara.app_host
  Capybara.app_host = host
  yield
ensure
  Capybara.app_host = original_host
end
```

`using_app_host` allows us to pass a host for Capybara to use and temporarily overrides the `app_host` rather then permanently setting it. Our use of `ensure` makes sure that the `app_host` is always set back to its original value regardless of exceptions being raised while `yield`ing the block. `visit_blog` allows us to pass an instance of a blog as well as a path to visit. By default, this path is the root of the blog.

So we can update our spec to look as follows:

```ruby
require "rails_helper"

feature "user views a blog" do
  scenario "homepage", :js do
     blog = create(
      :blog,
      subdomain: "bobloblaw",
      title: "Bob Loblaw's Law Blog",
      description: "Welcome to my new blog.",
    )

    visit_blog blog

    expect(page).to have_content blog.title
    expect(page).to have_content blog.description
  end

  def visit_blog(blog, path = '/')
    app_host = URI.join("http://#{blog.subdomain}.lvh.me", path).to_s
    using_app_host(app_host) do
      visit path
    end
  end

  def using_app_host(host)
    original_host = Capybara.app_host
    Capybara.app_host = host
    yield
  ensure
    Capybara.app_host = original_host
  end
end
```