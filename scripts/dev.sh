#!/bin/sh

start_frontend() (
  cd -- "$(dirname -- "$0")"/.. || exit 1
  pnpm --dir frontend install
  pnpm --dir frontend dev
)

start_backend() (
  cd -- "$(dirname -- "$0")"/.. || exit 1
  wgo -exit clear :: go run -tags dev . -db "mongodb://localhost:27017"
)

start_frontend &
start_backend
