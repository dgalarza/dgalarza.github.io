---
title: "A look at Decorators and Presenters"
category: Ruby on Rails
summary: A look at how decorators and presenters can give flexibility to your application.
date: 2012-10-03T16:38:27Z
tags: ["rails3", "decorators"]
---

#Posts: Decorators and Presenters

As part of an effort to clean up some of the complexity behind the views with posts on QFive a major refactoring was done on our current 'presenters' implementation.  


Since starting on the project I and several others have often opened up the presenters with the distinct feeling of being lost. The next step usually was a look at the base Presenter class which usually helped but would leave us with a sinking feeling with what was going on.

```ruby
class Presenter < BasicObject
  undef_method :==

  def initialize(component)
    @component = component
  end

  def method_missing(name, *args, &block)
    @component.send(name, *args, &block)
  end

  def respond_to?(method_id)
    if @component.respond_to?(method_id)
      true
    else
      super
    end
  end

  def send(symbol, *args)
    __send__(symbol, *args)
  end
end
```

A quick look at the base presenter reveals a few things. First, it inherits from BasicObject rather than the typical Object class. Next, it goes a step further to undefine the == method for comparison purposes. We could probably simplify the implementation. Either way now with the project coming to life and knowing much more about the use cases we can revisit this and clean up.

## Decorators masked as Presenters

Another problem with our 'presenters' is that they actually function as decorators. The topic of 'Decorators vs Presenters' is usually widely debated and I have not seen one final answer that seems to be accepted. However The decorator pattern is one of the original GoF design patterns. However, the decorator pattern does have an accepted definition, wikipedia defines it as:

'The decorator pattern can be used to extend (decorate) the functionality of a certain object at run-time, independently of other instances of the same class, provided some groundwork is done at design time. This is achieved by designing a new decorator class that wraps the original class.'


While the presenter pattern is often found as part of the 'Model-View-Presenter' pattern where the 'all presentation logic is pushed to the presenter'.


## Single Responsibility Principle
One thing was clear on the Presenters we had in place for posts. They were responsible for way to much. Our single Post presenter class (and any subsets of it) were responsible for:

1. Generating a hash which represents a post for sending it to Facebook in a share for 'post to facebook' functionality.
2. Generating a tweet text for sharing a post directly to Twitter.
3. Generating open graph tags for TwitterCards
4. Determining SOME open graph tags for Facebook (but not all)
5. Some minor post presentation updates for the view
6. Determining how to display a title of a post for the view (is it a topic your following? is it a team post? is it a repost?)

and more

## View Coupling with Presenters
Next up, some weird coupling and usage in the view.

If a presenter is intended for view logic, then why was our only usage of a presenter within app/views/posts/show.html.slim this:

```ruby
- presenter = PostPresenter.present(@post, self, true)
- content_for :title, truncate(@post.text, :length => 17, :separator => ' ').html_safe if @post.text
- content_for :og_title, truncate(@post.text, :length => 17, :separator => ' ').html_safe if @post.text
- content_for :og_type, "website"
- content_for :prefix, "og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# object: http://ogp.me/ns/object#"
```

There was no other reference to the presenter in the view. Another sign of failing SRP and coupling.

## Cleaning up

Before diving in I looked around into a few different solutions which all pointed back to [Draper](https://github.com/jcasimir/draper) so I figured we would give it a shot. With a large amount of refactoring and cleaning up ahead of me I set out with the following goals:

1. Follow SRP, don't end up with one massive class which is responsible for presenting a post for every possible situation.
2. Extensibility: We have many different places for posts: mobile, the web application, sharing on Facebook, Sharing on Twitter. We should be able to provide flexibility for this. We even have different sources or destinations: clubs, teams, topics. Extensibility and flexibility were key. I will elaborate on this later.


Cleaning up also did not mean that we needed to drop presenters in favor of decorators or vice versa. Rather, understand their differences and build on each of their strengths. It's important to not mask a decorator as a presenter. Looking in the application now we can find 2 folders: app/decorators and app/presenters.

So, when should you be using a decorator and when should you be using a presenter? Simply follow these 2 guidelines:

First, are you just augmenting functionality, whether or not it's related to the view? Use a decorator.


Take for example our use of cache keys for post partials. Posts can appear in either a user's news feed or their profile / activity feed. Post partials are cached for each user viewing them but we must cache them differently based on whether they are a repost, or which feed they appear in. Enter the decorator.

Within app/views/posts/_post.html.slim

```ruby
- cache post.partial_cache_key(:activity_stream, cache_key, current_user)  do  
  div id="post_#{post.id}" class="post"
  ...
```

app/decorators/post_decorator.rb

```ruby
 # Advanced handling for generating an array for the cache key. A repost must be cached
 # separately from the original post but it's own cache must be cleared when a user acts
 # upon the original post such as a like or a repost
 def partial_cache_key(*segments)
   segments << model
   if model.is_a_repost?
     segments << model.source
   end 

   segments
 end
```

This allows us to handle reposts transparently to the view.

Second, are you taking something and drastically providing different logic for the view? Use a presenter.


A perfect example of a presenter in use in QFive is the notifications presenter. This presenter is not aiming to add additional logic behind the notification based on it's use. It does not provide any value other than providing presentation on the view while handling its polymorphic roots.

```ruby
class NotificationPresenter < Presenter                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                            
  class << self                                                                                                                                                                                                                                                                                                                                                             
    def present(notification, context = nil)                                                                                                                                                                                                                                                                                                                                
      presenter = presenter_for(notification).new(notification, context)                                                                                                                                                                                                                                                                                                    
      presenter.present                                                                                                                                                                                                                                                                                                                                                     
    end                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                            
    def presenter_for(notification)                                                                                                                                                                                                                                                                                                                                         
      "#{notification.notifiable_type}_notification_presenter".classify.safe_constantize || NotificationPresenter                                                                                                                                                                                                                                                           
    end                                                                                                                                                                                                                                                                                                                                                                     
  end                                                                                                                                                                                                                                                                                                                                                                       
                                                                                                                                                                                                                                                                                                                                                                            
  def initialize(notification, context = nil)                                                                                                                                                                                                                                                                                                                               
    @notification = notification                                                                                                                                                                                                                                                                                                                                            
    @context = context                                                                                                                                                                                                                                                                                                                                                      
  end                                                                                                                                                                                                                                                                                                                                                                       
                                                                                                                                                                                                                                                                                                                                                                            
  def present                                                                                                                                                                                                                                                                                                                                                               
    sender_avatar_link + notification_presentation                                                                                                                                                                                                                                                                                                                          
  end 
  
  …
```

QFive has notifications for many things like comments, likes, follows, reposts, etc. and we have a sinple page which lists out the various notifications you can receive. There needs to be a way to transform a universal 'Notification' object for viewing purposes to the user. We could have a view littered with if else blocks which would quickly become a nightmare to maintain. Or we could abstract this into a presenter.


In our view you can find a simple partial for handling notifications:

```ruby
.media
	= notification_message(notification)
```

This in turn calls a helper method:

```ruby
def notification_message(notification)
	NotificationPresenter.present(notification, self).html_safe
end
```

So we simply output the results of the notification presenter to the view. Taking a look at the present method, we simply generate an avatar link for the sender of the notification and then a call to notification_presentation which can then proxy based off the different types of notifications:

```ruby
  def notification_presentation                                                                                                                                                                                                                                                                                                                                             
    klass = 'bd'                                                                                                                                                                                                                                                                                                                                                            
    method = @notification.notifiable_type.underscore.downcase + '_notification'                                                                                                                                                                                                                                                                                            
    message = self.send(method.to_sym)                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                            
    content_tag(:div, class: klass) do                                                                                                                                                                                                                                                                                                                                      
      link_to(@notification.sender.name, @notification.sender) + ' ' + message.html_safe                                                                                                                                                                                                                                                                                    
    end                                                                                                                                                                                                                                                                                                                                                                     
  end  
```

From here, we simply determine the kind of notification that is being presented (comment, follow, etc) and delegate to a method matching the convention `#{notifialbe_type.underscore.downcase}_notification` which for example in the scenario of a repost will call:

```ruby
def repost_notification                                                                                                                                                                                                                                                                                                                                                   
  "reposted #{notification_for_post}"                                                                                                                                                                                                                                                                                                                                     
end
```

We can also abstract logic for the following conditions:
* A user reposts a post for a club that I manage
* A user reposts a post for a post I made

With the various targets and receivers for a notification the permutations behind the kinds of ways a simple notification can be presented grows quickly.

## Flexibility

One last topic I will cover is the flexibility that the decorators provide. Let's take a scenario for a post which is posted within a topic that I follow. Assuming I do not follow the user but rather the post shows up in my newsfeed because I follow the topic, I should see the post with the common "Josh has posted in a topic you follow". This seems straightfoward enough. However if we start to think of the use case of visiting Josh's profile it no longer makes sense to display that heading. We are viewing this post in the context of Josh's profile rather than in our newsfeed, therefor "Josh posted in a topic that you follow" has lost its context in this view.

Enter feeds.

I will not get into the details of feeds in this post, but instead I will cover some background. A feed is a collection of posts to view on a page. There are different kinds of feeds, NewsFeed's which cover the case of displaying posts in your news feed when you log in, and activity feeds which pulls in content for a user or club, or team.

Since these feeds act as a context point towards the kinds of posts you are viewing at the time, we can inject decorators into the scene in order to provide flexibility for us.

```ruby
# NewsFeed
def decorated_posts                                                                                                                                                                                                                                                                                                                                                       
  NewsFeedPostDecorator.decorate posts                                                                                                                                                                                                                                                                                                                                    
end     

# ActivityFeed
def decorated_posts                                                                                                                                                                                                                                                                                                                                                       
  PostDecorator.decorate posts                                                                                                                                                                                                                                                                                                                                            
end
```

The view is no longer concerned with how to display a post within a news feed or an activity feed. Instead the view simply can call post.title and it will have the proper title generated.

For example, within NewsFeedPostDecorator:

```ruby
  def title                                                                                                                                                                                                                                                                                                                                                                 
    if model.is_a_repost?                                                                                                                                                                                                                                                                                                                                                   
      repost_title                                                                                                                                                                                                                                                                                                                                                          
    elsif model.team_post?                                                                                                                                                                                                                                                                                                                                                  
      team_post_title                                                                                                                                                                                                                                                                                                                                                       
    elsif followed_topic?                                                                                                                                                                                                                                                                                                                                                   
      topic_post_title                                                                                                                                                                                                                                                                                                                                                      
    else                                                                                                                                                                                                                                                                                                                                                                    
      generic_title                                                                                                                                                                                                                                                                                                                                                         
    end                                                                                                                                                                                                                                                                                                                                                                     
  end 
``` 

And then in PostDecorator:

```ruby
def title                                                                                                                                                                                                                                                                                                                                                                 
  if model.is_a_repost?                                                                                                                                                                                                                                                                                                                                                   
    repost_title                                                                                                                                                                                                                                                                                                                                                          
  else                                                                                                                                                                                                                                                                                                                                                                    
    generic_title                                                                                                                                                                                                                                                                                                                                                         
  end                                                                                                                                                                                                                                                                                                                                                                     
end   
```
