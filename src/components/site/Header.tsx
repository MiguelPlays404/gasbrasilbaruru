import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo-gas-brasil.asset.json";
import { NAV, MSG, wa } from "@/lib/site";
import { WhatsAppIcon } from "./icons";
import { AnimatePresence, motion } from "motion/react";
import { SPRING } from "@/lib/site";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("inicio");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach((n) => { const el = document.getElementById(n.id); if (el) obs.observe(el); });
    return () => { window.removeEventListener("scroll", onScroll); obs.disconnect(); };
  }, []);

  return (
    <>
    <svg aria-hidden="true" width="0" height="0" className="absolute"><filter id="liquid-glass-refract"><feTurbulence type="fractalNoise" baseFrequency="0.008 0.02" numOctaves="2" seed="3" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="10" xChannelSelector="R" yChannelSelector="G" /></filter></svg>
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1, scale: scrolled ? 0.985 : 1 }}
      transition={SPRING}
      className="glass-pill fixed inset-x-3 top-3 z-50 mx-auto max-w-6xl rounded-[1.75rem] md:inset-x-6 md:top-4"
    >
      <div className="flex h-16 items-center justify-between gap-4 pl-4 pr-2 md:pl-5">
        <a href="#inicio" className="flex items-center gap-2" aria-label="Gás Brasil — início">
          <img src={logo.url} alt="Gás Brasil" width={120} height={48} className="h-10 w-auto rounded-lg mix-blend-multiply" />
        </a>
        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-0.5 lg:gap-1">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  aria-current={active === n.id ? "true" : undefined}
                  className={`relative px-2 py-2 text-[13px] lg:px-3 lg:text-sm font-medium transition-colors hover:text-primary ${active === n.id ? "text-primary after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:bg-secondary" : "text-foreground/80"}`}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a href={wa(MSG.hero)} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-deep sm:inline-flex">
            <WhatsAppIcon className="h-4 w-4" /> Pedir gás
          </a>
          <button type="button" onClick={() => setOpen((v) => !v)} className="rounded-full p-2 transition active:scale-90 md:hidden" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open}>
            <motion.span key={open ? "x" : "m"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={SPRING} className="block">{open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</motion.span>
          </button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            key="m"
            aria-label="Menu móvel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={SPRING}
            className="overflow-hidden border-t border-foreground/10 md:hidden"
          >
            <ul className="grid px-5 py-3">
              {NAV.map((n, i) => (
                <motion.li key={n.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ ...SPRING, delay: i * 0.03 }}>
                  <a href={`#${n.id}`} onClick={() => setOpen(false)} className={`block py-3 text-base font-medium ${active === n.id ? "text-primary" : ""}`}>{n.label}</a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
    </>
  );
}
