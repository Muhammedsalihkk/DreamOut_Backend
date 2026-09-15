import request from 'supertest';
import app from '../src/app';

describe('App (e2e)', () => {
  it('/api/ (GET)', async () => {
    const response = await request(app).get('/api/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World!');
  });

  it('/api/health (GET)', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });
});
