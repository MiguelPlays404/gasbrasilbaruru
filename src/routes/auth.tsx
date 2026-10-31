import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => z.object({ redirect: z.string().optional() }).parse(s),
  head: () => ({
    meta: [
      { title: "Acesso administrativo — Gás Brasil" },
      { name: "description", content: "Área restrita da equipe Gás Brasil." },
      { property: "og:title", content: "Acesso administrativo — Gás Brasil" },
      { property: "og:description", content: "Área restrita da equipe Gás Brasil." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError("E-mail ou senha inválidos."); return; }
    const to = redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/admin/avaliacoes";
    navigate({ to, replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5 bg-surface p-8 shadow-soft">
        <div>
          <h1 className="text-2xl font-extrabold">Área administrativa</h1>
          <p className="mt-1 text-sm text-muted-foreground">Acesso restrito à equipe Gás Brasil.</p>
        </div>
        <label className="block text-sm font-medium">E-mail
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-sm border border-input bg-background px-3 py-2.5 outline-none focus:border-primary" />
        </label>
        <label className="block text-sm font-medium">Senha
          <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 w-full rounded-sm border border-input bg-background px-3 py-2.5 outline-none focus:border-primary" />
        </label>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <button disabled={loading} className="w-full rounded-sm bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary-deep disabled:opacity-60">{loading ? "Entrando…" : "Entrar"}</button>
      </form>
    </main>
  );
}
