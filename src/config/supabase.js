const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

// Validação das variáveis de ambiente
if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: SUPABASE_URL e SUPABASE_KEY devem estar definidas no arquivo .env')
  process.exit(1)
}

// Criação do cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase
