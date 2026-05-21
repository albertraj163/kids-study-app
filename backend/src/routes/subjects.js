/**
 * Subjects API - kids can browse available study topics.
 */
const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const subjects = await db.getSubjects();
    res.json({ subjects });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
