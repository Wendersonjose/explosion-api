const {
  buscarCarrinhoAtivoUsuario,
  buscarItensCarrinho,
  buscarPedidosUsuario,
  buscarPedidoPorId,
  atualizarStatusPedido,
  processarPedidoCompleto,
} = require('../services/pedidos.service')

const FORMAS_PAGAMENTO_PERMITIDAS = ['pix', 'cartao_credito', 'cartao_debito', 'boleto']

// Criar pedido
const criarPedido = async (req, res, next) => {
  try {
    const id_usuario = req.usuario.id
    const { id_endereco, forma_pagamento } = req.body

    if (!id_endereco || !forma_pagamento) {
      return res.status(400).json({
        success: false,
        message: 'id_endereco e forma_pagamento são obrigatórios',
      })
    }

    if (!FORMAS_PAGAMENTO_PERMITIDAS.includes(forma_pagamento)) {
      return res.status(400).json({
        success: false,
        message: `Forma de pagamento inválida. Permitidas: ${FORMAS_PAGAMENTO_PERMITIDAS.join(', ')}`,
      })
    }

    const carrinho = await buscarCarrinhoAtivoUsuario(id_usuario)

    if (!carrinho) {
      return res.status(404).json({
        success: false,
        message: 'Carrinho ativo não encontrado',
      })
    }

    const itensCarrinho = await buscarItensCarrinho(carrinho.id_carrinho)

    if (!itensCarrinho || itensCarrinho.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Carrinho vazio',
      })
    }

    const { pedido, pagamento } = await processarPedidoCompleto({
      id_usuario,
      id_endereco,
      forma_pagamento,
      itensCarrinho,
      id_carrinho: carrinho.id_carrinho,
    })

    return res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: { pedido, pagamento },
    })
  } catch (error) {
    next(error)
  }
}

// Listar meus pedidos
const listarMeusPedidos = async (req, res, next) => {
  try {
    const id_usuario = req.usuario.id

    const pedidos = await buscarPedidosUsuario(id_usuario)

    return res.status(200).json({
      success: true,
      data: pedidos,
    })
  } catch (error) {
    next(error)
  }
}

// Buscar pedido por ID
const buscarPedidoPorIdController = async (req, res, next) => {
  try {
    const { id } = req.params

    const pedido = await buscarPedidoPorId(id)

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado',
      })
    }

    return res.status(200).json({
      success: true,
      data: pedido,
    })
  } catch (error) {
    next(error)
  }
}

// Atualizar status do pedido
const atualizarStatusPedidoController = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'O campo status é obrigatório',
      })
    }

    const pedido = await atualizarStatusPedido(id, status)

    return res.status(200).json({
      success: true,
      message: 'Status atualizado com sucesso',
      data: pedido,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  criarPedido,
  listarMeusPedidos,
  buscarPedidoPorId: buscarPedidoPorIdController,
  atualizarStatusPedido: atualizarStatusPedidoController,
}