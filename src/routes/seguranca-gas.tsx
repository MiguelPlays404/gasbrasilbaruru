import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { absUrl, breadcrumbNode, organizationNode, PAGES, pageHead, SITE_NAME, webPageNode, websiteNode } from "@/lib/seo";

const P = PAGES.seguranca;
const CARTILHA = "https://www.gov.br/anp/pt-br/centrais-de-conteudo/publicacoes/cartilhas-e-guias/arq/gas-botijao-glp-10-orientacoes/cartilha-glp.pdf";
const DICAS = "https://www.gov.br/anp/pt-br/canais_atendimento/consumidor/dicas-para-o-consumidor-2013-glp-gas-de-cozinha";

export const Route = createFileRoute("/seguranca-gas")({
  head: () =>
    pageHead(P, {
      type: "article",
      schema: [
        organizationNode(),
        websiteNode(),
        webPageNode(P),
        breadcrumbNode(P),
        {
          "@type": "Article",
          "@id": `${absUrl(P.path)}#article`,
          mainEntityOfPage: { "@id": `${absUrl(P.path)}#webpage` },
          headline: "Segurança com botijão de gás: orientações da ANP",
          description: P.description,
          inLanguage: "pt-BR",
          datePublished: P.lastmod,
          dateModified: P.lastmod,
          author: { "@type": "Organization", name: SITE_NAME, url: absUrl("/") },
          publisher: { "@id": `${absUrl("/")}#organization` },
          citation: [CARTILHA, DICAS],
        },
      ],
    }),
  component: Seguranca,
});

function Seguranca() {
  return (
    <PageShell crumb="Segurança com gás" title="Segurança com botijão de gás" lead="Resumo das orientações da Agência Nacional do Petróleo, Gás Natural e Biocombustíveis (ANP) para o consumidor de gás de cozinha (GLP).">
      <p>Este conteúdo é um resumo informativo da cartilha oficial da ANP e não substitui as orientações do órgão regulador, do fabricante do botijão nem do Corpo de Bombeiros. Em dúvida, consulte as fontes ao final da página.</p>

      <h2>Na hora de comprar</h2>
      <ul>
        <li>Compre apenas de revendedores autorizados pela ANP. Segundo a ANP, o ponto de venda autorizado exibe quadro com CNPJ, nome, endereço, horário e telefone de atendimento ao consumidor, além do painel de preços.</li>
        <li>Na entrega em casa, o veículo deve exibir o nome do revendedor e a autorização da ANP.</li>
        <li>Não aceite botijão amassado, enferrujado ou danificado. Prefira o botijão lacrado, com a marca do distribuidor em relevo, lacre na válvula e rótulo com instruções de uso, nome e telefone do distribuidor.</li>
        <li>Confira a data de requalificação (a “ferradura” perto da válvula). Se não houver, verifique o ano de fabricação, que não pode passar de 15 anos.</li>
        <li>Se tiver dúvida sobre o peso, peça para pesar o botijão; o revendedor deve ter balança certificada pelo Inmetro no estabelecimento.</li>
        <li>Peça e guarde a nota fiscal: ela é a sua comprovação em caso de reclamação.</li>
        <li>O preço do gás é livre, mas deve estar visível no ponto de venda.</li>
      </ul>

      <h2>Na instalação e no uso</h2>
      <ul>
        <li>Instale o botijão em local aberto e ventilado, com mangueira e regulador dentro do prazo de validade, usando apenas as mãos.</li>
        <li>Nunca incline, deite, derrube, role ou danifique o botijão.</li>
        <li>Mantenha chamas e cigarros longe durante a troca.</li>
        <li>A cada botijão novo, teste vazamentos passando água com sabão em volta da válvula: se surgirem novas bolhas, há vazamento. <strong>Nunca use fogo para testar vazamento.</strong></li>
        <li>Nunca transfira gás de um botijão para outro.</li>
      </ul>

      <h2>Como guardar</h2>
      <ul>
        <li>Mantenha em local ventilado, protegido de chuva, sol e umidade, com até cinco botijões.</li>
        <li>Nunca guarde em ambientes fechados, como armários, porões ou banheiros.</li>
        <li>Mantenha distância mínima de 1,5 m de ralos e caixas de esgoto, longe de aparelhos elétricos e fontes de ignição.</li>
        <li>Não deixe o botijão deitado ou de cabeça para baixo, e não deixe a mangueira encostar ou passar por trás do fogão.</li>
      </ul>

      <h2>Se suspeitar de vazamento</h2>
      <ul>
        <li>Feche o registro do regulador.</li>
        <li>Retire pessoas e animais do local.</li>
        <li>Ligue para o Corpo de Bombeiros (193).</li>
        <li>Não use fogo para procurar o vazamento.</li>
      </ul>
      <p>Para problemas com o botijão, procure primeiro o revendedor, que deve prestar assistência técnica.</p>

      <h2>Reclamações e denúncias</h2>
      <p>Para irregularidades de preço, peso ou venda por revendedor não autorizado, a ANP orienta procurar primeiro o distribuidor; se o problema persistir, ligue para a ANP no <strong>0800 970 0267</strong> ou use o formulário Fale Conosco no site da ANP.</p>

      <h2>Fontes oficiais</h2>
      <ul>
        <li><a href={CARTILHA} target="_blank" rel="noopener noreferrer">ANP — Cartilha “Gás de botijão (GLP): 10 orientações”</a></li>
        <li><a href={DICAS} target="_blank" rel="noopener noreferrer">ANP — Dicas para o consumidor de GLP</a></li>
      </ul>
      <p>Quer pedir ou tirar dúvidas sobre o atendimento? Veja <Link to="/contato">como falar com a Gás Brasil</Link>.</p>
    </PageShell>
  );
}
