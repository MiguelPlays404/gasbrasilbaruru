import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, Phone } from "lucide-react";
import logo from "@/assets/logo-gas-brasil.asset.json";
import { WhatsAppIcon } from "./icons";
import { ADDRESS_CITY, ADDRESS_LINE, MAPS_URL, MSG, NAV, PHONE_DISPLAY, PHONE_TEL, wa } from "@/lib/site";
import { PAGES } from "@/lib/seo";

const INSTITUTIONAL = [PAGES.sobre, PAGES.seguranca, PAGES.gasDoPovo, PAGES.contato] as const;
const LEGAL = [PAGES.privacidade, PAGES.termos] as const;

/** Rodapé único do site (home e páginas institucionais). */
export function SiteFooter() {
  return (
    <footer className="bg-foreground py-14 text-background">
      <div className="container-page grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <img src={logo.url} alt="Gás Brasil" width={140} height={56} loading="lazy" className="h-14 w-auto rounded-sm bg-background p-1" />
          <p className="mt-4 text-background/70">Revenda e entrega de gás com atendimento em toda Bauru.</p>
        </div>
        <div className="space-y-2">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-background/60">Contato</p>
          <a href={PHONE_TEL} className="flex items-center gap-2 hover:text-secondary"><Phone className="h-4 w-4" aria-hidden="true" /> {PHONE_DISPLAY}</a>
          <a href={wa(MSG.final)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-secondary"><WhatsAppIcon className="h-4 w-4" /> WhatsApp</a>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 hover:text-secondary"><MapPin className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" /> {ADDRESS_LINE}, {ADDRESS_CITY}</a>
        </div>
        <nav aria-label="Institucional">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-background/60">Institucional</p>
          <ul className="mt-3 space-y-2 text-background/80">
            {INSTITUTIONAL.map((p) => (
              <li key={p.path}><Link to={p.path} className="hover:text-secondary">{p.label}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Rodapé">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-background/60">No site</p>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-background/80">
            {NAV.map((n) => <li key={n.id}><Link to="/" hash={n.id} className="hover:text-secondary">{n.label}</Link></li>)}
          </ul>
          <ul className="mt-4 space-y-2 border-t border-background/15 pt-4 text-background/80">
            {LEGAL.map((p) => (
              <li key={p.path}><Link to={p.path} className="hover:text-secondary">{p.label}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="container-page mt-10 border-t border-background/15 pt-6 text-sm text-background/60">© {new Date().getFullYear()} Gás Brasil. Todos os direitos reservados.</p>
    </footer>
  );
}

function SubHeader() {
  return (
    <header className="sticky top-3 z-50 mx-3 md:mx-6">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 rounded-[1.75rem] border border-white/25 bg-card/70 pl-4 pr-3 shadow-soft backdrop-blur-md backdrop-saturate-150 lg:pl-5">
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="Gás Brasil — página inicial">
          <img src={logo.url} alt="Gás Brasil" width={120} height={48} className="h-10 w-auto rounded-lg" />
        </Link>
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1 whitespace-nowrap text-sm font-medium">
            {[PAGES.home, ...INSTITUTIONAL].map((p) => (
              <li key={p.path}>
                <Link to={p.path} activeOptions={{ exact: true }} className="flex h-10 items-center rounded-full px-3.5 text-foreground/80 transition-colors hover:text-primary [&.active]:text-primary" activeProps={{ "aria-current": "page" }}>{p.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a href={wa(MSG.hero)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground whitespace-nowrap transition hover:bg-primary-deep sm:px-5">
            <WhatsAppIcon className="h-4 w-4" /> Pedir gás
          </a>
          <details className="group relative lg:hidden">
            <summary className="flex h-10 cursor-pointer list-none items-center rounded-full px-3 text-sm font-semibold text-foreground marker:hidden hover:bg-primary/10 hover:text-primary [&::-webkit-details-marker]:hidden">Menu</summary>
            <ul className="absolute right-0 top-12 grid w-56 gap-1 rounded-2xl border border-border bg-card p-2 shadow-soft">
              {[PAGES.home, ...INSTITUTIONAL].map((p) => (
                <li key={p.path}><Link to={p.path} className="block rounded-xl px-3 py-2.5 font-semibold hover:bg-primary/10 hover:text-primary">{p.label}</Link></li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </header>
  );
}

/** Estrutura das páginas institucionais: cabeçalho, migalhas de pão, conteúdo e rodapé. */
export function PageShell({ crumb, title, lead, children }: { crumb: string; title: string; lead: string; children: ReactNode }) {
  return (
    <>
      <SubHeader />
      <main id="conteudo" className="container-page max-w-3xl py-12 md:py-20">
        <nav aria-label="Você está em" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link to="/" className="font-semibold text-primary hover:underline">Início</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page">{crumb}</li>
          </ol>
        </nav>
        <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] md:text-5xl">{title}</h1>
        <p className="mt-5 text-xl text-muted-foreground">{lead}</p>
        <div className="mt-10 space-y-5 text-lg leading-relaxed text-muted-foreground [&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_ul]:space-y-2">
          {children}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
