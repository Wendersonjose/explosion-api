const express = require('express')
const router = express.Router()

const roleMiddleware = require('../middlewares/role.middleware')
const authMiddleware = require('../middlewares/auth.middleware')

const {
  listarClientes,
  buscarClientePorId
} = require('../controllers/clientes.controller')

router.get('/', authMiddleware, roleMiddleware('admin'), listarClientes)

router.get('/:id', authMiddleware, roleMiddleware('admin'), buscarClientePorId)

module.exports = router