---
title: "Using Uploadify with Rails 3 - Part 2 - Controller Example"
date: 2010-10-27T02:08:08Z
categories: ["Ruby on Rails"]
tags: ["rails3", "uploadify"]
summary: "A follow-up post on using Uploadify with Rails 3, focusing on setting up the controller to work with file uploads. This part covers handling content types and provides a full code sample for a Paperclip-based model and controller method."
---

Back in August <a href="http://www.glrzad.com/ruby-on-rails/using-uploadify-with-rails-3/" title="Using Uploadify with Rails 3">I posted a walkthrough</a> on working with a Flash based file uploader with Rails 3. After reading some comments I realized that a part was left out.  Setting up the controller to work with our upload. So this post is here as part 2 of 'Using Uploadify with Rails 3'.

This sample is going to be using the <a href="http://github.com/thoughtbot/paperclip" title="paperclip by thoughtbot">paperclip gem by thoughtbot</a> to handle our upload.

### The Controller
So we've gotten our file uploaded successfully, authentication is passing thanks to our previous work but what now? One of the first issues that you might run into is the content type for the file you uploaded.  Our uploadify upload will actually have the content_type set to 'application/octet-stream' which is not totally accurate representation of what we're uploading.

As stated earlier, this example is using paperclip, which will need the true content_type to be set to accurately continue uploading the file.  To resolve the 'application/octet-stream' issue we can use the mime-type gem and set the content_type of the file afterwards in the controller before trying to save the upload. Add the following to your gem file and run a bundle install:

``` ruby
gem 'mime-types', :require => 'mime/types'
```

With this in place we can force our controller to set the content type of the upload to the proper value.

We can do this with the following code:

``` ruby
params[:Filedata].content_type = MIME::Types.type_for(params[:Filedata].original_filename).to_s
```

Below is a full code sample of our Paperclip based model, and the full create controller method for handling our upload.  I hope you've found this post useful and please feel free to comment below with any questions, as I'll try to get to them as soon as possible.

#### GalleryImage Model

``` ruby
class GalleryImage < ActiveRecord::Base

	belongs_to :gallery
	delegate :venue, :to => :gallery

	# Storing photos in /galleries/:venue_name/:gallery_id/...
	has_attached_file :photo,
		:styles => { :thumb => "70x70", :iphone_thumb => "30x30#", :iphone_full => "320x480" },
		:url => '/galleries/:venue/:gallery/:id/:attachment/:style/:basename.:extension',
		:path => ':rails_root/public/galleries/:venue/:gallery/:id/:attachment/:style/:basename.:extension'
end
```

#### GalleryImagesController


``` ruby
def create

	@gallery = Gallery.find(params[:gallery_id])
	@gallery_image = GalleryImage.new
	@gallery_image.gallery = @gallery

	# Associate the correct MIME type for the file since Flash will change it
	params[:Filedata].content_type = MIME::Types.type_for(params[:Filedata].original_filename).to_s

	@gallery_image.photo = params[:Filedata]
    if @gallery_image.save
		render :json => { 'status' => 'success'  }
	else
		render :json => { 'status' => 'error' }
	end
end
```
