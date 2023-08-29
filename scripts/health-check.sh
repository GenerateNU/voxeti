#!/bin/sh

URL="$1"
curl --silent "${URL:-http://localhost:3000}" > /dev/null &&
curl --silent "${URL:-http://localhost:3000}"/api/healthcheck > /dev/null
