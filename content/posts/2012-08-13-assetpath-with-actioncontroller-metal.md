---
title: "AssetPath with ActionController::Metal"
date: 2012-08-13T02:26:53
categories: ["Ruby on Rails"]
tags: [rails-architecture, asset-pipeline, actioncontroller-metal, api-development, performance-optimization]
summary: "Getting proper asset paths with the asset pipeline while working with a controller which doesn't inherit from ActionController::Base can be a bit confusing. Learn how to get it working here."
---

At QFive we're building an API to serve our iOS application and throughout the site for ajax requests. Since our API only serves JSON we could slim down our controllers being used for the API to speed up requests as much as possible. In order to achieve this we've built a base controller for our API which inherits from ActionController::Metal instead of ActionController::Base. I was originally introduced to this idea in the book "Crafting Rails Applications" by Jose Valim.

One issue we've run into we've run into is related to the asset pipeline and serving assets from a custom asset host.

For example:

*config/environments/production.rb*

```ruby
Example::Application.configure do
	config.action_controller.asset_host = "//static.example/com"
end
```

Typically the usage behind this in a rails application is masked, whenever you use *image_tag* the image will be routed to the asset host on its own behind the scenes. However since we're inheriting from ActionController::Base there is some work to be done. We'll need to include a couple of modules and ensure that the load hooks are loaded in our base controller, something that happens behind the scenes when inheriting from ActionController::Base.

```ruby
class Api::V1::BaseController < ActionController::Metal
	include AbstractController::AssetPaths
	
	include ActionController::Redirecting
	include ActionController::Rendering
	include ActionController::Caching
	include ActionController::Renderers::All
	include ActionController::ConditionalGet
	include ActionController::ParamsWrapper
	include ActionController::MimeResponds
	
	ActiveSupport.run_load_hooks(:action_controller, self)
end
```

Of course, depending on what your application is using your mileage may vary. Our actual API BaseController looks something more like:

```ruby
class Api::V1::BaseController < ActionController::Metal
	include AbstractController::AssetPaths
	include ActionController::Helpers

	include ActionController::Redirecting
	include ActionController::Rendering
	include ActionController::Caching
	include ActionController::Renderers::All
	include ActionController::ConditionalGet
	include ActionController::ParamsWrapper

	include ActionController::MimeResponds
	include ActionController::RequestForgeryProtection
	include AbstractController::Callbacks

	include ActionController::Instrumentation
	include ActionController::Rescue

	Rails.application.routes.default_url_options = ActionMailer::Base.default_url_options
	include Rails.application.routes.url_helpers

	append_view_path "#{Rails.root}/app/views"

	protect_from_forgery

	ActiveSupport.run_load_hooks(:action_controller, self)
end
```

Be sure to check out the rails ActionController::Base to see what else is included by default and tweak as you see fit.
