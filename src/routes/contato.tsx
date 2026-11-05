import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { WhatsAppIcon } from "@/components/site/icons";
import { breadcrumbNode, organizationNode, PAGES, pageHead, webPageNode, websiteNode } from "@/lib/seo";
import { ADDRESS_CITY, ADDRESS_LINE, MAPS_URL, MSG, PHONE_DISPLAY, PHONE_TEL, wa } from "@/lib/site";

const P = PAGES.contato;

export const Route = createFileRoute("/contato")({
  head: () => pageHead(P, { schema: [organizationNode(), websiteNode(), webPageNode(P, "ContactPage"), breadcrumbNode(P)] }),
  component: Contato,
});

function Contato() {
  return (
    <PageShell crumb="Contato" title="Contato e localização" lead="Fale com a equipe da Gás Brasil para pedir gás, consultar a disponibilidade ou tirar dúvidas.">
      <h2>Como falar com a gente</h2>
      <ul className="!ml-0 space-y-4 [&_li]:ml-0 [&_li]:list-none [&_li]:pl-0">
        <li>
          <a href={wa(MSG.final)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 no-underline"><WhatsAppIcon className="h-6 w-6" /> WhatsApp: {PHONE_DISPLAY}</a>
        </li>
        <li>
          <a href={PHONE_TEL} className="inline-flex items-center gap-3 no-underline"><Phone className="h-6 w-6" aria-hidden="true" /> Telefone: {PHONE_DISPLAY}</a>
        </li>
      </ul>
      <p>O horário de atendimento e a disponibilidade de entrega, instalação e retirada são informados pela equipe no momento do contato.</p>

      <h2>Endereço</h2>
      <address className="not-italic">
        <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-3 no-underline"><MapPin className="mt-1 h-6 w-6 shrink-0" aria-hidden="true" /> <span>{ADDRESS_LINE}<br />{ADDRESS_CITY}</span></a>
      </address>
      <p><a href={MAPS_URL} target="_blank" rel="noopener noreferrer">Abrir no Google Maps</a> para ver o trajeto.</p>

      <h2>Área de atendimento</h2>
      <p>Atendemos toda a cidade de Bauru/SP.</p>
    </PageShell>
  );
}
