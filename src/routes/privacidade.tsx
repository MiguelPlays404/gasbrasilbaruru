import { createFileRoute, Link } from "@tanstack/react-router";
import { wa } from "@/lib/site";

const T = "Política de privacidade — Gás Brasil";
const D = "Como a Gás Brasil coleta, utiliza e publica os dados das avaliações enviadas pelo site, conforme a LGPD.";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: T }, { name: "description", content: D },
      { property: "og:title", content: T }, { property: "og:description", content: D },
      { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/privacidade" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <main className="container-page max-w-3xl py-16 md:py-24">
      <Link to="/" className="text-sm font-semibold text-primary">← Voltar ao site</Link>
      <h1 className="mt-6 text-4xl font-extrabold">Política de privacidade</h1>
      <div className="mt-8 space-y-6 text-lg leading-relaxed text-muted-foreground [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground">
        <h2>Quais dados coletamos</h2>
        <p>Ao enviar uma avaliação pelo site, coletamos apenas o nome de exibição que você informar, a nota (de 1 a 5 estrelas), o comentário e a sua autorização de publicação. Não pedimos telefone, e-mail ou documentos.</p>
        <p>Para evitar envios automáticos e abusivos, registramos temporariamente um código irreversível derivado da conexão de envio. Ele não identifica você e é apagado em até 24 horas.</p>
        <h2>Por que coletamos</h2>
        <p>Para conhecer a experiência de atendimento dos nossos clientes, melhorar nossos serviços e, com sua autorização, compartilhar essa experiência com outros visitantes.</p>
        <h2>Como as avaliações são exibidas</h2>
        <p>Toda avaliação passa por moderação antes de aparecer. Quando aprovada, são exibidos publicamente somente o nome de exibição, a nota, o comentário e a data. Avaliações feitas no Google seguem as regras do próprio Google e não são misturadas às avaliações do site.</p>
        <h2>Como solicitar a remoção</h2>
        <p>Você pode pedir a remoção da sua avaliação a qualquer momento pelo <a className="font-semibold text-primary underline" href={wa("Olá! Gostaria de solicitar a remoção de uma avaliação que enviei pelo site da Gás Brasil.")} target="_blank" rel="noopener noreferrer">WhatsApp</a> ou pelo telefone +55 14 99177-7941, informando o nome de exibição e a data aproximada do envio.</p>
      </div>
    </main>
  );
}
