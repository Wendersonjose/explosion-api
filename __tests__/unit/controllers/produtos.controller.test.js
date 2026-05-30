const supabase = require('../../../src/config/supabase');
const produtosController = require('../../../src/controllers/produtos.controller');
const { mockProduto } = require('../../helpers/testHelpers');

describe('Produtos Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('listarProdutos', () => {
    it('deve listar todos os produtos ativos', async () => {
      const mockProdutos = [mockProduto, { ...mockProduto, id_produto: 2 }];

      // Mock da query chain
      supabase.from.mockReturnThis();
      supabase.select.mockReturnThis();
      supabase.eq.mockReturnThis();
      supabase.order.mockResolvedValueOnce({
        data: mockProdutos,
        error: null
      });

      await produtosController.listarProdutos(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        total: 2,
        data: mockProdutos
      });
    });

    it('deve filtrar produtos por nome quando search é fornecido', async () => {
      req.query = { search: 'Red Bull' };

      supabase.from.mockReturnThis();
      supabase.select.mockReturnThis();
      supabase.eq.mockReturnThis();
      supabase.order.mockReturnThis();
      supabase.ilike.mockReturnThis();
      supabase.order.mockResolvedValueOnce({
        data: [mockProduto],
        error: null
      });

      await produtosController.listarProdutos(req, res, next);

      expect(supabase.ilike).toHaveBeenCalledWith('nome_produto', '%Red Bull%');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('deve filtrar produtos por marca quando fornecida', async () => {
      req.query = { marca: 'Red Bull' };

      supabase.from.mockReturnThis();
      supabase.select.mockReturnThis();
      supabase.eq.mockReturnThis();
      supabase.order.mockReturnThis();
      supabase.ilike.mockReturnThis();
      supabase.order.mockResolvedValueOnce({
        data: [mockProduto],
        error: null
      });

      await produtosController.listarProdutos(req, res, next);

      expect(supabase.ilike).toHaveBeenCalledWith(
        'energeticos.marcas.nome_marca',
        '%Red Bull%'
      );
    });

    it('deve aplicar múltiplos filtros simultaneamente', async () => {
      req.query = { search: 'Energy', marca: 'Red Bull' };

      supabase.from.mockReturnThis();
      supabase.select.mockReturnThis();
      supabase.eq.mockReturnThis();
      supabase.order.mockReturnThis();
      supabase.ilike.mockReturnThis();
      supabase.order.mockResolvedValueOnce({
        data: [mockProduto],
        error: null
      });

      await produtosController.listarProdutos(req, res, next);

      expect(supabase.ilike).toHaveBeenCalledTimes(2);
    });

    it('deve retornar array vazio quando não há produtos', async () => {
      supabase.from.mockReturnThis();
      supabase.select.mockReturnThis();
      supabase.eq.mockReturnThis();
      supabase.order.mockResolvedValueOnce({
        data: [],
        error: null
      });

      await produtosController.listarProdutos(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        total: 0,
        data: []
      });
    });

    it('deve chamar next com erro se houver erro no banco', async () => {
      const dbError = new Error('Database error');
      
      supabase.from.mockReturnThis();
      supabase.select.mockReturnThis();
      supabase.eq.mockReturnThis();
      supabase.order.mockResolvedValueOnce({
        data: null,
        error: dbError
      });

      await produtosController.listarProdutos(req, res, next);

      expect(next).toHaveBeenCalledWith(dbError);
    });
  });

  describe('buscarProdutoPorId', () => {
    it('deve retornar produto quando ID é válido', async () => {
      req.params = { id: '1' };

      supabase.from.mockReturnThis();
      supabase.select.mockReturnThis();
      supabase.eq.mockReturnThis();
      supabase.single.mockResolvedValueOnce({
        data: mockProduto,
        error: null
      });

      await produtosController.buscarProdutoPorId(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockProduto
      });
    });

    it('deve retornar 404 quando produto não é encontrado', async () => {
      req.params = { id: '999' };

      supabase.from.mockReturnThis();
      supabase.select.mockReturnThis();
      supabase.eq.mockReturnThis();
      supabase.single.mockResolvedValueOnce({
        data: null,
        error: new Error('Not found')
      });

      await produtosController.buscarProdutoPorId(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Produto não encontrado'
      });
    });

    it('deve chamar next com erro se houver erro no banco', async () => {
      req.params = { id: '1' };
      const dbError = new Error('Database connection error');

      supabase.from.mockReturnThis();
      supabase.select.mockReturnThis();
      supabase.eq.mockReturnThis();
      supabase.single.mockRejectedValueOnce(dbError);

      await produtosController.buscarProdutoPorId(req, res, next);

      expect(next).toHaveBeenCalledWith(dbError);
    });
  });
});
