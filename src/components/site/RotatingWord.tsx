import { useEffect, useRef, useState } from "react";

/**
 * Palavra verde do título do hero que troca sozinha.
 * - Sempre verde (text-primary), nunca muda de cor.
 * - Anima só transform + opacity (leve para Android fraco).
 * - A largura do espaço acompanha a palavra atual, então "com rapidez e
 *   praticidade." fica sempre colado, sem buraco.
 * - "Bauru" fica escondido em texto para leitores de tela e para o Google.
 */
const WORDS = ["Bauru", "sua casa", "todo bairro", "minutos", "sua porta"] as const;
const INTERVAL = 2600;

export function RotatingWord() {
  const [{ index, prev }, setPos] = useState({ index: 0, prev: -1 });
  const [widths, setWidths] = useState<number[] | null>(null);
  const sizers = useRef<(HTMLSpanElement | null)[]>([]);

  // Mede a largura real de cada palavra (com a fonte já carregada).
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const next = sizers.current.map((el) => (el ? Math.ceil(el.getBoundingClientRect().width) + 1 : 0));
        if (next.some((w) => w <= 0)) return;
        setWidths((old) => (old && old.every((w, i) => w === next[i]) ? old : next));
      });
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Troca a palavra a cada INTERVAL. Pausa se a aba estiver escondida
  // ou se a pessoa pediu menos animação no aparelho.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id: number | undefined;
    const stop = () => {
      if (id !== undefined) window.clearInterval(id);
      id = undefined;
    };
    const start = () => {
      stop();
      id = window.setInterval(
        () => setPos((p) => ({ index: (p.index + 1) % WORDS.length, prev: p.index })),
        INTERVAL,
      );
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <span className="relative inline-block align-baseline">
      <span className="sr-only">Bauru</span>
      <span
        aria-hidden="true"
        className="rotating-slot text-primary"
        style={widths ? { width: widths[index] } : undefined}
      >
        &#8203;
        {!widths && <span className="invisible">{WORDS[0]}</span>}
        {WORDS.map((word, i) => (
          <span
            key={word}
            className="rotating-word"
            data-state={i === index ? "active" : i === prev ? "out" : "idle"}
          >
            {word}
          </span>
        ))}
      </span>
      {/* Medidores invisíveis (só para calcular a largura de cada palavra) */}
      <span aria-hidden="true" className="pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap">
        {WORDS.map((word, i) => (
          <span key={word} ref={(el) => { sizers.current[i] = el; }} className="inline-block">
            {word}
          </span>
        ))}
      </span>
    </span>
  );
}
