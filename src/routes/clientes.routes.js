const express = require('express')
const router = express.Router()
const clientesController = require('../controllers/clientes.controller')

// Rotas para clientes atacadistas
router.get('/', clientesController.listarClientes)
router.get('/:id', clientesController.buscarClientePorId)

module.exports = router
