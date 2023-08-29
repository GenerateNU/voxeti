#!/bin/sh 

cd -- "$(dirname -- "$0")"/.. || exit 1
go test backend/e2e-tests/...
