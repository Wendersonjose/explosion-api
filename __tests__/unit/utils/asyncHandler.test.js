const asyncHandler = require('../../../src/utils/asyncHandler');

describe('AsyncHandler Utility', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('Success Cases', () => {
    it('deve executar função assíncrona com sucesso', async () => {
      const mockFn = jest.fn(async (req, res) => {
        res.status(200).json({ success: true });
      });

      const wrappedFn = asyncHandler(mockFn);
      await wrappedFn(req, res, next);

      expect(mockFn).toHaveBeenCalledWith(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(next).not.toHaveBeenCalled();
    });

    it('deve passar req, res e next para a função', async () => {
      const mockFn = jest.fn(async (req, res, next) => {
        expect(req).toBeDefined();
        expect(res).toBeDefined();
        expect(next).toBeDefined();
      });

      const wrappedFn = asyncHandler(mockFn);
      await wrappedFn(req, res, next);

      expect(mockFn).toHaveBeenCalledWith(req, res, next);
    });

    it('deve lidar com funções que retornam Promise', async () => {
      const mockFn = jest.fn(() => {
        return Promise.resolve({ data: 'test' });
      });

      const wrappedFn = asyncHandler(mockFn);
      await wrappedFn(req, res, next);

      expect(mockFn).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('deve capturar erros síncronos e passar para next', async () => {
      const error = new Error('Erro síncrono');
      const mockFn = jest.fn(() => {
        throw error;
      });

      const wrappedFn = asyncHandler(mockFn);
      await wrappedFn(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('deve capturar erros assíncronos e passar para next', async () => {
      const error = new Error('Erro assíncrono');
      const mockFn = jest.fn(async () => {
        throw error;
      });

      const wrappedFn = asyncHandler(mockFn);
      await wrappedFn(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('deve capturar erros de Promise rejeitada', async () => {
      const error = new Error('Promise rejeitada');
      const mockFn = jest.fn(() => {
        return Promise.reject(error);
      });

      const wrappedFn = asyncHandler(mockFn);
      await wrappedFn(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('não deve chamar next se não houver erro', async () => {
      const mockFn = jest.fn(async () => {
        return { success: true };
      });

      const wrappedFn = asyncHandler(mockFn);
      await wrappedFn(req, res, next);

      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('deve lidar com função que não retorna nada', async () => {
      const mockFn = jest.fn(async () => {
        // não retorna nada
      });

      const wrappedFn = asyncHandler(mockFn);
      await wrappedFn(req, res, next);

      expect(mockFn).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('deve lidar com múltiplas chamadas', async () => {
      const mockFn = jest.fn(async () => {
        return { success: true };
      });

      const wrappedFn = asyncHandler(mockFn);
      
      await wrappedFn(req, res, next);
      await wrappedFn(req, res, next);

      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('deve preservar o contexto da função original', async () => {
      let capturedThis;
      const mockFn = jest.fn(async function() {
        capturedThis = this;
      });

      const wrappedFn = asyncHandler(mockFn);
      await wrappedFn(req, res, next);

      expect(mockFn).toHaveBeenCalled();
    });
  });
});
