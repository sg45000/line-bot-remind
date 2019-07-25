#!/usr/bin/env bash

git checkout stage

heroku git:remote -a line-bot-stage-47832

git push heroku stage:master