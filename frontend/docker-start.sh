#!/bin/bash

# This file handles starting the frontend

if [ "$PROD" = "false" ]; then
    export DEV=true

    mkdir -p /usr/frontend/images
    cp -r images/ /usr/frontend/images

    npm run build -- --watch --outDir /usr/frontend/build --emptyOutDir
    echo "Quitting, bye :)"
    exit 0
elif [ "$PROD" = "true" ]; then
    bash ./build-docker.sh
    exit 0
fi

echo "PROD environment variable not set"
exit 1
