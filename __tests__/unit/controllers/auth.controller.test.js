const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../../../src/config/supabase');
const authController = require('../../../src/controllers/auth.controller');

describe('Auth Controller', () => {
  let req, res, next;

  beforeEach(() => {
    supabase.__reset();
    req = {
      body: {},
      usuario: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('register', () => {
    it('deve retornar erro 400 se campos obrigatórios não forem fornecidos', async () => {
      req.body = { nome: 'Teste' }; // faltando email e senha

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Nome, email e senha são obrigatórios'
      });
    });

    it('deve retornar erro 409 se email já estiver cadastrado', async () => {
      req.body = {
        nome: 'Teste',
        email: 'teste@example.com',
        senha: '123456'
      };

      supabase.__setResult({ id_usuario: 1, email: 'teste@example.com' }, null);

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email já cadastrado'
      });
    });

    it('deve criar usuário com sucesso', async () => {
      req.body = {
        nome: 'Novo Usuario',
        email: 'novo@example.com',
        senha: '123456'
      };

      // Mock para verificar usuário (não existe) + inserir usuário
      supabase.__setSequence(
        { data: null, error: null },
        { data: [{
          id_usuario: 1,
          nome: 'Novo Usuario',
          email: 'novo@example.com',
          tipo_usuario: 'cliente',
          criado_em: new Date().toISOString()
        }], error: null }
      );

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Usuário cadastrado com sucesso',
        data: expect.any(Array)
      });
    });

    it('deve chamar next com erro se houver erro no banco', async () => {
      req.body = {
        nome: 'Teste',
        email: 'teste@example.com',
        senha: '123456'
      };

      const dbError = new Error('Database error');
      supabase.__setSequence(
        { data: null, error: null },
        { data: null, error: dbError }
      );

      await authController.register(req, res, next);

      expect(next).toHaveBeenCalledWith(dbError);
    });
  });

  describe('login', () => {
    it('deve retornar erro 400 se email ou senha não forem fornecidos', async () => {
      req.body = { email: 'teste@example.com' }; // faltando senha

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    });

    it('deve retornar erro 401 se usuário não for encontrado', async () => {
      req.body = {
        email: 'naoexiste@example.com',
        senha: '123456'
      };

      supabase.__setResult(null, new Error('Not found'));

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email ou senha inválidos'
      });
    });

    it('deve retornar erro 401 se senha for inválida', async () => {
      req.body = {
        email: 'teste@example.com',
        senha: 'senhaerrada'
      };

      const hashedPassword = await bcrypt.hash('senhaCorreta', 10);

      supabase.__setResult({
        id_usuario: 1,
        email: 'teste@example.com',
        senha_hash: hashedPassword,
        tipo_usuario: 'cliente'
      }, null);

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email ou senha inválidos'
      });
    });

    it('deve fazer login com sucesso e retornar token', async () => {
      req.body = {
        email: 'teste@example.com',
        senha: '123456'
      };

      const hashedPassword = await bcrypt.hash('123456', 10);

      supabase.__setResult({
        id_usuario: 1,
        nome: 'Usuario Teste',
        email: 'teste@example.com',
        senha_hash: hashedPassword,
        tipo_usuario: 'cliente'
      }, null);

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login realizado com sucesso',
        token: expect.any(String),
        usuario: {
          id: 1,
          nome: 'Usuario Teste',
          email: 'teste@example.com',
          tipo_usuario: 'cliente'
        }
      });
    });

    it('deve gerar token JWT válido', async () => {
      req.body = {
        email: 'teste@example.com',
        senha: '123456'
      };

      const hashedPassword = await bcrypt.hash('123456', 10);

      supabase.__setResult({
        id_usuario: 1,
        nome: 'Usuario Teste',
        email: 'teste@example.com',
        senha_hash: hashedPassword,
        tipo_usuario: 'cliente'
      }, null);

      await authController.login(req, res, next);

      const responseData = res.json.mock.calls[0][0];
      const decoded = jwt.verify(responseData.token, process.env.JWT_SECRET);

      expect(decoded).toHaveProperty('id');
      expect(decoded).toHaveProperty('email');
      expect(decoded).toHaveProperty('tipo_usuario');
    });
  });
});
