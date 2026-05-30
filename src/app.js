
require('dotenv').config()
const express = require('express')
const cors = require('cors')


const clientesRoutes = require('./routes/clientes.routes')
const produtosRoutes = require('./routes/produtos.routes')
const authRoutes = require('./routes/auth.routes')
const errorHandler = require('./middlewares/errorHandler')
const carrinhoRoutes = require('./routes/carrinho.routes')
const pedidosRoutes = require('./routes/pedidos.routes')

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Explosion rodando' 
  })
})

// Rotas da API
app.use('/api/v1/clientes', clientesRoutes)
app.use('/api/v1/produtos', produtosRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/carrinho', carrinhoRoutes)
app.use('/api/v1/pedidos', pedidosRoutes)


// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler)

module.exports = app
