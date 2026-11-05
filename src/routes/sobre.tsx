import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { breadcrumbNode, organizationNode, PAGES, pageHead, webPageNode, websiteNode } from "@/lib/seo";
import { ADDRESS_CITY, ADDRESS_LINE, CYLINDERS, MAPS_URL, MSG, PHONE_DISPLAY, wa } from "@/lib/site";

const P = PAGES.sobre;

export const Route = createFileRoute("/sobre")({
  head: () => pageHead(P, { schema: [organizationNode(), websiteNode(), webPageNode(P, "AboutPage"), breadcrumbNode(P)] }),
  component: Sobre,
});

function Sobre() {
  return (
    <PageShell crumb="Sobre a Gás Brasil" title="Sobre a Gás Brasil" lead="Revenda e entrega de gás com atendimento em toda Bauru/SP, com entrega, instalação e retirada no local.">
      <h2>Quem somos</h2>
      <p>A Gás Brasil trabalha para tornar o acesso ao gás mais simples e prático para quem vive em Bauru. Com atendimento próximo, oferecemos diferentes formas de receber o pedido: com entrega, instalação ou retirada diretamente no estabelecimento.</p>

      <h2>Como atendemos</h2>
      <ul>
        <li><strong>Entrega:</strong> peça pelo WhatsApp e receba em casa, em toda a cidade de Bauru.</li>
        <li><strong>Instalação:</strong> consulte a disponibilidade do serviço com a nossa equipe.</li>
        <li><strong>Retirada no local:</strong> você também pode buscar o botijão no estabelecimento.</li>
      </ul>
      <p>Disponibilidade, valores e condições de pagamento são confirmados diretamente com a equipe pelo <a href={wa(MSG.entrega)} target="_blank" rel="noopener noreferrer">WhatsApp</a> ou pelo telefone {PHONE_DISPLAY}.</p>

      <h2>Produtos</h2>
      <p>Trabalhamos com produtos Liquigás. As opções de botijão apresentadas são {CYLINDERS.map((c) => `${c.model} (${c.kg} kg)`).join(", ")}. Consulte a disponibilidade de cada tamanho antes de pedir. Para orientações de uso e armazenamento, veja a página <Link to="/seguranca-gas">Segurança com botijão de gás</Link>.</p>
      <p>Liquigás é marca de seus respectivos titulares; a menção serve apenas para informar a linha de produtos com que a Gás Brasil trabalha.</p>

      <h2>Benefício Gás do Povo e pagamento</h2>
      <p>A Gás Brasil informa que atende pelo benefício Gás do Povo e que é possível parcelar em até 3 vezes, conforme as condições de pagamento. Veja como o programa funciona na página <Link to="/gas-do-povo">Gás do Povo</Link>.</p>

      <h2>Onde estamos</h2>
      <address className="not-italic">
        <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">{ADDRESS_LINE}, {ADDRESS_CITY}</a>
      </address>
      <p>Mais formas de falar com a gente em <Link to="/contato">Contato e localização</Link>.</p>
    </PageShell>
  );
}
