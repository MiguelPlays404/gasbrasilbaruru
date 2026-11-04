import React, { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-gas-brasil.asset.json";
import { NAV, MSG, wa, SPRING } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("inicio");
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLUListElement>(null);
  const [scrolling, setScrolling] = useState(false);
  const reducedMotion = useReducedMotion();
  const [underline, setUnderline] = useState({ x: 0, width: 0 });

  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout> | undefined;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let lastY = window.scrollY;
    let hidden = false;
    const onScroll = () => {
      if (window.scrollY === lastY) return;
      lastY = window.scrollY;
      setOpen(false);
      // some 0,4s depois que a rolagem começa; volta 0,4s depois que ela para
      clearTimeout(showTimer);
      showTimer = setTimeout(() => {
        hidden = false;
        setScrolling(false);
      }, 400);
      if (!hidden && !hideTimer) {
        hideTimer = setTimeout(() => {
          hideTimer = undefined;
          hidden = true;
          setScrolling(true);
        }, 400);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Seção atual = a que está na "linha de leitura" (um pouco abaixo do topo).
  // Ao clicar num item, ele fica travado como atual até a pessoa rolar sozinha.
  const lockRef = useRef<string | null>(null);
  useEffect(() => {
    const ids = NAV.map((n) => n.id);
    let raf = 0;
    const compute = () => {
      raf = 0;
      if (lockRef.current) { setActive(lockRef.current); return; }
      let id: string = ids[0] ?? "inicio";
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
        id = ids[ids.length - 1] ?? "inicio"; // chegou no fim da página
      } else {
        const line = Math.max(120, window.innerHeight * 0.35);
        for (const i of ids) {
          const el = document.getElementById(i);
          if (el && el.getBoundingClientRect().top <= line) id = i;
        }
      }
      setActive(id);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(compute); };
    const release = () => { if (lockRef.current) { lockRef.current = null; schedule(); } };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(e.key)) release();
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchstart", release, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchstart", release);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const select = (id: string) => { lockRef.current = id; setActive(id); };

  // Fecha o menu ao tocar fora ou apertar Esc.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!headerRef.current?.contains(t) && !menuRef.current?.contains(t)) setOpen(false);
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
    select(id);
    setOpen(false);
    // espera o menu terminar de fechar para a rolagem não competir com a animação
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }, 220);
  };

  // A aba em destaque: o item sob o mouse, ou o ativo quando o mouse sai.
  const [hover, setHover] = useState<string | null>(null);
  const target = hover ?? active;

  useEffect(() => {
    const tabs = tabsRef.current;
    if (!tabs) return;
    const measure = () => {
      const link = tabs.querySelector<HTMLAnchorElement>(`a[href="#${target}"]`);
      if (!link || !tabs.getClientRects().length) return;
      const rect = link.getBoundingClientRect();
      const parent = tabs.getBoundingClientRect();
      setUnderline({ x: rect.left - parent.left + 12, width: Math.max(0, rect.width - 24) });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(tabs);
    for (const link of tabs.querySelectorAll("a")) observer.observe(link);
    window.addEventListener("resize", measure);
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, [target]);

  return (
    <>
    <motion.header
      ref={headerRef}
      initial={false}
      animate={{ y: scrolling ? -110 : 0, opacity: scrolling ? 0 : 1 }}
      transition={reducedMotion ? { duration: 0 } : SPRING}
      data-scrolling={scrolling}
      {...(scrolling ? { inert: true } : {})}
      className="fixed inset-x-3 top-3 z-50 mx-auto max-w-6xl rounded-[1.75rem] border border-white/40 bg-card/50 shadow-[0_10px_30px_-18px_color-mix(in_oklab,var(--primary-deep)_45%,transparent)] backdrop-blur-2xl backdrop-saturate-150 md:inset-x-6 md:top-4"
    >
      <div className="grid h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 pl-4 pr-2 lg:pl-5">
        <a href="#inicio" className="flex shrink-0 items-center gap-2" aria-label="Gás Brasil — início">
          <img src={logo.url} alt="Gás Brasil" width={120} height={48} className="h-10 w-auto rounded-lg" />
        </a>

        {/* Abas do computador: sublinhado laranja que desliza, verde no hover/seleção */}
        <nav aria-label="Principal" className="hidden justify-self-center lg:block">
          <ul ref={tabsRef} className="relative flex items-center gap-1 whitespace-nowrap" onPointerLeave={() => setHover(null)}>
            {NAV.map((n) => (
              <li key={n.id} className="relative">
                <a
                  href={`#${n.id}`}
                  onPointerEnter={() => setHover(n.id)}
                  onFocus={() => setHover(n.id)}
                  onBlur={() => setHover(null)}
                  onClick={(e) => go(e, n.id)}
                  aria-current={target === n.id ? "true" : undefined}
                  className={`relative flex h-10 items-center rounded-full px-3.5 text-sm font-medium transition-colors duration-200 xl:px-4 ${target === n.id ? "text-primary" : "text-foreground/80 hover:text-primary"}`}
                >
                  {n.label}
                </a>
              </li>
            ))}
            <motion.li
              aria-hidden="true"
              data-nav-underline
              initial={false}
              animate={{ x: underline.x, width: underline.width }}
              transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 32, mass: 0.8 }}
              className="pointer-events-none absolute -bottom-0.5 left-0 h-[3px] rounded-full bg-secondary"
            />
          </ul>
        </nav>

        <div className="col-start-3 flex shrink-0 items-center gap-2">
          <a href={wa(MSG.hero)} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground whitespace-nowrap transition hover:bg-primary-deep sm:inline-flex">
            <WhatsAppIcon className="h-4 w-4" /> Pedir gás
          </a>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 transition-transform hover:bg-primary/10 hover:text-primary active:scale-90 lg:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="menu-movel"
          >
            <span className="relative block h-6 w-6">
              <Menu className={`absolute inset-0 h-6 w-6 transition duration-200 ${open ? "rotate-90 opacity-0" : "opacity-100"}`} />
              <X className={`absolute inset-0 h-6 w-6 transition duration-200 ${open ? "opacity-100" : "-rotate-90 opacity-0"}`} />
            </span>
          </Button>
        </div>
      </div>
    </motion.header>

    {/* Menu do celular/tablet: painel branco, verde no hover/seleção */}
    <nav
      ref={menuRef}
      id="menu-movel"
      aria-label="Menu móvel"
      aria-hidden={!open}
      data-open={open}
      className="mobile-menu fixed inset-x-3 top-[5.25rem] z-50 mx-auto max-w-6xl overflow-hidden rounded-[1.5rem] border border-white/40 bg-card/60 shadow-[0_12px_32px_-16px_color-mix(in_oklab,var(--primary-deep)_40%,transparent)] backdrop-blur-2xl backdrop-saturate-150 md:inset-x-6 md:top-[5.5rem] lg:hidden"
      {...(!open ? { inert: true } : {})}
    >
      <ul className="grid px-4 py-3">
        {NAV.map((n) => (
          <li key={n.id}>
            <a
              href={`#${n.id}`}
              onPointerEnter={() => setHover(n.id)}
              onPointerLeave={() => setHover((h) => (h === n.id ? null : h))}
              onClick={(e) => go(e, n.id)}
              className={`flex items-center justify-between rounded-xl px-3 py-3 text-base font-semibold transition-colors duration-200 ${hover === n.id || active === n.id ? "bg-primary/10 text-primary" : "text-foreground"}`}
            >
              {n.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="px-4 pb-4 sm:hidden">
        <a href={wa(MSG.hero)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
          <WhatsAppIcon className="h-4 w-4" /> Pedir gás
        </a>
      </div>
    </nav>
    </>
  );
}
