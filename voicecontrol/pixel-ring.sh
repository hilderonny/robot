#!/bin/sh
# Automatically restarts pixel-ring.py on file change
# https://github.com/channelcat/sanic/issues/168#issuecomment-299684248

find ./ -name \*.py | entr -r python pixel-ring.py
