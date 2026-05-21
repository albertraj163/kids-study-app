/**
 * Prometheus metrics for the backend.
 * Exposed at GET /metrics (Prometheus scrape format).
 */
const client = require('prom-client');

// Collect default Node.js metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics({ prefix: 'kids_study_' });

const httpRequestCounter = new client.Counter({
  name: 'kids_study_http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

const httpRequestDuration = new client.Histogram({
  name: 'kids_study_http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2],
});

function recordRequest(method, route, status, durationSeconds) {
  httpRequestCounter.inc({ method, route, status: String(status) });
  httpRequestDuration.observe({ method, route }, durationSeconds);
}

module.exports = {
  client,
  recordRequest,
};
