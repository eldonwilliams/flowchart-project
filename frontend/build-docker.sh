#!/bin/bash

# Build the frontend then copy it to the appropriate directory

npm run build

mkdir -p /usr/frontend/build
cp -r dist/ /usr/frontend/build

mkdir -p /usr/frontend/images
cp -r images/ /usr/frontend/images