const errorHandler = require('../../../src/middlewares/errorHandler');

describe('Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    
    // Guarda o NODE_ENV original
    this.originalEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    // Restaura o NODE_ENV
    process.env.NODE_ENV = this.originalEnv;
  });

  describe('Status Code', () => {
    it('deve usar statusCode 500 como padrão', () => {
      const error = new Error('Erro genérico');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('deve usar statusCode do erro quando fornecido', () => {
      const error = new Error('Recurso não encontrado');
      error.statusCode = 404;

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('deve lidar com diferentes códigos de status', () => {
      const testCases = [
        { statusCode: 400, message: 'Bad Request' },
        { statusCode: 401, message: 'Unauthorized' },
        { statusCode: 403, message: 'Forbidden' },
        { statusCode: 404, message: 'Not Found' },
        { statusCode: 409, message: 'Conflict' },
        { statusCode: 422, message: 'Unprocessable Entity' }
      ];

      testCases.forEach(({ statusCode, message }) => {
        const error = new Error(message);
        error.statusCode = statusCode;

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(statusCode);
      });
    });
  });

  describe('Response Format', () => {
    it('deve retornar formato padrão de erro', () => {
      const error = new Error('Mensagem de erro');
      error.statusCode = 400;

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Mensagem de erro'
      });
    });

    it('deve incluir stack trace em development', () => {
      process.env.NODE_ENV = 'development';
      const error = new Error('Erro de teste');
      error.stack = 'Error: Erro de teste\n    at test.js:1:1';

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Erro de teste',
          stack: expect.any(String)
        })
      );
    });

    it('não deve incluir stack trace em production', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('Erro de teste');
      error.stack = 'Error: Erro de teste\n    at test.js:1:1';

      errorHandler(error, req, res, next);

      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall).not.toHaveProperty('stack');
      expect(jsonCall).toEqual({
        success: false,
        message: 'Erro de teste'
      });
    });

    it('deve usar mensagem padrão quando erro não tem mensagem', () => {
      const error = new Error();
      delete error.message;

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Erro interno do servidor'
      });
    });
  });

  describe('Logging', () => {
    it('deve logar o erro no console', () => {
      const error = new Error('Erro para log');
      const consoleErrorSpy = jest.spyOn(console, 'error');

      errorHandler(error, req, res, next);

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('deve lidar com erro sem propriedades', () => {
      const error = {};

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Erro interno do servidor'
      });
    });

    it('deve lidar com statusCode inválido', () => {
      const error = new Error('Teste');
      error.statusCode = 'invalid';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
