import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

// ─── Supabase Client (Singleton) ──────────────────────────────────────────────
// URL e chave pública — credenciais públicas por design.
// A segurança é gerida pelo backend via Row Level Security (RLS).
const SUPABASE_URL = 'https://korjbphaqprewuvsusrb.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_L-dq2PRp9wOcU70ukpRnTw_3X6gXUqz';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// ─── Auth Helpers ─────────────────────────────────────────────────────────────
export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });

  if (error) throw error;

  // Create profile row
  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: fullName,
    });
    if (profileError) console.error('Erro ao criar perfil:', profileError);
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession(): Promise<Session | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data;
}

// ─── Data Helpers (user-scoped) ───────────────────────────────────────────────
export interface DBSubtopicProgress {
  user_id: string;
  subtopic_id: string;
  status: string;
  mastery: number;
  last_review: string | null;
  next_review: string | null;
}

export interface DBSession {
  id: string;
  user_id: string;
  date: string;
  duration: number;
  area_id: string;
  topic_name: string;
  notes: string;
}

// ─── SQL Schema ───────────────────────────────────────────────────────────────
export const SUPABASE_SQL_SETUP = `-- Execute este SQL no SQL Editor do Supabase para criar as tabelas:

-- Tabela de perfis
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabela de progresso por subtópico (por usuário)
CREATE TABLE IF NOT EXISTS public.subtopic_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subtopic_id TEXT NOT NULL,
  status TEXT NOT NULL,
  mastery INTEGER NOT NULL,
  last_review DATE,
  next_review DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, subtopic_id)
);

-- Tabela de sessões de estudo (por usuário)
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  duration INTEGER NOT NULL,
  area_id TEXT NOT NULL,
  topic_name TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (id, user_id)
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtopic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas: cada usuário só acessa seus próprios dados
CREATE POLICY "Users manage own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users manage own progress" ON public.subtopic_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own sessions" ON public.study_sessions
  FOR ALL USING (auth.uid() = user_id);`;
