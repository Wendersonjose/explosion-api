# 📚 Documentação Swagger - Explosion API

## 🎯 Visão Geral

A Explosion API possui documentação interativa completa usando **Swagger UI** com especificação **OpenAPI 3.0**. Isso permite testar todos os endpoints diretamente no navegador, sem necessidade de ferramentas externas como Postman ou Insomnia.

## 🚀 Acessando a Documentação

### Passo 1: Inicie o servidor

```bash
npm start
# ou para desenvolvimento com hot reload
npm run dev
```

### Passo 2: Acesse o Swagger UI

Abra seu navegador e acesse:

```
http://localhost:3000/api-docs
```

## 🔐 Autenticação no Swagger

Para testar endpoints protegidos que requerem autenticação JWT:

### 1️⃣ Faça login primeiro

1. No Swagger UI, expanda a seção **"Autenticação"**
2. Clique em `POST /api/v1/auth/login`
3. Clique em **"Try it out"**
4. Preencha o corpo da requisição:

```json
{
  "email": "seu-email@example.com",
  "senha": "sua-senha"
}
```

5. Clique em **"Execute"**
6. Copie o token JWT retornado na resposta

### 2️⃣ Configure a autenticação

1. No topo da página do Swagger, clique no botão **"Authorize"** 🔒
2. Cole o token no formato: `Bearer seu_token_aqui`
3. Clique em **"Authorize"**
4. Clique em **"Close"**

### 3️⃣ Teste endpoints protegidos

Agora você pode testar qualquer endpoint que requer autenticação, como:
- `GET /api/v1/auth/me` - Obter perfil do usuário
- `GET /api/v1/carrinho` - Ver carrinho de compras
- `POST /api/v1/pedidos` - Criar pedidos

## 📖 Endpoints Documentados

### ✅ Autenticação
- `POST /api/v1/auth/register` - Registrar novo usuário
- `POST /api/v1/auth/login` - Fazer login
- `GET /api/v1/auth/me` - Obter perfil (requer autenticação)

### ✅ Produtos
- `GET /api/v1/produtos` - Listar todos os produtos
- `GET /api/v1/produtos/{id}` - Buscar produto por ID

### 🚧 Em Desenvolvimento
- Clientes
- Carrinho
- Pedidos

## 💡 Dicas de Uso

### Testar Múltiplas Requisições

1. **Buscar produtos**: `GET /api/v1/produtos`
2. **Filtrar por nome**: `GET /api/v1/produtos?nome=energia`
3. **Ver detalhes**: `GET /api/v1/produtos/{id}`

### Exportar Especificação OpenAPI

Para integrar com outras ferramentas ou gerar código client:

```
http://localhost:3000/api-docs.json
```

Você pode importar este JSON em:
- Postman
- Insomnia
- Thunder Client
- Geradores de código (Swagger Codegen, OpenAPI Generator)

## 🎨 Recursos do Swagger UI

### Visualização de Schemas

Todos os modelos de dados estão documentados na seção **"Schemas"** no final da página:
- `Usuario` - Estrutura de usuário
- `Produto` - Estrutura de produto
- `Cliente` - Estrutura de cliente
- `LoginRequest` - Requisição de login
- `LoginResponse` - Resposta de login
- `RegisterRequest` - Requisição de registro
- `Error` - Estrutura de erro padrão

### Exemplos Automáticos

Cada endpoint possui:
- ✅ Exemplos de requisição
- ✅ Exemplos de resposta
- ✅ Códigos de status HTTP
- ✅ Descrição de parâmetros
- ✅ Schemas de dados

### Try It Out

Clique em **"Try it out"** em qualquer endpoint para:
- Editar parâmetros
- Modificar corpo da requisição
- Ver requisição curl equivalente
- Executar e ver resposta em tempo real

## 🔧 Personalizando a Documentação

### Adicionar Documentação a Novos Endpoints

Para adicionar documentação Swagger a novos endpoints, use comentários JSDoc no arquivo de rotas:

```javascript
/**
 * @swagger
 * /api/v1/exemplo:
 *   get:
 *     summary: Descrição breve do endpoint
 *     tags: [Nome da Tag]
 *     parameters:
 *       - in: query
 *         name: parametro
 *         schema:
 *           type: string
 *         description: Descrição do parâmetro
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NomeDoSchema'
 */
router.get('/exemplo', controller)
```

### Adicionar Novos Schemas

Edite `src/config/swagger.js` e adicione na seção `components.schemas`:

```javascript
NovoSchema: {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'ID único'
    },
    nome: {
      type: 'string',
      description: 'Nome do item'
    }
  }
}
```

## 📚 Referências

- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger JSDoc](https://github.com/Surnet/swagger-jsdoc)
- [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)

## 🆘 Problemas Comuns

### Swagger não carrega

1. Verifique se o servidor está rodando: `http://localhost:3000`
2. Limpe o cache do navegador (Ctrl + Shift + Del)
3. Tente modo anônimo/incógnito

### Token JWT não funciona

1. Certifique-se de incluir `Bearer` antes do token
2. Formato correto: `Bearer eyJhbGc...`
3. Verifique se o token não expirou (faça login novamente)

### Endpoint não aparece na documentação

1. Verifique se o arquivo de rota está em `src/routes/`
2. Confirme que adicionou os comentários `@swagger`
3. Reinicie o servidor após adicionar documentação

---

**💡 Pro Tip**: Mantenha a documentação Swagger sempre atualizada quando adicionar ou modificar endpoints. Isso facilita a integração com frontend e testes!
