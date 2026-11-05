# Relatório SEO — Gás Brasil (Bauru/SP) — 04/11/2026

URL usada: https://screenshot-to-spark-6156.lovable.app (atual). Domínio futuro: https://gasbrasilbauru.com.br
**Para trocar:** edite uma linha em `src/lib/seo.ts` (`DEFAULT_SITE_URL`) ou defina `VITE_SITE_URL`. Canonical, og:url, sitemap, robots, llms.txt e JSON-LD seguem automaticamente.

## 1. Stack e renderização
TanStack Start (React 19, Vite, Tailwind 4), SSR ativo, Supabase (avaliações), deploy Lovable. O HTML inicial já traz todo o conteúdo (conferido com curl).

## 2. Problemas encontrados (antes)
| Prior. | Problema |
|---|---|
| Crítico | canonical e og:url relativos ("/") |
| Crítico | sem sitemap.xml; robots.txt sem `Sitemap:`; grupos por bot que anulariam qualquer Disallow do `*` |
| Alto | respostas do FAQ ausentes do HTML (accordion fechado não renderiza texto) |
| Alto | sem og:image / twitter:image; JSON-LD sem @id, logo, WebSite, breadcrumb |
| Alto | só 2 páginas indexáveis (home e /privacidade); sem páginas institucionais, termos ou rodapé com elas |
| Médio | H1 lido por robôs como "Bauru Bauru Bauru sua casa todo bairro minutos sua porta…" (palavras animadas) |
| Médio | hero 1600px JPEG único (191 KB) sem srcset/preload |
| Médio | title da home com 64 caracteres; meta genérica no root |
| Médio | contraste do laranja da marca (2,6–2,8:1) — decisão de design, não alterado |

## 3. Correções realizadas (verificadas no código e no HTML servido)
- `src/lib/seo.ts`: URL única, registro de páginas, `pageHead()` (title, description, canonical absoluto, OG, Twitter, JSON-LD), nós Schema.org.
- Novas páginas (todas no rodapé): `/sobre`, `/seguranca-gas`, `/gas-do-povo`, `/contato`, `/termos`; `/privacidade` migrada para o mesmo layout.
- Rodapé compartilhado (`PageShell.tsx`) com Institucional, Legal e seções da home; cabeçalho simples e breadcrumbs nas subpáginas; links internos contextuais na home.
- `sitemap.xml`, `robots.txt`, `llms.txt` como rotas do app (gerados do mesmo registro); `public/robots.txt` removido.
- FAQ da home em `<details>` nativo (mesmo visual, respostas no HTML, exclusivo, sem JS).
- H1 limpo: "Entrega de gás em Bauru com rapidez e praticidade." (palavras animadas via CSS).
- Hero em WebP com srcset (29–94 KB) + preload; `og-gas-brasil.jpg` 1200×630.

## 4. Estrutura final
`/` · `/sobre` · `/seguranca-gas` · `/gas-do-povo` · `/contato` · `/privacidade` · `/termos`. Fora do índice: `/auth` (noindex), `/admin/*` (noindex + Disallow).

## 5. Validação (docs/seo/validate_seo.py contra o servidor local)
7/7 páginas: HTTP 200, 1 H1, title 34–49 car., description 104–148, canonical absoluto = URL do sitemap, OG/Twitter completos, JSON-LD parseável com @id resolvidos, sem noindex, sem duplicatas, todos os links internos 200, 404 real em URL inexistente. Sitemap: 7 URLs únicas, lastmod W3C, robots declara o sitemap.
`tsc` limpo · `vitest` 7/7 · `vite build` OK.
Lighthouse (dev server, local): subpáginas Acessibilidade 100 / SEO 100 / Boas práticas 96; home Acessibilidade 96 / SEO 100 (única falha: contraste do laranja).
Validador oficial do Google (Rich Results Test) e PageSpeed **não foram executados** (sem acesso externo).

## 6. Performance — limites da medição
Não foi possível medir LCP/INP/CLS reais: a sandbox bloqueia Google Fonts e Supabase (a home espera o loader de avaliações ~7 s aqui; em produção depende da latência do Supabase). Melhorias aplicadas: imagem do hero responsiva + preload + `decoding=async`. Pendente medir em produção: CSS de Google Fonts bloqueia renderização (considerar fontes próprias); loader de avaliações bloqueia o SSR (considerar timeout/streaming).

## 7. Dados verificados na pesquisa
- Endereço e telefone batem com a listagem do Solutudo ("Gás Brasil - Liquigás", Av. Nuno de Assis, 1166, (14) 99177-7941). Fonte de diretório, pode estar desatualizada.
- Segurança: ANP, cartilha "Gás de botijão (GLP): 10 orientações" e página de dicas ao consumidor. Gás do Povo: Agência gov (out/2025).
- Concorrentes locais listados no Solutudo (ex.: Ultragaz, Dinho Gás, Salim Gás, Jacaré Gás, Nosso Gás, PeguiGás/Liquigás) — só existência; **não** foi feita análise técnica deles nem estimativa de volume de busca.
- Sem Search Console, Keyword Planner ou volume de busca: nenhum número de busca foi inventado.
- Não confirmado: relação formal com a Liquigás (o site diz "trabalhamos com produtos Liquigás"; usei exatamente essa frase), página oficial no Facebook (robots bloqueou a leitura; por isso **sem sameAs**).

## 8. Schema.org implementado
LocalBusiness (@id, endereço, telefone, logo, areaServed, hasMap, contactPoint, makesOffer), WebSite, WebPage/AboutPage/ContactPage, BreadcrumbList, Article (segurança). **Não** incluídos: aggregateRating/Review (nota 4,8 é própria/Google), geo, horários, sameAs, FAQPage (sem rich result desde 05/2026). Exemplo: `jsonld-home.json`.

## 9. IA / GEO
Conteúdo claro e citável no HTML, fontes oficiais linkadas, entidade identificada. `llms.txt` publicado (opcional; o Google diz que não ajuda nem atrapalha). Nenhuma regra de crawler de IA foi alterada: todos seguem permitidos como antes — treinamento é decisão sua.

## 10. Pendências (dependem de você / acesso externo)
1. Publicar o domínio e trocar `DEFAULT_SITE_URL`; configurar redirecionamento do domínio lovable.app para o definitivo.
2. Search Console (verificar propriedade, enviar sitemap) e Bing Webmaster.
3. Informar razão social, CNPJ, número de autorização ANP e horário de atendimento (sinais de confiança; hoje omitidos de propósito).
4. Confirmar com a Liquigás/ANP a relação comercial antes de usar "revendedor autorizado".
5. Perfil do Google Meu Negócio e Facebook oficial: confirmar URLs e então adicionar `sameAs`; confirmar coordenadas para `geo`.
6. Revisar `/termos` e `/privacidade` com advogado (texto é genérico/informativo).
7. Decidir o contraste do laranja (#ef7926) para WCAG AA (texto branco sobre laranja 2,8:1).
8. Medir PageSpeed/CrUX em produção; hospedar fontes; logo em `/public` (hoje vem de `/__l5e/…`, caminho do Lovable).
9. Cabeçalhos de segurança (CSP, HSTS, etc.) dependem da hospedagem.
