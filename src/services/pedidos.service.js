const supabase = require("../config/supabase");

// ─── Carrinho ────────────────────────────────────────────────────────────────

const buscarCarrinhoAtivoUsuario = async (id_usuario) => {
  const { data: carrinho, error } = await supabase
    .from("carrinhos")
    .select("*")
    .eq("id_usuario", id_usuario)
    .eq("status", "ativo")
    .maybeSingle();

  if (error) throw error;

  return carrinho;
};

const buscarItensCarrinho = async (id_carrinho) => {
  const { data: itens, error } = await supabase
    .from("itens_carrinho")
    .select("*")
    .eq("id_carrinho", id_carrinho);

  if (error) throw error;

  return itens;
};

const finalizarCarrinho = async (id_carrinho) => {
  const { error: erroItens } = await supabase
    .from("itens_carrinho")
    .delete()
    .eq("id_carrinho", id_carrinho);

  if (erroItens) throw erroItens;

  const { error: erroStatus } = await supabase
    .from("carrinhos")
    .update({ status: "finalizado" })
    .eq("id_carrinho", id_carrinho);

  if (erroStatus) throw erroStatus;
};

// ─── Estoque ─────────────────────────────────────────────────────────────────

const verificarEDecrementarEstoque = async (itens) => {
  for (const item of itens) {
    const { data: produto, error: erroProduto } = await supabase
      .from("produtos")
      .select("estoque")
      .eq("id_produto", item.id_produto)
      .single();

    if (erroProduto) throw erroProduto;

    if (produto.estoque < item.quantidade) {
      const erro = new Error(
        `Estoque insuficiente para o produto ${item.id_produto}`,
      );
      erro.status = 400;
      throw erro;
    }

    const { error: erroAtualizacao } = await supabase
      .from("produtos")
      .update({ estoque: produto.estoque - item.quantidade })
      .eq("id_produto", item.id_produto);

    if (erroAtualizacao) throw erroAtualizacao;
  }
};

// ─── Pedido ───────────────────────────────────────────────────────────────────

const criarPedidoRegistro = async (id_usuario, id_endereco, valor_total) => {
  const { data: pedido, error } = await supabase
    .from("pedidos")
    .insert([{ id_usuario, id_endereco, valor_total, status: "pendente" }])
    .select("*")
    .single();

  if (error) throw error;

  return pedido;
};

const criarItensPedido = async (itensPedido) => {
  const { error } = await supabase.from("itens_pedido").insert(itensPedido);

  if (error) throw error;

  return true;
};

const buscarPedidosUsuario = async (id_usuario) => {
  const { data: pedidos, error } = await supabase
    .from("pedidos")
    .select("*")
    .eq("id_usuario", id_usuario)
    

  if (error) throw error;

  return pedidos;
};

const buscarPedidoPorId = async (id_pedido) => {
  const { data: pedido, error } = await supabase
    .from("pedidos")
    .select("*, itens_pedido(*), pagamentos(*)")
    .eq("id_pedido", id_pedido)
    .single();

  if (error) throw error;

  return pedido;
};

const atualizarStatusPedido = async (id_pedido, status) => {
  const statusPermitidos = [
    "pendente",
    "recebido",
    "em_separacao",
    "enviado",
    "entregue",
    "cancelado",
  ];

  if (!statusPermitidos.includes(status)) {
    const erro = new Error(
      `Status inválido. Permitidos: ${statusPermitidos.join(", ")}`,
    );
    erro.status = 400;
    throw erro;
  }

  const { data: pedido, error } = await supabase
    .from("pedidos")
    .update({ status })
    .eq("id_pedido", id_pedido)
    .select("*")
    .single();

  if (error) throw error;

  return pedido;
};

// ─── Pagamento ────────────────────────────────────────────────────────────────

const criarPagamento = async (id_pedido, forma_pagamento, valor) => {
  const { data: pagamento, error } = await supabase
    .from("pagamentos")
    .insert([
      { id_pedido, forma_pagamento, valor, status_pagamento: "pendente" },
    ])
    .select("*")
    .single();

  if (error) throw error;

  return pagamento;
};

// ─── Orquestração ─────────────────────────────────────────────────────────────

/**
 * Orquestra a criação completa de um pedido:
 * 1. Cria o registro do pedido
 * 2. Cria os itens do pedido
 * 3. Registra o pagamento
 * 4. Decrementa o estoque (com verificação)
 * 5. Finaliza o carrinho
 *
 * Nota: idealmente estas etapas devem ser encapsuladas em uma stored procedure
 * no Postgres (supabase.rpc) para garantir atomicidade total.
 */
const processarPedidoCompleto = async ({
  id_usuario,
  id_endereco,
  forma_pagamento,
  itensCarrinho,
  id_carrinho,
}) => {
  const valorTotal = itensCarrinho.reduce((total, item) => {
    return total + Number(item.preco_unitario) * item.quantidade;
  }, 0);

  await verificarEDecrementarEstoque(itensCarrinho);

  const pedido = await criarPedidoRegistro(id_usuario, id_endereco, valorTotal);

  const itensPedido = itensCarrinho.map((item) => ({
    id_pedido: pedido.id_pedido,
    id_produto: item.id_produto,
    quantidade: item.quantidade,
    preco_unitario: Number(item.preco_unitario),
    subtotal: Number(item.preco_unitario) * item.quantidade,
  }));

  await criarItensPedido(itensPedido);

  const pagamento = await criarPagamento(
    pedido.id_pedido,
    forma_pagamento,
    valorTotal,
  );

  await finalizarCarrinho(id_carrinho);

  return { pedido, pagamento };
};

module.exports = {
  buscarCarrinhoAtivoUsuario,
  buscarItensCarrinho,
  finalizarCarrinho,
  verificarEDecrementarEstoque,
  criarPedidoRegistro,
  criarItensPedido,
  criarPagamento,
  buscarPedidosUsuario,
  buscarPedidoPorId,
  atualizarStatusPedido,
  processarPedidoCompleto,
};
