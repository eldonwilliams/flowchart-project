#!/bin/bash

if [ "$PROD" = "false" ]; then
    npm run dev
    exit 0
elif [ "$PROD" = "true" ]; then
    npm run start
    exit 0
fi