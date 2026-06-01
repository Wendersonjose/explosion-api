const express  = require('express')

const router = express.Router()

const {
    listarProdutos,
    buscarProdutoPorId
} = require('../controllers/produtos.controller')

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Endpoints de gerenciamento de produtos
 */

/**
 * @swagger
 * /api/v1/produtos:
 *   get:
 *     summary: Listar todos os produtos
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar produtos por nome (busca parcial)
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', listarProdutos)

/**
 * @swagger
 * /api/v1/produtos/{id}:
 *   get:
 *     summary: Buscar produto por ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', buscarProdutoPorId)

module.exports = router
