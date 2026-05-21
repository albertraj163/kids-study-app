/**
 * Kids Study App - Backend entry point
 * Express server with health, subjects, quiz, and Prometheus metrics.
 */
const express = require('express');
const { client: promClient, recordRequest } = require('./metrics');
const healthRouter = require('./routes/health');
const subjectsRouter = require('./routes/subjects');
const quizRouter = require('./routes/quiz');
const db = require('./db');

const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

app.use(express.json());

// Allow browser requests from the frontend (different port = cross-origin)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Request timing middleware for Prometheus
app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const durationNs = Number(process.hrtime.bigint() - start);
    const route = req.route?.path || req.path;
    recordRequest(req.method, route, res.statusCode, durationNs / 1e9);
  });
  next();
});

// API routes
app.use('/health', healthRouter);
app.use('/api/subjects', subjectsRouter);
app.use('/api/quiz', quizRouter);

// Prometheus scrape endpoint
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Friendly root page for quick checks in a browser
app.get('/', (_req, res) => {
  res.json({
    message: 'Kids Study API',
    endpoints: ['/health', '/api/subjects', '/api/quiz/:subjectId', '/metrics'],
  });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  // Retry DB connection (postgres may still be starting in Docker)
  let connected = false;
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      await db.initDatabase();
      connected = true;
      break;
    } catch (err) {
      console.warn(`DB init attempt ${attempt}/10 failed: ${err.message}`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  if (!connected) {
    console.error('Could not connect to database. Exiting.');
    process.exit(1);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kids Study backend listening on port ${PORT}`);
  });
}

// Export app for Supertest in unit tests
module.exports = { app, start };

if (require.main === module) {
  start();
}
