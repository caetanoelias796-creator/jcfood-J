/* ============================================================
   FIREBASE INTEGRATION ENGINE V4.0 (JC INFORMÁTICA CMS)
   Firestore Database + Firebase Storage + Offline LocalStorage Cache
   ============================================================ */

// CONFIGURAÇÃO OFICIAL DO FIREBASE PROJECT (JC INFORMÁTICA)
export const firebaseConfig = {
  apiKey: "AIzaSyJCInformaticaOfficialKey2026",
  authDomain: "jc-informatica-site.firebaseapp.com",
  projectId: "jc-informatica-site",
  storageBucket: "jc-informatica-site.appspot.com",
  messagingSenderId: "555432814464",
  appId: "1:555432814464:web:jcinformaticasite2026"
};

export const CATEGORIES_V31 = {
  computadores: {
    label: 'Computadores',
    subcategories: ['Escritório', 'Home Office', 'Profissional', 'All in One']
  },
  pc_gamer: {
    label: 'PC Gamer',
    subcategories: ['Entrada', 'Intermediário', 'Avançado', 'Extreme', 'PCs Montados pela JC Informática']
  },
  notebooks: {
    label: 'Notebooks',
    subcategories: ['Acer', 'ASUS', 'Dell', 'HP', 'Lenovo', 'Samsung', 'Gamer']
  },
  monitores: {
    label: 'Monitores',
    subcategories: ['Gamer', 'Profissionais', 'Ultrawide', '4K']
  },
  componentes: {
    label: 'Componentes',
    subcategories: ['Processadores', 'Placas-mãe', 'Memórias RAM', 'SSD', 'HD', 'Placas de Vídeo', 'Fontes', 'Gabinetes', 'Coolers', 'Water Coolers']
  },
  perifericos: {
    label: 'Periféricos',
    subcategories: ['Teclados', 'Mouses', 'Mouse Pads', 'Headsets', 'Caixas de Som', 'Microfones', 'Webcams', 'Controles Gamer']
  },
  redes: {
    label: 'Redes',
    subcategories: ['Roteadores', 'Switches', 'Repetidores', 'Access Points', 'Adaptadores Wi-Fi', 'Cabos de Rede']
  },
  impressao: {
    label: 'Impressão',
    subcategories: ['Impressoras', 'Multifuncionais', 'Toners', 'Cartuchos']
  },
  armazenamento: {
    label: 'Armazenamento',
    subcategories: ['SSD Externo', 'HD Externo', 'Pen Drives', 'Cartões de Memória']
  },
  energia: {
    label: 'Energia',
    subcategories: ['Nobreaks', 'Estabilizadores', 'Filtros de Linha']
  },
  automacao: {
    label: 'Automação Comercial',
    subcategories: ['Sistemas de Gestão', 'Computadores para PDV', 'Monitores Touch', 'Impressoras Térmicas', 'Leitores de Código de Barras', 'Gavetas de Dinheiro', 'Balanças', 'Coletores de Dados', 'Bobinas', 'Etiquetas']
  },
  assistencia: {
    label: 'Assistência Técnica',
    subcategories: [
      'Formatação', 'Instalação do Windows', 'Instalação de Programas', 'Upgrade SSD', 
      'Upgrade Memória RAM', 'Limpeza Preventiva', 'Troca de Pasta Térmica', 'Montagem de Computadores', 
      'Diagnóstico', 'Configuração de Redes', 'Configuração de Roteadores', 'Instalação de Impressoras', 
      'Suporte Técnico para Empresas', 'Manutenção de Computadores', 'Manutenção de Notebooks'
    ]
  }
};

export const AVAILABLE_TAGS = [
  'Novo', 'Lançamento', 'Oferta', 'Mais Vendido', 'Destaque', 
  'Gamer', 'Escritório', 'Home Office', 'Profissional', 'Recomendado pela JC'
];

export const INITIAL_PRODUCTS_V40 = [
  {
    id: "prod-1",
    nome: "Teclado Mecânico Gamer Redragon RGB Switch Blue",
    sku: "71995",
    codigo: "71995",
    marca: "Redragon",
    categoria: "perifericos",
    subcategoria: "Teclados Gamer",
    estoque: "Disponível",
    destaque: true,
    ativo: true,
    imagem: "imagem/teclado_redragon.jpg",
    galeria: ["imagem/teclado_redragon.jpg"],
    garantia: "12 Meses com Fabricante",
    resumo: "Padrão ABNT2 com iluminação RGB Chroma personalizável e switches mecânicos Blue de alta durabilidade.",
    especificacoes: [
      "Padrão ABNT2 completo com Ç",
      "Switches Mecânicos de Alta Precisão (Outemu Blue)",
      "Iluminação RGB Chroma com múltiplos modos",
      "Teclas 100% Anti-Ghosting e Keycaps Double-Shot",
      "Construção metálica reforçada e cabo trançado de 1.8m"
    ],
    descricao: "Teclado mecânico ideal para jogadores exigentes e digitação de alta precisão."
  },
  {
    id: "prod-2",
    nome: "Gabinete Gamer Aquário Vidro Temperado Panorâmico ARGB",
    sku: "JC-NZX-002",
    codigo: "JC-NZX-002",
    marca: "NZXT",
    categoria: "componentes",
    subcategoria: "Gabinetes",
    estoque: "Disponível",
    destaque: true,
    ativo: true,
    imagem: "imagem/Gabinete NZXT H9.png",
    galeria: ["imagem/Gabinete NZXT H9.png"],
    garantia: "12 Meses com Fabricante",
    resumo: "Gabinete no estilo aquário com visão panorâmica de vidro temperado e excelente fluxo de ar.",
    especificacoes: [
      "Painel frontal e lateral em vidro temperado de 4mm",
      "Suporte a Water Cooler até 360mm",
      "Espaço dedicado para Cable Management",
      "Compatível com Placas ATX, Micro-ATX e Mini-ITX"
    ],
    descricao: "Design aquário panorâmico para destacar os componentes do seu setup gamer."
  },
  {
    id: "prod-3",
    nome: "Headset Gamer Redragon 7.1 Surround Som Imersivo",
    sku: "JC-RED-003",
    codigo: "JC-RED-003",
    marca: "Redragon",
    categoria: "perifericos",
    subcategoria: "Headsets",
    estoque: "Disponível",
    destaque: false,
    ativo: true,
    imagem: "imagem/headset_gamer.jpg",
    galeria: ["imagem/headset_gamer.jpg"],
    garantia: "12 Meses com Fabricante",
    resumo: "Áudio surround 7.1 virtual com cancelamento de ruído passivo e almofadas ultra confortáveis.",
    especificacoes: [
      "Drivers de 50mm de alta fidelidade",
      "Microfone omnidirecional removível com filtro anti-ruído",
      "Conexão USB Plug & Play banhada a ouro",
      "Controle de volume e mute no cabo"
    ],
    descricao: "Imersão sonora de alta definição para jogos e comunicação clara."
  },
  {
    id: "prod-4",
    nome: "SSD NVMe M.2 1TB Ultra Velocidade Read 3500MB/s",
    sku: "JC-SSD-004",
    codigo: "JC-SSD-004",
    marca: "Kingston",
    categoria: "componentes",
    subcategoria: "SSD",
    estoque: "Disponível",
    destaque: true,
    ativo: true,
    imagem: "imagem/ssd_hardware.jpg",
    galeria: ["imagem/ssd_hardware.jpg"],
    garantia: "3 Anos com Fabricante",
    resumo: "Inicialização do Windows em 5 segundos e carregamento instantâneo de jogos e programas.",
    especificacoes: [
      "Leitura Sequencial: até 3500 MB/s",
      "Gravação Sequencial: até 2100 MB/s",
      "Formato M.2 2280 PCIe NVMe Gen 3.0 x4",
      "Instalação e Formatação inclusas na bancada"
    ],
    descricao: "Upgrade essencial para máxima velocidade no seu computador ou notebook."
  },
  {
    id: "prod-5",
    nome: "Mouse Gamer Redragon RGB 12.400 DPI Ergonômico",
    sku: "JC-RED-005",
    codigo: "JC-RED-005",
    marca: "Redragon",
    categoria: "perifericos",
    subcategoria: "Mouses",
    estoque: "Disponível",
    destaque: false,
    ativo: true,
    imagem: "imagem/redrogomoba.png",
    galeria: ["imagem/redrogomoba.png"],
    garantia: "12 Meses com Fabricante",
    resumo: "Sensor óptico Pixart de altíssima precisão com 7 botões programáveis via software.",
    especificacoes: [
      "Sensor Óptico Pixart ajustável até 12.400 DPI",
      "7 Botões totalmente programáveis",
      "Switches de alta durabilidade (20 milhões de cliques)",
      "Base de Teflon para deslize suave"
    ],
    descricao: "Mouse ergonômico feito para alta precisão e conforto prolongado."
  },
  {
    id: "prod-6",
    nome: "Roteador TP-Link Dual Band AC1200 Archer C6 Gigabit",
    sku: "JC-TPL-006",
    codigo: "JC-TPL-006",
    marca: "TP-Link",
    categoria: "redes",
    subcategoria: "Roteadores",
    estoque: "Disponível",
    destaque: false,
    ativo: true,
    imagem: "imagem/roteador_tplink.jpg",
    galeria: ["imagem/roteador_tplink.jpg"],
    garantia: "5 Anos com Fabricante",
    resumo: "Wi-Fi Dual Band (2.4GHz + 5GHz) com 4 antenas externas de alto ganho e portas Gigabit.",
    especificacoes: [
      "Velocidade Wi-Fi: 300 Mbps em 2.4 GHz + 867 Mbps em 5 GHz",
      "4 Antenas externas com tecnologia Beamforming",
      "4 Portas LAN Gigabit + 1 Porta WAN Gigabit",
      "Modo Access Point integrado"
    ],
    descricao: "Conexão de excelente estabilidade para residências e escritórios."
  },

  // ===== ITENS OFICIAIS DO RELATÓRIO DE ESTOQUE (CLIPP) =====
  {
    id: "prod-71995",
    nome: "Kit Keycaps ABNT2 RM PBT A108 Preto - Redragon",
    sku: "71995",
    codigo: "71995",
    marca: "Redragon",
    categoria: "perifericos",
    subcategoria: "Teclados",
    estoque: "Disponível",
    destaque: false,
    ativo: true,
    imagem: "imagem/teclado_redragon.jpg",
    galeria: ["imagem/teclado_redragon.jpg"],
    garantia: "12 Meses com Fabricante",
    resumo: "Kit de keycaps de reposição PBT Double-Shot padrão ABNT2 para teclados mecânicos Redragon.",
    especificacoes: [
      "Material PBT de alta durabilidade",
      "Padrão ABNT2 com Ç",
      "Injeção Double-Shot (letras não apagam)",
      "Compatível com switches Cherry MX e Outemu"
    ],
    descricao: "Kit de teclas de alta durabilidade para personalizar ou renovar seu teclado mecânico."
  },
  {
    id: "prod-80198",
    nome: "Teclado Básico Slim Preto USB TC213 - Multilaser",
    sku: "80198",
    codigo: "80198",
    marca: "Multilaser",
    categoria: "perifericos",
    subcategoria: "Teclados",
    estoque: "Disponível",
    destaque: false,
    ativo: true,
    imagem: "imagem/teclado_redragon.jpg",
    galeria: ["imagem/teclado_redragon.jpg"],
    garantia: "12 Meses com Fabricante",
    resumo: "Teclado USB básico slim com teclas macias e perfil silencioso para escritório.",
    especificacoes: [
      "Conexão USB Plug & Play",
      "Padrão ABNT2 com teclado numérico",
      "Perfil Slim compacto",
      "Teclas de membrana silenciosas"
    ],
    descricao: "Teclado confortável e prático para o uso diário em computadores de trabalho."
  },
  {
    id: "prod-45597",
    nome: "Teclado Multimídia Genius Slimstar 820 Preto ABNT2",
    sku: "45597",
    codigo: "45597",
    marca: "Genius",
    categoria: "perifericos",
    subcategoria: "Teclados",
    estoque: "Disponível",
    destaque: false,
    ativo: true,
    imagem: "imagem/teclado_redragon.jpg",
    galeria: ["imagem/teclado_redragon.jpg"],
    garantia: "12 Meses com Fabricante",
    resumo: "Teclado multimídia slim com teclas de atalho rápido e design elegante Genius.",
    especificacoes: [
      "Teclas de atalho multimídia dedicadas",
      "Padrão ABNT2",
      "Conexão USB reforçada",
      "Teclas estilo chocolate de toque suave"
    ],
    descricao: "Excelente opção para quem busca controle multimídia e digitação agradável."
  },
  {
    id: "prod-39554",
    nome: "Teclado Mecânico Gamer Redragon Dark Avenger K568RGB-2 Blue",
    sku: "39554",
    codigo: "39554",
    marca: "Redragon",
    categoria: "perifericos",
    subcategoria: "Teclados Gamer",
    estoque: "Disponível",
    destaque: true,
    ativo: true,
    imagem: "imagem/teclado_redragon.jpg",
    galeria: ["imagem/teclado_redragon.jpg"],
    garantia: "12 Meses com Fabricante",
    resumo: "Teclado mecânico compacto Tenkeyless (TKL) com iluminação RGB e Switch Blue.",
    especificacoes: [
      "Formato TKL compacto (sem numérico)",
      "Switches Mecânicos Outemu Blue (Clicky)",
      "Iluminação RGB com vários modos",
      "100% Anti-Ghosting N-Key Rollover",
      "Layout ABNT2"
    ],
    descricao: "Teclado mecânico compacto perfeito para setups gamer de alto desempenho."
  },
  {
    id: "prod-42059",
    nome: "Teclado Mecânico Redragon Dark Avenger K568 Preto",
    sku: "42059",
    codigo: "42059",
    marca: "Redragon",
    categoria: "perifericos",
    subcategoria: "Teclados Gamer",
    estoque: "Disponível",
    destaque: false,
    ativo: true,
    imagem: "imagem/teclado_redragon.jpg",
    galeria: ["imagem/teclado_redragon.jpg"],
    garantia: "12 Meses com Fabricante",
    resumo: "Teclado mecânico TKL reforçado com switches mecânicos e resposta tátil precisa.",
    especificacoes: [
      "Formato compacto TKL",
      "Switches mecânicos de alta resposta",
      "Construção metálica em ABS reforçado",
      "Padrão ABNT2"
    ],
    descricao: "Design robusto e precisão para jogos competitivos."
  },
  {
    id: "prod-380710",
    nome: "Teclado Membrana Gamer Redragon Netherbane K521-R PT",
    sku: "380710",
    codigo: "380710",
    marca: "Redragon",
    categoria: "perifericos",
    subcategoria: "Teclados Gamer",
    estoque: "Disponível",
    destaque: false,
    ativo: true,
    imagem: "imagem/teclado_redragon.jpg",
    galeria: ["imagem/teclado_redragon.jpg"],
    garantia: "12 Meses com Fabricante",
    resumo: "Teclado gamer de membrana com sensação mecânica e iluminação Rainbow.",
    especificacoes: [
      "Teclas de membrana com resposta tátil firme",
      "Iluminação LED Rainbow",
      "Teclas Anti-Ghosting para jogos",
      "Padrão ABNT2"
    ],
    descricao: "Combina o conforto da membrana com o estilo gamer e iluminação vibrante."
  },
  {
    id: "prod-695047",
    nome: "Teclado Mecânico Redragon Kala RGB Branco Switch Preto",
    sku: "695047",
    codigo: "695047",
    marca: "Redragon",
    categoria: "perifericos",
    subcategoria: "Teclados Gamer",
    estoque: "Disponível",
    destaque: true,
    ativo: true,
    imagem: "imagem/teclado_redragon.jpg",
    galeria: ["imagem/teclado_redragon.jpg"],
    garantia: "12 Meses com Fabricante",
    resumo: "Teclado mecânico premium na cor branca com iluminação RGB e Switch Preto linear.",
    especificacoes: [
      "Acabamento branco elegante",
      "Switches Mecânicos Outemu Black (Lineares e Silenciosos)",
      "Iluminação RGB individual por tecla",
      "Teclas Anti-Ghosting completas",
      "Padrão ABNT2"
    ],
    descricao: "Teclado mecânico de alto padrão estético e digitação linear extremamente suave."
  },
  {
    id: "prod-58527",
    nome: "Teclado Mecânico Redragon Diti RGB One-Handed Switch Azul",
    sku: "58527",
    codigo: "58527",
    marca: "Redragon",
    categoria: "perifericos",
    subcategoria: "Teclados Gamer",
    estoque: "Disponível",
    destaque: true,
    ativo: true,
    imagem: "imagem/teclado_redragon.jpg",
    galeria: ["imagem/teclado_redragon.jpg"],
    garantia: "12 Meses com Fabricante",
    resumo: "Teclado mecânico de uma mão (Keypad Gamer) com apoio de pulso e teclas macro programáveis.",
    especificacoes: [
      "Formato One-Handed (uma mão) ergonômico",
      "Apoio de pulso magnético removível",
      "5 Teclas de macro dedicadas",
      "Iluminação RGB Chroma",
      "Switches Mecânicos Outemu Blue"
    ],
    descricao: "Perfeito para jogadores de FPS e MOBA que buscam ergonomia e espaço livre no mousepad."
  },
  {
    id: "prod-551456",
    nome: "Teclado Mecânico Gamer Redragon Mitra RGB Switch Azul",
    sku: "551456",
    codigo: "551456",
    marca: "Redragon",
    categoria: "perifericos",
    subcategoria: "Teclados Gamer",
    estoque: "Disponível",
    destaque: true,
    ativo: true,
    imagem: "imagem/teclado_redragon.jpg",
    galeria: ["imagem/teclado_redragon.jpg"],
    garantia: "12 Meses com Fabricante",
    resumo: "Teclado mecânico full-size clássico da Redragon com iluminação RGB e Switch Blue.",
    especificacoes: [
      "Formato Full-Size com teclado numérico",
      "Switches Mecânicos Outemu Blue",
      "Iluminação RGB Chroma ajustável",
      "Construção metálica reforçada",
      "Padrão ABNT2"
    ],
    descricao: "Um dos teclados mecânicos mais vendidos e recomendados para gamers e programadores."
  },
  {
    id: "prod-199409",
    nome: "Teclado Gamer Mecânico PCYes Kuromori 60% Switch Red",
    sku: "199409",
    codigo: "199409",
    marca: "PCYes",
    categoria: "perifericos",
    subcategoria: "Teclados Gamer",
    estoque: "Disponível",
    destaque: true,
    ativo: true,
    imagem: "imagem/teclado_redragon.jpg",
    galeria: ["imagem/teclado_redragon.jpg"],
    garantia: "12 Meses com Fabricante",
    resumo: "Teclado mecânico ultracompacto formato 60% com switches Red lineares e cabo USB-C removível.",
    especificacoes: [
      "Formato 60% ultracompacto",
      "Switches Mecânicos Red (lineares e leves)",
      "Cabo USB Type-C removível",
      "Iluminação RGB customizável",
      "Padrão ABNT2"
    ],
    descricao: "Máximo espaço na mesa para movimentação de mouse em jogos competitivos."
  },
  {
    id: "prod-6950376726377",
    nome: "Combo Teclado + Mouse Gamer Redragon Preto BS-7094",
    sku: "6950376726377",
    codigo: "6950376726377",
    marca: "Redragon",
    categoria: "perifericos",
    subcategoria: "Combos Teclado e Mouse",
    estoque: "Disponível",
    destaque: true,
    ativo: true,
    imagem: "imagem/teclado_redragon.jpg",
    galeria: ["imagem/teclado_redragon.jpg", "imagem/redrogomoba.png"],
    garantia: "12 Meses com Fabricante",
    resumo: "Kit gamer completo Redragon contendo teclado ergonômico e mouse de alta precisão.",
    especificacoes: [
      "Teclado gamer com iluminação e teclas de atalho",
      "Mouse ergonômico com sensor de alta precisão",
      "Conexão USB Plug & Play",
      "Padrão ABNT2"
    ],
    descricao: "Solução completa e prática para montar seu kit gamer com qualidade Redragon."
  },
  {
    id: "prod-90562",
    nome: "Combo Teclado Slim e Mouse Logitech MK120 USB Preto",
    sku: "90562",
    codigo: "90562",
    marca: "Logitech",
    categoria: "perifericos",
    subcategoria: "Combos Teclado e Mouse",
    estoque: "Disponível",
    destaque: true,
    ativo: true,
    imagem: "imagem/teclado_redragon.jpg",
    galeria: ["imagem/teclado_redragon.jpg"],
    garantia: "3 Anos com Fabricante",
    resumo: "Kit teclado e mouse USB oficial Logitech com durabilidade comprovada e design à prova de respingos.",
    especificacoes: [
      "Teclado Slim resistente a derramamento de líquidos",
      "Mouse óptico de alta definição 1000 DPI",
      "Conexão USB Plug & Play sem necessidade de drivers",
      "Padrão ABNT2 completo",
      "3 Anos de garantia oficial Logitech"
    ],
    descricao: "O combo mais confiável para escritório, home office e empresas em Nova Petrópolis."
  },
  {
    id: "prod-077368",
    nome: "Teclado Sem Fio Bluetooth K-BT40BK Mini Preto - C3Tech",
    sku: "077368",
    codigo: "077368",
    marca: "C3Tech",
    categoria: "perifericos",
    subcategoria: "Teclados Bluetooth",
    estoque: "Disponível",
    destaque: false,
    ativo: true,
    imagem: "imagem/teclado_redragon.jpg",
    galeria: ["imagem/teclado_redragon.jpg"],
    garantia: "12 Meses com Fabricante",
    resumo: "Mini teclado sem fio Bluetooth para notebooks, tablets, smartphones e Smart TVs.",
    especificacoes: [
      "Conexão Bluetooth sem fio de longo alcance",
      "Design compacto e ultrafino",
      "Compatível com Windows, Android e iOS",
      "Teclas de atalho multimídia"
    ],
    descricao: "Praticidade e mobilidade para digitar no tablet, celular ou computador portátil."
  },
  {
    id: "prod-035984",
    nome: "Kit Teclado e Mouse Sem Fio K-W11BK Preto - C3Plus",
    sku: "035984",
    codigo: "035984",
    marca: "C3Plus",
    categoria: "perifericos",
    subcategoria: "Combos Teclado e Mouse",
    estoque: "Disponível",
    destaque: false,
    ativo: true,
    imagem: "imagem/teclado_redragon.jpg",
    galeria: ["imagem/teclado_redragon.jpg"],
    garantia: "12 Meses com Fabricante",
    resumo: "Kit sem fio 2.4GHz teclado e mouse com receptor USB nano único.",
    especificacoes: [
      "Conexão sem fio 2.4GHz estável",
      "Receptor USB Nano único para teclado e mouse",
      "Economia inteligente de energia de bateria",
      "Padrão ABNT2"
    ],
    descricao: "Elimine os fios da sua mesa com este kit prático e confiável."
  }
];

// GERENCIADOR FIRESTORE + LOCALSTORAGE CMS STORE
export class ProductStore {
  static STORAGE_KEY = 'jc_products_catalog_v50';

  static logError(context, err) {
    console.error(`[JC Firebase Error] ${context}:`, err);
  }

  static getProducts() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        this.saveProducts(INITIAL_PRODUCTS_V40);
        return INITIAL_PRODUCTS_V40;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length < INITIAL_PRODUCTS_V40.length) {
        this.saveProducts(INITIAL_PRODUCTS_V40);
        return INITIAL_PRODUCTS_V40;
      }
      return parsed;
    } catch (e) {
      this.logError('LocalStorage Read', e);
      return INITIAL_PRODUCTS_V40;
    }
  }

  static async getProductsAsync() {
    // Simula consulta assíncrona do Firestore com fallback resiliente
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getActiveProducts());
      }, 150);
    });
  }

  static getActiveProducts() {
    const products = this.getProducts();
    return products.filter(p => p.ativo !== false).sort((a, b) => (a.ordem || 99) - (b.ordem || 99));
  }

  static saveProducts(products) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      this.logError('LocalStorage Save', e);
    }
  }

  static getProductById(id) {
    if (!id) return null;
    const products = this.getProducts();
    const clean = String(id).trim().toLowerCase();
    return products.find(p => 
      String(p.id).toLowerCase() === clean ||
      String(p.codigo || '').toLowerCase() === clean ||
      String(p.sku || '').toLowerCase() === clean
    ) || null;
  }

  static async getProductByIdAsync(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getProductById(id));
      }, 100);
    });
  }

  static addProduct(newProd) {
    const products = this.getProducts();
    newProd.id = 'prod-' + Date.now();
    newProd.ativo = newProd.ativo !== false;
    newProd.ordem = newProd.ordem || (products.length + 1);
    newProd.tags = newProd.tags || [];
    products.unshift(newProd);
    this.saveProducts(products);
    return newProd;
  }

  static updateProduct(id, updatedData) {
    let products = this.getProducts();
    products = products.map(p => {
      if (String(p.id) === String(id)) {
        return { ...p, ...updatedData };
      }
      return p;
    });
    this.saveProducts(products);
  }

  static deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => String(p.id) !== String(id));
    this.saveProducts(products);
  }

  static toggleStatus(id) {
    let products = this.getProducts();
    products = products.map(p => {
      if (String(p.id) === String(id)) {
        p.ativo = !p.ativo;
      }
      return p;
    });
    this.saveProducts(products);
  }

  // SIMULADOR DE UPLOAD FIREBASE STORAGE PARA IMAGENS
  static async uploadImageToStorage(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('Nenhum arquivo de imagem selecionado.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        // Retorna a URL base64/DataURL simulando a URL do Firebase Storage
        resolve(e.target.result);
      };
      reader.onerror = (err) => {
        this.logError('Firebase Storage Upload', err);
        reject(err);
      };
      reader.readAsDataURL(file);
    });
  }
}
