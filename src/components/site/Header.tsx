import React, { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo-gas-brasil.asset.json";
import { NAV, MSG, wa } from "@/lib/site";
import { WhatsAppIcon } from "./icons";
import { motion } from "motion/react";
import { SPRING } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("inicio");
  const [hovered, setHovered] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach((n) => { const el = document.getElementById(n.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  // Fecha o menu ao tocar fora ou apertar Esc.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setOpen(false);
    // espera o menu terminar de fechar para a rolagem não competir com a animação
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }, 220);
  };

  return (
    <motion.header
      ref={headerRef}
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={SPRING}
      className="glass-pill fixed inset-x-3 top-3 z-50 mx-auto max-w-6xl rounded-[1.75rem] md:inset-x-6 md:top-4"
    >
      <div className="grid h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 pl-4 pr-2 lg:pl-5">
        <a href="#inicio" className="flex shrink-0 items-center gap-2" aria-label="Gás Brasil — início">
          <img src={logo.url} alt="Gás Brasil" width={120} height={48} className="h-10 w-auto rounded-lg mix-blend-multiply" />
        </a>
        <nav aria-label="Principal" className="hidden justify-self-center lg:block">
          <ul className="flex items-center gap-1 whitespace-nowrap" onMouseLeave={() => setHovered(null)}>
            {NAV.map((n) => {
              const highlighted = (hovered ?? active) === n.id;
              return (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onMouseEnter={() => setHovered(n.id)}
                    onFocus={() => setHovered(n.id)}
                    aria-current={active === n.id ? "true" : undefined}
                    className={`relative rounded-full px-3 py-2 text-sm xl:px-3.5 font-medium transition-colors duration-200 ${highlighted ? "text-primary" : "text-foreground/80"}`}
                  >
                    {n.label}
                    {highlighted && (
                      <motion.span
                        layoutId="nav-underline"
                        transition={SPRING}
                        className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-secondary"
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="col-start-3 flex shrink-0 items-center gap-2">
          <a href={wa(MSG.hero)} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground whitespace-nowrap transition hover:bg-primary-deep sm:inline-flex">
            <WhatsAppIcon className="h-4 w-4" /> Pedir gás
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 transition-transform active:scale-90 lg:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="menu-movel"
          >
            <span className="relative block h-6 w-6">
              <Menu className={`absolute inset-0 h-6 w-6 transition duration-200 ${open ? "rotate-90 opacity-0" : "opacity-100"}`} />
              <X className={`absolute inset-0 h-6 w-6 transition duration-200 ${open ? "opacity-100" : "-rotate-90 opacity-0"}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Menu do celular: painel que desce da barra (só opacity/transform) */}
      <nav
        id="menu-movel"
        aria-label="Menu móvel"
        aria-hidden={!open}
        data-open={open}
        className="mobile-menu absolute inset-x-0 top-[calc(100%+0.5rem)] overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-surface shadow-soft lg:hidden"
        {...(!open ? { inert: true } : {})}
      >
        <ul className="grid px-4 py-3">
          {NAV.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} onClick={(e) => go(e, n.id)} className={`block rounded-xl px-3 py-3 text-base font-medium transition-colors duration-200 active:bg-primary/15 ${active === n.id ? "text-primary" : "text-foreground"}`}>{n.label}</a>
            </li>
          ))}
        </ul>
        <div className="px-4 pb-4 sm:hidden">
          <a href={wa(MSG.hero)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
            <WhatsAppIcon className="h-4 w-4" /> Pedir gás
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
