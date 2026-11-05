import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { breadcrumbNode, organizationNode, PAGES, pageHead, webPageNode, websiteNode } from "@/lib/seo";
import { MSG, wa } from "@/lib/site";

const P = PAGES.gasDoPovo;
const FONTE = "https://agenciagov.ebc.com.br/noticias/202510/perguntas-respostas-saiba-como-vai-funcionar-programa-gas-do-povo";

export const Route = createFileRoute("/gas-do-povo")({
  head: () => pageHead(P, { schema: [organizationNode(), websiteNode(), webPageNode(P), breadcrumbNode(P)] }),
  component: GasDoPovo,
});

function GasDoPovo() {
  return (
    <PageShell crumb="Gás do Povo" title="Gás do Povo: como funciona" lead="Programa do Governo Federal que oferece a recarga gratuita do botijão de gás de cozinha em revendas credenciadas.">
      <p>As informações abaixo resumem o que o Governo Federal divulgou sobre o programa (Agência gov, outubro de 2025). As regras podem ser atualizadas: confirme sempre nos canais oficiais.</p>

      <h2>O que é</h2>
      <p>O Gás do Povo substitui o Auxílio Gás dos Brasileiros e concede a gratuidade na recarga do botijão de 13 kg em revendas credenciadas.</p>

      <h2>Quem tem direito</h2>
      <ul>
        <li>Famílias inscritas no Cadastro Único, com cadastro atualizado há pelo menos 24 meses.</li>
        <li>Renda mensal por pessoa de até meio salário mínimo.</li>
        <li>Há prioridade para beneficiários do Bolsa Família.</li>
      </ul>

      <h2>Como o vale é usado</h2>
      <ul>
        <li>O vale é emitido em nome do responsável familiar no Cadastro Único e não é pago em dinheiro.</li>
        <li>A recarga é feita diretamente na revenda credenciada, com validação eletrônica do beneficiário.</li>
        <li>Segundo o governo, não pode ser cobrado valor adicional pela recarga, exceto o vasilhame vazio (quando a família não o tem) ou o frete, se combinado.</li>
        <li>A revenda participante deve exibir a identificação visual do programa.</li>
      </ul>

      <h2>Onde consultar as regras e as revendas</h2>
      <ul>
        <li>Lista de revendas participantes: aplicativo Meu Social, site ou aplicativo da CAIXA e Portal Cidadão.</li>
        <li>Dúvidas sobre o programa: telefone 121 (24 horas) ou canal FalaBR.</li>
        <li><a href={FONTE} target="_blank" rel="noopener noreferrer">Perguntas e respostas oficiais — Agência gov</a></li>
      </ul>

      <h2>Atendimento na Gás Brasil</h2>
      <p>A Gás Brasil informa que aceita o benefício Gás do Povo. Para saber como realizar o atendimento, a disponibilidade e eventual frete de entrega, <a href={wa(MSG.gasDoPovo)} target="_blank" rel="noopener noreferrer">fale com a equipe pelo WhatsApp</a>. Veja também <Link to="/sobre">sobre a Gás Brasil</Link> e <Link to="/contato">como chegar até nós</Link>.</p>
    </PageShell>
  );
}
