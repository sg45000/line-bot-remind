#!/usr/bin/env bash

git checkout master

heroku git:remote -a line-bot-prod-40325

git push heroku master