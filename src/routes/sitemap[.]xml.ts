import { createFileRoute } from "@tanstack/react-router";
import { absUrl, SITEMAP_PAGES } from "@/lib/seo";

/** sitemap.xml gerado a partir do registro de páginas públicas e indexáveis (src/lib/seo.ts). */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const urls = SITEMAP_PAGES.map((p) => `  <url>\n    <loc>${absUrl(p.path)}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n  </url>`).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
        return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" } });
      },
    },
  },
});
