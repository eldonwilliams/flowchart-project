#!/bin/bash

# This file handles starting the frontend

if [ "$PROD" = "false" ]; then
    npm install -g nodemon ts-node
    npm run docker-dev
    exit 0
elif [ "$PROD" = "true" ]; then
    bash ./build-docker.sh
    exit 0
fi

echo "PROD environment variable not set"
exit 1