import React, { useState } from "react";
import { GraduationCap, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { signIn } from "../../lib/supabase";

const usernameToEmail = (username: string) => `${username.toLowerCase().trim()}@studyvestibular.app`;

const ALLOWED_USERS = ["joaopedro", "vinicius"];

export default function LoginPage({ onAuth }: { onAuth: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const user = username.toLowerCase().trim().replace(/\s/g, "");

    if (!user) {
      setError("Informe um nome de usuário.");
      return;
    }

    if (!ALLOWED_USERS.includes(user)) {
      setError("Usuário não encontrado. Acesso restrito.");
      return;
    }

    setLoading(true);
    try {
      await signIn(usernameToEmail(user), password);
      onAuth();
    } catch (err: any) {
      const msg = err?.message || "";
      if (msg.includes("Invalid login") || msg.includes("invalid")) {
        setError("Senha incorreta. Tente novamente.");
      } else {
        setError("Erro ao entrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }} />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent 60%)" }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
            style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)" }}>
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Study Vestibular</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acesso restrito — faça login para continuar
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-lg font-semibold text-foreground">Entrar</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Use seu nome de usuário e senha</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground block">Nome de usuário</label>
              <div className="flex items-center gap-2.5 bg-input-background border border-border rounded-xl px-3.5 py-2.5 focus-within:border-primary/50 transition-colors">
                <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  placeholder="usuario"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground block">Senha</label>
              <div className="flex items-center gap-2.5 bg-input-background border border-border rounded-xl px-3.5 py-2.5 focus-within:border-primary/50 transition-colors">
                <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5">
                <div className="w-1 h-1 rounded-full bg-destructive mt-1.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-muted-foreground/50 mt-6">
          Plataforma de estudos para vestibulares
        </p>
      </div>
    </div>
  );
}
