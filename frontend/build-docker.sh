#!/bin/bash

# This file handles building the frontend

if [ "$PROD" = "true" ]; then
    export NODE_ENV="production"
else
    export NODE_ENV="development"
fi

echo $NODE_ENV
echo $PROD

npm run build

mkdir -p /usr/frontend/build
cp -r dist/ /usr/frontend/build

mkdir -p /usr/frontend/images
cp -r images/ /usr/frontend/images