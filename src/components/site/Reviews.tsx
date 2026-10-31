import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Star, CheckCircle2 } from "lucide-react";
import { submitReview } from "@/lib/reviews.functions";
import { reviewInputSchema } from "@/lib/reviews.schema";
import { GoogleIcon } from "./icons";
import { Stars } from "./Stars";

type Review = { id: string; display_name: string; rating: number; comment: string; created_at: string };
type Stats = { total: number | null; average: number | null; r1: number | null; r2: number | null; r3: number | null; r4: number | null; r5: number | null };

const fmt = (d: string) => new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

export function Reviews({ reviews, stats, googleReviewUrl, publicEnabled }: { reviews: Review[]; stats: Stats; googleReviewUrl: string | null; publicEnabled: boolean }) {
  const [showForm, setShowForm] = useState(false);
  const total = stats.total ?? 0;
  const avg = Number(stats.average ?? 0);
  const [featured, ...rest] = publicEnabled ? reviews : [];

  return (
    <section id="avaliacoes" className="py-20 md:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <h2 className="text-4xl font-extrabold leading-[1.05] text-foreground md:text-5xl">O que nossos clientes dizem.</h2>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            A experiência de quem escolhe a Gás Brasil é muito importante para nós. Confira as avaliações e compartilhe também a sua experiência.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {googleReviewUrl ? (
              <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-sm border border-input bg-surface px-5 py-3 font-semibold transition hover:border-primary">
                <GoogleIcon className="h-5 w-5" /> Avaliar no Google
              </a>
            ) : (
              <span className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-sm border border-dashed border-input px-5 py-3 text-sm text-muted-foreground" title="Link de avaliação ainda não configurado">
                <GoogleIcon className="h-5 w-5 opacity-50" /> Avaliar no Google (em breve)
              </span>
            )}
            <button type="button" onClick={() => setShowForm((v) => !v)} aria-expanded={showForm} aria-controls="form-avaliacao" className="inline-flex items-center justify-center gap-2 rounded-sm bg-secondary px-5 py-3 font-semibold text-secondary-foreground transition hover:brightness-95">
              <Star className="h-5 w-5" /> Deixar minha avaliação
            </button>
          </div>

          <div className="mt-12 border-t border-border pt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Avaliações enviadas pelo site</p>
            {total > 0 ? (
              <div className="mt-4 flex items-end gap-6">
                <div>
                  <p className="font-display text-6xl font-extrabold text-primary">{avg.toFixed(1).replace(".", ",")}</p>
                  <Stars value={avg} />
                  <p className="mt-1 text-sm text-muted-foreground">{total} {total === 1 ? "avaliação" : "avaliações"}</p>
                </div>
                <ul className="flex-1 space-y-1.5" aria-label="Distribuição das notas">
                  {[5, 4, 3, 2, 1].map((n) => {
                    const c = (stats[`r${n}` as keyof Stats] as number | null) ?? 0;
                    return (
                      <li key={n} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="w-3">{n}</span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <span className="block h-full bg-secondary" style={{ width: `${total ? (c / total) * 100 : 0}%` }} />
                        </span>
                        <span className="w-6 text-right">{c}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <p className="mt-4 text-lg text-foreground">Seja o primeiro a compartilhar sua experiência com a Gás Brasil.</p>
            )}
          </div>
        </div>

        <div>
          {showForm && <ReviewForm />}
          {featured && (
            <figure className={`${showForm ? "mt-12" : ""} border-l-4 border-secondary pl-6 md:pl-8`}>
              <Stars value={featured.rating} size="h-5 w-5" />
              <blockquote className="mt-4 font-display text-2xl font-semibold leading-snug text-foreground md:text-3xl">“{featured.comment}”</blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground"><strong className="text-foreground">{featured.display_name}</strong> · {fmt(featured.created_at)}</figcaption>
            </figure>
          )}
          {rest.length > 0 && (
            <ul className="mt-10 divide-y divide-border">
              {rest.map((r) => (
                <li key={r.id} className="py-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong>{r.display_name}</strong>
                    <span className="flex items-center gap-3 text-xs text-muted-foreground"><Stars value={r.rating} />{fmt(r.created_at)}</span>
                  </div>
                  <p className="mt-2 text-muted-foreground">{r.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function ReviewForm() {
  const submit = useServerFn(submitReview);
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [serverError, setServerError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    const parsed = reviewInputSchema.safeParse({ display_name: name, rating, comment, consent_to_publish: consent });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[String(i.path[0])] ??= i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await submit({ data: { ...parsed.data, website } });
      if (res.ok) { setStatus("done"); router.invalidate(); }
      else { setServerError(res.error); setStatus("idle"); }
    } catch {
      setServerError("Não foi possível enviar sua avaliação agora. Tente novamente.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="animate-rise flex gap-4 border-l-4 border-primary bg-surface p-6">
        <CheckCircle2 className="h-7 w-7 shrink-0 text-primary" />
        <p className="text-lg">Obrigado por avaliar a Gás Brasil! Sua avaliação foi recebida e ficará disponível após nossa aprovação.</p>
      </div>
    );
  }

  const label = ["", "Ruim", "Regular", "Bom", "Muito bom", "Excelente"];
  return (
    <form id="form-avaliacao" onSubmit={onSubmit} noValidate className="animate-rise space-y-6 bg-surface p-6 shadow-soft md:p-8">
      <p className="text-lg font-semibold">Conte como foi sua experiência com a Gás Brasil.</p>
      <div className="hidden" aria-hidden="true">
        <label>Site <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Sua nota</legend>
        <div className="flex items-center gap-1" role="radiogroup" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} ${n === 1 ? "estrela" : "estrelas"}`} onClick={() => setRating(n)} onMouseEnter={() => setHover(n)} className="p-1 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-ring">
              <Star className={`h-8 w-8 ${(hover || rating) >= n ? "fill-star text-star" : "fill-transparent text-input"}`} />
            </button>
          ))}
          <span className="ml-3 text-sm text-muted-foreground">{label[hover || rating]}</span>
        </div>
        {errors.rating && <p className="mt-1 text-sm text-destructive">{errors.rating}</p>}
      </fieldset>
      <div>
        <label htmlFor="rv-name" className="mb-1.5 block text-sm font-medium">Nome ou nome de exibição</label>
        <input id="rv-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} className="w-full rounded-sm border border-input bg-background px-3 py-2.5 outline-none focus:border-primary" />
        {errors.display_name && <p className="mt-1 text-sm text-destructive">{errors.display_name}</p>}
      </div>
      <div>
        <label htmlFor="rv-comment" className="mb-1.5 block text-sm font-medium">Comentário sobre o atendimento</label>
        <textarea id="rv-comment" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={1000} rows={4} className="w-full resize-y rounded-sm border border-input bg-background px-3 py-2.5 outline-none focus:border-primary" />
        <div className="flex justify-between text-xs text-muted-foreground"><span className="text-destructive">{errors.comment}</span><span>{comment.length}/1000</span></div>
      </div>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--primary)]" />
        <span>Autorizo a publicação do meu nome de exibição, nota e comentário no site da Gás Brasil, conforme a <Link to="/privacidade" className="font-medium text-primary underline">política de privacidade</Link>.</span>
      </label>
      {errors.consent_to_publish && <p className="-mt-4 text-sm text-destructive">{errors.consent_to_publish}</p>}
      {serverError && <p role="alert" className="text-sm text-destructive">{serverError}</p>}
      <button type="submit" disabled={status === "sending"} className="w-full rounded-sm bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:bg-primary-deep disabled:opacity-60 sm:w-auto">
        {status === "sending" ? "Enviando…" : "Enviar avaliação"}
      </button>
    </form>
  );
}
