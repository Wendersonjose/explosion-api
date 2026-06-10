const supabase = require('../config/supabase')

const buscarCarrinhoAtivoUsuario = async (id_usuario) => {
  const { data: carrinho, error } = await supabase
    .from('carrinhos')
    .select('*')
    .eq('id_usuario', id_usuario)
    .eq('status', 'ativo')
    .maybeSingle()

  if (error) throw error

  return carrinho
}

const buscarItensCarrinho = async (id_carrinho) => {
  const { data: itens, error } = await supabase
    .from('itens_carrinho')
    .select('*')
    .eq('id_carrinho', id_carrinho)

  if (error) throw error

  return itens
}

const criarPedidoRegistro = async (id_usuario, id_endereco, valor_total) => {
  const { data: pedido, error } = await supabase
    .from('pedidos')
    .insert([
      {
        id_usuario,
        id_endereco,
        status: 'pendente',
        valor_total
      }
    ])
    .select('*')
    .single()

  if (error) throw error

  return pedido
}

const criarPedido = async () => {}

const buscarPedidosUsuario = async () => {}

const buscarPedidoPorId = async () => {}

const atualizarStatusPedido = async () => {}

const criarItensPedido = async (itensPedido) => {
  const { error } = await supabase
    .from('itens_pedido')
    .insert(itensPedido)

  if (error) {
    throw error
  }

  return true
}

const criarPagamento = async (
  id_pedido,
  forma_pagamento,
  valor
) => {
  const { data: pagamento, error } = await supabase
    .from('pagamentos')
    .insert([
      {
        id_pedido,
        forma_pagamento,
        status_pagamento: 'pendente',
        valor
      }
    ])
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return pagamento
}

module.exports = {
  buscarCarrinhoAtivoUsuario,
  buscarItensCarrinho,
  criarPedidoRegistro,
  criarPedido,
  buscarPedidosUsuario,
  buscarPedidoPorId,
  atualizarStatusPedido,
  criarItensPedido,
  criarPagamento
}