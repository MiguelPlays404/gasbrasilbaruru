import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { breadcrumbNode, organizationNode, PAGES, pageHead, webPageNode, websiteNode } from "@/lib/seo";

const P = PAGES.termos;

export const Route = createFileRoute("/termos")({
  head: () => pageHead(P, { schema: [organizationNode(), websiteNode(), webPageNode(P), breadcrumbNode(P)] }),
  component: Termos,
});

function Termos() {
  return (
    <PageShell crumb="Termos de uso" title="Termos de uso" lead="Condições para o uso do site da Gás Brasil.">
      <h2>Natureza do site</h2>
      <p>Este site apresenta informações sobre a Gás Brasil, revenda e entrega de gás em Bauru/SP. As informações têm caráter informativo e não constituem proposta de venda.</p>

      <h2>Pedidos, disponibilidade e valores</h2>
      <p>Pedidos, disponibilidade de produtos, serviços de entrega, instalação ou retirada, valores e condições de pagamento são confirmados diretamente com a equipe da Gás Brasil, pelo WhatsApp ou por telefone, no momento do atendimento.</p>

      <h2>Contato por WhatsApp</h2>
      <p>Os botões do site abrem uma conversa no WhatsApp, serviço de terceiros sujeito aos próprios termos e à própria política de privacidade.</p>

      <h2>Avaliações</h2>
      <p>As avaliações enviadas pelo site passam por moderação antes de serem publicadas e são tratadas conforme a <Link to="/privacidade">Política de privacidade</Link>. Avaliações feitas no Google seguem as regras do próprio Google.</p>

      <h2>Marcas e conteúdo</h2>
      <p>Nomes e logotipos de terceiros, como Liquigás e Gás do Povo, pertencem aos respectivos titulares e são citados apenas para identificar produtos e programas relacionados ao atendimento. Informações sobre normas e programas públicos resumem fontes oficiais, indicadas nas respectivas páginas, e podem mudar.</p>

      <h2>Links externos</h2>
      <p>O site pode conter links para páginas de terceiros, como órgãos públicos e mapas. A Gás Brasil não controla o conteúdo desses sites.</p>

      <h2>Alterações</h2>
      <p>Estes termos podem ser atualizados a qualquer momento. A versão vigente é sempre a publicada nesta página.</p>

      <h2>Contato</h2>
      <p>Dúvidas sobre estes termos: veja <Link to="/contato">Contato e localização</Link>.</p>
    </PageShell>
  );
}
