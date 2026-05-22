const express  = require('express')

const router = express.Router()

const {
    listarProdutos,
    buscarProdutoPorId
} = require('../controllers/produtos.controller')

// Rotas de produtos
router.get('/', listarProdutos)
router.get('/:id', buscarProdutoPorId)

module.exports = router
