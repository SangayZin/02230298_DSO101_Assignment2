const fs = require('fs');
const path = require('path');
const request = require('supertest');

process.env.NODE_ENV = 'test';

const testDbPath = path.join(__dirname, 'test-tasks.db');
process.env.DB_PATH = testDbPath;
process.env.ALLOWED_ORIGIN = '*';

if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

const { app, closeDatabase } = require('./server');

afterAll(() => {
  closeDatabase();

  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
});

describe('Todo API', () => {
  it('returns health status', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Server is running');
  });

  it('creates a task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: 'Jenkins test task', description: 'Created during CI' });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Jenkins test task');
    expect(response.body.description).toBe('Created during CI');
  });
});