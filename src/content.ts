// ============================================================
// TODOS OS TEXTOS E DADOS DO SITE FICAM AQUI.
// Itens marcados com TODO são provisórios: troque pelos dados reais.
// ============================================================

export type Product = { name: string; description: string };
export type Work = { service: string; image: string; alt: string; width: number; height: number; position: string };

export const brand = {
  name: "Rose & Keise",
  kind: "Esmaltaria",
  whatsappNumber: "5511991556818",
  whatsappDisplay: "(11) 99155-6818",
  whatsappMessage: "Olá! Quero agendar um horário na Rose & Keise.",
  // Usuário do Instagram, sem @ (conferir com a cliente se está escrito igual ao letreiro)
  instagramUser: "Roselikeise",
  street: "Rua Ilha de Capri, 225",
  district: "Recanto Verde do Sol",
  city: "São Paulo, SP",
  // Texto usado nos links e no mapa do Google Maps
  mapsQuery: "Rua Ilha de Capri, 225 - Recanto Verde do Sol, São Paulo - SP",
  // TODO: preencher os horários reais. Enquanto estiver vazio, o bloco de horários não aparece no site.
  // Exemplo: { days: "Segunda a sexta", time: "09h às 19h" }
  hours: [] as { days: string; time: string }[],
};

export const nav = [
  { label: "Trabalhos", href: "#trabalhos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

export const hero = {
  title: "Unhas bem cuidadas, do jeito que você imagina.",
  secondaryCta: "Ver trabalhos",
};

export const about = {
  title: "Um espaço calmo para cuidar das suas unhas.",
  paragraphs: [
    "A Rose & Keise é uma esmaltaria no Recanto Verde do Sol, em São Paulo, feita para quem gosta de unhas bem acabadas e de um atendimento sem pressa.",
    "Cada serviço é combinado em conversa: formato, cor e acabamento escolhidos com você, com materiais selecionados com critério.",
  ],
  imageAlt: "Fachada rosa da Rose & Keise, com o letreiro Rose & Keise Nails Designer",
  caption: "Fachada rosa, na Rua Ilha de Capri, 225. É só procurar pelo número.",
};

// Texto do botão de agendar que aparece em cada foto do carrossel.
export const booking = {
  cta: "Agendar este serviço",
  message: (service: string) => `Olá! Quero agendar: ${service}.`,
};

export const worksSection = {
  title: "Nossos trabalhos",
  text: "Alguns dos serviços que realizamos. Gostou de algum? É só chamar no WhatsApp e agendar o seu.",
  instagramCta: "Veja mais no Instagram",
  productsTitle: "Produtos que usamos",
  worksLabel: "Trabalhos realizados",
  prev: "Foto anterior",
  next: "Próxima foto",
  pause: "Pausar carrossel",
  play: "Reproduzir carrossel",
};

export const products: Product[] = [
  { name: "Esmaltes", description: "Cremosos, perolados e com glitter, em tons para o dia a dia e para ocasiões especiais." },
  { name: "Géis e bases", description: "Base, top coat e géis que dão durabilidade e acabamento uniforme." },
  { name: "Cuidados", description: "Óleos de cutícula, cremes e hidratantes para mãos e pés." },
];

// Fotos do carrossel. Para trocar uma foto, substitua o arquivo em public/images/trabalhos/ (mesmo nome)
// ou ajuste "image". "position" centraliza as unhas dentro do formato (eixo X e Y, em %).
export const works: Work[] = [
  {
    service: "Pé normal",
    image: "images/trabalhos/pe-normal.webp",
    alt: "Pés com unhas esmaltadas em tom claro com francesinha, calçando chinelo preto",
    width: 828,
    height: 1242,
    position: "50% 70%",
  },
  {
    service: "Esmaltação em gel",
    image: "images/trabalhos/esmaltacao-gel.webp",
    alt: "Pés com unhas esmaltadas em gel num tom claro com ponta branca",
    width: 828,
    height: 1157,
    position: "50% 55%",
  },
  {
    service: "Alongamento de fibra de vidro",
    image: "images/trabalhos/alongamento-fibra.webp",
    alt: "Mão com unhas longas em tom rosa leitoso, uma delas com detalhe marmorizado dourado",
    width: 828,
    height: 1138,
    position: "50% 35%",
  },
  {
    service: "Unha normal",
    image: "images/trabalhos/unha-normal.webp",
    alt: "Mão com unhas curtas pretas brilhantes e uma unha nude com fios prateados",
    width: 655,
    height: 953,
    position: "50% 55%",
  },
  {
    service: "Banho em gel",
    image: "images/trabalhos/banho-gel.webp",
    alt: "Mão com unhas amendoadas em branco leitoso, com glitter dourado e detalhe em folha de ouro",
    width: 713,
    height: 791,
    position: "45% 50%",
  },
  {
    service: "Postiça realista",
    image: "images/trabalhos/postica-realista.webp",
    alt: "Mão com unhas amendoadas nude com francesinha vermelha, corações e pedrarias",
    width: 827,
    height: 743,
    position: "62% 50%",
  },
  {
    service: "Alongamento em gel",
    image: "images/trabalhos/alongamento-gel.webp",
    alt: "Mão com unhas longas em gel, ainda sem esmalte, em tom rosa claro sobre luva rosa",
    width: 900,
    height: 1200,
    position: "50% 50%",
  },
  {
    service: "Molde F1",
    image: "images/trabalhos/molde-f1.webp",
    alt: "Mão com unhas em francesinha com detalhe estampado em preto e branco",
    width: 828,
    height: 999,
    position: "50% 50%",
  },
];

export const contact = {
  title: "Agende seu horário",
  text: "Chame no WhatsApp para agendar ou venha nos visitar.",
  cta: "Chamar no WhatsApp",
  instagramCta: "Ver Instagram",
  directionsCta: "Como chegar",
  mapsCta: "Abrir no Google Maps",
  mapTitle: "Mapa com a localização da Rose & Keise",
  labels: {
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    address: "Endereço",
    hours: "Horários",
  },
};

export const footer = {
  navTitle: "Navegação",
  contactTitle: "Contato",
};
