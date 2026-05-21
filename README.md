# Kids Study App — Mini Production CI/CD

A beginner-friendly **DevOps learning project**: a simple kids' study web app with Docker, PostgreSQL, Prometheus, Grafana, and a full **GitHub Actions** CI/CD pipeline.

---

## What You Get

| Layer | Technology |
|-------|------------|
| Frontend | HTML, CSS, JavaScript (Nginx) |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Monitoring | Prometheus + Grafana |
| CI/CD | GitHub Actions + **Jenkins** (`Jenkinsfile`) |
| Deploy | Docker Compose |

---

## Project Structure

```
.
├── Jenkinsfile                   # Jenkins pipeline (lint, test, build, deploy)
├── .github/workflows/ci-cd.yml   # GitHub Actions pipeline definition
├── .env.example                    # Environment variable template (copy to .env)
├── docker-compose.yml              # Full stack: app + DB + monitoring + registry
├── frontend/                       # Static UI served by Nginx
│   ├── Dockerfile
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
├── backend/                        # Express API
│   ├── Dockerfile
│   ├── src/
│   │   ├── index.js
│   │   ├── db.js
│   │   ├── metrics.js              # Prometheus metrics
│   │   └── routes/
│   └── tests/api.test.js           # Unit tests (mocked DB)
├── monitoring/
│   ├── prometheus.yml
│   └── grafana/provisioning/
├── scripts/local-ci.sh             # Run CI stages on Ubuntu locally
└── README.md
```

---

## CI/CD Flow (Visual)

```
  Developer pushes code to GitHub
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions Runner                     │
│                         (Ubuntu)                             │
└─────────────────────────────────────────────────────────────┘
              │
    ┌─────────┴─────────┐
    │   Job: quality    │  (every push & PR)
    └─────────┬─────────┘
              │
    ┌─────────▼─────────┐
    │ 1. npm ci         │  Install dependencies
    ├───────────────────┤
    │ 2. npm run lint   │  ESLint checks
    ├───────────────────┤
    │ 3. npm test       │  Jest unit tests
    └─────────┬─────────┘
              │  (only on main/master push)
    ┌─────────▼─────────┐
    │ build-and-deploy  │
    └─────────┬─────────┘
              │
    ┌─────────▼─────────┐
    │ 4. docker build   │  Backend + Frontend images
    ├───────────────────┤
    │ 5. docker push    │  → localhost:5000 (local registry)
    ├───────────────────┤
    │ 6. compose up     │  Deploy full stack
    └─────────┬─────────┘
              │
              ▼
    ┌─────────────────────┐
    │  Kids Study App     │
    │  :8080 frontend     │
    │  :3000 API          │
    │  :9090 Prometheus   │
    │  :3001 Grafana      │
    └─────────────────────┘
```

**ASCII: Request path when app is running**

```
  Browser (:8080)
       │
       ▼
  ┌──────────┐     GET /api/subjects     ┌──────────┐
  │ Frontend │ ─────────────────────────► │ Backend  │
  │  Nginx   │ ◄───────────────────────── │ Express  │
  └──────────┘         JSON               └────┬─────┘
                                               │
                                               ▼
                                         ┌──────────┐
                                         │ Postgres │
                                         └──────────┘

  Prometheus (:9090) ──scrapes──► GET /metrics (backend)
  Grafana (:3001)    ──queries──► Prometheus
```

---

## Prerequisites (Ubuntu)

```bash
# Node.js 20+ (for local dev/tests)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Docker & Compose
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin
# This project also works with standalone: sudo apt install docker-compose
sudo usermod -aG docker $USER
# Log out and back in so docker runs without sudo
```

---

## Quick Start (Docker Compose)

```bash
cd "mini ci cd"
cp .env.example .env
# Edit .env if needed (passwords, ports)

docker-compose up -d --build
# If you have the Compose plugin: docker compose up -d --build
# Or use the helper: ./scripts/compose.sh up -d --build
```

Wait ~30 seconds for PostgreSQL and the API to become healthy.

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:8080 |
| **API health** | http://localhost:3002/health |
| **API subjects** | http://localhost:3002/api/subjects |
| **Prometheus** | http://localhost:9090 |
| **Grafana** | http://localhost:3030 (admin / admin from `.env`) |

```bash
# Check all containers
docker-compose ps

# View backend logs
docker-compose logs -f backend

# Stop everything
docker-compose down
```

---

## Local Development (without full stack)

```bash
cd backend
npm ci
npm run lint
npm test
npm run dev   # needs PostgreSQL or use Docker for postgres only
```

Start only the database:

```bash
docker-compose up -d postgres
```

Set in `.env`: `POSTGRES_HOST=localhost`, then run `npm run dev` in `backend/`.

Open `frontend/index.html` in a browser only works if CORS/API URL is configured; **recommended path is Docker Compose**.

---

## Run CI/CD Locally (Ubuntu)

Mirrors the GitHub Actions stages:

```bash
chmod +x scripts/local-ci.sh
./scripts/local-ci.sh
```

**Local registry note:** To push to `localhost:5000`, configure Docker once:

```bash
sudo mkdir -p /etc/docker
echo '{ "insecure-registries": ["localhost:5000"] }' | sudo tee /etc/docker/daemon.json
sudo systemctl restart docker
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check (DB connectivity) |
| GET | `/api/subjects` | List study subjects |
| GET | `/api/quiz/:subjectId` | Quiz questions for a subject |
| GET | `/metrics` | Prometheus metrics |

---

## Security Practices (included)

- **Environment variables** — secrets in `.env` (never committed); see `.env.example`
- **Non-root Docker users** — backend runs as `appuser`; frontend uses Nginx user
- **No secrets in code** — database credentials from env vars only
- **`.gitignore`** — excludes `.env` and `node_modules`

---

## Monitoring

1. Open **Prometheus**: http://localhost:9090 → Status → Targets → `kids-study-backend` should be **UP**
2. Open **Grafana**: http://localhost:3001 → login with credentials from `.env`
3. Dashboard **Kids Study App** is auto-provisioned (HTTP requests, latency, memory)

Generate traffic: refresh the frontend and take a quiz; metrics will appear in Grafana after ~1 minute.

---

## Sample Screenshots

_Add your own screenshots after running the app and place them in `docs/screenshots/`._

| Screenshot | Description |
|------------|-------------|
| `docs/screenshots/01-home.png` | Home page with subject cards |
| `docs/screenshots/02-quiz.png` | Quiz in progress |
| `docs/screenshots/03-health.png` | `curl localhost:3000/health` JSON response |
| `docs/screenshots/04-grafana.png` | Grafana dashboard with request metrics |
| `docs/screenshots/05-github-actions.png` | Green CI/CD pipeline in GitHub Actions |

**Example commands to capture:**

```bash
mkdir -p docs/screenshots
# After docker compose up:
google-chrome --headless --screenshot=docs/screenshots/01-home.png http://localhost:8080
curl -s http://localhost:3002/health | jq . > docs/screenshots/health.json
```

---

## GitHub Actions Setup

1. Push this repo to GitHub
2. Workflow file: `.github/workflows/ci-cd.yml`
3. On **push to `main`**: runs lint, tests, build, push to local registry, deploy
4. On **pull requests**: runs only install, lint, test (no deploy)

Fork users: enable Actions in repo **Settings → Actions**.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `unknown shorthand flag: 'd'` | Use `docker-compose` (hyphen), not `docker compose` — see Prerequisites |
| Backend exits immediately | Wait for postgres healthcheck; check `docker-compose logs backend` |
| Port 3000 already allocated | Change `BACKEND_PORT` and `API_URL` in `.env` (default is now **3002**) |
| Frontend shows "offline" | Ensure `API_URL` in `.env` matches reachable backend URL |
| Push to `localhost:5000` fails | Add `insecure-registries` (see Local registry note) |
| Grafana empty graphs | Generate traffic; wait 1–2 min for Prometheus scrape |

---

## Learning Goals

After completing this project you should understand:

1. How a **multi-container** app is wired with Docker Compose
2. How **CI** catches bugs early (lint + tests)
3. How **CD** builds images and deploys them
4. Why **health checks** and **metrics** matter in production
5. Basic **security** habits: env vars, non-root containers, no committed secrets

---

## License

Educational use — free to copy, modify, and teach with.
