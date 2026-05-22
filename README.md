# 🚀 Explosion API

API REST desenvolvida para gerenciamento de produtos energéticos e clientes atacadistas, construída com Node.js, Express e Supabase.

## 📋 Sobre o Projeto

A Explosion API é uma solução backend robusta que oferece endpoints para consulta de produtos energéticos e gestão de clientes atacadistas. A API utiliza Supabase como banco de dados, oferecendo consultas otimizadas com relacionamentos complexos entre tabelas.

### ✨ Funcionalidades

- ✅ Listagem e busca de produtos energéticos
- ✅ Filtros avançados (busca por nome e marca)
- ✅ Gestão de clientes atacadistas
- ✅ Relacionamentos complexos (energéticos, marcas, volumes, preços)
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

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/explosion-api.git
cd explosion-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Porta do servidor
PORT=3000

# Configurações do Supabase
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_anon_do_supabase

# Ambiente
NODE_ENV=development
```

> **⚠️ Importante:** Nunca commit o arquivo `.env` no repositório. Ele já está incluído no `.gitignore`.

### 4. Como obter as credenciais do Supabase

1. Acesse [supabase.com](https://supabase.com/) e crie uma conta
2. Crie um novo projeto
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** → `SUPABASE_URL`
   - **anon/public key** → `SUPABASE_KEY`

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

### Produtos

#### Listar todos os produtos

```http
GET /api/v1/produtos
```

**Query Parameters:**
- `search` (opcional) - Busca por nome do produto
- `marca` (opcional) - Filtra por nome da marca

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "total": 10,
  "data": [
    {
      "id_produto": 1,
      "nome_produto": "Red Bull 250ml",
      "descricao": "Energético Red Bull",
      "imagem_url": "https://...",
      "estoque": 100,
      "ativo": true,
      "energeticos": {
        "nome_energetico": "Red Bull",
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

**Parâmetros:**
- `id` - ID do produto

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id_produto": 1,
    "nome_produto": "Red Bull 250ml",
    ...
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

### Clientes

#### Listar todos os clientes atacadistas

```http
GET /api/v1/clientes
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id_cliente_atacado": 1,
      "nome_empresa": "Distribuidora XYZ",
      "cnpj": "12.345.678/0001-90",
      "email": "contato@xyz.com",
      ...
    }
  ]
}
```

#### Buscar cliente por ID

```http
GET /api/v1/clientes/:id
```

**Parâmetros:**
- `id` - ID do cliente atacadista

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id_cliente_atacado": 1,
    "nome_empresa": "Distribuidora XYZ",
    ...
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

### Status da API

```http
GET /
```

**Resposta:**
```json
{
  "message": "API Explosion rodando"
}
```

## 🎯 Como Executar

### Modo de Desenvolvimento

```bash
npm run dev
```

O servidor iniciará em `http://localhost:3000` com hot reload habilitado.

### Modo de Produção

```bash
npm start
```

## 🧪 Testando a API

### Usando cURL

```bash
# Listar produtos
curl http://localhost:3000/api/v1/produtos

# Buscar produto específico
curl http://localhost:3000/api/v1/produtos/1

# Buscar produtos com filtro
curl "http://localhost:3000/api/v1/produtos?search=red&marca=bull"

# Listar clientes
curl http://localhost:3000/api/v1/clientes
```

### Usando ferramentas GUI

Recomendamos usar:
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [Thunder Client](https://www.thunderclient.com/) (extensão VS Code)

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

- ✅ Variáveis de ambiente para credenciais sensíveis
- ✅ CORS configurado
- ✅ Validação de ambiente no startup
- ✅ Tratamento de erros centralizado
- ✅ Logs de erro em desenvolvimento

## 📝 Scripts Disponíveis

```bash
# Iniciar servidor em desenvolvimento (com hot reload)
npm run dev

# Iniciar servidor em produção
npm start

# Executar testes (a implementar)
npm test
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Commit

Seguimos o padrão de [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Alteração em documentação
- `refactor:` - Refatoração de código
- `style:` - Formatação de código
- `test:` - Adição de testes
- `chore:` - Tarefas gerais

## 🐛 Reportando Bugs

Encontrou um bug? Abra uma [issue](https://github.com/seu-usuario/explosion-api/issues) com:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Ambiente (Node.js version, OS, etc)

## 📄 Licença

Este projeto está sob a licença ISC.

## 👨‍💻 Autor

Desenvolvido com ❤️ para o desafio técnico.

---

## 🚧 Roadmap

Funcionalidades planejadas para versões futuras:

- [ ] Implementar testes unitários e de integração
- [ ] Adicionar autenticação JWT
- [ ] Implementar paginação nos endpoints
- [ ] Criar endpoints POST/PUT/DELETE
- [ ] Adicionar validação de dados com Joi/Yup
- [ ] Implementar rate limiting
- [ ] Documentação Swagger/OpenAPI
- [ ] Docker e Docker Compose
- [ ] CI/CD com GitHub Actions
- [ ] Cache com Redis
- [ ] Logs estruturados com Winston

## 📚 Recursos Adicionais

- [Documentação do Express.js](https://expressjs.com/)
- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de APIs RESTful](https://restfulapi.net/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**💡 Dica:** Se você está fazendo um fork deste projeto, não esqueça de:
1. Atualizar as URLs do repositório neste README
2. Criar seu próprio projeto no Supabase
3. Configurar as variáveis de ambiente corretamente
4. Dar uma ⭐ no projeto original se foi útil!
