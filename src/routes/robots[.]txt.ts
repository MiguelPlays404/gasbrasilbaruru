import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () => {
        // Um único grupo (*): vale para Googlebot, Bingbot e demais rastreadores. Nenhuma regra específica
        // para crawlers de IA foi adicionada (políticas de treinamento dependem de decisão do responsável).
        const txt = `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
        return new Response(txt, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
      },
    },
  },
});
