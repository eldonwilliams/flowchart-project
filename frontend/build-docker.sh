#!/bin/bash

# Build the frontend then copy it to the appropriate directory

echo "Starting Build"

rm -r /usr/frontend

if [ "$MODE" != "" ]; then
    echo "MODE = $MODE"
    npm run build -- --mode $MODE
else
    echo "MODE UNSET"
    npm run build
fi

# If in a container, copy to volumes

if [ -f /.dockerenv ]; then
    echo "Moving Build"

    mkdir -p /usr/frontend/dist
    cp -r dist/ /usr/frontend

    mkdir -p /usr/frontend/images
    cp -r images/ /usr/frontend
fi
