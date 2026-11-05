import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { breadcrumbNode, organizationNode, PAGES, pageHead, webPageNode, websiteNode } from "@/lib/seo";
import { wa } from "@/lib/site";

const P = PAGES.privacidade;

export const Route = createFileRoute("/privacidade")({
  head: () => pageHead(P, { schema: [organizationNode(), websiteNode(), webPageNode(P), breadcrumbNode(P)] }),
  component: Privacy,
});

function Privacy() {
  return (
    <PageShell crumb="Política de privacidade" title="Política de privacidade" lead="Como tratamos os dados das avaliações enviadas pelo site, conforme a LGPD.">
<h2>Quais dados coletamos</h2>
    <p>Ao enviar uma avaliação pelo site, coletamos apenas o nome de exibição que você informar, a nota (de 1 a 5 estrelas), o comentário e a sua autorização de publicação. Não pedimos telefone, e-mail ou documentos.</p>
    <p>Para evitar envios automáticos e abusivos, registramos temporariamente um código irreversível derivado da conexão de envio. Ele não identifica você e é apagado em até 24 horas.</p>
    <h2>Por que coletamos</h2>
    <p>Para conhecer a experiência de atendimento dos nossos clientes, melhorar nossos serviços e, com sua autorização, compartilhar essa experiência com outros visitantes.</p>
    <h2>Como as avaliações são exibidas</h2>
    <p>Toda avaliação passa por moderação antes de aparecer. Quando aprovada, são exibidos publicamente somente o nome de exibição, a nota, o comentário e a data. Avaliações feitas no Google seguem as regras do próprio Google e não são misturadas às avaliações do site.</p>
    <h2>Como solicitar a remoção</h2>
    <p>Você pode pedir a remoção da sua avaliação a qualquer momento pelo <a className="font-semibold text-primary underline" href={wa("Olá! Gostaria de solicitar a remoção de uma avaliação que enviei pelo site da Gás Brasil.")} target="_blank" rel="noopener noreferrer">WhatsApp</a> ou pelo telefone +55 14 99177-7941, informando o nome de exibição e a data aproximada do envio.</p>

      <p>Veja também os <Link to="/termos">Termos de uso</Link> do site.</p>
    </PageShell>
  );
}
