#!/bin/sh

set -e

# additional commands -----------------------------------

# redundant with Dockerfile build but we need this in order for package.json changes to take effect
npm install
echo "npm run migrate"
# load data to redis
# npm run migrate
echo "migrate done, now run pls"
npm run start
echo "migrate done1.0"
npm run migrate
echo "migrate done2"
