const supabase = require("../config/supabase");

// Busca o carrinho ativo do usuário
const buscarCarrinhoAtivo = async (id_usuario) => {
  const { data: carrinho, error } = await supabase
    .from("carrinhos")
    .select("*")
    .eq("id_usuario", id_usuario)
    .eq("status", "ativo")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return carrinho;
};

// Cria um novo carrinho ativo
const criarCarrinho = async (id_usuario) => {
  const { data: carrinho, error } = await supabase
    .from("carrinhos")
    .insert([{ id_usuario }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return carrinho;
};

// Busca produto e preço de varejo
const buscarProdutoPorId = async (id_produto) => {
  const { data: produto, error } = await supabase
    .from("produtos")
    .select(
      `
      id_produto,
      nome_produto,
      estoque,
      ativo,
      precos_varejo (
        preco_varejo_unitario
      )
    `,
    )
    .eq("id_produto", id_produto)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return produto;
};

// Busca um item específico no carrinho
const buscarItensCarrinhoPorProduto = async (id_carrinho, id_produto) => {
  const { data: item, error } = await supabase
    .from("itens_carrinho")
    .select("*")
    .eq("id_carrinho", id_carrinho)
    .eq("id_produto", id_produto)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return item;
};

// Atualiza quantidade e preço unitário de um item
const atualizarQuantidadeItem = async (
  id_item_carrinho,
  quantidade,
  preco_unitario,
) => {
  const { data: itemAtualizado, error } = await supabase
    .from("itens_carrinho")
    .update({
      quantidade,
      preco_unitario,
    })
    .eq("id_item_carrinho", id_item_carrinho)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return itemAtualizado;
};

// Cria um novo item no carrinho
const criarItemCarrinho = async (
  id_carrinho,
  id_produto,
  quantidade,
  preco_unitario,
) => {
  const { data: item, error } = await supabase
    .from("itens_carrinho")
    .insert([
      {
        id_carrinho,
        id_produto,
        quantidade,
        preco_unitario,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return item;
};

// Busca um item do carrinho por ID e valida se pertence ao carrinho ativo
const buscarItemCarrinhoPorId = async (id_item_carrinho, id_carrinho) => {
  const { data, error } = await supabase
    .from('itens_carrinho')
    .select('*')
    .eq('id_item_carrinho', id_item_carrinho)
    .eq('id_carrinho', id_carrinho)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
};

//remover item do carrinho

const removerItemCarrinhoPorId = async (id_item_carrinho) => {
  const { data, error } = await supabase
    .from('itens_carrinho')
    .delete()
    .eq('id_item_carrinho', id_item_carrinho)
    .select() // adicionar isso

  if (error) throw error
  if (!data || data.length === 0) throw new Error('Item não encontrado')

  return true
};


module.exports = {
  buscarCarrinhoAtivo,
  criarCarrinho,
  buscarProdutoPorId,
  buscarItensCarrinhoPorProduto,
  atualizarQuantidadeItem,
  criarItemCarrinho,
  buscarItemCarrinhoPorId,
  removerItemCarrinhoPorId,
};
