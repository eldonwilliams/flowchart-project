#!/bin/bash

# Build the frontend then copy it to the appropriate directory

npm run build

# If in a container, copy to volumes

if [ -f /.dockerenv ]; then
    mkdir -p /usr/frontend/dist
    cp -r dist/ /usr/frontend

    mkdir -p /usr/frontend/images
    cp -r images/ /usr/frontend
fi
