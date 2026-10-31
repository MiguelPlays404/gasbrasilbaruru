export const PHONE_DISPLAY = "+55 14 99177-7941";
export const PHONE_TEL = "tel:+5514991777941";
export const MAPS_URL = "https://maps.app.goo.gl/BCmxMiSDEHpDEtp77";

export function wa(message: string) {
  return `https://wa.me/5514991777941?text=${encodeURIComponent(message)}`;
}

export const MSG = {
  hero: "Olá! Vim pelo site da Gás Brasil e gostaria de pedir gás. Poderiam me informar a disponibilidade e a entrega para meu bairro em Bauru?",
  entrega: "Olá! Gostaria de solicitar uma entrega de gás em Bauru.",
  instalacao: "Olá! Gostaria de consultar a disponibilidade de instalação de gás.",
  retirada: "Olá! Gostaria de consultar a disponibilidade para retirar meu botijão no local.",
  botijoes: "Olá! Gostaria de consultar a disponibilidade dos botijões P-8, P-13 e P-20.",
  gasDoPovo: "Olá! Gostaria de saber como funciona o atendimento com o benefício Gás do Povo na Gás Brasil.",
  final: "Olá! Acessei o site da Gás Brasil e gostaria de fazer um pedido.",
};

export const NAV = [
  { id: "inicio", label: "Início" },
  { id: "empresa", label: "Empresa" },
  { id: "atendimento", label: "Atendimento" },
  { id: "botijoes", label: "Botijões" },
  { id: "beneficios", label: "Benefícios" },
  { id: "avaliacoes", label: "Avaliações" },
  { id: "localizacao", label: "Localização" },
];
