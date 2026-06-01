const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../../src/app');
const supabase = require('../../src/config/supabase');

describe('API Integration - Auth Routes', () => {
  beforeEach(() => {
    supabase.__reset();
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth/register', () => {
    it('deve registrar novo usuário com sucesso', async () => {
      // Mock: verificar usuário (não existe) + inserir usuário
      supabase.__setSequence(
        { data: null, error: null },
        { data: [{
          id_usuario: 1,
          nome: 'Novo Usuario',
          email: 'novo@test.com',
          tipo_usuario: 'cliente',
          criado_em: new Date().toISOString()
        }], error: null }
      );

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          nome: 'Novo Usuario',
          email: 'novo@test.com',
          senha: '123456'
        })
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toEqual({
        success: true,
        message: 'Usuário cadastrado com sucesso',
        data: expect.any(Array)
      });
    });

    it('deve rejeitar registro com dados incompletos', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          nome: 'Teste'
          // faltando email e senha
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: 'Nome, email e senha são obrigatórios'
      });
    });

    it('deve rejeitar email já cadastrado', async () => {
      // Mock: usuário já existe
      supabase.__setResult({ id_usuario: 1, email: 'existente@test.com' }, null);

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          nome: 'Teste',
          email: 'existente@test.com',
          senha: '123456'
        })
        .expect('Content-Type', /json/)
        .expect(409);

      expect(response.body).toEqual({
        success: false,
        message: 'Email já cadastrado'
      });
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const hashedPassword = await bcrypt.hash('123456', 10);

      supabase.__setResult({
        id_usuario: 1,
        nome: 'Usuario Teste',
        email: 'teste@test.com',
        senha_hash: hashedPassword,
        tipo_usuario: 'cliente'
      }, null);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'teste@test.com',
          senha: '123456'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Login realizado com sucesso',
        token: expect.any(String),
        usuario: expect.objectContaining({
          email: 'teste@test.com'
        })
      });
    });

    it('deve rejeitar login com credenciais inválidas', async () => {
      supabase.__setResult(null, new Error('Not found'));

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'invalido@test.com',
          senha: 'senhaerrada'
        })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toEqual({
        success: false,
        message: 'Email ou senha inválidos'
      });
    });

    it('deve rejeitar login com dados incompletos', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'teste@test.com'
          // faltando senha
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    });

    it('deve rejeitar login com senha incorreta', async () => {
      const hashedPassword = await bcrypt.hash('senhaCorreta', 10);

      supabase.__setResult({
        id_usuario: 1,
        email: 'teste@test.com',
        senha_hash: hashedPassword,
        tipo_usuario: 'cliente'
      }, null);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'teste@test.com',
          senha: 'senhaErrada'
        })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toEqual({
        success: false,
        message: 'Email ou senha inválidos'
      });
    });
  });
});
