#!/usr/bin/env bash
# =============================================================================
# Run the same CI/CD stages locally on Ubuntu (without GitHub Actions)
# Usage: ./scripts/local-ci.sh
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== Stage 1: Install dependencies ==="
cd backend && npm ci && cd ..

echo "=== Stage 2: Lint ==="
cd backend && npm run lint && cd ..

echo "=== Stage 3: Unit tests ==="
cd backend && npm test && cd ..

echo "=== Stage 4: Build Docker images ==="
docker build -t kids-study-backend:latest ./backend
docker build -t kids-study-frontend:latest ./frontend

echo "=== Stage 5: Push to local registry (localhost:5000) ==="
COMPOSE="${COMPOSE:-./scripts/compose.sh}"
chmod +x "$COMPOSE"
$COMPOSE up -d registry
sleep 3
docker tag kids-study-backend:latest localhost:5000/kids-study-backend:latest
docker tag kids-study-frontend:latest localhost:5000/kids-study-frontend:latest
docker push localhost:5000/kids-study-backend:latest || {
  echo "Tip: Add insecure-registries for localhost:5000 in /etc/docker/daemon.json"
  exit 1
}
docker push localhost:5000/kids-study-frontend:latest

echo "=== Stage 6: Deploy with Docker Compose ==="
cp -n .env.example .env 2>/dev/null || true
$COMPOSE up -d --build

echo "Done! Frontend: http://localhost:8080  API: http://localhost:3000/health"
