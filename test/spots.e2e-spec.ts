import request from 'supertest';
import app from '../src/app';

describe('Spots (e2e)', () => {
  it('GET /api/spots should return 200 with list of spots', async () => {
    const response = await request(app).get('/api/spots');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('statusCode', 200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('POST /api/spots with empty body should return 400 validation error', async () => {
    const response = await request(app)
      .post('/api/spots')
      .send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('statusCode', 400);
    expect(response.body.message).toContain('Spot name is required');
  });

  it('POST /api/spots without category should return 400 validation error', async () => {
    const response = await request(app)
      .post('/api/spots')
      .send({ name: 'Valid Name' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('statusCode', 400);
    expect(response.body.message).toContain('Spot category is required');
  });

  it('POST /api/spots with invalid latitude should return 400 validation error', async () => {
    const response = await request(app)
      .post('/api/spots')
      .send({
        name: 'Valid Name',
        category: 'Nature',
        latitude: 999,
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('statusCode', 400);
    expect(response.body.message).toContain('Latitude must be a valid number between -90 and 90');
  });

  it('POST /api/spots with valid payload creates spot with 201', async () => {
    const response = await request(app)
      .post('/api/spots')
      .send({
        name: 'E2E Test Spot',
        category: 'Viewpoint',
        location: 'Munnar, Kerala',
        description: 'Test description for e2e',
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('statusCode', 201);
    expect(response.body.data).toHaveProperty('name', 'E2E Test Spot');
    expect(response.body.data).toHaveProperty('category', 'Viewpoint');
  });
});
