// Configuração global para testes
require('dotenv').config({ path: '.env.test' });

// Mock global do Supabase
jest.mock('./src/config/supabase', () => require('./__tests__/__mocks__/supabase'));

// Aumentar timeout para testes que fazem chamadas externas
jest.setTimeout(10000);

// Silenciar console nos testes
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};

// Resetar apenas histórico de chamadas após cada teste, mantendo implementações
afterEach(() => {
  const mockSupabase = require('./__tests__/__mocks__/supabase');
  
  // Resetar histórico de chamadas de cada função mock
  Object.values(mockSupabase).forEach(mockFn => {
    if (mockFn.mockClear) {
      mockFn.mockClear();
    }
  });
});
