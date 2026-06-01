// __mocks__/supabase.js
//
// Mock do cliente Supabase para testes (Jest).
//
// Cobre os dois padrões de término de query usados nos controllers:
//   1. await direto na cadeia        -> ex.: await supabase.from(...).select(...).eq(...)
//   2. método terminal .single()     -> ex.: await supabase.from(...).select(...).single()
//
// Suporta múltiplas queries na MESMA função (ex.: register faz 2 queries)
// via fila de resultados: cada resposta é consumida por uma query, em ordem.
//
// ----------------------------------------------------------------------------
// Como usar nos testes:
//
//   const supabase = require("../config/supabase");
//
//   beforeEach(() => supabase.__reset());
//
//   // UMA resposta (próxima query consome):
//   supabase.__setResult({ id_usuario: 1, nome: "Ana" });
//   supabase.__setResult(null);                 // ex.: 404 / 401
//   supabase.__setError(new Error("db down"));  // ex.: 500
//
//   // VÁRIAS respostas em ordem (1ª query, 2ª query, ...):
//   supabase.__setSequence(
//     { data: null, error: null },              // 1ª query
//     { data: [{ id_usuario: 1 }], error: null } // 2ª query
//   );
//
//   // Asserções de encadeamento:
//   expect(supabase.ilike).toHaveBeenCalledWith("nome_produto", "%monster%");
// ----------------------------------------------------------------------------

const createClient = () => {
  // Fila de resultados. Cada query (terminal ou await direto) consome um item.
  // Se a fila estiver vazia, usa _default.
  let _queue = [];
  let _default = { data: [], error: null };

  const nextResult = () => {
    const result = _queue.length ? _queue.shift() : _default;
    // Se o resultado tem o flag __throw, lança exceção
    if (result.__throw) {
      throw result.error;
    }
    return result;
  };

  const builder = {
    // ---- métodos intermediários (encadeáveis: retornam o próprio builder) ----
    from: jest.fn(() => builder),
    select: jest.fn(() => builder),
    insert: jest.fn(() => builder),
    update: jest.fn(() => builder),
    delete: jest.fn(() => builder),
    upsert: jest.fn(() => builder),
    eq: jest.fn(() => builder),
    neq: jest.fn(() => builder),
    gt: jest.fn(() => builder),
    gte: jest.fn(() => builder),
    lt: jest.fn(() => builder),
    lte: jest.fn(() => builder),
    like: jest.fn(() => builder),
    ilike: jest.fn(() => builder),
    is: jest.fn(() => builder),
    in: jest.fn(() => builder),
    contains: jest.fn(() => builder),
    match: jest.fn(() => builder),
    order: jest.fn(() => builder),
    limit: jest.fn(() => builder),
    range: jest.fn(() => builder),

    // ---- métodos terminais (resolvem uma Promise) ----
    single: jest.fn(() => Promise.resolve(nextResult())),
    maybeSingle: jest.fn(() => Promise.resolve(nextResult())),

    // ---- torna o builder "thenable" (permite await direto na cadeia) ----
    // Lê o resultado no momento do await, não um valor fixo do módulo.
    then(resolve, reject) {
      return Promise.resolve(nextResult()).then(resolve, reject);
    },
    catch(reject) {
      return Promise.resolve(nextResult()).catch(reject);
    },

    // ---- helpers de teste ----
    // Enfileira UMA resposta de sucesso (consumida pela próxima query).
    __setResult: (data, error = null) => {
      _queue.push({ data, error });
    },
    // Enfileira UM erro (data: null) — útil para testar caminho 500.
    __setError: (error) => {
      _queue.push({ data: null, error });
    },
    // Enfileira uma exceção que será lançada (Promise.reject) — útil para testar blocos catch.
    __setThrow: (error) => {
      _queue.push({ __throw: true, error });
    },
    // Enfileira VÁRIAS respostas em ordem. Cada arg = { data, error }.
    __setSequence: (...results) => {
      results.forEach((r) => _queue.push(r));
    },
    // Define a resposta padrão (usada quando a fila esvazia).
    __setDefault: (data, error = null) => {
      _default = { data, error };
    },
    // Limpa a fila e o histórico de chamadas dos mocks. Chamar em beforeEach.
    __reset: () => {
      _queue = [];
      _default = { data: [], error: null };
      Object.values(builder).forEach((fn) => {
        if (jest.isMockFunction(fn)) fn.mockClear();
      });
    },
  };

  return builder;
};

const supabase = createClient();

module.exports = supabase;
// Exporta também a factory, caso queira instâncias isoladas em algum teste.
module.exports.createClient = createClient;