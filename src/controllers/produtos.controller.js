const supabase = require("../config/supabase");

const listarProdutos = async (req, res, next) => {
  try {
    const { search, marca } = req.query;

    let query = supabase
      .from("produtos")
      .select(`
        id_produto,
        nome_produto,
        descricao,
        imagem_url,
        estoque,
        ativo,
        energeticos (
          nome_energetico,
          marcas (
            nome_marca
          )
        ),
        volumes (
          ml
        ),
        precos_varejo (
          preco_varejo_unitario
        )
      `)
      .eq("ativo", true)
      .order("id_produto", { ascending: true });

    if (search) {
      query = query.ilike("nome_produto", `%${search}%`);
    }

    if (marca) {
      query = query.ilike("energeticos.marcas.nome_marca", `%${marca}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      total: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const buscarProdutoPorId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("produtos")
      .select(`
        id_produto,
        nome_produto,
        descricao,
        imagem_url,
        estoque,
        ativo,
        energeticos (
          nome_energetico,
          marcas (
            nome_marca
          )
        ),
        volumes (
          ml
        ),
        precos_varejo (
          preco_varejo_unitario
        )
      `)
      .eq("id_produto", id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarProdutos,
  buscarProdutoPorId,
};