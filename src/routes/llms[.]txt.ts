import { createFileRoute } from "@tanstack/react-router";
import { absUrl, PAGES, SITE_URL } from "@/lib/seo";
import { ADDRESS_CITY, ADDRESS_LINE, PHONE_DISPLAY } from "@/lib/site";

/** llms.txt: índice opcional em Markdown para sistemas de IA. Não é fator de ranqueamento do Google. */
export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: () => {
        const link = (p: { path: string; label: string; description: string }) => `- [${p.label}](${absUrl(p.path)}): ${p.description}`;
        const body = `# Gás Brasil

> Revenda e entrega de gás com atendimento em toda Bauru/SP. Entrega, instalação (consulte a disponibilidade) e retirada no local. Trabalha com produtos Liquigás.

Endereço: ${ADDRESS_LINE}, ${ADDRESS_CITY}
Telefone/WhatsApp: ${PHONE_DISPLAY}
Site: ${SITE_URL}/

## Páginas
${[PAGES.home, PAGES.sobre, PAGES.contato, PAGES.seguranca, PAGES.gasDoPovo].map(link).join("\n")}

## Legal
${[PAGES.privacidade, PAGES.termos].map(link).join("\n")}

## Fontes oficiais citadas
- [ANP — Cartilha GLP: 10 orientações](https://www.gov.br/anp/pt-br/centrais-de-conteudo/publicacoes/cartilhas-e-guias/arq/gas-botijao-glp-10-orientacoes/cartilha-glp.pdf)
- [Agência gov — Perguntas e respostas sobre o Gás do Povo](https://agenciagov.ebc.com.br/noticias/202510/perguntas-respostas-saiba-como-vai-funcionar-programa-gas-do-povo)
`;
        return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
      },
    },
  },
});
