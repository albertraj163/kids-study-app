/**
 * PostgreSQL connection pool.
 * Credentials come from environment variables (see .env.example).
 */
const { Pool } = require('pg');
const { SEED_VERSION, SUBJECTS, QUESTIONS } = require('./seed-data');

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'kidsapp',
  password: process.env.POSTGRES_PASSWORD || 'kidsapp_secret',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  database: process.env.POSTGRES_DB || 'kids_study',
});

async function applySeed(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  const { rows: metaRows } = await client.query(
    `SELECT value FROM app_meta WHERE key = 'seed_version'`
  );
  const currentVersion = metaRows[0]?.value ?? '0';
  if (currentVersion === SEED_VERSION) {
    return;
  }

  await client.query('DELETE FROM quiz_questions');
  await client.query('DELETE FROM subjects');
  await client.query('ALTER SEQUENCE subjects_id_seq RESTART WITH 1');
  await client.query('ALTER SEQUENCE quiz_questions_id_seq RESTART WITH 1');

  for (const subject of SUBJECTS) {
    await client.query(
      `INSERT INTO subjects (name, emoji, description) VALUES ($1, $2, $3)`,
      [subject.name, subject.emoji, subject.description]
    );
  }

  for (const q of QUESTIONS) {
    await client.query(
      `INSERT INTO quiz_questions (subject_id, question, options, correct_index)
       VALUES ($1, $2, $3::jsonb, $4)`,
      [q.subjectId, q.question, JSON.stringify(q.options), q.correctIndex]
    );
  }

  await client.query(
    `INSERT INTO app_meta (key, value) VALUES ('seed_version', $1)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    [SEED_VERSION]
  );
}

/**
 * Run SQL to create tables and seed sample data (idempotent).
 */
async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        emoji VARCHAR(10) NOT NULL,
        description TEXT
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS quiz_questions (
        id SERIAL PRIMARY KEY,
        subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
        question TEXT NOT NULL,
        options JSONB NOT NULL,
        correct_index INTEGER NOT NULL
      );
    `);

    await applySeed(client);
  } finally {
    client.release();
  }
}

async function getSubjects() {
  const { rows } = await pool.query(
    'SELECT id, name, emoji, description FROM subjects ORDER BY id'
  );
  return rows;
}

async function getQuizBySubjectId(subjectId) {
  const { rows } = await pool.query(
    `SELECT id, question, options, correct_index
     FROM quiz_questions
     WHERE subject_id = $1
     ORDER BY id
     LIMIT 10`,
    [subjectId]
  );
  return rows.map((row) => ({
    id: row.id,
    question: row.question,
    options: row.options,
    correctIndex: row.correct_index,
  }));
}

async function checkDatabaseHealth() {
  const { rows } = await pool.query('SELECT 1 AS ok');
  return rows[0].ok === 1;
}

module.exports = {
  pool,
  initDatabase,
  getSubjects,
  getQuizBySubjectId,
  checkDatabaseHealth,
};
