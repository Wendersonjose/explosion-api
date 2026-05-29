const supabase = require('../config/supabase')


// Função para obter o carrinho do usuário autenticado

const obterCarrinho = async (req, res, next) => {
  try {
    const id_usuario = req.usuario.id

    const { data: carrinho, error } = await supabase
      .from('carrinhos')
      .select(`
        id_carrinho,
        status,
        criado_em,
        atualizado_em,
        itens_carrinho (
          id_item_carrinho,
          id_produto,
          quantidade,
          preco_unitario,
          produtos (
            nome_produto,
            descricao,
            imagem_url
          )
        )
      `)
      .eq('id_usuario', id_usuario)
      .eq('status', 'ativo')
      .single()

    if (error || !carrinho) {
      return res.status(200).json({
        success: true,
        message: 'Carrinho vazio',
        data: {
          itens: [],
          total: 0
        }
      })
    }

    const total = carrinho.itens_carrinho.reduce((acc, item) => {
      return acc + Number(item.preco_unitario) * item.quantidade
    }, 0)

    return res.status(200).json({
      success: true,
      message: 'Carrinho obtido com sucesso',
      data: {
        ...carrinho,
        total
      }
    })
  } catch (error) {
    next(error)
  }
}

// Função para adicionar um item ao carrinho

const adicionarItemCarrinho = async (req, res, next) => {
  try {
    const { id_produto, quantidade } = req.body
    const id_usuario = req.usuario.id

    if (!id_produto || !quantidade) {
      return res.status(400).json({
        success: false,
        message: 'id_produto e quantidade são obrigatórios'
      })
    }

    if (quantidade <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantidade deve ser maior que zero'
      })
    }

    let { data: carrinho } = await supabase
      .from('carrinhos')
      .select('*')
      .eq('id_usuario', id_usuario)
      .eq('status', 'ativo')
      .single()

    if (!carrinho) {
      const { data: novoCarrinho, error: erroCarrinho } = await supabase
        .from('carrinhos')
        .insert([
          {
            id_usuario
          }
        ])
        .select()
        .single()

      if (erroCarrinho) {
        throw erroCarrinho
      }

      carrinho = novoCarrinho
    }

    const { data: produto, error: erroProduto } = await supabase
      .from('produtos')
      .select(`
        id_produto,
        nome_produto,
        estoque,
        ativo,
        precos_varejo (
          preco_varejo_unitario
        )
      `)
      .eq('id_produto', id_produto)
      .single()

    if (erroProduto || !produto) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      })
    }

    if (!produto.ativo) {
      return res.status(400).json({
        success: false,
        message: 'Produto inativo'
      })
    }

    if (produto.estoque < quantidade) {
      return res.status(400).json({
        success: false,
        message: 'Estoque insuficiente'
      })
    }

  
    const precoUnitario =
      produto.precos_varejo.preco_varejo_unitario

    const { data: itemExistente } = await supabase
      .from('itens_carrinho')
      .select('*')
      .eq('id_carrinho', carrinho.id_carrinho)
      .eq('id_produto', id_produto)
      .single()

    if (itemExistente) {
      const novaQuantidade =
        itemExistente.quantidade + quantidade

      if (produto.estoque < novaQuantidade) {
        return res.status(400).json({
          success: false,
          message: 'Estoque insuficiente'
        })
      }

      const {
        data: itemAtualizado,
        error: erroAtualizar
      } = await supabase
        .from('itens_carrinho')
        .update({
          quantidade: novaQuantidade,
          preco_unitario: precoUnitario
        })
        .eq(
          'id_item_carrinho',
          itemExistente.id_item_carrinho
        )
        .select()
        .single()

      if (erroAtualizar) {
        throw erroAtualizar
      }

      return res.status(200).json({
        success: true,
        message: 'Quantidade do produto atualizada no carrinho',
        data: itemAtualizado
      })
    }

    const { data: itemCarrinho, error: erroItem } = await supabase
      .from('itens_carrinho')
      .insert([
        {
          id_carrinho: carrinho.id_carrinho,
          id_produto,
          quantidade,
          preco_unitario: precoUnitario
        }
      ])
      .select()
      .single()

    if (erroItem) {
      throw erroItem
    }

    return res.status(201).json({
      success: true,
      message: 'Produto adicionado ao carrinho',
      data: itemCarrinho
    })
  } catch (error) {
    next(error)
  }
}

// Função para remover um item do carrinho

const removerItemCarrinho = async (req, res, next) => {
  try {
    const { id_item_carrinho } = req.params
    const id_usuario = req.usuario.id

    const { data: carrinho } = await supabase
      .from('carrinhos')
      .select('id_carrinho')
      .eq('id_usuario', id_usuario)
      .eq('status', 'ativo')
      .single()

    if (!carrinho) {
      return res.status(404).json({
        success: false,
        message: 'Carrinho não encontrado'
      })
    }

    const { data: item, error: erroItem } = await supabase
      .from('itens_carrinho')
      .select('*')
      .eq('id_item_carrinho', id_item_carrinho)
      .eq('id_carrinho', carrinho.id_carrinho)
      .single()

    if (erroItem || !item) {
      return res.status(404).json({
        success: false,
        message: 'Item não encontrado no carrinho'
      })
    }

    const { error } = await supabase
      .from('itens_carrinho')
      .delete()
      .eq('id_item_carrinho', id_item_carrinho)

    if (error) {
      throw error
    }

    return res.status(200).json({
      success: true,
      message: 'Item removido do carrinho'
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  obterCarrinho,
  adicionarItemCarrinho,
  removerItemCarrinho
}