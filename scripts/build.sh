#!/bin/sh

build_frontend() (
  cd -- "$(dirname -- "$0")"/.. || exit 1
  pnpm --dir frontend install
  pnpm --dir frontend build
)

build_backend() (
  cd -- "$(dirname -- "$0")"/.. || exit 1
  go get .
  go build
)

build_frontend
build_backend
