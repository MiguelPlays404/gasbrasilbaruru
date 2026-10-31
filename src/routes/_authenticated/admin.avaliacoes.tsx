import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Stars } from "@/components/site/Stars";

export const Route = createFileRoute("/_authenticated/admin/avaliacoes")({
  head: () => ({
    meta: [
      { title: "Painel de avaliações — Gás Brasil" },
      { name: "description", content: "Moderação das avaliações enviadas pelo site." },
      { property: "og:title", content: "Painel de avaliações — Gás Brasil" },
      { property: "og:description", content: "Moderação das avaliações enviadas pelo site." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Status = "pending" | "approved" | "rejected";
const STATUS_LABEL: Record<Status, string> = { pending: "Pendente", approved: "Aprovada", rejected: "Rejeitada" };

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const role = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return { admin: false, email: "" };
      const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
      return { admin: !!data, email: u.user.email ?? "" };
    },
  });

  async function signOut() {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (role.isLoading) return <p className="p-10 text-muted-foreground">Carregando…</p>;
  if (!role.data?.admin) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold">Acesso não autorizado</h1>
        <p className="max-w-md text-muted-foreground">Esta conta não tem permissão de administrador. Peça ao responsável pela Gás Brasil para liberar seu acesso.</p>
        <button onClick={signOut} className="rounded-sm border border-input px-4 py-2 font-medium">Sair</button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="container-page flex h-16 items-center justify-between">
          <h1 className="text-lg font-extrabold">Gás Brasil · Avaliações</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-muted-foreground sm:inline">{role.data.email}</span>
            <a href="/" className="text-primary">Ver site</a>
            <button onClick={signOut} className="font-medium">Sair</button>
          </div>
        </div>
      </header>
      <div className="container-page space-y-10 py-10">
        <Overview />
        <ReviewList />
        <Settings />
      </div>
    </main>
  );
}

function useAllReviews() {
  return useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

function Overview() {
  const { data = [] } = useAllReviews();
  const approved = data.filter((r) => r.status === "approved");
  const avg = approved.length ? approved.reduce((s, r) => s + r.rating, 0) / approved.length : 0;
  const items = [
    ["Recebidas", data.length],
    ["Pendentes", data.filter((r) => r.status === "pending").length],
    ["Aprovadas", approved.length],
    ["Rejeitadas", data.filter((r) => r.status === "rejected").length],
    ["Média aprovadas", approved.length ? avg.toFixed(1).replace(".", ",") : "—"],
  ];
  return (
    <section aria-label="Visão geral" className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border md:grid-cols-5">
      {items.map(([l, v]) => (
        <div key={l} className="bg-surface p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{l}</p>
          <p className="mt-1 font-display text-3xl font-extrabold text-primary">{v}</p>
        </div>
      ))}
    </section>
  );
}

function ReviewList() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useAllReviews();
  const [status, setStatus] = useState<Status | "all">("pending");
  const [rating, setRating] = useState<number | 0>(0);
  const [expanded, setExpanded] = useState<string | null>(null);

  const moderate = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-reviews"] }),
  });

  const list = data.filter((r) => (status === "all" || r.status === status) && (!rating || r.rating === rating));

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-2xl font-bold">Gerenciar avaliações</h2>
        <div className="flex gap-3 text-sm">
          <label>Status{" "}
            <select value={status} onChange={(e) => setStatus(e.target.value as Status | "all")} className="ml-1 rounded-sm border border-input bg-surface px-2 py-1.5">
              <option value="all">Todas</option><option value="pending">Pendentes</option><option value="approved">Aprovadas</option><option value="rejected">Rejeitadas</option>
            </select>
          </label>
          <label>Nota{" "}
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="ml-1 rounded-sm border border-input bg-surface px-2 py-1.5">
              <option value={0}>Todas</option>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
            </select>
          </label>
        </div>
      </div>
      {moderate.error && <p role="alert" className="mt-3 text-sm text-destructive">Não foi possível atualizar: {(moderate.error as Error).message}</p>}
      <ul className="mt-6 divide-y divide-border border-y border-border bg-surface">
        {isLoading && <li className="p-6 text-muted-foreground">Carregando…</li>}
        {!isLoading && list.length === 0 && <li className="p-6 text-muted-foreground">Nenhuma avaliação neste filtro.</li>}
        {list.map((r) => (
          <li key={r.id} className="grid gap-3 p-5 md:grid-cols-[1fr_auto] md:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <strong>{r.display_name}</strong>
                <Stars value={r.rating} />
                <span className={`rounded-sm px-2 py-0.5 text-xs font-semibold ${r.status === "approved" ? "bg-primary text-primary-foreground" : r.status === "rejected" ? "bg-destructive text-destructive-foreground" : "bg-secondary text-secondary-foreground"}`}>{STATUS_LABEL[r.status as Status]}</span>
                <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("pt-BR")}</span>
              </div>
              <p className={`mt-2 text-muted-foreground ${expanded === r.id ? "" : "line-clamp-2"}`}>{r.comment}</p>
              {r.comment.length > 140 && <button onClick={() => setExpanded(expanded === r.id ? null : r.id)} className="mt-1 text-sm text-primary">{expanded === r.id ? "Mostrar menos" : "Ver comentário completo"}</button>}
              {r.moderated_at && <p className="mt-1 text-xs text-muted-foreground">Moderada em {new Date(r.moderated_at).toLocaleString("pt-BR")}</p>}
            </div>
            <div className="flex gap-2">
              {r.status !== "approved" && <button disabled={moderate.isPending} onClick={() => moderate.mutate({ id: r.id, status: "approved" })} className="rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Aprovar</button>}
              {r.status !== "rejected" && <button disabled={moderate.isPending} onClick={() => moderate.mutate({ id: r.id, status: "rejected" })} className="rounded-sm border border-destructive px-4 py-2 text-sm font-semibold text-destructive">Rejeitar</button>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Settings() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("key, value");
      return Object.fromEntries((data ?? []).map((s) => [s.key, s.value ?? ""]));
    },
  });
  const [url, setUrl] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [msg, setMsg] = useState("");
  useEffect(() => { if (data) { setUrl(data["GOOGLE_REVIEW_URL"] ?? ""); setEnabled(data["REVIEWS_PUBLIC_ENABLED"] !== "false"); } }, [data]);

  async function save(e: React.FormEvent) {
    e.preventDefault(); setMsg("");
    const clean = url.trim();
    if (clean && !/^https:\/\/(g\.page|search\.google\.com|www\.google\.com|google\.com|maps\.app\.goo\.gl|g\.co)\//i.test(clean)) {
      setMsg("Informe um endereço do Google começando com https://"); return;
    }
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("site_settings").upsert([
      { key: "GOOGLE_REVIEW_URL", value: clean || null, updated_at: new Date().toISOString(), updated_by: u.user?.id },
      { key: "REVIEWS_PUBLIC_ENABLED", value: enabled ? "true" : "false", updated_at: new Date().toISOString(), updated_by: u.user?.id },
    ]);
    setMsg(error ? `Erro: ${error.message}` : "Configurações salvas.");
    qc.invalidateQueries({ queryKey: ["settings"] });
  }

  return (
    <section className="grid gap-8 md:grid-cols-[1fr_1fr]">
      <form onSubmit={save} className="space-y-4 bg-surface p-6">
        <h2 className="text-2xl font-bold">Configurações</h2>
        <label className="block text-sm font-medium">GOOGLE_REVIEW_URL — link oficial de avaliação no Google
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://g.page/r/…/review" className="mt-1.5 w-full rounded-sm border border-input bg-background px-3 py-2.5" />
        </label>
        <p className="text-xs text-muted-foreground">Use o link “Pedir avaliações” do Perfil da Empresa no Google, não o link de localização do Maps.</p>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="accent-[var(--primary)]" /> Exibir avaliações aprovadas no site</label>
        <button className="rounded-sm bg-primary px-5 py-2.5 font-semibold text-primary-foreground">Salvar</button>
        {msg && <p role="status" className="text-sm">{msg}</p>}
      </form>
      <div className="space-y-2 bg-surface p-6 text-sm text-muted-foreground">
        <h2 className="text-2xl font-bold text-foreground">Informações do sistema</h2>
        <p>• Novas avaliações entram como <strong>pendentes</strong> e só aparecem no site após aprovação.</p>
        <p>• Cada conexão pode enviar no máximo 3 avaliações por hora.</p>
        <p>• Toda aprovação ou rejeição fica registrada com data e responsável.</p>
        <p>• Notas do Google e do site são exibidas separadamente e nunca misturadas.</p>
      </div>
    </section>
  );
}
