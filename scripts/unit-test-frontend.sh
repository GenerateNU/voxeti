#!/bin/sh 

cd -- "$(dirname -- "$0")"/.. || exit 1
pnpm --dir frontend run test:unit:coverage
