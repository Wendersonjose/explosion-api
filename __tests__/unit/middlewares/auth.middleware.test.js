const authMiddleware = require('../../../src/middlewares/auth.middleware');
const { generateTestToken } = require('../../helpers/testHelpers');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('Token Validation', () => {
    it('deve rejeitar requisição sem token', () => {
      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token de autenticação não fornecido'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve rejeitar token inválido', () => {
      req.headers.authorization = 'Bearer token-invalido';

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token de autenticação inválido'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve aceitar token válido e adicionar usuário à requisição', () => {
      const token = generateTestToken({
        id_usuario: 1,
        email: 'test@example.com',
        tipo_usuario: 'cliente'
      });

      req.headers.authorization = `Bearer ${token}`;

      authMiddleware(req, res, next);

      expect(req.usuario).toBeDefined();
      expect(req.usuario.id_usuario).toBe(1);
      expect(req.usuario.email).toBe('test@example.com');
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve rejeitar token sem o prefixo Bearer', () => {
      const token = generateTestToken();
      req.headers.authorization = token; // sem "Bearer "

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('deve rejeitar authorization header vazio', () => {
      req.headers.authorization = '';

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token de autenticação não fornecido'
      });
    });
  });

  describe('Token Payload', () => {
    it('deve preservar todos os dados do payload no req.usuario', () => {
      const payload = {
        id_usuario: 123,
        email: 'user@example.com',
        tipo_usuario: 'admin',
        nome: 'Test User'
      };

      const token = generateTestToken(payload);
      req.headers.authorization = `Bearer ${token}`;

      authMiddleware(req, res, next);

      expect(req.usuario.id_usuario).toBe(123);
      expect(req.usuario.email).toBe('user@example.com');
      expect(req.usuario.tipo_usuario).toBe('admin');
    });
  });
});
