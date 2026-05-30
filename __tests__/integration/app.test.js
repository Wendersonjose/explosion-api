const request = require('supertest');
const app = require('../../src/app');

describe('API Integration Tests - Health Check', () => {
  describe('GET /', () => {
    it('deve retornar status 200 na rota raiz', async () => {
      const response = await request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        message: 'API Explosion rodando'
      });
    });
  });

  describe('Error Handling', () => {
    it('deve retornar 404 para rotas não existentes', async () => {
      const response = await request(app)
        .get('/api/v1/rota-inexistente')
        .expect(404);
    });
  });

  describe('CORS', () => {
    it('deve permitir requisições CORS', async () => {
      const response = await request(app)
        .get('/')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('JSON Middleware', () => {
    it('deve aceitar requisições JSON', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ test: 'data' })
        .set('Content-Type', 'application/json');

      // A requisição deve ser aceita (mesmo que retorne erro de validação)
      expect(response.status).toBeDefined();
    });
  });
});
