#!/usr/bin/env bash
# Use docker-compose (standalone) or docker compose (plugin), whichever is installed.
if docker compose version >/dev/null 2>&1; then
  exec docker compose "$@"
elif command -v docker-compose >/dev/null 2>&1; then
  exec docker-compose "$@"
else
  echo "Error: Install Docker Compose (docker-compose or docker compose plugin)." >&2
  exit 1
fi
