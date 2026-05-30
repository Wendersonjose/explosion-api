const roleMiddleware = require('../../../src/middlewares/role.middleware');

describe('Role Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      usuario: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('Autenticação', () => {
    it('deve rejeitar se usuário não estiver autenticado', () => {
      const middleware = roleMiddleware('admin');
      
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Usuário não autenticado'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Autorização', () => {
    it('deve permitir acesso para perfil autorizado', () => {
      req.usuario = {
        id_usuario: 1,
        tipo_usuario: 'admin'
      };

      const middleware = roleMiddleware('admin');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve rejeitar acesso para perfil não autorizado', () => {
      req.usuario = {
        id_usuario: 1,
        tipo_usuario: 'cliente'
      };

      const middleware = roleMiddleware('admin');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Usuário não autorizado'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve permitir acesso para múltiplos perfis autorizados', () => {
      req.usuario = {
        id_usuario: 1,
        tipo_usuario: 'cliente'
      };

      const middleware = roleMiddleware('admin', 'cliente', 'vendedor');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve rejeitar quando perfil não está na lista de permitidos', () => {
      req.usuario = {
        id_usuario: 1,
        tipo_usuario: 'visitante'
      };

      const middleware = roleMiddleware('admin', 'vendedor');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Casos Edge', () => {
    it('deve funcionar com um único perfil permitido', () => {
      req.usuario = {
        id_usuario: 1,
        tipo_usuario: 'admin'
      };

      const middleware = roleMiddleware('admin');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('deve ser case-sensitive na comparação de perfis', () => {
      req.usuario = {
        id_usuario: 1,
        tipo_usuario: 'Admin' // com maiúscula
      };

      const middleware = roleMiddleware('admin');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
