const express = require('express');

const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware')

const {
    obterCarrinho,
    adicionarItemCarrinho,
    removerItemCarrinho

} = require('../controllers/carrinho.controller');


// Rota para obter o carrinho do usuário autenticado
router.get('/', authMiddleware, obterCarrinho);

// Rota para adicionar um item ao carrinho do usuário autenticado
router.post(
    '/adicionar',
     authMiddleware, 
     adicionarItemCarrinho
    );

// Rota para remover um item do carrinho do usuário autenticado
router.delete(
    '/item/:id_item_carrinho', 
    authMiddleware, 
    removerItemCarrinho
);

module.exports = router;