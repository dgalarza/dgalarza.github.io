---
layout: post
title: "How Buoy Software is Redefining Rails Development with ViewComponents"
description: "Discover how Buoy Software improved their Rails app by transitioning from React and GraphQL to ViewComponents. Learn about performance gains and simplified development."
date: 2024-09-05
author: Damian Galarza
keywords:
    - ViewComponents
    - Rails Views
    - React alternatives
    - Ruby on Rails ViewComponents gem
    - Moving from React to Rails views
    - Benefits of ViewComponents in Rails
    - React to ViewComponents transition
---

This post was originally posted on the [Buoy Software blog](https://buoy.blog/2024/09/05/react-to-view-components.html).

In the ever-evolving world of web development, choosing the right technology
stack is crucial for building efficient and maintainable applications. We moved away
from React and GraphQL, opting instead for traditional REST APIs and Rails-based
views, leveraging the power of the [ViewComponents gem](https://viewcomponent.org/).

## The initial tech stack: React and GraphQL

Buoy Software's journey began with a mobile application built using React Native
and powered by a GraphQL API in a Ruby on Rails application. The success of this
project led us to adopt similar technologies for our web application, resulting
in a React based front-end using webpacker. This approach allowed for code reuse
and consistency across platforms, which seemed like an ideal solution at the time.
For our small team, it was easier to maintain a shared pattern when moving
between the React Native application and our web application.

## Buoy Hackathon 2023

Buoy is a fully remote company and we have an annual hackathon where we get the
entire company together to spend time together in person. This is typically 2-3
days where we work on various hackathon projects pitched by the team. One team
pitched an idea to move our stack away from React and GraphQL to Rails views.
One of the things we enjoyed about React though, was the component system for
building UIs.

## Challenges faced with React and GraphQL in Rails

While starting off with GraphQL and React worked very well for our small team to
bootstrap our web application, over time we were presented with challenges that
made us rethink our approach.

### Inherent complexity within the application

Simple tasks which could easily be accomplished in a traditional Ruby on Rails
application started to become more and more complex. A simple feature which might
only need a REST controller and some views in a traditional Ruby on Rails application
would instead need GraphQL types, fields, mutations and resolvers. We leveraged
Typescript on the front-end which meant we needed to generate types for all of
our queries. Then we needed to create complex React components to bring the
whole thing together.

This complexity also appears when attempting to debug any issues that might
arise. With so many places to look across the stack, finding the root cause of a
problem is not straightforward.

### The illusion of sharing an API

When kicking things off, we had grand visions of a single source of truth
GraphQL API that powered our donor's mobile app as well as our donor management
system in one single API. Time would prove otherwise. As it turned out APIs that
the mobile application relied on were fairly different from those that the donor
management system required. The ones that were similar required vastly different
permission scopes. We ended up spending more time trying to build a shared API
rather than building dedicated APIs as needed.

### Complexity in onboarding new team members

At Buoy we believe in hiring full-stack software engineers. This proved more
difficult with our complex framework for building out front-ends. While this
wasn't an impossible task to get engineers up and running, it has proven to be
a learning curve for sure.

## Understanding ViewComponents in Ruby on Rails

### What are ViewComponents?

ViewComponents is a framework for building reusable, testable, and encapsulated
view components in Ruby on Rails. Inspired by similar concepts in modern JavaScript
frameworks such as React, ViewComponents allows developers to create modular,
object-oriented views that can be easily composed and reused across an application.
Think React components written in Ruby and used in Rails views.

To get started install the gem via `gem install view_components` or add it to
your Bundle file. Now, take the following React component:


```js
import React from 'react';
import PropTypes from 'prop-types';

const VARIANT_STYLES = {
  info: 'bg-blue-100 text-blue-800 border-blue-500',
  success: 'bg-green-100 text-green-800 border-green-500',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-500',
  error: 'bg-red-100 text-red-800 border-red-500',
};

const Banner = ({ variant = 'info', message, onClose }) => {
  return (
    <div className={`p-4 border-l-4 ${VARIANT_STYLES[variant]}`}>
      <div className="flex justify-between items-center">
        <p>{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
};

Banner.propTypes = {
  variant: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

export default Banner;
```

To replicate this with ViewComponents we'll want the following. First we'll want
to create a new directory within our `app` folder called `app/components`. The
common way to build components is to have 2 files, one is the class to hold any
logic behind our component and the other is the erb template. For the example
above we'll have 2 new files.

```ruby
# app/components/banner_component.rb
class BannerComponent < ViewComponent::Base
  VARIANT_STYLES = {
    info: "bg-blue-100 text-blue-800 border-blue-500",
    success: "bg-green-100 text-green-800 border-green-500",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-500",
    error: "bg-red-100 text-red-800 border-red-500"
  }.freeze

  def initialize(variant: :info, message:, closable: false)
    @variant = variant
    @message = message
    @closable = closable
  end

  def variant_class
    VARIANT_STYLES[@variant]
  end

  private

  attr_reader :variant, :message, :closable
end
```

Paired with an erb template in `app/components/banner_component.html.erb`

```erb
<!-- app/components/banner_component.html.erb -->
<div class="p-4 border-l-4 <%= variant_class %>">
  <div class="flex justify-between items-center">
    <p><%= message %></p>
    <% if closable %>
      <%= button_to "&times;".html_safe,
                    nil,
                    method: :get,
                    class: "text-gray-500 hover:text-gray-700",
                    aria: { label: "Close" },
                    data: { action: "click->banner#close" } %>
    <% end %>
  </div>
</div>
```

We can then render our component in a view like so:

```
<%= render(BannerComponent.new(variant: :success, message: "Operation completed successfully!", closable: true)) %>
```

### Testing our component

To test our component we can utilize Spec.

```ruby
# spec/components/banner_component_spec.rb
require "rails_helper"

RSpec.describe BannerComponent, type: :component do
  it "renders each variant with the appropriate CSS classes" do
    BannerComponent::VARIANT_STYLES.each do |variant, expected_class|
      component = BannerComponent.new(variant: variant, message: "Test message")
      render_inline(component)
      expect(page).to have_css("div.border-l-4.#{expected_class}")
    end
  end

  it "renders the message" do
    message = "This is a test message"
    component = BannerComponent.new(variant: :info, message: message)
    render_inline(component)
    expect(page).to have_text(message)
  end

  it "renders a close button when closable is true" do
    component = BannerComponent.new(variant: :info, message: "Test", closable: true)
    render_inline(component)
    expect(page).to have_button(class: "text-gray-500 hover:text-gray-700", text: "×")
  end

  it "does not render a close button when closable is false" do
    component = BannerComponent.new(variant: :info, message: "Test", closable: false)
    render_inline(component)
    expect(page).not_to have_button(class: "text-gray-500 hover:text-gray-700", text: "×")
  end

  it "applies the correct variant class" do
    component = BannerComponent.new(variant: :success, message: "Test")
    expect(component.variant_class).to eq("bg-green-100 text-green-800 border-green-500")
  end
end
```

Note our use of the `type: component` here.

### Benefits of ViewComponents over React components

1. Server-side rendering: ViewComponents are rendered on the server, reducing the
client-side JavaScript payload and improving initial page load times.

2. Seamless integration: As a native Rails solution, ViewComponents integrates
smoothly with existing Rails patterns and helpers. No more jumping through hoops
fighting with a JavaScript build tool like webpacker for simple tasks.

3. Testability: ViewComponents can be unit tested in isolation, improving overall
code quality and maintainability using the tools our team was already comfortable
in, RSPec.

## Buoy Software’s Journey to Adopting ViewComponents

Transitioning an existing Rails application to ViewComponents required careful
planning. Our application had grown quite large by the time we decided to move
away from React so finding a way to incrementally make this change was of the
utmost importance.

Our team began by identifying key areas where React components could be replaced
with ViewComponents. At Buoy we leverage feature flags which were a great tool for
this. We began by identifying the lowest risk area to introduce our change and
began there. The team gradually refactored these components, ensuring that the
application’s functionality remained intact throughout the process.

To ensure we did not find ourselves in a migration that stopped feature development
for months we took an iterative strategy to roll out the changes. As we made
changes to the codebase to update existing features we took it as an opportunity
to do a migration to ViewComponents.

To further ensure value was being provided by this migration we paired it with a
redesign of our application which moved us to the
[Tailwind](https://tailwindcss.com/) CSS framework. This
allowed us to get buy in from all stakeholders including leadership.

We are still not completely done with our migration, but we have found it to be
quite successful and are excited to finish our transition.

## Advantages of Traditional Rails Architecture

We've already seen many advantages as a result of our move away from React to a
more traditional Rails application.

### Simplified development workflow

Our initial hypothesis for this change was that we could drastically reduce
software development time for tasks by moving away from React to traditional
Rails views. We can confidently say that this has been true. Features that might
have taken weeks now take days. We no longer need to worry about ensuring we
have experts in both React and Rails.

With a unified codebase, we no longer need to worry about about context switching
between Ruby and JavaScript nearly as much. We can leverage the tools we've all
grown comfortable with such as testing with RSpec rather than Jest.

### Improved collaboration and onboarding

Within our React based application, debugging or simply trying to understand how
something worked required traversing a maze of code. Do I need to look at the
GraphQL layer? Is it the React application? Local state management in JavaScript?
We now have a more traditional application where it's easier to find things.
New engineers on the team can get up to speed much faster now which means
providing value quickly.

## Conclusion and Future Outlook

One of Buoy's core values is to prefer simplicity over complexity. We've found
that this change embodies this as we now have a much simpler architecture leading
to better outcomes overall. By embracing server-side rendering and leveraging
the power of ViewComponents, we were able to create a more performant,
maintainable, and developer-friendly application.

As web development continues to evolve, it's crucial to periodically reassess
your technology choices. What works for one project or team may not be the best
solution for another. Buoy's experience serves as a reminder that there's no
one-size-fits-all approach in our industry.
