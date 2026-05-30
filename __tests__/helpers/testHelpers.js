// Helpers para testes
const jwt = require('jsonwebtoken');

/**
 * Gera um token JWT de teste
 */
const generateTestToken = (payload = {}) => {
  const defaultPayload = {
    id_usuario: 1,
    email: 'test@example.com',
    tipo_usuario: 'cliente',
    ...payload
  };

  return jwt.sign(defaultPayload, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
};

/**
 * Gera um token JWT de teste para admin
 */
const generateAdminToken = () => {
  return generateTestToken({
    id_usuario: 999,
    email: 'admin@example.com',
    tipo_usuario: 'admin'
  });
};

/**
 * Mock de dados de teste para produtos
 */
const mockProduto = {
  id_produto: 1,
  nome_produto: 'Red Bull Energy Drink',
  descricao: 'Bebida energética',
  imagem_url: 'http://example.com/redbull.jpg',
  estoque: 100,
  ativo: true,
  energeticos: {
    nome_energetico: 'Red Bull',
    marcas: {
      nome_marca: 'Red Bull'
    }
  },
  volumes: {
    ml: 250
  },
  precos_varejo: {
    preco_varejo_unitario: 8.50
  }
};

/**
 * Mock de dados de teste para cliente
 */
const mockCliente = {
  id_cliente: 1,
  nome: 'Cliente Teste',
  email: 'cliente@test.com',
  telefone: '11999999999',
  cpf: '12345678900',
  criado_em: new Date().toISOString()
};

/**
 * Mock de dados de teste para usuário
 */
const mockUsuario = {
  id_usuario: 1,
  nome: 'Usuário Teste',
  email: 'usuario@test.com',
  tipo_usuario: 'cliente',
  criado_em: new Date().toISOString()
};

/**
 * Mock do Supabase
 */
const mockSupabaseClient = () => {
  return {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn(),
  };
};

module.exports = {
  generateTestToken,
  generateAdminToken,
  mockProduto,
  mockCliente,
  mockUsuario,
  mockSupabaseClient
};
