---
title: "NewRelic RPM with ActionController::Metal"
date: 2012-09-05T00:00:00Z
categories: ["Ruby on Rails"]
tags: [rails-architecture, performance-monitoring, actioncontroller-metal, newrelic, api-development, instrumentation]
summary: "Get NewRelic RPM request instrumentation while using ActionController::Metal"
---

As part of our work with the [QFive](http://www.qfive.com) API for internal consumption we've built it out using Rails' ActionController::Metal.
We quickly realized that incoming requests to the API were not being tracked by NewRelic and looked for a way to resolve this. A quick google search will yield [this documentation from New Relic](https://newrelic.com/docs/ruby/adding-instrumentation-to-actioncontroller-metal)
which includes the following example:

```ruby
class SteelController < ActionController::Metal
  include ActionController::Rendering

  def show
    render :text => "Here is some text"
  end
  include ::NewRelic::Agent::Instrumentation::ControllerInstrumentation
  add_transaction_tracer :show
end
```

While this works, the problem remains that now you will need to add a transaction tracer for each and every controller action you add.

With this in mind I went in search of a better solution which could streamline the solution. Digging around the NewRelic RPM gem internals I was able to find the 'magic' behind the way New Relic integrates into requests. Within `lib/new_relic/agent/instrumentation/rails3/action_controller.rb` you can find the following:

```ruby
DependencyDetection.defer do
  @name = :rails3_controller

  depends_on do
    defined?(::Rails) && ::Rails::VERSION::MAJOR.to_i == 3
  end

  depends_on do
    defined?(ActionController) && defined?(ActionController::Base)
  end

  executes do
    NewRelic::Agent.logger.debug 'Installing Rails 3 Controller instrumentation'
  end

  executes do
    class ActionController::Base
      include NewRelic::Agent::Instrumentation::ControllerInstrumentation
      include NewRelic::Agent::Instrumentation::Rails3::ActionController
    end
  end
end
```

Which handles including the various instrumentation tools for ActionController. With this in mind we can follow the same logic in our API BaseController:

```ruby
require 'new_relic/agent/instrumentation/controller_instrumentation'
require 'new_relic/agent/instrumentation/rails3/action_controller'
require 'new_relic/agent/instrumentation/rails3/errors'

class Api::V1::BaseController < ActionController::Metal
	include ActionController::Instrumentation
	include ActionController::Rescue
	
	# ...
	
	# In order to enable NewRelic RPM monitoring in the API we'll need to include it
	include NewRelic::Agent::Instrumentation::ControllerInstrumentation
	include NewRelic::Agent::Instrumentation::Rails3::ActionController
	include NewRelic::Agent::Instrumentation::Rails3::Errors
		
end
```
