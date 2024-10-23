---
title: "Using Uploadify with Rails 3"
date: 2010-08-25T02:29:53Z
categories: ["Ruby on Rails"]
tags: ["rails3", "uploadify"]
---

I recently worked on a couple of Rails projects which both implemented the ability to upload photos to the server.  One of these projects required the ability to upload multiple files at once and since HTML5 multi-file uploads aren't ready yet I needed another solution. So I decided to move forward using a Flash based uploader, specifically <a href="http://www.uploadify.com/">Uploadify</a>. Uploadify is a jQuery plugin which allows you to upload multiple files through a Flash based interface which provides helpful functionality like progress bars and multi-upload queuing, along with this, it's super easy to use.

Well that is until you're trying to work with a Rails application.  There are lots of resources around that go into the details of how to get this to work but the real issue that I had was that they were mostly for Rails 2.3.8 and my application is now using Rails 3 and the methods described in all of these articles don't completely apply to Rails 3.

<h3>Why is this extra work needed?</h3>

Before moving forward on how to get everything working let's take a look at why it's not working in the first place to better understand what we're dealing with and how we're fixing the problem.

Requests made via POST, PUT, DELETE all require a valid authentication token and session information in order to complete the request successfully in order to protect against Cross-site request forgery.  When building out forms using Rails form helpers, a hidden input is created which contains the authenticity token to prove the authenticity of the request along with your session cookie data.

This poses 2 problems for us using Flash to upload files.

First, Uploadify is not going to automatically send the authenticity token with the POST request. Second, Flash based requests do not send our session information along with the request. The first situation is pretty easy to fix while the session information requires a little more work on our part.

<h3>Sending the Authentication_Token</h3>

Let's start by sending the authenticity token along with the request. In previous versions of Rails we would have had to found a way to get the authenticity token to send but as part of Rails 3 usage of Unobtrusive JavaScript, it now includes a new helper method called `csrf_meta_tag`. This helper method will provide us with 2 meta tags, <strong>csrf-param</strong> and <strong>csrf-token</strong>


``` html
<meta name="csrf-param" content="authenticity_token"/>
<meta name="csrf-token" content="s2yuw7u24N9fni1m+Wynr595kTphEeMrNSWPAnMroLM="/>
```

Once we have the CSRF meta tags in place, we can move forward and add the authenticity to the parameters which are sent with Uploadify's request.  The JavaScript snippet below is an example of pulling the CSRF token information and passing it along with our Uploadify requests using the scriptData configuration parameter.

``` javascript
<script type="text/javascript">
$(function () {
  // Create an empty object to store our custom script data
  var uploadify_script_data = {};

  // Fetch the CSRF meta tag data
  var csrf_token = $('meta[name=csrf-token]').attr('content');
  var csrf_param = $('meta[name=csrf-param]').attr('content');

  // Now associate the data in the config, encoding the data safely
  uploadify_script_data[csrf_token] = encodeURI(csrf_param);

   // Configure Uploadify
  $('#photo-upload').uploadify({
    'uploader' : '/assets/uploadify.swf',
    'script' : '/photos/',
    'scriptData' : uploadify_script_data
  });
});
</script>
```

Uploadify allows you to pass extra data along with it's request using the scriptData parameter which accepts an object of properties to send with the request.  In our case we are fetching the CSRF and creating a new property in the scriptData object with the name of the CSRF token and setting it's value to the CSRF param.  Using this, we can pass along the authenticity token with the request.  It's important to note that we are encoding the authentication token value using encodeURI to escape any special characters so the data gets sent along to the server correctly.

I actually ran into an issue where even using encodeURI once was not enough and I needed to double encode because + signs were being converted into spaces.
So if you are continuing to run into InvalidAuthenticityToken error, check your log to see that the authenticity token is being correctly sent along. While trying to debug the problem a quick look into the log showed that I was receiving

``` ruby
authenticity_token=>"3WB Cj0h7y4St5ZyvlYU xIEVT7yIIr6IRAhOOLCb5w=
```

The spaces in the above authenticity token should have been + signs instead.  In order to resolve this issue I ended up having to double encode the authenticity token before sending it along like so:

``` javascript
uploadify_script_data[csrf_token] = encodeURI(encodeURI(csrf_param));
```

Now that we have the authenticity token being sent by Uploadify, let's move forward and get our session information passed along as well.

<h3>Passing the Session Cookie</h3>

One of the first steps to passing the session cookie along with our Uploadify requests is to add it to the scriptData like we did with the authentication_token. Unfortunately there is no quick way to handle this through JavaScript alone, we need to include it using some ERB to apply it.

In earlier versions of Rails the session cookie key could be accessed via: `ActionController::Base.session_options[:key]`

As of Rails 3 though we can access the session cookie key using: `Rails.application.config.session_options[:key]`

Below is a simple example of how to send the session cookie information in the scriptData.

``` javascript
<script type="text/javascript">
<%- session_key = Rails.application.config.session_options[:key] -%>
$(function () {

  var uploadify_script_data = {};

  // Fetch the CSRF meta tag data
  var csrf_token = $('meta[name=csrf-token]').attr('content');
  var csrf_param = $('meta[name=csrf-param]').attr('content');

  // Now associate the data in the config, encoding the data safely
  uploadify_script_data[csrf_token] = encodeURI(csrf_param)

  // Associate the session information
  uploadify_script_data['<%= session_key %>'] = '<%= cookies[session_key] %>';

  $('#upload-photo').uploadify({
    script : '/photos/',
    scriptData : uploadify_script_data
  });
});
</script>
```

Now that we have the session cookie data being passed with the request we'll need to move forward and have that information set with the headers of the Flash request, enter Middleware.

<h3>Rack Middleware</h3>

In order to get the session information to be associated with the request correctly we'll need to create some custom middleware which will intercept the requests from Flash and inject the cookie information into the header.

Some middleware has been around for accomplishing this but most are not compatible with Rails 3.  I've posted a Gist on Github which has a working middleware for Rails 3 which I found on <a href="http://metautonomo.us/2010/07/09/uploadify-and-rails-3/">metautonomo.us</a> which we can use to accomplish our task.

Create a file in app/middleware/flash_session_cookie_middleware.rb creating the middleware directory if it doesn't already exist and add the following code in it:

``` ruby
require 'rack/utils'
 
class FlashSessionCookieMiddleware
  def initialize(app, session_key = '_session_id')
    @app = app
    @session_key = session_key
  end
 
  def call(env)
    if env['HTTP_USER_AGENT'] =~ /^(Adobe|Shockwave) Flash/
      req = Rack::Request.new(env)
      env['HTTP_COOKIE'] = [ @session_key,
                             req.params[@session_key] ].join('=').freeze unless req.params[@session_key].nil?
      env['HTTP_ACCEPT'] = "#{req.params['_http_accept']}".freeze unless req.params['_http_accept'].nil?
    end
 
    @app.call(env)
  end
end
```

Once you've created that file we'll need to add the middleware directory to our autoload's path if it isn't already. You can do this by modifying you're config/application.rb file and add the following in  the autoload section:

``` ruby
# Custom directories with classes and modules you want to be autoloadable.
# config.autoload_paths += %W(#{config.root}/
config.autoload_paths += %W(#{config.root}/app/middleware/)
```

Once that's done we have one more step to do, inserting the middleware so that it will go to work when we need it.

Place the following code in config/initializers/session_store.rb

``` ruby
Rails.application.config.middleware.insert_before(
  ActionDispatch::Session::CookieStore,
  FlashSessionCookieMiddleware,
  Rails.application.config.session_options[:key]
)
```

#### Update
If you are using ActiveRecord based session storage instead of cookie based session storage you will need the following intializer instead:

``` ruby
SampleApp::Application.config.session_store :active_record_store, :key => '_uploader_session'

Rails.application.config.middleware.insert_before(
  Rails.application.config.session_store,
  FlashSessionCookieMiddleware,
  Rails.application.config.session_options[:key]
)
```

Thanks to reader <a href="http:/www.twitter.com/fromthought2web" target="_blank">@fromthought2web</a> for sharing his findings!

With all this in place you should now be ready to successfully upload files via Flash with your Rails project.

Good luck!

### Updates
<dl>
	<dt>2012-04-03</dt>
	<dd>Included sample middleware when using ActiveRecord for session store, thanks to <a href="http://www.twitter.com/fromthought2web" target="_blank">@fromthought2web</a> for sharing his finds.</dd>

	<dt>2010-08-26</dt>
	<dd>Resolved issue in code sample where session_key_name was being reference instead of session_key. Original sample updated</dd>
	<dd>`uploadify_script_data['<%= session_key %>'] = '<%= cookies[session_key] %>';`</dd>
</dl>
