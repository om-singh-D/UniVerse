import request from 'supertest';
import app from '../../src/app';

describe('Confessions Integration Tests', () => {
  describe('GET /api/confessions', () => {
    it('should get confessions', async () => {
      const response = await request(app)
        .get('/api/confessions')
        .expect(200);

      // TODO: Add assertions
    });
  });

  describe('POST /api/confessions', () => {
    it('should create a new confession', async () => {
      const confessionData = {
        content: 'This is a test confession',
        isAnonymous: true,
        categoryId: 1
      };

      const response = await request(app)
        .post('/api/confessions')
        .send(confessionData)
        .expect(200);

      // TODO: Add assertions
    });
  });
});
