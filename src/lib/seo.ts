import logo from "@/assets/logo-gas-brasil.asset.json";
import { ADDRESS_CITY, CYLINDERS, MAPS_URL } from "@/lib/site";

/**
 * URL pública do site. É a ÚNICA fonte para canonical, og:url, sitemap, robots e JSON-LD.
 * Quando o domínio definitivo estiver no ar, troque só o valor abaixo (ou defina VITE_SITE_URL):
 *   https://gasbrasilbauru.com.br
 */
const DEFAULT_SITE_URL = "https://screenshot-to-spark-6156.lovable.app";
export const SITE_URL = ((import.meta.env["VITE_SITE_URL"] as string | undefined) || DEFAULT_SITE_URL).replace(/\/+$/, "");

export const absUrl = (path: string) => `${SITE_URL}${path === "/" ? "/" : path}`;

export const SITE_NAME = "Gás Brasil";
export const OG_IMAGE = absUrl("/og-gas-brasil.jpg");
export const OG_ALT = "Entregador da Gás Brasil levando um botijão até a porta de uma casa em Bauru";

/** Páginas públicas e indexáveis. `lastmod` = data da última alteração real de conteúdo. */
export type SeoPage = { path: string; title: string; description: string; lastmod: string; label: string };

export const PAGES = {
  home: {
    path: "/",
    label: "Início",
    title: "Gás Brasil — Entrega de gás em Bauru/SP",
    description:
      "Entrega, instalação e retirada de gás em toda Bauru. Botijões P-8, P-13, P-20 e P-45, Gás do Povo e parcelamento em até 3x. Peça pelo WhatsApp.",
    lastmod: "2026-11-04",
  },
  sobre: {
    path: "/sobre",
    label: "Sobre a Gás Brasil",
    title: "Sobre a Gás Brasil — revenda de gás em Bauru",
    description:
      "Conheça a Gás Brasil: revenda e entrega de gás em Bauru/SP, com entrega, instalação e retirada no local. Endereço, produtos e formas de atendimento.",
    lastmod: "2026-11-04",
  },
  seguranca: {
    path: "/seguranca-gas",
    label: "Segurança com gás",
    title: "Segurança com botijão de gás: orientações da ANP",
    description:
      "Resumo das orientações oficiais da ANP para comprar, instalar e guardar o botijão de gás de cozinha e o que fazer em caso de suspeita de vazamento.",
    lastmod: "2026-11-04",
  },
  gasDoPovo: {
    path: "/gas-do-povo",
    label: "Gás do Povo",
    title: "Gás do Povo: como funciona o benefício do botijão",
    description:
      "Entenda o programa Gás do Povo do Governo Federal: quem tem direito, como o vale é usado na revenda e onde consultar as regras oficiais.",
    lastmod: "2026-11-04",
  },
  contato: {
    path: "/contato",
    label: "Contato",
    title: "Contato e localização — Gás Brasil, Bauru/SP",
    description:
      "Fale com a Gás Brasil pelo WhatsApp ou telefone (14) 99177-7941. Av. Dr. Nuno de Assis, 1166, Centro, Bauru/SP. Veja como chegar.",
    lastmod: "2026-11-04",
  },
  privacidade: {
    path: "/privacidade",
    label: "Política de privacidade",
    title: "Política de privacidade — Gás Brasil",
    description:
      "Como a Gás Brasil coleta, utiliza e publica os dados das avaliações enviadas pelo site, conforme a LGPD.",
    lastmod: "2026-11-04",
  },
  termos: {
    path: "/termos",
    label: "Termos de uso",
    title: "Termos de uso do site — Gás Brasil",
    description:
      "Condições de uso do site da Gás Brasil: natureza informativa, pedidos e disponibilidade confirmados com a equipe, avaliações e links externos.",
    lastmod: "2026-11-04",
  },
} satisfies Record<string, SeoPage>;

export const SITEMAP_PAGES: SeoPage[] = Object.values(PAGES);

// ---------- JSON-LD (somente dados verificados no próprio site) ----------
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function organizationNode() {
  return {
    "@type": "LocalBusiness",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: absUrl("/"),
    description: "Revenda e entrega de gás com atendimento em toda Bauru/SP.",
    logo: { "@type": "ImageObject", url: absUrl(logo.url) },
    image: OG_IMAGE,
    telephone: "+5514991777941",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Dr. Nuno de Assis, 1166",
      addressLocality: "Bauru",
      addressRegion: "SP",
      postalCode: "17010-120",
      addressCountry: "BR",
    },
    areaServed: { "@type": "City", name: "Bauru", containedInPlace: { "@type": "AdministrativeArea", name: "São Paulo" } },
    hasMap: MAPS_URL,
    contactPoint: { "@type": "ContactPoint", telephone: "+5514991777941", contactType: "customer service", availableLanguage: "pt-BR", areaServed: "BR-SP" },
    makesOffer: CYLINDERS.map(({ model, kg }) => ({ "@type": "Offer", itemOffered: { "@type": "Product", name: `Botijão ${model} (${kg} kg)` } })),
  };
}

export const websiteNode = () => ({
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: absUrl("/"),
  name: SITE_NAME,
  inLanguage: "pt-BR",
  publisher: { "@id": ORG_ID },
});

export function webPageNode(page: SeoPage, type: "WebPage" | "AboutPage" | "ContactPage" = "WebPage") {
  const url = absUrl(page.path);
  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    inLanguage: "pt-BR",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    dateModified: page.lastmod,
    ...(page.path === "/" ? {} : { breadcrumb: { "@id": `${url}#breadcrumb` } }),
  };
}

export function breadcrumbNode(page: SeoPage) {
  const url = absUrl(page.path);
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: PAGES.home.label, item: absUrl("/") },
      { "@type": "ListItem", position: 2, name: page.label, item: url },
    ],
  };
}

type Head = {
  meta: Array<Record<string, string>>;
  links: Array<Record<string, string>>;
  scripts: Array<{ type: string; children: string }>;
};

/** Monta title, description, canonical absoluto, Open Graph, Twitter Card e JSON-LD de uma página. */
export function pageHead(page: SeoPage, opts: { type?: "website" | "article"; schema: object[] }): Head {
  const url = absUrl(page.path);
  return {
    meta: [
      { title: page.title },
      { name: "description", content: page.description },
      { property: "og:title", content: page.title },
      { property: "og:description", content: page.description },
      { property: "og:type", content: opts.type ?? "website" },
      { property: "og:url", content: url },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: OG_ALT },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: page.title },
      { name: "twitter:description", content: page.description },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({ "@context": "https://schema.org", "@graph": opts.schema }).replace(/</g, "\\u003c"),
      },
    ],
  };
}

export const FULL_ADDRESS = `Av. Dr. Nuno de Assis, 1166 - Centro, ${ADDRESS_CITY}`;
