#!/bin/sh

URL="$1"
curl --silent "${URL:-http://127.0.0.1:3000}" > /dev/null &&
curl --silent "${URL:-http://127.0.0.1:3000}"/api/healthcheck > /dev/null
