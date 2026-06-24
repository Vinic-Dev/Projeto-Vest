import React, { useState } from "react";
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { signIn, signUp } from "../../lib/supabase";

type AuthTab = "login" | "signup";

export default function LoginPage({ onAuth }: { onAuth: () => void }) {
  const [tab, setTab] = useState<AuthTab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (tab === "login") {
        await signIn(email, password);
      } else {
        if (!name.trim()) {
          setError("Por favor, informe seu nome.");
          setLoading(false);
          return;
        }
        await signUp(email, password, name.trim());
      }
      onAuth();
    } catch (err: any) {
      const msg = err?.message || "Ocorreu um erro. Tente novamente.";
      if (msg.includes("Invalid login")) {
        setError("Email ou senha incorretos.");
      } else if (msg.includes("already registered")) {
        setError("Este email já está cadastrado. Faça login.");
      } else if (msg.includes("Password should be")) {
        setError("A senha deve ter pelo menos 6 caracteres.");
      } else if (msg.includes("valid email")) {
        setError("Informe um email válido.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #34d399, transparent 70%)" }} />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #60a5fa, transparent 60%)" }} />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[10%] w-2 h-2 rounded-full bg-primary/20 animate-pulse" />
        <div className="absolute top-[25%] right-[15%] w-1.5 h-1.5 rounded-full bg-accent/20 animate-pulse"
          style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-[20%] left-[20%] w-1 h-1 rounded-full bg-chart-2/20 animate-pulse"
          style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-[30%] right-[10%] w-2.5 h-2.5 rounded-full bg-primary/15 animate-pulse"
          style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, #34d399, #60a5fa)" }}>
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">StudyENEM</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sua plataforma de estudos para o ENEM
          </p>
        </div>

        {/* Card */}
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-border">
            {(["login", "signup"] as AuthTab[]).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 py-3.5 text-sm font-medium transition-all relative ${
                  tab === t
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/70"
                }`}
              >
                {t === "login" ? "Entrar" : "Criar Conta"}
                {tab === t && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {tab === "signup" && (
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground block">Nome completo</label>
                <div className="flex items-center gap-2.5 bg-input-background border border-border rounded-xl px-3.5 py-2.5 focus-within:border-primary/50 transition-colors">
                  <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground block">Email</label>
              <div className="flex items-center gap-2.5 bg-input-background border border-border rounded-xl px-3.5 py-2.5 focus-within:border-primary/50 transition-colors">
                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                  autoComplete="email"
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
                  placeholder={tab === "signup" ? "Mínimo 6 caracteres" : "Sua senha"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                  autoComplete={tab === "login" ? "current-password" : "new-password"}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>

            {/* Error message */}
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
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #34d399, #22c55e)",
                color: "#022c22",
              }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {tab === "login" ? "Entrar" : "Criar Conta"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Switch tab link */}
            <p className="text-center text-xs text-muted-foreground pt-1">
              {tab === "login" ? (
                <>
                  Não tem uma conta?{" "}
                  <button type="button" onClick={() => { setTab("signup"); setError(""); }}
                    className="text-primary hover:underline font-medium">
                    Crie agora
                  </button>
                </>
              ) : (
                <>
                  Já tem uma conta?{" "}
                  <button type="button" onClick={() => { setTab("login"); setError(""); }}
                    className="text-primary hover:underline font-medium">
                    Faça login
                  </button>
                </>
              )}
            </p>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-muted-foreground/50 mt-6">
          Plataforma de estudos para vestibulares e ENEM
        </p>
      </div>
    </div>
  );
}
