import { createClient } from '@supabase/supabase-js';

// Try to get credentials from environment variables or localStorage fallback
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const localUrl = localStorage.getItem('supabase_url');
  const localKey = localStorage.getItem('supabase_anon_key');

  return {
    url: envUrl || localUrl || '',
    key: envKey || localKey || '',
    isConfigured: !!(envUrl || localUrl) && !!(envKey || localKey)
  };
};

const config = getSupabaseConfig();

export const supabase = config.isConfigured
  ? createClient(config.url, config.key)
  : null;

// Re-initialize client if config changes in localStorage dynamically
export const getSupabaseClient = () => {
  const currentConfig = getSupabaseConfig();
  if (!currentConfig.isConfigured) return null;
  return createClient(currentConfig.url, currentConfig.key);
};

export interface DBSubtopicProgress {
  subtopic_id: string;
  status: string;
  mastery: number;
  last_review: string | null;
  next_review: string | null;
}

export interface DBSession {
  id: string;
  date: string;
  duration: number;
  area_id: string;
  topic_name: string;
  notes: string;
}

// SQL Schema for reference and setup modal
export const SUPABASE_SQL_SETUP = `-- Execute este código SQL no SQL Editor do Supabase para criar as tabelas necessárias:

CREATE TABLE IF NOT EXISTS public.subtopic_progress (
  subtopic_id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  mastery INTEGER NOT NULL,
  last_review DATE,
  next_review DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.study_sessions (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  duration INTEGER NOT NULL,
  area_id TEXT NOT NULL,
  topic_name TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Habilitar acesso público para facilitar o protótipo (desabilite RLS nas tabelas no Supabase Dashboard se necessário)`;
