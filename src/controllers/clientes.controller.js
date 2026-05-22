const supabase = require('../config/supabase')
const asyncHandler = require('../utils/asyncHandler')

/**
 * @desc    Listar todos os clientes atacadistas
 * @route   GET /clientes
 * @access  Public
 */
const listarClientes = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('clientes_atacadistas')
    .select('*')

  if (error) {
    const err = new Error(error.message)
    err.statusCode = 500
    throw err
  }

  res.json({
    success: true,
    data: data
  })
})

/**
 * @desc    Buscar cliente atacadista por ID
 * @route   GET /clientes/:id
 * @access  Public
 */
const buscarClientePorId = asyncHandler(async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('clientes_atacadistas')
    .select('*')
    .eq('id_cliente_atacado', id)
    .single()

  if (error || !data) {
    const err = new Error('Cliente não encontrado')
    err.statusCode = 404
    throw err
  }

  res.json({
    success: true,
    data: data
  })
})

module.exports = {
  listarClientes,
  buscarClientePorId
}
