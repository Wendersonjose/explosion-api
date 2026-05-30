# Testes Automatizados - Explosion API

## 📋 Visão Geral

Este projeto contém uma suite completa de testes automatizados para garantir a qualidade e confiabilidade da API Explosion.

## 🗂️ Estrutura de Testes

```
__tests__/
├── helpers/
│   └── testHelpers.js          # Funções auxiliares e mocks reutilizáveis
├── unit/
│   ├── middlewares/
│   │   ├── auth.middleware.test.js
│   │   ├── role.middleware.test.js
│   │   └── errorHandler.test.js
│   ├── controllers/
│   │   ├── auth.controller.test.js
│   │   └── produtos.controller.test.js
│   └── utils/
│       └── asyncHandler.test.js
└── integration/
    ├── app.test.js
    ├── auth.routes.test.js
    └── produtos.routes.test.js
```

## 🧪 Tipos de Testes

### Testes Unitários

Testam componentes individuais isoladamente:

- **Middlewares**: Autenticação, autorização e tratamento de erros
- **Controllers**: Lógica de negócio de autenticação e produtos
- **Utils**: Funções auxiliares como asyncHandler

### Testes de Integração

Testam a API completa com todas as camadas integradas:

- **Health Check**: Verifica se a API está funcionando
- **Rotas de Autenticação**: Registro e login
- **Rotas de Produtos**: Listagem e busca de produtos

## 🚀 Como Executar

### Executar todos os testes

```bash
npm test
```

### Executar testes em modo watch

```bash
npm run test:watch
```

### Executar com cobertura de código

```bash
npm run test:coverage
```

### Executar com saída detalhada

```bash
npm run test:verbose
```

## 📊 Cobertura de Código

O projeto está configurado para manter uma cobertura mínima de:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

Arquivos excluídos da cobertura:

- `src/server.js` (arquivo de inicialização)
- `src/config/**` (configurações externas)

## ⚙️ Configuração

### Jest Configuration

O Jest está configurado no arquivo `jest.config.js` com:

- Ambiente: Node.js
- Timeout: 10 segundos
- Setup: `jest.setup.js`
- Mocks automáticos limpos entre testes

### Variáveis de Ambiente

Os testes utilizam o arquivo `.env.test` para configurações específicas:

```env
NODE_ENV=test
SUPABASE_URL=http://localhost:54321
SUPABASE_KEY=your-test-key-here
JWT_SECRET=test-secret-key
PORT=3001
```

**⚠️ Importante**: Configure variáveis reais para testes de integração completos.

## 🔧 Tecnologias Utilizadas

- **Jest**: Framework de testes
- **Supertest**: Testes de API HTTP
- **bcryptjs**: Testes de criptografia
- **jsonwebtoken**: Testes de autenticação

## 📝 Padrões de Teste

### Estrutura de um teste

```javascript
describe('Nome do Componente', () => {
  beforeEach(() => {
    // Setup antes de cada teste
  });

  describe('Funcionalidade específica', () => {
    it('deve fazer algo específico', async () => {
      // Arrange (preparar)
      // Act (executar)
      // Assert (verificar)
    });
  });
});
```

### Convenções

1. Use nomes descritivos para os testes
2. Agrupe testes relacionados com `describe`
3. Limpe mocks após cada teste
4. Use mocks para dependências externas
5. Teste casos de sucesso, erro e edge cases

## 🐛 Debugging

Para debug de testes específicos:

```bash
# Executar arquivo específico
npm test -- __tests__/unit/middlewares/auth.middleware.test.js

# Executar com debug
node --inspect-brk node_modules/.bin/jest --runInBand
```

## 📚 Helpers Disponíveis

- `generateTestToken()`: Gera token JWT para testes
- `generateAdminToken()`: Gera token de admin
- `mockProduto`: Mock de dados de produto
- `mockCliente`: Mock de dados de cliente
- `mockUsuario`: Mock de dados de usuário
- `mockSupabaseClient()`: Mock do cliente Supabase

## ✅ Checklist de Testes

Ao adicionar novos recursos, certifique-se de testar:

- [ ] Casos de sucesso
- [ ] Validações de entrada
- [ ] Tratamento de erros
- [ ] Casos edge (valores nulos, vazios, etc)
- [ ] Autenticação e autorização
- [ ] Integração com banco de dados (mockado)

## 🔄 CI/CD

Os testes são executados automaticamente:

- Antes de cada commit (recomendado com git hooks)
- Em pull requests
- Antes de deploy para produção

## 📈 Próximos Passos

- [ ] Adicionar testes para rotas de carrinho
- [ ] Adicionar testes para rotas de clientes
- [ ] Implementar testes E2E com banco de dados real
- [ ] Adicionar testes de performance
- [ ] Configurar CI/CD com GitHub Actions

## 💡 Dicas

1. Mantenha os testes simples e focados
2. Use mocks para dependências externas
3. Teste comportamentos, não implementações
4. Mantenha a cobertura de código alta
5. Execute testes antes de fazer commit

## 🆘 Suporte

Para problemas ou dúvidas sobre os testes, consulte:

- Documentação do Jest: https://jestjs.io/
- Documentação do Supertest: https://github.com/visionmedia/supertest
- Issues do projeto

---

**Última atualização**: Maio 2026
