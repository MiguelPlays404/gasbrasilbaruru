import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, ArrowRight, Truck, Wrench, Store } from "lucide-react";
import heroImg from "@/assets/hero-entrega.jpg";
import instalacaoImg from "@/assets/instalacao.jpg";
import retiradaImg from "@/assets/retirada.jpg";
import botijoesImg from "@/assets/botijoes.jpg";
import liquigas from "@/assets/liquigas.asset.json";
import gasDoPovo from "@/assets/gas-do-povo.asset.json";
import parceria from "@/assets/parceria.asset.json";
import logo from "@/assets/logo-gas-brasil.asset.json";
import { Header } from "@/components/site/Header";
import { Reviews } from "@/components/site/Reviews";
import { WhatsAppIcon } from "@/components/site/icons";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getPublicReviews } from "@/lib/reviews.functions";
import { Reveal } from "@/components/site/Reveal";
import { ADDRESS_CITY, ADDRESS_LINE, MAPS_URL, MSG, NAV, PHONE_DISPLAY, PHONE_TEL, wa } from "@/lib/site";

const TITLE = "Gás Brasil — Entrega de gás em Bauru/SP | P-8, P-13 e P-20";
const DESC = "Entrega, instalação e retirada de gás em toda Bauru. Botijões P-8, P-13 e P-20, aceitamos Gás do Povo e parcelamos em até 3x. Peça pelo WhatsApp.";

export const Route = createFileRoute("/")({
  loader: () => getPublicReviews(),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Gás Brasil",
          description: "Revenda e entrega de gás com atendimento em toda Bauru/SP.",
          telephone: "+55 14 99177-7941",
          areaServed: { "@type": "City", name: "Bauru", containedInPlace: "São Paulo, Brasil" },
          hasMap: MAPS_URL,
          address: { "@type": "PostalAddress", streetAddress: "Av. Dr. Nuno de Assis, 1166", addressLocality: "Bauru", addressRegion: "SP", postalCode: "17010-120", addressCountry: "BR" },
          makesOffer: ["Botijão P-8 (8 kg)", "Botijão P-13 (13 kg)", "Botijão P-20 (20 kg)"].map((n) => ({ "@type": "Offer", itemOffered: { "@type": "Product", name: n } })),
        }),
      },
    ],
  }),
  component: Index,
});

const FAQ = [
  ["A Gás Brasil atende quais regiões?", "Atendemos toda a cidade de Bauru."],
  ["Posso solicitar entrega pelo WhatsApp?", "Sim! Você pode entrar em contato diretamente com nossa equipe e consultar seu pedido."],
  ["Vocês também realizam instalação?", "Sim! Você pode consultar a disponibilidade da instalação pelo WhatsApp."],
  ["Posso retirar o gás pessoalmente?", "Sim! Além da entrega, você pode optar pela retirada no estabelecimento."],
  ["Quais tamanhos de botijão estão disponíveis?", "A Gás Brasil apresenta opções de botijão P-8 (8 kg), P-13 (13 kg) e P-20 (20 kg). Consulte a disponibilidade pelo WhatsApp."],
  ["A Gás Brasil aceita Gás do Povo?", "Sim! Consulte pelo WhatsApp as informações sobre o atendimento pelo benefício."],
  ["Posso parcelar meu gás?", "Sim! Existe a possibilidade de parcelamento em até 3 vezes, conforme as condições de pagamento."],
];

function WaLink({ msg, children, className = "" }: { msg: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={wa(msg)} target="_blank" rel="noopener noreferrer" className={`group inline-flex items-center gap-2 font-semibold text-primary hover:text-primary-deep ${className}`}>
      {children} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </a>
  );
}

function Index() {
  const data = Route.useLoaderData();
  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section id="inicio" className="relative overflow-hidden pt-24 md:pt-28">
          <div className="container-page grid items-center gap-10 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-24">
            <Reveal>
              <p className="eyebrow-line text-sm font-semibold text-secondary">Entrega rápida no seu bairro. Atendemos toda Bauru.</p>
              <h1 className="mt-5 text-[2.6rem] font-extrabold leading-[1.02] text-foreground sm:text-6xl lg:text-[4.2rem]">
                Entrega de gás em <span className="text-primary">Bauru</span> com rapidez e praticidade.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                Precisou de gás? Conte com a Gás Brasil. Levamos praticidade até você, com entrega, instalação e opção de retirada no local.
              </p>
              <div className="mt-8 grid max-w-xl gap-3">
                <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
                  <a href={wa(MSG.hero)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-4 py-4 font-bold text-primary-foreground shadow-soft transition hover:bg-primary-deep">
                    <WhatsAppIcon className="h-5 w-5" /> Pedir pelo WhatsApp
                  </a>
                  <a href={PHONE_TEL} className="inline-flex flex-col items-center justify-center rounded-sm bg-secondary px-4 py-2.5 font-bold text-secondary-foreground transition hover:brightness-95">
                    <span className="inline-flex items-center gap-2"><Phone className="h-5 w-5" /> Ligar agora</span>
                    <span className="text-xs font-medium opacity-90">{PHONE_DISPLAY}</span>
                  </a>
                </div>
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-sm border-2 border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">
                  <MapPin className="h-5 w-5" /> Ver nossa localização
                </a>
                <address className="text-center text-sm not-italic text-muted-foreground">{ADDRESS_LINE}, {ADDRESS_CITY}</address>
              </div>
            </Reveal>
            <div className="relative">
              <div className="absolute -right-24 -top-10 hidden h-[110%] w-[70%] bg-primary lg:block" aria-hidden="true" />
              <img src={heroImg} alt="Entregador da Gás Brasil levando um botijão até a porta de uma casa em Bauru" width={1600} height={1104} fetchPriority="high" className="relative aspect-[4/3] w-full object-cover shadow-soft" />
            </div>
          </div>
        </section>

        {/* COBERTURA + EMPRESA */}
        <section id="empresa" className="bg-primary py-20 text-primary-foreground md:py-28">
          <div className="container-page">
            <p className="max-w-4xl font-display text-3xl font-bold leading-tight md:text-5xl">
              De bairro em bairro, toda Bauru conta com a gente.
            </p>
            <p className="mt-5 max-w-2xl text-lg text-primary-foreground/80">
              Nosso compromisso é facilitar sua rotina com atendimento próximo, praticidade e diferentes formas de receber seu gás.
            </p>
            <div className="mt-16 grid gap-10 border-t border-primary-foreground/20 pt-14 lg:grid-cols-[1fr_1.2fr]">
              <Reveal><h2 className="text-3xl font-extrabold leading-tight md:text-4xl">Mais do que entregar gás, <span className="text-secondary">facilitar o seu dia.</span></h2></Reveal>
              <div className="space-y-5 text-lg text-primary-foreground/85">
                <p>A Gás Brasil trabalha para tornar o acesso ao gás mais simples e prático para quem vive em Bauru. Com atendimento próximo e soluções que acompanham a necessidade de cada cliente, oferecemos diferentes formas de receber seu pedido: com entrega, instalação ou retirada diretamente no estabelecimento.</p>
                <p>Nosso compromisso é proporcionar uma experiência de atendimento acessível, com praticidade, qualidade e atenção em cada pedido.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ATENDIMENTO */}
        <section id="atendimento" className="py-20 md:py-28">
          <div className="container-page">
            <Reveal><h2 className="max-w-2xl text-4xl font-extrabold leading-[1.05] md:text-5xl">Você escolhe como prefere receber.</h2></Reveal>

            <div className="mt-14 grid items-center gap-8 md:grid-cols-[1.2fr_1fr] md:gap-14">
              <img src={heroImg} alt="Entrega residencial de gás" width={1600} height={1104} loading="lazy" className="aspect-[16/10] w-full object-cover object-[30%_center]" />
              <div>
                <Truck className="h-8 w-8 text-secondary" aria-hidden="true" />
                <h3 className="mt-3 text-2xl font-bold">Entrega</h3>
                <p className="mt-3 text-lg text-muted-foreground">Peça pelo WhatsApp e receba seu gás no conforto da sua casa. Atendemos toda Bauru, levando praticidade até você.</p>
                <WaLink msg={MSG.entrega} className="mt-5">Solicitar entrega</WaLink>
              </div>
            </div>

            <div className="mt-16 grid items-center gap-8 md:grid-cols-[1fr_1.2fr] md:gap-14">
              <div className="md:order-1 order-2">
                <Wrench className="h-8 w-8 text-secondary" aria-hidden="true" />
                <h3 className="mt-3 text-2xl font-bold">Instalação</h3>
                <p className="mt-3 text-lg text-muted-foreground">Além da entrega, você também pode solicitar a instalação do seu gás. Consulte nossa equipe e descubra a disponibilidade do serviço.</p>
                <WaLink msg={MSG.instalacao} className="mt-5">Consultar instalação</WaLink>
              </div>
              <img src={instalacaoImg} alt="Profissional instalando regulador em botijão de gás" width={1200} height={912} loading="lazy" className="order-1 aspect-[16/10] w-full object-cover md:order-2" />
            </div>

            <div className="mt-16 grid items-end gap-8 md:grid-cols-[1.2fr_1fr] md:gap-14">
              <img src={retiradaImg} alt="Cliente retirando botijão no balcão do estabelecimento" width={1200} height={912} loading="lazy" className="aspect-[16/10] w-full object-cover" />
              <div className="border-l-4 border-secondary pl-6">
                <Store className="h-8 w-8 text-secondary" aria-hidden="true" />
                <h3 className="mt-3 text-2xl font-bold">Retirada no local</h3>
                <p className="mt-3 text-lg text-muted-foreground">Prefere buscar pessoalmente? Você também pode retirar seu gás diretamente no estabelecimento.</p>
                <WaLink msg={MSG.retirada} className="mt-5">Consultar retirada</WaLink>
              </div>
            </div>
          </div>
        </section>

        {/* BOTIJÕES */}
        <section id="botijoes" className="bg-surface py-20 md:py-28">
          <div className="container-page">
            <div className="grid gap-6 md:grid-cols-2 md:items-end">
              <Reveal><h2 className="text-4xl font-extrabold leading-[1.05] md:text-5xl">Um tamanho para cada necessidade.</h2></Reveal>
              <p className="text-lg text-muted-foreground">A Gás Brasil oferece diferentes opções de botijão para você encontrar o que precisa. Consulte a disponibilidade pelo nosso WhatsApp.</p>
            </div>
            <img src={botijoesImg} alt="Botijões de gás P-8, P-13 e P-20 lado a lado" width={1600} height={912} loading="lazy" className="mx-auto mt-10 w-full max-w-4xl mix-blend-multiply" />
            <ul className="mx-auto grid max-w-4xl grid-cols-3 text-center">
              {[["P-8", "8 kg"], ["P-13", "13 kg"], ["P-20", "20 kg"]].map(([m, kg]) => (
                <li key={m}>
                  <p className="font-display text-2xl font-extrabold text-primary md:text-4xl">Botijão {m}</p>
                  <p className="text-muted-foreground">{kg}</p>
                </li>
              ))}
            </ul>
            <div className="mt-12 flex flex-col items-center gap-4 text-center">
              <p className="text-lg">Quer saber qual está disponível? Fale com a gente.</p>
              <a href={wa(MSG.botijoes)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-deep">
                <WhatsAppIcon className="h-5 w-5" /> Consultar pelo WhatsApp
              </a>
            </div>

            <div className="mt-20 grid items-center gap-10 border-t border-border pt-16 md:grid-cols-[1fr_1.3fr]">
              <img src={liquigas.url} alt="Logotipo Liquigás" width={1160} height={350} loading="lazy" className="w-full max-w-sm mix-blend-multiply" />
              <div>
                <h3 className="text-3xl font-extrabold leading-tight">Qualidade que faz parte da sua rotina.</h3>
                <p className="mt-4 text-lg text-muted-foreground">Trabalhamos com produtos Liquigás para atender às necessidades da sua casa e da sua rotina. Na Gás Brasil, você encontra praticidade no atendimento e diferentes opções para receber seu gás.</p>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFÍCIOS */}
        <section id="beneficios" className="py-20 md:py-28">
          <div className="container-page grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="inline-block bg-secondary px-3 py-1 font-display text-sm font-extrabold tracking-widest text-secondary-foreground">ACEITAMOS GÁS DO POVO</p>
              <Reveal><h2 className="mt-5 text-4xl font-extrabold leading-[1.05] md:text-5xl">Você também pode contar com o Gás do Povo!</h2></Reveal>
              <p className="mt-5 text-lg text-muted-foreground">A Gás Brasil aceita o benefício Gás do Povo. Consulte nossa equipe pelo WhatsApp e saiba como realizar seu atendimento.</p>
              <div className="mt-6 flex items-center gap-6">
                <img src={gasDoPovo.url} alt="Logotipo Gás do Povo" width={720} height={427} loading="lazy" className="h-20 w-auto mix-blend-multiply" />
                <WaLink msg={MSG.gasDoPovo}>Consultar atendimento</WaLink>
              </div>
            </div>
            <img src={parceria.url} alt="O Gás Brasil também participa do Gás do Povo" width={1628} height={966} loading="lazy" className="w-full shadow-soft" />
          </div>

          <div className="container-page mt-24 grid items-center gap-8 border-y border-border py-14 md:grid-cols-[auto_1fr] md:gap-14">
            <p className="font-display text-[8rem] font-extrabold leading-none text-secondary md:text-[11rem]" aria-hidden="true">3x</p>
            <div>
              <Reveal><h2 className="text-3xl font-extrabold md:text-4xl">Na hora de pagar, mais praticidade também.</h2></Reveal>
              <p className="mt-3 text-2xl font-semibold">Parcele seu gás em até <span className="text-secondary">3</span> vezes!</p>
              <p className="mt-2 text-lg text-muted-foreground">Consulte nossas condições de pagamento diretamente com a equipe.</p>
            </div>
          </div>
        </section>

        <Reviews {...data} />

        {/* LOCALIZAÇÃO */}
        <section id="localizacao" className="bg-primary-deep py-20 text-primary-foreground md:py-28">
          <div className="container-page grid items-center gap-10 md:grid-cols-[1.3fr_1fr]">
            <div>
              <Reveal><h2 className="text-4xl font-extrabold leading-[1.05] md:text-5xl">A Gás Brasil está perto de você.</h2></Reveal>
              <p className="mt-5 max-w-xl text-lg text-primary-foreground/80">Atendemos toda Bauru e estamos prontos para facilitar seu pedido. Consulte nossa localização e descubra como chegar até nós.</p>
              <address className="mt-8 flex items-start gap-3 border-l-4 border-secondary pl-5 text-xl font-semibold not-italic">
                <MapPin className="mt-1 h-6 w-6 shrink-0 text-secondary" aria-hidden="true" />
                <span>{ADDRESS_LINE}<br />{ADDRESS_CITY}</span>
              </address>
            </div>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 rounded-sm bg-secondary px-8 py-5 text-lg font-bold text-secondary-foreground transition hover:brightness-95">
              <MapPin className="h-6 w-6" /> Como chegar
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section id="duvidas" className="py-20 md:py-28">
          <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal><h2 className="text-4xl font-extrabold leading-[1.05] md:text-5xl">Ficou alguma dúvida?</h2></Reveal>
            <Accordion type="single" collapsible className="w-full">
              {FAQ.map(([q, a], i) => (
                <AccordionItem key={q} value={`q${i}`}>
                  <AccordionTrigger className="text-left text-lg font-semibold">{q}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="bg-secondary py-20 text-secondary-foreground md:py-24">
          <div className="container-page text-center">
            <Reveal><h2 className="text-4xl font-extrabold md:text-6xl">Precisou de gás? Conte com a Gás Brasil!</h2></Reveal>
            <p className="mx-auto mt-5 max-w-2xl text-lg opacity-90">Peça agora mesmo e escolha como prefere receber: entregamos, instalamos ou você pode retirar no local.</p>
            <a href={wa(MSG.final)} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-3 rounded-sm bg-primary px-8 py-5 text-lg font-extrabold text-primary-foreground shadow-soft transition hover:bg-primary-deep">
              <WhatsAppIcon className="h-6 w-6" /> PEDIR MEU GÁS PELO WHATSAPP
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-foreground py-14 text-background">
        <div className="container-page grid gap-10 md:grid-cols-3">
          <div>
            <img src={logo.url} alt="Gás Brasil" width={140} height={56} loading="lazy" className="h-14 w-auto rounded-sm bg-background p-1" />
            <p className="mt-4 text-background/70">Revenda e entrega de gás com atendimento em toda Bauru.</p>
          </div>
          <div className="space-y-2">
            <a href={PHONE_TEL} className="flex items-center gap-2 hover:text-secondary"><Phone className="h-4 w-4" /> {PHONE_DISPLAY}</a>
            <a href={wa(MSG.final)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-secondary"><WhatsAppIcon className="h-4 w-4" /> WhatsApp</a>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-secondary"><MapPin className="h-4 w-4 shrink-0" /> {ADDRESS_LINE}, {ADDRESS_CITY}</a>
          </div>
          <nav aria-label="Rodapé">
            <ul className="grid grid-cols-2 gap-2 text-background/80">
              {NAV.map((n) => <li key={n.id}><a href={`#${n.id}`} className="hover:text-secondary">{n.label}</a></li>)}
              <li><a href="/privacidade" className="hover:text-secondary">Privacidade</a></li>
            </ul>
          </nav>
        </div>
        <p className="container-page mt-10 border-t border-background/15 pt-6 text-sm text-background/60">© {new Date().getFullYear()} Gás Brasil. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}
