const supabase = require("../config/supabase");

const {
  buscarCarrinhoAtivoUsuario,
  buscarItensCarrinho,
  criarPedidoRegistro,
  criarItensPedido,
  criarPagamento,
} = require("../services/pedidos.service");

// Criar pedido
const criarPedido = async (req, res, next) => {
  try {
    const idUsuario = req.usuario.id;
    const { id_endereco, forma_pagamento } = req.body;

    if (!id_endereco || !forma_pagamento) {
      return res.status(400).json({
        success: false,
        message: "id_endereco e forma_pagamento são obrigatórios",
      });
    }

    // Verificar se o usuário tem um carrinho ativo

    const carrinho = await buscarCarrinhoAtivoUsuario(idUsuario);

    if (!carrinho) {
      return res.status(404).json({
        success: false,
        message: "Carrinho ativo não encontrado",
      });
    }

    // Buscar itens do carrinho
    const itensCarrinho = await buscarItensCarrinho(carrinho.id_carrinho);

    if (!itensCarrinho || itensCarrinho.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Carrinho vazio",
      });
    }

    // Calcular valor total do pedido
    const valorTotal = itensCarrinho.reduce((total, item) => {
      return total + Number(item.preco_unitario) * item.quantidade;
    }, 0);

    // Criar registro do pedido

    const pedido = await criarPedidoRegistro(
      idUsuario,
      id_endereco,
      valorTotal,
    );

    // Criar itens do pedido
    const itensPedido = itensCarrinho.map((item) => ({
      id_pedido: pedido.id_pedido,
      id_produto: item.id_produto,
      quantidade: item.quantidade,
      preco_unitario: item.preco_unitario,
      subtotal: Number(item.preco_unitario) * item.quantidade,
    }));

    await criarItensPedido(itensPedido);

    const pagamento = await criarPagamento(
      pedido.id_pedido,
      forma_pagamento,
      valorTotal,
    );

    for (const item of itensCarrinho) {
      const { data: produto, error: erroProduto } = await supabase
        .from("produtos")
        .select("estoque")
        .eq("id_produto", item.id_produto)
        .single();

      if (erroProduto) throw erroProduto;

      const novoEstoque = produto.estoque - item.quantidade;

      const { error: erroAtualizacao } = await supabase
        .from("produtos")
        .update({ estoque: novoEstoque })
        .eq("id_produto", item.id_produto);

      if (erroAtualizacao) throw erroAtualizacao;
    }

    const { error: erroRemoverItens } = await supabase
      .from("itens_carrinho")
      .delete()
      .eq("id_carrinho", carrinho.id_carrinho);

    if (erroRemoverItens) throw erroRemoverItens;

    const { error: erroCarrinhoAtualizado } = await supabase
      .from("carrinhos")
      .update({ status: "finalizado" })
      .eq("id_carrinho", carrinho.id_carrinho);

    if (erroCarrinhoAtualizado) throw erroCarrinhoAtualizado;

    return res.status(201).json({
      success: true,
      message: "Pedido criado com sucesso",
      data: {
        pedido,
        pagamento,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Listar meus pedidos
const listarMeusPedidos = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

// Buscar pedido por ID
const buscarPedidoPorId = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

// Atualizar status do pedido
const atualizarStatusPedido = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

module.exports = {
  criarPedido,
  listarMeusPedidos,
  buscarPedidoPorId,
  atualizarStatusPedido,
};
