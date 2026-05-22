# 🚀 Explosion API

> **⚠️ Projeto em Desenvolvimento** - Esta é uma versão inicial da API. Novas funcionalidades estão sendo implementadas.

API REST para e-commerce Explosion, especializado em produtos energéticos. Construída com Node.js, Express e Supabase/PostgreSQL.

## 📋 Sobre o Projeto

A Explosion API é o backend do e-commerce Explosion, oferecendo endpoints para consulta de produtos energéticos e gestão de clientes atacadistas. A API utiliza Supabase (PostgreSQL) como banco de dados, com consultas otimizadas e relacionamentos entre tabelas.

### ✨ Funcionalidades Implementadas

- ✅ Listagem de produtos energéticos
- ✅ Busca de produtos por ID
- ✅ Filtro de produtos por nome
- ✅ Listagem de clientes atacadistas
- ✅ Busca de clientes por ID
- ✅ Relacionamentos de dados (energéticos, marcas, volumes, preços)
- ✅ Tratamento de erros centralizado
- ✅ Suporte a CORS
- ✅ Estrutura MVC organizada

## 🛠️ Tecnologias Utilizadas

- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[Express.js](https://expressjs.com/) v5** - Framework web
- **[Supabase](https://supabase.com/)** - Backend as a Service (BaaS)
- **[Cors](https://www.npmjs.com/package/cors)** - Middleware de CORS
- **[Dotenv](https://www.npmjs.com/package/dotenv)** - Gerenciamento de variáveis de ambiente
- **[Nodemon](https://nodemon.io/)** - Hot reload em desenvolvimento

## 📦 Pré-requisitos

Antes de começar, você precisará ter instalado:

- **Node.js** (versão 16.x ou superior)
- **npm** ou **yarn**
- Conta no **Supabase** (gratuita)

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/Wendersonjose/explosion-api.git
cd explosion-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e configure com suas credenciais:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais (veja seção [Variáveis de Ambiente](#-variáveis-de-ambiente) abaixo).

> **⚠️ Importante:** Nunca commit o arquivo `.env` no repositório. Ele já está incluído no `.gitignore`.

### 4. Inicie o servidor

**Modo desenvolvimento (com hot reload):**
```bash
npm run dev
```

**Modo produção:**
```bash
npm start
```

O servidor iniciará em `http://localhost:3000`

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `PORT` | Porta do servidor | `3000` |
| `SUPABASE_URL` | URL do projeto Supabase | `https://xxxxx.supabase.co` |
| `SUPABASE_KEY` | Chave anon/public do Supabase | `eyJhbGc...` |
| `NODE_ENV` | Ambiente de execução | `development` ou `production` |

### Como obter as credenciais do Supabase

1. Acesse [supabase.com](https://supabase.com/) e crie uma conta gratuita
2. Crie um novo projeto
3. Acesse **Settings** → **API** no painel do seu projeto
4. Copie:
   - **Project URL** → Use como `SUPABASE_URL`
   - **anon/public key** → Use como `SUPABASE_KEY`

**Exemplo de arquivo `.env`:**
```env
PORT=3000
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua_chave_anon_aqui
NODE_ENV=development
```

## 📁 Estrutura do Projeto

```
explosion-api/
├── src/
│   ├── config/
│   │   └── supabase.js          # Configuração do cliente Supabase
│   ├── controllers/
│   │   ├── clientes.controller.js   # Lógica de negócio - Clientes
│   │   └── produtos.controller.js   # Lógica de negócio - Produtos
│   ├── middlewares/
│   │   └── errorHandler.js      # Middleware de tratamento de erros
│   ├── routes/
│   │   ├── clientes.routes.js   # Rotas de clientes
│   │   └── produtos.routes.js   # Rotas de produtos
│   ├── utils/
│   │   └── asyncHandler.js      # Wrapper para funções assíncronas
│   ├── app.js                   # Configuração do Express
│   └── server.js                # Inicialização do servidor
├── .env                         # Variáveis de ambiente (criar)
├── .gitignore
├── package.json
└── README.md
```

## 🔌 Endpoints da API

### Base URL
```
http://localhost:3000/api/v1
```

### Status da API

```http
GET /
```

Verifica se a API está online.

**Resposta:**
```json
{
  "message": "API Explosion rodando"
}
```

---

### Produtos

#### Listar todos os produtos

```http
GET /api/v1/produtos
```

Lista todos os produtos energéticos ativos no catálogo.

**Query Parameters (opcionais):**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `search` | string | Busca produtos por nome (case-insensitive) |

**Exemplo de requisição:**
```bash
# Listar todos os produtos
curl http://localhost:3000/api/v1/produtos

# Buscar produtos por nome
curl http://localhost:3000/api/v1/produtos?search=monster
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "total": 10,
  "data": [
    {
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

## 🚧 Roadmap

### Funcionalidades Planejadas

#### 🔐 Autenticação e Usuários
- [ ] Sistema de autenticação com JWT
- [ ] Registro de novos usuários
- [ ] Login e logout
- [ ] Recuperação de senha
- [ ] Perfis de usuário (cliente e administrador)

#### 🛒 E-commerce
- [ ] Carrinho de compras
  - [ ] Adicionar produtos ao carrinho
  - [ ] Remover produtos do carrinho
  - [ ] Atualizar quantidades
  - [ ] Persistência do carrinho
- [ ] Sistema de pedidos
  - [ ] Criar pedido
  - [ ] Histórico de pedidos
  - [ ] Rastreamento de status
  - [ ] Cancelamento de pedidos
- [ ] Gestão de endereços de entrega
- [ ] Cálculo de frete

#### 💳 Pagamentos
- [ ] Integração com gateway de pagamento
- [ ] Múltiplas formas de pagamento
- [ ] Confirmação de pagamento
- [ ] Geração de comprovantes

#### 🎛️ Área Administrativa
- [ ] Dashboard administrativo
- [ ] CRUD completo de produtos
- [ ] Gestão de categorias e marcas
- [ ] Gerenciamento de estoque
- [ ] Visualização de pedidos
- [ ] Relatórios de vendas
- [ ] Gestão de clientes

#### 📊 Melhorias Técnicas
- [ ] Paginação em todas as listagens
- [ ] Filtros avançados (marca, categoria, preço)
- [ ] Ordenação de resultados
- [ ] Validação de dados com Joi/Yup
- [ ] Testes unitários e de integração
- [ ] Documentação Swagger/OpenAPI
- [ ] Rate limiting
- [ ] Cache com Redis
- [ ] Logs estruturados
- [ ] Docker e Docker Compose
- [ ] CI/CD com GitHub Actions

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
