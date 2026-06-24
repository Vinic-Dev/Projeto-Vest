// Script para criar os usuários João Pedro e Vinícius no Supabase
// Execute com: node create-users.mjs

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://korjbphaqprewuvsusrb.supabase.co';
// Precisamos da service_role key para criar usuários via admin API
// Obtenha em: Supabase Dashboard > Settings > API > service_role secret
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('❌ Defina a variável SUPABASE_SERVICE_KEY antes de rodar este script.');
  console.error('   $env:SUPABASE_SERVICE_KEY = "sua-service-role-key"');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const USERS = [
  { email: 'joaopedro@studyvestibular.app', password: 'abc123', full_name: 'João Pedro' },
  { email: 'vinicius@studyvestibular.app',  password: 'abc123', full_name: 'Vinícius' },
];

for (const u of USERS) {
  console.log(`\n🔄 Criando usuário: ${u.full_name} (${u.email})`);
  
  // Tenta criar o usuário
  const { data, error } = await supabase.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true, // já confirma o email automaticamente
    user_metadata: { full_name: u.full_name },
  });

  if (error) {
    if (error.message.includes('already')) {
      console.log(`  ⚠️  Usuário já existe, pulando...`);
      continue;
    }
    console.error(`  ❌ Erro: ${error.message}`);
    continue;
  }

  console.log(`  ✅ Usuário criado! ID: ${data.user.id}`);

  // Cria o perfil na tabela profiles
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: data.user.id,
    full_name: u.full_name,
  });

  if (profileError) {
    console.error(`  ⚠️  Erro ao criar perfil: ${profileError.message}`);
  } else {
    console.log(`  ✅ Perfil criado!`);
  }
}

console.log('\n✅ Pronto!');
