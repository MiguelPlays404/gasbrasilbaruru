import { useEffect, useId, useRef } from "react";

/**
 * Liquid Glass de verdade (refração nas bordas), igual ao da imagem:
 * o meio do vidro fica NÍTIDO (sem desfoque) e só a borda "dobra" o que está atrás,
 * como uma lente. Funciona escrevendo um mapa de deslocamento (feImage) que é
 * aplicado no backdrop-filter do elemento.
 *
 * - Só liga em Chrome/Edge/Android Chrome (únicos que aceitam url() no backdrop-filter).
 * - Em aparelho fraco (poucos núcleos/pouca RAM) NÃO liga: fica o vidro limpo, leve.
 * - Em Safari/Firefox também cai no vidro limpo (translúcido, sem desfoque forte).
 */
function supportsRefraction() {
  if (typeof window === "undefined" || typeof CSS === "undefined") return false;
  const ua = navigator.userAgent;
  if (/CriOS|FxiOS|EdgiOS/.test(ua)) return false; // navegadores de iPhone usam WebKit
  if (!/Chrome\/|Chromium\/|Edg\//.test(ua) || /Firefox\//.test(ua)) return false;
  if (!CSS.supports?.("backdrop-filter", "url(#a)")) return false;
  const n = navigator as Navigator & { deviceMemory?: number };
  if ((n.hardwareConcurrency && n.hardwareConcurrency <= 4) || (n.deviceMemory && n.deviceMemory <= 4)) return false;
  return true;
}

/** Mapa de deslocamento: neutro no meio, empurra para dentro perto da borda. */
function makeMap(w: number, h: number, r: number, bezel: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  const img = ctx.createImageData(w, h);
  const d = img.data;
  const hw = w / 2, hh = h / 2, ix = hw - r, iy = hh - r;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      let R = 128, G = 128;
      const side = Math.min(x + 0.5, w - x - 0.5, y + 0.5, h - y - 0.5);
      if (side < bezel) {
        const px = x + 0.5 - hw, py = y + 0.5 - hh;
        const qx = Math.abs(px) - ix, qy = Math.abs(py) - iy;
        const ox = Math.max(qx, 0), oy = Math.max(qy, 0);
        const len = Math.hypot(ox, oy);
        const dist = -(len + Math.min(Math.max(qx, qy), 0) - r);
        if (dist >= 0 && dist < bezel) {
          let nx: number, ny: number; // normal para fora
          if (qx > 0 && qy > 0) { nx = (Math.sign(px) * ox) / len; ny = (Math.sign(py) * oy) / len; }
          else if (qx > qy) { nx = Math.sign(px); ny = 0; }
          else { nx = 0; ny = Math.sign(py); }
          const t = 1 - dist / bezel;
          const m = t * t; // mais forte bem na borda, some suave para dentro
          R = Math.round(127.5 * (1 - nx * m));
          G = Math.round(127.5 * (1 - ny * m));
        }
      }
      d[i] = R; d[i + 1] = G; d[i + 2] = 128; d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL("image/png");
}

type Props = {
  targetRef: React.RefObject<HTMLElement | null>;
  /** largura da borda que dobra a imagem, em px */
  bezel?: number;
  /** quanto a borda desloca o fundo, em px */
  depth?: number;
};

export function LiquidGlassFilter({ targetRef, bezel = 16, depth = 18 }: Props) {
  const id = "lg-" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const imgRef = useRef<SVGFEImageElement>(null);

  useEffect(() => {
    const el = targetRef.current;
    const img = imgRef.current;
    if (!el || !img || !supportsRefraction()) return;
    const value = `url(#${id}) blur(var(--glass-blur, 1px)) saturate(1.4) brightness(1.06)`;
    let key = "";
    let timer = 0;
    // A lente só vale no celular/tablet. No computador a barra é fosca (ver styles.css).
    const mq = window.matchMedia("(max-width: 1023.98px)");

    const build = () => {
      const w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight);
      if (w < 16 || h < 16) return false; // escondido
      const r = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || h / 2, h / 2, w / 2);
      const k = `${w}x${h}x${r}`;
      if (k !== key) {
        const url = makeMap(w, h, r, bezel);
        if (!url) return false;
        key = k;
        img.setAttribute("href", url);
        img.setAttribute("width", String(w));
        img.setAttribute("height", String(h));
      }
      return true;
    };
    const clear = () => {
      el.style.removeProperty("-webkit-backdrop-filter");
      el.style.removeProperty("backdrop-filter");
    };
    const apply = () => {
      if (mq.matches && build()) {
        el.style.setProperty("-webkit-backdrop-filter", value);
        el.style.setProperty("backdrop-filter", value);
      } else {
        clear();
      }
    };

    apply();
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(apply, 120);
    });
    ro.observe(el);
    mq.addEventListener("change", apply);
    return () => {
      window.clearTimeout(timer);
      ro.disconnect();
      mq.removeEventListener("change", apply);
      clear();
    };
  }, [targetRef, id, bezel]);

  return (
    <svg aria-hidden="true" width="0" height="0" className="pointer-events-none absolute">
      <defs>
        <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feImage ref={imgRef} x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale={depth * 2} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}
