/**
 * Health check route - used by Docker, load balancers, and CI smoke tests.
 */
const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const dbOk = await db.checkDatabaseHealth();
    const status = dbOk ? 'healthy' : 'degraded';
    const code = dbOk ? 200 : 503;
    res.status(code).json({
      status,
      service: 'kids-study-backend',
      timestamp: new Date().toISOString(),
      database: dbOk ? 'connected' : 'disconnected',
    });
  } catch (err) {
    res.status(503).json({
      status: 'unhealthy',
      service: 'kids-study-backend',
      error: err.message,
    });
  }
});

module.exports = router;
