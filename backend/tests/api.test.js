/**
 * Unit tests for the Kids Study API.
 * Database is mocked so CI can run tests without PostgreSQL.
 */
const request = require('supertest');

jest.mock('../src/db', () => ({
  initDatabase: jest.fn().mockResolvedValue(undefined),
  checkDatabaseHealth: jest.fn().mockResolvedValue(true),
  getSubjects: jest.fn().mockResolvedValue([
    { id: 1, name: 'Math', emoji: '🔢', description: 'Numbers' },
  ]),
  getQuizBySubjectId: jest.fn().mockResolvedValue([
    {
      id: 1,
      question: 'Which of the following is a prime number?',
      options: ['21', '29', '33'],
      correctIndex: 1,
    },
  ]),
}));

const { app } = require('../src/index');

describe('Kids Study API', () => {
  test('GET /health returns healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toBe('kids-study-backend');
  });

  test('GET /api/subjects returns subject list', async () => {
    const res = await request(app).get('/api/subjects');
    expect(res.status).toBe(200);
    expect(res.body.subjects).toHaveLength(1);
    expect(res.body.subjects[0].name).toBe('Math');
  });

  test('GET /api/quiz/:subjectId returns quiz questions', async () => {
    const res = await request(app).get('/api/quiz/1');
    expect(res.status).toBe(200);
    expect(res.body.questions).toHaveLength(1);
    expect(res.body.questions[0].question).toContain('prime');
  });

  test('GET /api/quiz/invalid returns 400', async () => {
    const res = await request(app).get('/api/quiz/abc');
    expect(res.status).toBe(400);
  });

  test('GET /metrics returns Prometheus format', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.text).toContain('kids_study_');
  });
});
