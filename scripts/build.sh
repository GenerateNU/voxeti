#!/bin/sh

build_frontend() (
  cd -- "$(dirname -- "$0")"/.. || exit 1
  pnpm --dir frontend install
  pnpm --dir frontend build
)

build_backend() (
  cd -- "$(dirname -- "$0")"/.. || exit 1
  go build -tags serve
)

build_frontend
build_backend
