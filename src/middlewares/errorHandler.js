/**
 * Middleware global de tratamento de erros
 * Padroniza a resposta de erro da API
 */
const errorHandler = (err, req, res, next) => {
  // Define status code padrão como 500 se não especificado
  const statusCode = err.statusCode || 500

  // Log do erro no console para debug
  console.error('Erro:', err.message)
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack)
  }

  // Resposta padronizada de erro
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

module.exports = errorHandler
