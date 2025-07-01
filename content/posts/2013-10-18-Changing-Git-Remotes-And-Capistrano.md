---
title: "Changing Git Remotes and Capistrano"
date: 2013-10-18
categories: ["Ruby"]
tags: [capistrano, git, deployment, troubleshooting, devops]
summary: "A quick look at some recent issues I had when trying to move git remotes and then deploying with Capistrano and how I resolved the issue."
---

I've started to move some of my less frequently updated private projects over to [Bitbucket](https://bitbucket.org/) in order to take advantage of their free private repositories.
Making this move has been quite simple with their repository importer, allowing you to import projects right from other services like Github. 

Recently however I ran into an issue when trying to deploy my project with capistrano. It turns out that just changing your repository URL in the config.rb is not enough when you are deploying via remote cache (`set :deploy_via, :remote_cache`).
Capistrano has a copy of your project cloned out on the server your deploying to in order to speed up deploys instead of transferring the content from your machine to the server. Changing
the remote in my deploy configuration did not propogate the change to the cached-copy of the repo on the server. Simply ssh'ing onto the server and removing the cached-copy and then redeploying resolved the issue.
The newly generated cached-copy had my updated remote.

The cached copy can be found at `shared/cached-copy`. Be sure to remove the entire cached-copy directory and not just it's contents.
