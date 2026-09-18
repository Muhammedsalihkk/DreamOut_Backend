import request from 'supertest';
import app from '../src/app';

describe('Auth Endpoints (e2e)', () => {
  describe('POST /api/auth/login', () => {
    it('should return 400 when email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 400 when password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 400 for invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'invalid-email', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Invalid email format');
    });
  });

  describe('POST /api/users/login', () => {
    it('should return 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });
});
