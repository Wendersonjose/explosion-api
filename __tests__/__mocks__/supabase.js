// Mock global do Supabase para testes
// Cria um mock "thenable" que pode ser encadeado E await-ado

// Valor padrão de resposta
let defaultResponse = { data: [], error: null };

// Cria o objeto mock
const mockSupabase = {
  // Método then() para tornar o objeto "thenable" (pode ser awaited)
  then(resolve, reject) {
    return Promise.resolve(defaultResponse).then(resolve, reject);
  },
};

// Adiciona métodos de encadeamento que retornam o próprio mockSupabase
mockSupabase.from = jest.fn(() => mockSupabase);
mockSupabase.select = jest.fn(() => mockSupabase);
mockSupabase.insert = jest.fn(() => mockSupabase);
mockSupabase.update = jest.fn(() => mockSupabase);
mockSupabase.delete = jest.fn(() => mockSupabase);
mockSupabase.eq = jest.fn(() => mockSupabase);
mockSupabase.ilike = jest.fn(() => mockSupabase);
mockSupabase.order = jest.fn(() => mockSupabase);
mockSupabase.single = jest.fn(() => Promise.resolve(defaultResponse));

module.exports = mockSupabase;
