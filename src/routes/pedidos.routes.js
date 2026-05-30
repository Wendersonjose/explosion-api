const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');

const {
    criarPedido,
    listarMeusPedidos,
    buscarPedidoPorId,
    atualizarStatusPedido,
} = require('../controllers/pedidos.controller');

router.post('/', authMiddleware, criarPedido);
router.get('/meus-pedidos', authMiddleware, listarMeusPedidos);
router.get('/:id', authMiddleware, buscarPedidoPorId);
router.put('/:id/status', authMiddleware, atualizarStatusPedido);

module.exports = router;