#!/bin/bash

# This file handles starting the frontend

# mkdir -p /usr/frontend/images
# mkdir -p /usr/frontend/dist

echo "Starting Frontend"

if [ "$PROD" = "false" ]; then
    echo "Development Environment"
    # export DEV=true
    # cp -r images/ /usr/frontend
    # npm run build -- -w --outDir /usr/frontend/dist --emptyOutDir
    npm install -g nodemon ts-node

    nodemon --ignore /dist/**/* --watch . -e ts,tsx,html,json,js,jsx --exec "MODE=development /bin/bash ./build-docker.sh"

    exit 0
elif [ "$PROD" = "true" ]; then
    bash ./build-docker.sh
    exit 0
fi

echo "PROD environment variable not set"
exit 1
