const request = require('supertest');
const app = require('../../src/app');
const { mockProduto } = require('../helpers/testHelpers');
const supabase = require('../../src/config/supabase');

describe('API Integration - Produtos Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/produtos', () => {
    it('deve listar todos os produtos', async () => {
      const mockProdutos = [
        mockProduto,
        { ...mockProduto, id_produto: 2, nome_produto: 'Monster Energy' }
      ];

      supabase.order.mockResolvedValueOnce({
        data: mockProdutos,
        error: null
      });

      const response = await request(app)
        .get('/api/v1/produtos')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        total: 2,
        data: mockProdutos
      });
    });

    it('deve filtrar produtos por nome', async () => {
      supabase.order.mockResolvedValueOnce({
        data: [mockProduto],
        error: null
      });

      const response = await request(app)
        .get('/api/v1/produtos?search=Red Bull')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(supabase.ilike).toHaveBeenCalledWith('nome_produto', '%Red Bull%');
      expect(response.body.success).toBe(true);
    });

    it('deve filtrar produtos por marca', async () => {
      supabase.order.mockResolvedValueOnce({
        data: [mockProduto],
        error: null
      });

      const response = await request(app)
        .get('/api/v1/produtos?marca=Red Bull')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(supabase.ilike).toHaveBeenCalledWith(
        'energeticos.marcas.nome_marca',
        '%Red Bull%'
      );
    });

    it('deve aplicar múltiplos filtros', async () => {
      supabase.order.mockResolvedValueOnce({
        data: [mockProduto],
        error: null
      });

      const response = await request(app)
        .get('/api/v1/produtos?search=Energy&marca=Red Bull')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(supabase.ilike).toHaveBeenCalledTimes(2);
      expect(response.body.success).toBe(true);
    });

    it('deve retornar lista vazia quando não há produtos', async () => {
      supabase.order.mockResolvedValueOnce({
        data: [],
        error: null
      });

      const response = await request(app)
        .get('/api/v1/produtos')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        total: 0,
        data: []
      });
    });
  });

  describe('GET /api/v1/produtos/:id', () => {
    it('deve retornar produto por ID', async () => {
      supabase.single.mockResolvedValueOnce({
        data: mockProduto,
        error: null
      });

      const response = await request(app)
        .get('/api/v1/produtos/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockProduto
      });
    });

    it('deve retornar 404 para produto não encontrado', async () => {
      supabase.single.mockResolvedValueOnce({
        data: null,
        error: new Error('Not found')
      });

      const response = await request(app)
        .get('/api/v1/produtos/999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        message: 'Produto não encontrado'
      });
    });

    it('deve aceitar diferentes IDs', async () => {
      const ids = [1, 5, 10, 100];

      for (const id of ids) {
        supabase.single.mockResolvedValueOnce({
          data: { ...mockProduto, id_produto: id },
          error: null
        });

        const response = await request(app)
          .get(`/api/v1/produtos/${id}`)
          .expect(200);

        expect(response.body.data.id_produto).toBe(id);
      }
    });
  });

  describe('Error Handling', () => {
    it('deve lidar com erros do banco de dados', async () => {
      const dbError = new Error('Database connection failed');
      
      supabase.order.mockResolvedValueOnce({
        data: null,
        error: dbError
      });

      const response = await request(app)
        .get('/api/v1/produtos')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });
});
