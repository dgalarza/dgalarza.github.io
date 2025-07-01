---
title: "Simple Sinatra Service Proxy"
date: 2012-04-02T00:00:00Z
categories: ["Ruby"]
tags: [sinatra, api-development, cors, proxy-patterns, microservices, ruby]
summary: "Use Sinatra to rapidly build a proxy for a service when you can't make cross-origin AJAX requests in development."
---

Recently I came across the situation where I would need to communicate with a third party API on the front
end via JavaScript and some AJAX requests. Unfortunately JavaScript does not allow ajax requests across different
domains which caused an issue for us since the service does not support a JSONP service to get around this.

Instead, I set out to build a back end service which would consume our third party API and we could interact
with on the front end. However, I did not want to spend a great deal of time on building this midpoint between
the services.

### Ruby and Sinatra to the Rescue

Armed with the task at hand I set out to build the simplest approach possible to begin consuming our third party
API as quickly as possible. I started out with Rails and a look into ActiveResource but quickly found that there was
to much overhead and complexity for what I needed. With this in mind I decided to move onto a simple Sinatra application which
would aim to mimic the third party services in API methods and forward requests for us.

For our test case, let's look at the Twitter API. Note, Twitter does in fact support a JSONP service so this isn't really necessary.
We are simply using it as a test case for the post.


#### Fetching a user's timeline

``` ruby
require 'sintra'
require 'net/http'

get "/1/statuses/user_timeline" do
    uri = URI::HTTP.build(
        :host => api.twitter.com,
        :path => request.path_info,
        :query => request.query_string
    )

    content_type 'application/json', :charset => 'utf-8'

    Net::HTTP.get(uri)
end
```

In order to fetch a user's timeline we will need to make a request to the following API path: `/1/statuses/user_timeline`. Along with this path
the API documentation by twitter specifies that we can send various parameters along in the query string. What we have done here is we created a path which matches
twitter's and from there we access the request information provided by Sinatra. We build a URI using the API URL, `request.path`, and `request.query`. This will allow us
to quickly forward the request to Twitter's API through a NET::HTTP.get request.

Now that we've done that we can either mount our Sinatra app somewhere in the same domain or proxy requests to it on another domain.  In my case, I've set up a simple
proxy through Apache at /services.

```
<IfModule mod_proxy.c>
    ProxyRequests Off
    ProxyVia On

    <Proxy *>
        AddDefaultCharset off
        Order deny, allow
        Allow from all
    </Proxy>

    ProxyPass /services http://127.0.0.1:9393
    ProxyPassReverse /services http://127.0.0.1:9393
</IfModule>
```

So assuming I have my Sinatra application up and running on port 9393. I now have a proxy which will forward all requests to /services in my web application
to the Sinatra application. This will then forward all requests to the Twitter API and return the results. Visit the [mod_proxy](http://httpd.apache.org/docs/2.0/mod/mod_proxy.html) documentation
for more information about HTTP proxies with Apache.

#### Drying up our application

In our case right now we have a single method that we are forwarding, but what if we wanted to support more API methods provided by twitter.  Well we could go ahead and write out
each method and its block, or we could take advantage of the flexibility we have available to us.

``` ruby
require 'sinatra'
require 'net/http'

def api_request(path, query_string)
    uri = URI::HTTP.build(
        :host => api.twitter.com,
        :path => path,
        :query => query_string
    )

    Net::HTTP.get uri
end

request_handler = -> do
    content_type = 'application/json', :charset => 'utf-8'
    api_request request.path_info, request.query_string
end

%w{
    /1/statues/user_timeline
    /1/statuses/mentions
    /1/statuses/retweeted_by_me
}.each { |route| get route, &request_handler }
```

