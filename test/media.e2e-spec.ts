import request from 'supertest';
import app from '../src/app';
import { BackendCloudinaryService } from '../src/infrastructure/security/cloudinary.service';

describe('Media Controller & Cloudinary Service (e2e)', () => {
  it('POST /api/media/delete without publicId or url returns 400 BadRequest', async () => {
    const response = await request(app).post('/api/media/delete').send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('statusCode', 400);
    expect(response.body.message).toContain('publicId or url is required');
  });

  it('POST /api/media/delete with publicId handles deletion safely', async () => {
    const response = await request(app)
      .post('/api/media/delete')
      .send({ publicId: 'dreamout/destinations/sample_id_123' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('statusCode', 200);
    expect(response.body).toHaveProperty('message');
  });

  it('DELETE /api/media?publicId=... handles deletion safely', async () => {
    const response = await request(app)
      .delete('/api/media')
      .query({ publicId: 'dreamout/destinations/sample_id_456' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('statusCode', 200);
  });

  describe('BackendCloudinaryService helper functions', () => {
    it('isCloudinaryUrl correctly identifies Cloudinary URLs', () => {
      expect(
        BackendCloudinaryService.isCloudinaryUrl(
          'https://res.cloudinary.com/dyvbvvjaz/image/upload/v12345/dreamout/destinations/abc.jpg'
        )
      ).toBe(true);

      expect(
        BackendCloudinaryService.isCloudinaryUrl(
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb'
        )
      ).toBe(false);

      expect(BackendCloudinaryService.isCloudinaryUrl(null)).toBe(false);
    });

    it('extractPublicId parses Cloudinary URLs accurately', () => {
      const url =
        'https://res.cloudinary.com/dyvbvvjaz/image/upload/v1729000000/dreamout/destinations/munnar_peak.jpg';
      expect(BackendCloudinaryService.extractPublicId(url)).toBe(
        'dreamout/destinations/munnar_peak'
      );

      const rawId = 'dreamout/profiles/avatar_user1';
      expect(BackendCloudinaryService.extractPublicId(rawId)).toBe('dreamout/profiles/avatar_user1');
    });
  });
});
