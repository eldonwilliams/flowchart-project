#!/bin/bash

# This file handles building the frontend

npm run build

mkdir -p /usr/frontend/build
cp -r dist/ /usr/frontend/build

mkdir -p /usr/frontend/images
cp -r images/ /usr/frontend/images