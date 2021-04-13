#!/bin/bash
####################################
# LIMS Update Script               #
# Usage: ./deploy.sh production    #
####################################

RUN_AS="$1"

deps_install() {
  cd $1
    npm install
    if [ "$1" == "ui" ]; then
      bower install
	  npm run build
    fi
  cd -
}
git pull

# npm/bower etc.
deps_install ui
deps_install data_service
deps_install user_service
deps_install gate

if [ "$RUN_AS" == "production" ]; then
	pm2 reload pm2-all.json --env production
else
	pm2 reload pm2-all.json
fi
