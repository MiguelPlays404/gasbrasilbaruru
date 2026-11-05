import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Phone, ArrowRight, ChevronDown, Truck, Wrench, Store } from "lucide-react";
import hero640 from "@/assets/hero-entrega-640.webp";
import hero960 from "@/assets/hero-entrega-960.webp";
import hero1280 from "@/assets/hero-entrega-1280.webp";
import hero1600 from "@/assets/hero-entrega-1600.webp";
import heroAvif640 from "@/assets/hero-entrega-640.avif";
import heroAvif960 from "@/assets/hero-entrega-960.avif";
import heroAvif1280 from "@/assets/hero-entrega-1280.avif";
import heroAvif1600 from "@/assets/hero-entrega-1600.avif";
import instalacaoImg from "@/assets/instalacao.jpg";
import retiradaImg from "@/assets/retirada.jpg";
import botijoesImg from "@/assets/botijoes-liquigas.jpeg.asset.json";
import liquigas from "@/assets/liquigas.asset.json";
import gasDoPovo from "@/assets/gas-do-povo.asset.json";
import parceria from "@/assets/parceria.asset.json";
import { Header } from "@/components/site/Header";
import { SiteFooter } from "@/components/site/PageShell";
import { Reviews } from "@/components/site/Reviews";
import { WhatsAppIcon } from "@/components/site/icons";
import { getPublicReviews } from "@/lib/reviews.functions";
import { Reveal } from "@/components/site/Reveal";
import { RotatingWord } from "@/components/site/RotatingWord";
import { ADDRESS_CITY, ADDRESS_LINE, CYLINDERS, MAPS_URL, MSG, PHONE_DISPLAY, PHONE_TEL, wa } from "@/lib/site";
import { organizationNode, PAGES, pageHead, webPageNode, websiteNode } from "@/lib/seo";

const HERO_SRCSET = `${hero640} 640w, ${hero960} 960w, ${hero1280} 1280w, ${hero1600} 1600w`;
const HERO_AVIF_SRCSET = `${heroAvif640} 640w, ${heroAvif960} 960w, ${heroAvif1280} 1280w, ${heroAvif1600} 1600w`;
const HERO_SIZES = "(min-width: 1216px) 520px, (min-width: 1024px) calc((100vw - 120px) * 0.475), (min-width: 768px) calc(100vw - 64px), calc(100vw - 40px)";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      return await getPublicReviews();
    } catch (e) {
      console.warn("Falha ao carregar avaliações", e);
      return {
        reviews: [],
        stats: { total: 0, average: 0, r1: 0, r2: 0, r3: 0, r4: 0, r5: 0 },
        googleReviewUrl: null as string | null,
        publicEnabled: true,
      };
    }
  },
  head: () => {
    const head = pageHead(PAGES.home, { schema: [organizationNode(), websiteNode(), webPageNode(PAGES.home)] });
    // Pré-carrega a imagem do hero (maior elemento da tela) para melhorar o LCP.
    head.links.push({ rel: "preload", as: "image", href: heroAvif960, imageSrcSet: HERO_AVIF_SRCSET, imageSizes: HERO_SIZES, type: "image/avif", fetchPriority: "high" });
    return head;
  },
  component: Index,
});

const FAQ = [
  ["A Gás Brasil atende quais regiões?", "Atendemos toda a cidade de Bauru."],
  ["Posso solicitar entrega pelo WhatsApp?", "Sim! Você pode entrar em contato diretamente com nossa equipe e consultar seu pedido."],
  ["Vocês também realizam instalação?", "Sim! Você pode consultar a disponibilidade da instalação pelo WhatsApp."],
  ["Posso retirar o gás pessoalmente?", "Sim! Além da entrega, você pode optar pela retirada no estabelecimento."],
  ["Quais tamanhos de botijão estão disponíveis?", "A Gás Brasil apresenta opções de botijão P-8 (8 kg), P-13 (13 kg), P-20 (20 kg) e P-45 (45 kg). Consulte a disponibilidade pelo WhatsApp."],
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
            <Reveal immediate>
              <p className="eyebrow-line text-sm font-semibold text-secondary">Entrega rápida no seu bairro. Atendemos toda Bauru.</p>
              <h1 className="mt-5 text-[2.6rem] font-extrabold leading-[1.02] text-foreground sm:text-6xl lg:text-[4.2rem]">
                Entrega de gás em <RotatingWord /> com rapidez e praticidade.
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
                <address className="text-center text-sm not-italic text-muted-foreground"><a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="text-inherit no-underline transition-colors hover:text-primary">{ADDRESS_LINE}, {ADDRESS_CITY}</a></address>
              </div>
            </Reveal>
            <div className="relative">
              <div className="absolute -right-24 -top-10 hidden h-[110%] w-[70%] bg-primary lg:block" aria-hidden="true" />
              <picture>
                <source type="image/avif" srcSet={HERO_AVIF_SRCSET} sizes={HERO_SIZES} />
                <img src={hero960} srcSet={HERO_SRCSET} sizes={HERO_SIZES} alt="Entregador da Gás Brasil levando um botijão até a porta de uma casa em Bauru" width={1600} height={1104} fetchPriority="high" decoding="async" className="relative aspect-[4/3] w-full object-cover shadow-soft" />
              </picture>
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
                <p><Link to="/sobre" className="font-semibold text-primary-foreground underline underline-offset-4 hover:text-secondary">Conheça a Gás Brasil</Link></p>
              </div>
            </div>
          </div>
        </section>

        {/* ATENDIMENTO */}
        <section id="atendimento" className="py-20 md:py-28">
          <div className="container-page">
            <Reveal><h2 className="max-w-2xl text-4xl font-extrabold leading-[1.05] md:text-5xl">Você escolhe como prefere receber.</h2></Reveal>

            <div className="mt-14 grid items-center gap-8 md:grid-cols-[1.2fr_1fr] md:gap-14">
              <img src={hero960} srcSet={HERO_SRCSET} sizes="(min-width: 768px) 55vw, 100vw" alt="Entrega residencial de gás" width={1600} height={1104} loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover object-[30%_center]" />
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
            <img src={botijoesImg.url} alt="Liquigás: botijões P-8, P-13, P-20 e P-45 lado a lado, com seus tamanhos proporcionais" width={1029} height={768} loading="lazy" className="mx-auto mt-10 block h-auto w-full max-w-4xl object-contain" />
            <ul className="mx-auto mt-6 grid max-w-4xl grid-cols-2 gap-6 text-center sm:grid-cols-4">
              {CYLINDERS.map(({ model, kg }) => (
                <li key={model} className="min-w-0">
                  <p className="font-display text-xl font-extrabold text-primary md:text-2xl">Botijão {model}</p>
                  <p className="text-muted-foreground">{kg} kg</p>
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
                <p className="mt-4"><Link to="/seguranca-gas" className="font-semibold text-primary underline underline-offset-4">Veja as orientações da ANP para usar o botijão com segurança</Link></p>
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
              <p className="mt-3"><Link to="/gas-do-povo" className="font-semibold text-primary underline underline-offset-4">Entenda como funciona o programa Gás do Povo</Link></p>
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
              <p className="mt-4"><Link to="/contato" className="font-semibold text-primary-foreground underline underline-offset-4 hover:text-secondary">Todos os canais de contato</Link></p>
              <address className="mt-8 flex items-start gap-3 border-l-4 border-secondary pl-5 text-xl font-semibold not-italic">
                <MapPin className="mt-1 h-6 w-6 shrink-0 text-secondary" aria-hidden="true" />
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="text-inherit no-underline transition-colors hover:text-secondary">{ADDRESS_LINE}<br />{ADDRESS_CITY}</a>
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
            {/* <details> nativo: as respostas já vêm no HTML (visíveis para Google/IA) e funcionam sem JavaScript. */}
            <div className="w-full">
              {FAQ.map(([q, a]) => (
                <details key={q} name="faq" className="group border-b">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-lg font-semibold transition-all hover:underline [&::-webkit-details-marker]:hidden">
                    <span>{q}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="animate-rise pb-4 text-base text-muted-foreground [animation-duration:0.3s]">{a}</p>
                </details>
              ))}
            </div>
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

      <SiteFooter />
    </>
  );
}
