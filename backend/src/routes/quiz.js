/**
 * Quiz API - returns questions for a given subject.
 */
const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/:subjectId', async (req, res, next) => {
  try {
    const subjectId = parseInt(req.params.subjectId, 10);
    if (Number.isNaN(subjectId) || subjectId < 1) {
      return res.status(400).json({ error: 'Invalid subject ID' });
    }
    const questions = await db.getQuizBySubjectId(subjectId);
    if (questions.length === 0) {
      return res.status(404).json({ error: 'No quiz found for this subject' });
    }
    res.json({ subjectId, questions });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
