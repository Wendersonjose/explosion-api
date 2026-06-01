const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Explosion API',
      version: '1.0.0',
      description: 'API para gerenciamento de clientes, produtos, carrinho e pedidos',
      contact: {
        name: 'Explosion API Support'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT no formato: Bearer {token}'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de erro'
            },
            error: {
              type: 'string',
              description: 'Detalhes do erro'
            }
          }
        },
        Cliente: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do cliente'
            },
            nome: {
              type: 'string',
              description: 'Nome do cliente'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do cliente'
            },
            telefone: {
              type: 'string',
              description: 'Telefone do cliente'
            },
            endereco: {
              type: 'string',
              description: 'Endereço do cliente'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            }
          }
        },
        Produto: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do produto'
            },
            nome: {
              type: 'string',
              description: 'Nome do produto'
            },
            descricao: {
              type: 'string',
              description: 'Descrição do produto'
            },
            preco: {
              type: 'number',
              format: 'float',
              description: 'Preço do produto'
            },
            estoque: {
              type: 'integer',
              description: 'Quantidade em estoque'
            },
            categoria: {
              type: 'string',
              description: 'Categoria do produto'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            }
          }
        },
        Usuario: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do usuário'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário'
            },
            nome: {
              type: 'string',
              description: 'Nome do usuário'
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              description: 'Papel do usuário'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário'
            },
            senha: {
              type: 'string',
              format: 'password',
              description: 'Senha do usuário'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'Token JWT de autenticação'
            },
            user: {
              $ref: '#/components/schemas/Usuario'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'senha', 'nome'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário'
            },
            senha: {
              type: 'string',
              format: 'password',
              description: 'Senha do usuário'
            },
            nome: {
              type: 'string',
              description: 'Nome do usuário'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = {
  swaggerUi,
  swaggerSpec
}
