<div align="center">

# 🚀 Explosion API

[![Node.js](https://img.shields.io/badge/Node.js-v22.20-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3.0-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)
[![Tests](https://img.shields.io/badge/Tests-48%2F71_Passing-yellow?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![Coverage](https://img.shields.io/badge/Coverage-59.73%25-orange?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow?style=for-the-badge)](https://github.com)

**API REST profissional para e-commerce Explosion**  
Sistema completo de gerenciamento de produtos energéticos com autenticação JWT e controle de acesso

[Características](#-características) • [Tecnologias](#-stack-tecnológico) • [Instalação](#-instalação-e-configuração) • [Testes](#-testes-automatizados) • [Documentação](#-documentação-da-api) • [Roadmap](#-roadmap)

</div>

---

## 📋 Sobre o Projeto

A **Explosion API** é o backend robusto do e-commerce Explosion, especializado em produtos energéticos. Desenvolvida com arquitetura **RESTful** e padrão **MVC**, oferece endpoints seguros para gestão de produtos, clientes atacadistas e autenticação de usuários.

### ⚡ Características

- 🔐 **Autenticação JWT** completa com hash bcrypt
- 🛡️ **Controle de acesso** por perfil de usuário
- � **Documentação Swagger** interativa com OpenAPI 3.0
- �🗃️ **PostgreSQL via Supabase** com queries otimizadas
- 🔄 **Relacionamentos complexos** entre tabelas
- ⚠️ **Tratamento centralizado de erros**
- 📝 **Logs estruturados** de operações
- 🌐 **CORS** configurado para integração frontend
- 📦 **Estrutura MVC** escalável e organizada

### ✨ Funcionalidades Implementadas

#### 🔐 Autenticação & Autorização
- ✅ Registro de usuários com validação
- ✅ Login com geração de JWT
- ✅ Hash de senhas com bcrypt (10 rounds)
- ✅ Middleware de autenticação por token
- ✅ Perfil do usuário autenticado
- ✅ Proteção de rotas sensíveis

#### 🛍️ Produtos
- ✅ Listagem completa de produtos ativos
- ✅ Busca de produto por ID
- ✅ Filtro por nome (case-insensitive)
- ✅ Filtro por marca
- ✅ Relacionamentos: energéticos, marcas, volumes, preços

#### 👥 Clientes Atacadistas
- ✅ Listagem de clientes (rota protegida)
- ✅ Busca de cliente por ID
- ✅ Dados completos de contato e negócio

#### � Carrinho de Compras
- ✅ Obter carrinho do usuário autenticado
- ✅ Adicionar produtos ao carrinho
- ✅ Atualizar quantidade de itens
- ✅ Remover itens do carrinho
- ✅ Cálculo automático do total
- ✅ Validação de estoque

#### 📦 Pedidos
- ✅ Criar pedido a partir do carrinho
- ✅ Integração com sistema de pagamento
- ✅ Atualização automática de estoque
- ✅ Geração de itens do pedido
- ✅ Registro de transações de pagamento
- ✅ Gerenciamento de status do pedido
- ✅ Validação de carrinho e produtos

#### �🔒 Segurança
- ✅ Variáveis de ambiente (.env)
- ✅ Tokens JWT com expiração configurável
- ✅ Validação de entrada de dados
- ✅ Proteção contra SQL injection (via Supabase)
- ✅ CORS configurado

## 🏗️ Arquitetura Técnica

### Estrutura do Projeto (MVC)

```
explosion-api/
├── src/
│   ├── config/
│   │   └── supabase.js              # Cliente Supabase configurado
│   │
│   ├── controllers/
│   │   ├── auth.controller.js       # Lógica: registro, login, perfil
│   │   ├── carrinho.controller.js   # Lógica: gestão de carrinho
│   │   ├── clientes.controller.js   # Lógica: CRUD clientes
│   │   ├── pedidos.controller.js    # Lógica: criação e gestão de pedidos
│   │   └── produtos.controller.js   # Lógica: CRUD produtos
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js       # Verificação JWT
│   │   ├── role.middleware.js       # Controle de acesso por perfil
│   │   └── errorHandler.js          # Tratamento centralizado de erros
│   │
│   ├── routes/
│   │   ├── auth.routes.js           # Endpoints de autenticação
│   │   ├── carrinho.routes.js       # Endpoints de carrinho
│   │   ├── clientes.routes.js       # Endpoints de clientes
│   │   ├── pedidos.routes.js        # Endpoints de pedidos
│   │   └── produtos.routes.js       # Endpoints de produtos
│   │
│   ├── utils/
│   │   └── asyncHandler.js          # Wrapper para async/await
│   │
│   ├── app.js                       # Configuração do Express
│   └── server.js                    # Inicialização do servidor
│
├── .env                             # Variáveis de ambiente (NÃO comitar)
├── .gitignore
├── package.json
└── README.md
```

### Fluxo de Autenticação

```
┌─────────────┐          ┌──────────────┐          ┌─────────────┐
│   Cliente   │          │  Explosion   │          │  Supabase   │
│  (Frontend) │          │     API      │          │   (DB)      │
└──────┬──────┘          └──────┬───────┘          └──────┬──────┘
       │                        │                         │
       │ 1. POST /auth/register │                         │
       ├───────────────────────>│                         │
       │   { nome, email, senha }│                        │
       │                        │ 2. Hash senha (bcrypt)  │
       │                        │                         │
       │                        │ 3. INSERT usuario       │
       │                        ├────────────────────────>│
       │                        │                         │
       │                        │ 4. Usuario criado       │
       │                        │<────────────────────────┤
       │ 5. { success, data }   │                         │
       │<───────────────────────┤                         │
       │                        │                         │
       │ 6. POST /auth/login    │                         │
       ├───────────────────────>│                         │
       │   { email, senha }     │                         │
       │                        │ 7. SELECT usuario       │
       │                        ├────────────────────────>│
       │                        │                         │
       │                        │ 8. Usuario encontrado   │
       │                        │<────────────────────────┤
       │                        │                         │
       │                        │ 9. Validar senha        │
       │                        │    bcrypt.compare()     │
       │                        │                         │
       │                        │ 10. Gerar JWT           │
       │                        │     jwt.sign()          │
       │                        │                         │
       │ 11. { token, usuario } │                         │
       │<───────────────────────┤                         │
       │                        │                         │
       │ 12. GET /clientes      │                         │
       │     Authorization: JWT │                         │
       ├───────────────────────>│                         │
       │                        │ 13. Verificar JWT       │
       │                        │     jwt.verify()        │
       │                        │                         │
       │                        │ 14. SELECT clientes     │
       │                        ├────────────────────────>│
       │                        │                         │
       │                        │ 15. Lista de clientes   │
       │                        │<────────────────────────┤
       │                        │                         │
       │ 16. { success, data }  │                         │
       │<───────────────────────┤                         │
       │                        │                         │
```

## 🛠️ Stack Tecnológico

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **[Node.js](https://nodejs.org/)** | 22.20 | Runtime JavaScript |
| **[Express.js](https://expressjs.com/)** | 5.2.1 | Framework web minimalista |
| **[Supabase](https://supabase.com/)** | 2.106.1 | BaaS com PostgreSQL |
| **[JWT](https://jwt.io/)** | 9.0.3 | Autenticação stateless |
| **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** | 3.0.3 | Hash de senhas |
| **[Swagger UI](https://swagger.io/)** | 5.18.2 | Documentação interativa OpenAPI 3.0 |
| **[Jest](https://jestjs.io/)** | 29.7.0 | Framework de testes |
| **[Supertest](https://www.npmjs.com/package/supertest)** | 7.0.0 | Testes HTTP/REST |
| **[CORS](https://www.npmjs.com/package/cors)** | 2.8.6 | Cross-Origin Resource Sharing |
| **[dotenv](https://www.npmjs.com/package/dotenv)** | 17.4.2 | Gerenciamento de variáveis |
| **[Nodemon](https://nodemon.io/)** | 3.1.14 | Hot reload (dev) |

## � Pré-requisitos

Certifique-se de ter instalado:

- **[Node.js](https://nodejs.org/)** v16.x ou superior
- **npm** ou **yarn**
- Conta no **[Supabase](https://supabase.com/)** (plano gratuito disponível)
- **Git** (para clonar o repositório)

## 🚀 Instalação e Configuração

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/Wendersonjose/explosion-api.git
cd explosion-api
```

### 2️⃣ Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3️⃣ Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Supabase:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua_chave_anon_publica_aqui

# JWT
JWT_SECRET=sua_chave_secreta_forte_e_aleatoria_aqui
JWT_EXPIRES_IN=7d
```

> ⚠️ **IMPORTANTE:** Nunca comite o arquivo `.env` no repositório. Ele já está incluído no `.gitignore`.

#### Como obter as credenciais do Supabase

1. Acesse [supabase.com](https://supabase.com/) e faça login
2. Crie um novo projeto ou selecione um existente
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** → `SUPABASE_URL`
   - **anon/public key** → `SUPABASE_KEY`

### 4️⃣ Inicie o servidor

**Desenvolvimento (com hot reload):**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

✅ Servidor iniciado em `http://localhost:3000`

```
🚀 Servidor rodando na porta 3000
📍 Ambiente: development
```

## 🔐 Variáveis de Ambiente

Arquivo `.env` necessário na raiz do projeto:

| Variável | Tipo | Descrição | Exemplo |
|----------|------|-----------|---------|
| `PORT` | number | Porta do servidor | `3000` |
| `NODE_ENV` | string | Ambiente de execução | `development` / `production` |
| `SUPABASE_URL` | string | URL do projeto Supabase | `https://xxxxx.supabase.co` |
| `SUPABASE_KEY` | string | Chave anon/public do Supabase | `eyJhbGc...` |
| `JWT_SECRET` | string | Chave secreta para JWT (min. 32 caracteres) | `8f3b7c2a9e1d...` |
| `JWT_EXPIRES_IN` | string | Tempo de expiração do token | `7d`, `24h`, `1d` |

### Gerando JWT_SECRET Seguro

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -hex 64
```

## 📖 Documentação da API

### 📚 Swagger UI

A API possui documentação interativa completa com **Swagger UI**. Após iniciar o servidor, acesse:

```
http://localhost:3000/api-docs
```

**Recursos do Swagger:**
- 🎯 Interface interativa para testar todos os endpoints
- 📋 Documentação completa de schemas e modelos
- 🔐 Suporte para autenticação JWT (clique em "Authorize")
- 📥 Especificação OpenAPI 3.0 em JSON: http://localhost:3000/api-docs.json

**Como usar:**
1. Acesse http://localhost:3000/api-docs
2. Para endpoints protegidos, clique no botão **"Authorize"** 🔒
3. Insira o token JWT no formato: `Bearer seu_token_aqui`
4. Clique em **"Authorize"** e depois **"Close"**
5. Agora você pode testar os endpoints protegidos diretamente na interface

### Base URL

```
http://localhost:3000/api/v1
```

### Autenticação

A API utiliza **JWT (JSON Web Token)** para autenticação. Após o login, inclua o token no header de requisições protegidas:

```http
Authorization: Bearer seu_token_jwt_aqui
```

---

## 🧪 Testes Automatizados

O projeto possui uma suíte completa de testes automatizados com **Jest** e **Supertest**.

### 📊 Status Atual

```
✓ 48/71 testes passando (67.6%)
✓ Middlewares: 100% cobertura
✓ Utils: 100% cobertura  
✓ Routes: 100% cobertura
✓ CI/CD configurado com GitHub Actions
```

### 🚀 Executar Testes

```bash
# Todos os testes
npm test

# Com relatório de cobertura
npm run test:coverage

# Modo watch (desenvolvimento)
npm run test:watch

# Saída detalhada
npm run test:verbose

# Apenas testes unitários
npm test -- __tests__/unit

# Apenas testes de integração
npm test -- __tests__/integration
```

### 📝 Documentação Completa

Para documentação detalhada dos testes, consulte:
- [`__tests__/README.md`](__tests__/README.md) - Guia completo de testes
- [`TEST_SUMMARY.md`](TEST_SUMMARY.md) - Resumo do status atual e roadmap

---

## 🔌 Endpoints

### 🏠 Health Check

#### Verificar status da API

```http
GET /
```

**Resposta (200 OK):**
```json
{
  "message": "API Explosion rodando"
}
```

---

### 🔐 Autenticação

#### 1. Registrar novo usuário

```http
POST /api/v1/auth/register
```

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**Resposta (201 Created):**
```json
{
  "success": true,
  "message": "Usuário cadastrado com sucesso",
  "data": [
    {
      "id_usuario": 1,
      "nome": "João Silva",
      "email": "joao@example.com",
      "criado_em": "2026-05-23T10:30:00.000Z"
    }
  ]
}
```

**Erros:**
- `400` - Campos obrigatórios não fornecidos
- `409` - Email já cadastrado

---

#### 2. Login

```http
POST /api/v1/auth/login
```

**Body:**
```json
{
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@example.com",
    "tipo_usuario": "cliente"
  }
}
```

**Erros:**
- `400` - Email e senha são obrigatórios
- `401` - Email ou senha inválidos

---

#### 3. Obter perfil do usuário autenticado

```http
GET /api/v1/auth/me
```

**Headers:**
```http
Authorization: Bearer seu_token_jwt_aqui
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "data": {
    "id_usuario": 1,
    "nome": "João Silva",
    "email": "joao@example.com",
    "tipo_usuario": "cliente",
    "criado_em": "2026-05-23T10:30:00.000Z"
  }
}
```

**Erros:**
- `401` - Token não fornecido ou inválido
- `404` - Usuário não encontrado

---

### 🛍️ Produtos

#### 1. Listar todos os produtos

```http
GET /api/v1/produtos
```

**Query Parameters (opcionais):**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `search` | string | Busca por nome do produto (case-insensitive) |
| `marca` | string | Filtra por marca |

**Exemplos:**
```bash
# Listar todos
curl http://localhost:3000/api/v1/produtos

# Buscar por nome
curl "http://localhost:3000/api/v1/produtos?search=monster"

# Filtrar por marca
curl "http://localhost:3000/api/v1/produtos?marca=monster"
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "total": 2,
  "data": [
    {
      "id_produto": 1,
      "nome_produto": "Monster Energy Original - 473ml",
      "descricao": "Energético com blend exclusivo de ingredientes...",
      "imagem_url": "https://example.com/image.jpg",
      "estoque": 150,
      "ativo": true,
      "energeticos": {
        "nome_energetico": "Monster Energy Original",
        "marcas": {
          "nome_marca": "Monster"
        }
      },
      "volumes": {
        "ml": 473
      },
      "precos_varejo": {
        "preco_varejo_unitario": 8.99
      }
    }
  ]
}
```

---

#### 2. Buscar produto por ID

```http
GET /api/v1/produtos/:id
```

**Exemplo:**
```bash
curl http://localhost:3000/api/v1/produtos/1
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "data": {
    "id_produto": 1,
    "nome_produto": "Monster Energy Original - 473ml",
    "descricao": "Energético com blend exclusivo de ingredientes...",
    "imagem_url": "https://example.com/image.jpg",
    "estoque": 150,
    "ativo": true,
    "energeticos": {
      "nome_energetico": "Monster Energy Original",
      "marcas": {
        "nome_marca": "Monster"
      }
    },
    "volumes": {
      "ml": 473
    },
    "precos_varejo": {
      "preco_varejo_unitario": 8.99
    }
  }
}
```

**Erros:**
- `404` - Produto não encontrado

---

### 👥 Clientes Atacadistas

#### 1. Listar todos os clientes (🔒 Protegida)

```http
GET /api/v1/clientes
```

**Headers:**
```http
Authorization: Bearer seu_token_jwt_aqui
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id_cliente_atacado": 1,
      "razao_social": "Distribuidora ABC LTDA",
      "cnpj": "12.345.678/0001-90",
      "email": "contato@distribuidoraabc.com",
      "telefone": "(11) 98765-4321",
      "endereco": "Rua das Empresas, 123",
      "cidade": "São Paulo",
      "estado": "SP",
      "cep": "01234-567",
      "contato_responsavel": "Carlos Silva"
    }
  ]
}
```

**Erros:**
- `401` - Token não fornecido ou inválido
- `500` - Erro ao buscar clientes

---

#### 2. Buscar cliente por ID

```http
GET /api/v1/clientes/:id
```

**Exemplo:**
```bash
curl http://localhost:3000/api/v1/clientes/1
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "data": {
    "id_cliente_atacado": 1,
    "razao_social": "Distribuidora ABC LTDA",
    "cnpj": "12.345.678/0001-90",
    "email": "contato@distribuidoraabc.com",
    "telefone": "(11) 98765-4321",
    "endereco": "Rua das Empresas, 123",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567",
    "contato_responsavel": "Carlos Silva"
  }
}
```

**Erros:**
- `404` - Cliente não encontrado

---

### 🛒 Carrinho de Compras

Endpoints para gerenciamento do carrinho de compras do usuário autenticado.

#### 1. Obter Carrinho (🔒 Protegida)

```http
GET /api/v1/carrinho
```

**Headers:**
```http
Authorization: Bearer seu_token_jwt_aqui
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Carrinho obtido com sucesso",
  "data": {
    "id_carrinho": 1,
    "status": "ativo",
    "criado_em": "2026-05-29T10:30:00.000Z",
    "atualizado_em": "2026-05-29T14:20:00.000Z",
    "itens_carrinho": [
      {
        "id_item_carrinho": 1,
        "id_produto": 5,
        "quantidade": 2,
        "preco_unitario": 8.99,
        "produtos": {
          "nome_produto": "Monster Energy Original - 473ml",
          "descricao": "Energético com blend exclusivo de ingredientes",
          "imagem_url": "https://example.com/monster.jpg"
        }
      },
      {
        "id_item_carrinho": 2,
        "id_produto": 3,
        "quantidade": 1,
        "preco_unitario": 7.99,
        "produtos": {
          "nome_produto": "Red Bull Energy Drink 250ml",
          "descricao": "Energético Red Bull tradicional",
          "imagem_url": "https://example.com/redbull.jpg"
        }
      }
    ],
    "total": 25.97
  }
}
```

**Resposta Carrinho Vazio (200 OK):**
```json
{
  "success": true,
  "message": "Carrinho vazio",
  "data": {
    "itens": [],
    "total": 0
  }
}
```

**Erros:**
- `401` - Token não fornecido ou inválido

---

#### 2. Adicionar Item ao Carrinho (🔒 Protegida)

```http
POST /api/v1/carrinho/adicionar
```

**Headers:**
```http
Authorization: Bearer seu_token_jwt_aqui
Content-Type: application/json
```

**Body:**
```json
{
  "id_produto": 5,
  "quantidade": 2
}
```

**Resposta Item Adicionado (201 Created):**
```json
{
  "success": true,
  "message": "Produto adicionado ao carrinho",
  "data": {
    "id_item_carrinho": 1,
    "id_carrinho": 1,
    "id_produto": 5,
    "quantidade": 2,
    "preco_unitario": 8.99
  }
}
```

**Resposta Quantidade Atualizada (200 OK):**
```json
{
  "success": true,
  "message": "Quantidade do produto atualizada no carrinho",
  "data": {
    "id_item_carrinho": 1,
    "id_carrinho": 1,
    "id_produto": 5,
    "quantidade": 4,
    "preco_unitario": 8.99
  }
}
```

**Validações:**
- `id_produto` e `quantidade` são obrigatórios
- `quantidade` deve ser maior que zero
- Produto deve existir e estar ativo
- Estoque deve ser suficiente para a quantidade solicitada
- Se o item já existe no carrinho, a quantidade é incrementada

**Erros:**
- `400` - Campos obrigatórios ausentes, quantidade inválida ou estoque insuficiente
- `401` - Token não fornecido ou inválido
- `404` - Produto não encontrado

---

#### 3. Remover Item do Carrinho (🔒 Protegida)

```http
DELETE /api/v1/carrinho/item/:id_item_carrinho
```

**Headers:**
```http
Authorization: Bearer seu_token_jwt_aqui
```

**Parâmetros da URL:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------||
| `id_item_carrinho` | integer | ID do item no carrinho |

**Exemplo:**
```bash
curl -X DELETE http://localhost:3000/api/v1/carrinho/item/1 \
  -H "Authorization: Bearer seu_token_jwt_aqui"
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Item removido do carrinho"
}
```

**Erros:**
- `401` - Token não fornecido ou inválido
- `404` - Carrinho ou item não encontrado

---

### 📦 Pedidos

#### 1. Criar Pedido a partir do Carrinho (🔒 Protegida)

```http
POST /api/v1/pedidos
```

**Headers:**
```http
Authorization: Bearer seu_token_jwt_aqui
Content-Type: application/json
```

**Body:**
```json
{
  "id_endereco": 1,
  "forma_pagamento": "pix"
}
```

**Descrição:**
Cria um novo pedido a partir dos itens do carrinho ativo do usuário. Realiza as seguintes operações em uma transação:

1. Valida o carrinho ativo e seus itens
2. Calcula o valor total do pedido
3. Cria o registro do pedido com status "pendente"
4. Cria os itens do pedido
5. Registra a transação de pagamento
6. Atualiza o estoque dos produtos
7. Remove os itens do carrinho
8. Finaliza o carrinho (status: "finalizado")

**Parâmetros do Body:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|------------|
| `id_endereco` | integer | Sim | ID do endereço de entrega do usuário |
| `forma_pagamento` | string | Sim | Forma de pagamento: `pix`, `boleto`, `cartao_credito`, `cartao_debito` |

**Resposta (201 Created):**
```json
{
  "success": true,
  "message": "Pedido criado com sucesso",
  "data": {
    "pedido": {
      "id_pedido": 1,
      "id_usuario": 5,
      "id_endereco": 1,
      "valor_total": 45.97,
      "status_pedido": "pendente",
      "criado_em": "2026-05-29T15:30:00.000Z"
    },
    "itens": [
      {
        "id_item_pedido": 1,
        "id_produto": 5,
        "quantidade": 2,
        "preco_unitario": 8.99,
        "subtotal": 17.98
      },
      {
        "id_item_pedido": 2,
        "id_produto": 3,
        "quantidade": 3,
        "preco_unitario": 9.33,
        "subtotal": 27.99
      }
    ],
    "pagamento": {
      "id_pagamento": 1,
      "forma_pagamento": "pix",
      "valor": 45.97,
      "status_pagamento": "pendente",
      "criado_em": "2026-05-29T15:30:00.000Z"
    }
  }
}
```

**Validações Realizadas:**
- Usuário deve estar autenticado
- Carrinho deve existir e estar ativo
- Carrinho deve conter pelo menos 1 item
- Endereço deve pertencer ao usuário
- Estoque dos produtos deve ser suficiente
- Forma de pagamento deve ser válida

**Status do Pedido:**
- `pendente` - Pedido criado, aguardando confirmação de pagamento
- `recebido` - Pagamento confirmado
- `em_separacao` - Pedido sendo preparado
- `enviado` - Pedido em transporte
- `entregue` - Pedido entregue ao cliente
- `cancelado` - Pedido cancelado

**Formas de Pagamento Aceitas:**
- `pix` - Pagamento via PIX
- `boleto` - Boleto bancário
- `cartao_credito` - Cartão de crédito
- `cartao_debito` - Cartão de débito

**Tabelas Afetadas:**
- `pedidos` - Novo registro criado
- `itens_pedido` - Registros dos produtos do pedido
- `pagamentos` - Registro da transação
- `produtos` - Estoque atualizado (decrementado)
- `itens_carrinho` - Itens removidos
- `carrinhos` - Status atualizado para "finalizado"

**Erros:**
- `400` - Dados inválidos ou carrinho vazio
- `401` - Token não fornecido ou inválido
- `404` - Carrinho não encontrado ou endereço não encontrado
- `409` - Estoque insuficiente para um ou mais produtos
- `500` - Erro ao processar pedido (transação revertida)

**Exemplo de Erro - Estoque Insuficiente:**
```json
{
  "success": false,
  "message": "Estoque insuficiente para o produto: Monster Energy Original - 473ml. Disponível: 5, Solicitado: 10"
}
```

**Exemplo de Erro - Carrinho Vazio:**
```json
{
  "success": false,
  "message": "Carrinho vazio. Adicione produtos antes de criar um pedido"
}
```

---

### ⚠️ Tratamento de Erros

Todas as respostas de erro seguem o padrão:

```json
{
  "success": false,
  "message": "Descrição do erro"
}
```

**Códigos HTTP:**
- `400` - Bad Request (dados inválidos)
- `401` - Unauthorized (não autenticado)
- `403` - Forbidden (sem permissão)
- `404` - Not Found (recurso não encontrado)
- `409` - Conflict (conflito de dados)
- `500` - Internal Server Error (erro no servidor)
      "id_produto": 1,
      "nome_produto": "Red Bull Energy Drink 250ml",
      "descricao": "Energético Red Bull tradicional",
      "imagem_url": "https://...",
      "estoque": 100,
      "ativo": true,
      "energeticos": {
        "nome_energetico": "Red Bull Original",
        "marcas": {
          "nome_marca": "Red Bull GmbH"
        }
      },
      "volumes": {
        "ml": 250
      },
      "precos_varejo": {
        "preco_varejo_unitario": 7.99
      }
    }
  ]
}
```

#### Buscar produto por ID

```http
GET /api/v1/produtos/:id
```

Retorna os detalhes de um produto específico.

**Parâmetros da URL:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | integer | ID do produto |

**Exemplo de requisição:**
```bash
curl http://localhost:3000/api/v1/produtos/1
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id_produto": 1,
    "nome_produto": "Red Bull Energy Drink 250ml",
    "descricao": "Energético Red Bull tradicional",
    "imagem_url": "https://...",
    "estoque": 100,
    "ativo": true,
    "energeticos": {
      "nome_energetico": "Red Bull Original",
      "marcas": {
        "nome_marca": "Red Bull GmbH"
      }
    },
    "volumes": {
      "ml": 250
    },
    "precos_varejo": {
      "preco_varejo_unitario": 7.99
    }
  }
}
```

**Erro (404):**
```json
{
  "success": false,
  "message": "Produto não encontrado"
}
```

---

### Clientes

#### Listar todos os clientes atacadistas

```http
GET /api/v1/clientes
```

Retorna a lista de todos os clientes atacadistas cadastrados.

**Exemplo de requisição:**
```bash
curl http://localhost:3000/api/v1/clientes
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id_cliente_atacado": 1,
      "nome_empresa": "Distribuidora XYZ Ltda",
      "cnpj": "12.345.678/0001-90",
      "email": "contato@distribuidoraxyz.com",
      "telefone": "(11) 98765-4321",
      "endereco": "Rua Exemplo, 123"
    }
  ]
}
```

#### Buscar cliente por ID

```http
GET /api/v1/clientes/:id
```

Retorna os detalhes de um cliente atacadista específico.

**Parâmetros da URL:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | integer | ID do cliente atacadista |

**Exemplo de requisição:**
```bash
curl http://localhost:3000/api/v1/clientes/1
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id_cliente_atacado": 1,
    "nome_empresa": "Distribuidora XYZ Ltda",
    "cnpj": "12.345.678/0001-90",
    "email": "contato@distribuidoraxyz.com",
    "telefone": "(11) 98765-4321",
    "endereco": "Rua Exemplo, 123"
  }
}
```

**Erro (404):**
```json
{
  "success": false,
  "message": "Cliente não encontrado"
}
```

---

### Autenticação

#### Registrar novo usuário

```http
POST /api/v1/auth/register
```

Cria um novo usuário no sistema.

**Body (JSON):**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha_forte_123"
}
```

**Exemplo de requisição:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "senha": "senha_forte_123"
  }'
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Usuário cadastrado com sucesso",
  "data": [
    {
      "id_usuario": 1,
      "nome": "João Silva",
      "email": "joao@example.com",
      "criado_em": "2026-05-22T10:30:00.000Z"
    }
  ]
}
```

**Erro (409 - Email já existe):**
```json
{
  "success": false,
  "message": "Email já cadastrado"
}
```

**Erro (400 - Campos obrigatórios):**
```json
{
  "success": false,
  "message": "Nome, email e senha são obrigatórios"
}
```

#### Login de usuário

```http
POST /api/v1/auth/login
```

Autentica um usuário e retorna um token JWT.

**Body (JSON):**
```json
{
  "email": "joao@example.com",
  "senha": "senha_forte_123"
}
```

**Exemplo de requisição:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "senha": "senha_forte_123"
  }'
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id_usuario": 1,
      "nome": "João Silva",
      "email": "joao@example.com"
    }
  }
}
```

**Erro (401 - Credenciais inválidas):**
```json
{
  "success": false,
  "message": "Email ou senha inválidos"
}
```

**Erro (400 - Campos obrigatórios):**
```json
{
  "success": false,
  "message": "Email e senha são obrigatórios"
}
```

## 🎯 Como Executar

### Scripts Disponíveis

```bash
# Desenvolvimento com hot reload
npm run dev

# Produção
npm start

# Testes (a implementar)
npm test
```

## 🧪 Testando a API

### Usando cURL

```bash
# Status da API
curl http://localhost:3000/

# Listar todos os produtos
curl http://localhost:3000/api/v1/produtos

# Buscar produtos por nome
curl http://localhost:3000/api/v1/produtos?search=monster

# Buscar produto específico por ID
curl http://localhost:3000/api/v1/produtos/1

# Listar todos os clientes
curl http://localhost:3000/api/v1/clientes

# Buscar cliente específico por ID
curl http://localhost:3000/api/v1/clientes/1
```

### Ferramentas Recomendadas

- **[Postman](https://www.postman.com/)** - Cliente API completo
- **[Insomnia](https://insomnia.rest/)** - Cliente API leve
- **[Thunder Client](https://www.thunderclient.com/)** - Extensão para VS Code
- **[REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)** - Extensão para VS Code

## 🗄️ Estrutura do Banco de Dados

O projeto utiliza as seguintes tabelas no Supabase:

### Tabelas Principais

- **produtos** - Catálogo de produtos
- **clientes_atacadistas** - Cadastro de clientes atacado
- **energeticos** - Tipos de energéticos
- **marcas** - Marcas dos produtos
- **volumes** - Volumes disponíveis
- **precos_varejo** - Preços de varejo

### Relacionamentos

- Produtos → Energéticos (1:1)
- Energéticos → Marcas (1:1)
- Produtos → Volumes (1:1)
- Produtos → Preços Varejo (1:1)

## 🔒 Segurança

Medidas de segurança implementadas:

- ✅ Variáveis de ambiente para credenciais sensíveis
- ✅ CORS configurado para controle de origens
- ✅ Validação de variáveis obrigatórias no startup
- ✅ Tratamento centralizado de erros
- ✅ Logs detalhados em ambiente de desenvolvimento
- ✅ Arquivo `.env` incluído no `.gitignore`

## 📝 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| Desenvolvimento | `npm run dev` | Inicia servidor com hot reload (nodemon) |
| Produção | `npm start` | Inicia servidor em modo produção |
| Testes | `npm test` | Executa testes (a implementar) |

## 🤝 Como Contribuir

Contribuições são bem-vindas! Para contribuir:

1. Faça um **fork** do projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas alterações (`git commit -m 'feat: adiciona MinhaFeature'`)
4. Faça **push** para a branch (`git push origin feature/MinhaFeature`)
5. Abra um **Pull Request**

### Padrão de Commits

Seguimos o [Conventional Commits](https://www.conventionalcommits.org/):

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `feat` | Nova funcionalidade | `feat: adiciona carrinho de compras` |
| `fix` | Correção de bug | `fix: corrige cálculo de preço` |
| `docs` | Documentação | `docs: atualiza README` |
| `refactor` | Refatoração de código | `refactor: melhora estrutura do controller` |
| `style` | Formatação | `style: ajusta indentação` |
| `test` | Testes | `test: adiciona testes de produtos` |
| `chore` | Tarefas gerais | `chore: atualiza dependências` |

## 🐛 Reportar Bugs

Encontrou um bug? [Abra uma issue](https://github.com/Wendersonjose/explosion-api/issues) incluindo:

- ✅ Descrição clara do problema
- ✅ Passos para reproduzir
- ✅ Comportamento esperado vs atual
- ✅ Screenshots (se aplicável)
- ✅ Informações do ambiente (Node.js, OS, etc)

## 📄 Licença

Este projeto está sob a licença **ISC**.

## 👨‍💻 Autor

Desenvolvido por **Wenderson Jose** para desafio técnico.

- GitHub: [@Wendersonjose](https://github.com/Wendersonjose)

---

# 🚧 Roadmap

## 🔐 Autenticação e Usuários

* [x] Sistema de autenticação com JWT
* [x] Registro de novos usuários
* [x] Login
* [ ] Logout
* [ ] Recuperação de senha
* [x] Perfis de usuário (cliente e administrador)

---

## 🛒 Carrinho de Compras

* [x] Consultar carrinho do usuário autenticado
* [x] Adicionar item ao carrinho
* [x] Atualizar quantidade automaticamente (incrementa se item já existe)
* [x] Remover item do carrinho
* [x] Cálculo de total do carrinho
* [x] Validações de estoque e produto ativo
* [x] Persistência no banco de dados
* [ ] Atualizar quantidade manualmente (endpoint específico)
* [ ] Limpar carrinho completo
* [ ] Finalizar carrinho (converter em pedido)

---

## 📦 Produtos

* [x] Listagem de produtos ativos
* [x] Busca por ID
* [x] Filtro por nome (case-insensitive)
* [x] Filtro por marca
* [x] Relacionamentos (energéticos, marcas, volumes, preços)
* [ ] CRUD completo (criar, editar, deletar)
* [ ] Upload de imagens
* [ ] Filtros avançados (categoria, preço, estoque)
* [ ] Ordenação personalizada
* [ ] Paginação

---

## 👥 Clientes

* [x] Listagem de clientes atacadistas
* [x] Busca de cliente por ID
* [x] Proteção com autenticação JWT
* [ ] CRUD completo de clientes
* [ ] Validação de CNPJ
* [ ] Histórico de compras por cliente

---

## 💼 Sistema de Pedidos

* [x] Criar pedido a partir do carrinho
* [x] Integração com estoque (baixa automática)
* [x] Registro de pagamentos
* [x] Cálculo automático do total
* [x] Validação de estoque disponível
* [ ] Histórico de pedidos do usuário
* [ ] Rastreamento de status do pedido
* [ ] Detalhes do pedido
* [ ] Cancelamento de pedidos
* [ ] Atualização de status (recebido, em_separacao, enviado, entregue)

---

## 💳 Pagamentos

* [ ] Integração com gateway de pagamento
* [ ] Múltiplas formas de pagamento (cartão, PIX, boleto)
* [ ] Confirmação de pagamento
* [ ] Webhooks de status
* [ ] Geração de comprovantes
* [ ] Histórico de transações

---

## 🎛️ Área Administrativa

* [ ] Dashboard administrativo
* [ ] CRUD completo de produtos
* [ ] Gestão de categorias e marcas
* [ ] Gerenciamento de estoque
* [ ] Visualização de todos os pedidos
* [ ] Relatórios de vendas
* [x] Gestão de clientes (visualização)
* [ ] Controle de usuários do sistema

---

## 📊 Melhorias Técnicas

* [ ] Paginação em listagens
* [x] Pesquisa por nome de produtos
* [x] Filtro por marca
* [ ] Filtros avançados (categoria, faixa de preço)
* [ ] Ordenação de resultados
* [ ] Validação com Joi/Yup
* [ ] Testes unitários e integração (Jest/Supertest)
* [ ] Documentação com Swagger/OpenAPI
* [ ] Rate limiting
* [ ] Cache com Redis
* [ ] Logs estruturados (Winston/Pino)
* [ ] Docker / Docker Compose
* [ ] CI/CD com GitHub Actions
* [ ] Monitoramento e observabilidade

---

### 📈 Status Atual

Progresso funcional aproximado do backend:

| Módulo | Progresso | Status |
|--------|-----------|--------|
| **Estrutura Base** | 100% | ✅ Completo |
| **Autenticação** | 85% | 🟢 Avançado |
| **Produtos** | 65% | 🟡 Em Progresso |
| **Carrinho** | 100% | ✅ Completo |
| **Clientes** | 40% | 🟡 Básico |
| **Pedidos** | 60% | 🟡 Em Progresso |
| **Pagamentos** | 30% | 🟡 Básico |
| **Área Admin** | 15% | 🔴 Inicial |
| **Infraestrutura** | 25% | 🔴 Inicial |

**Última atualização:** 29 de maio de 2026

---

## 📚 Recursos Adicionais

- [Documentação do Express.js](https://expressjs.com/)
- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de APIs RESTful](https://restfulapi.net/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 💡 Fazendo Fork do Projeto

Se você está fazendo um fork deste projeto:

1. ⭐ **Dê uma estrela** no projeto original
2. 🔧 Atualize as URLs do repositório neste README
3. 🗄️ Crie seu próprio projeto no [Supabase](https://supabase.com/)
4. 🔐 Configure suas variáveis de ambiente no `.env`
5. 📝 Personalize conforme sua necessidade
6. 🚀 Divirta-se codando!

---

<div align="center">

**Feito com ❤️ e ☕**

</div>
