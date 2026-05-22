/**
 * Wrapper para funções assíncronas que automaticamente captura erros
 * e passa para o middleware de tratamento de erros
 * @param {Function} fn - Função assíncrona do controller
 * @returns {Function} Middleware do Express
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

module.exports = asyncHandler
