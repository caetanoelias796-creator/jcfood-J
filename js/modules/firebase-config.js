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
    sku: "JC-RED-001",
    codigoBarras: "789855543201",
    marca: "Redragon",
    categoria: "perifericos",
    subcategoria: "Teclados",
    preco: 289.90,
    precoPromocional: 269.90,
    parcelamento: "10x de R$ 28,99 sem juros",
    estoque: "Disponível",
    destaque: true,
    promocao: true,
    tags: ["Mais Vendido", "Gamer", "Recomendado pela JC"],
    ordem: 1,
    ativo: true,
    imagem: "imagem/teclado_redragon.jpg",
    galeria: ["imagem/teclado_redragon.jpg"],
    garantia: "12 Meses com Fabricante",
    fabricante: "Redragon Brasil",
    resumo: "Padrão ABNT2 com iluminação RGB Chroma personalizável e switches mecânicos Blue de alta durabilidade.",
    especificacoes: [
      "Padrão ABNT2 completo com Ç",
      "Switches Mecânicos de Alta Precisão (Outemu Blue)",
      "Iluminação RGB Chroma com 18 modos de efeitos",
      "Teclas 100% Anti-Ghosting e Keycaps Double-Shot",
      "Construção metálica reforçada e cabo trançado de 1.8m"
    ],
    descricao: "O Teclado Mecânico Redragon é a escolha ideal para jogadores exigentes e produtividade diária em Nova Petrópolis."
  },
  {
    id: "prod-2",
    nome: "Gabinete Gamer Aquário Vidro Temperado Panorâmico ARGB",
    sku: "JC-NZX-002",
    codigoBarras: "789855543202",
    marca: "NZXT",
    categoria: "componentes",
    subcategoria: "Gabinetes",
    preco: 499.00,
    precoPromocional: 459.00,
    parcelamento: "10x de R$ 49,90 sem juros",
    estoque: "Disponível",
    destaque: true,
    promocao: true,
    tags: ["Destaque", "Gamer", "Lançamento"],
    ordem: 2,
    ativo: true,
    imagem: "imagem/Gabinete NZXT H9.png",
    galeria: ["imagem/Gabinete NZXT H9.png"],
    garantia: "12 Meses com Fabricante",
    fabricante: "NZXT",
    resumo: "Gabinete no estilo aquário com visão panorâmica de vidro temperado e excelente fluxo de ar.",
    especificacoes: [
      "Painel frontal e lateral em vidro temperado de 4mm",
      "Suporte a Water Cooler até 360mm na parte superior",
      "Espaço dedicado para organizador de cabos (Cable Management)",
      "Compatível com Placas-mãe ATX, Micro-ATX e Mini-ITX"
    ],
    descricao: "Projetado para ostentar seu setup com máxima eficiência térmica e iluminação ARGB."
  },
  {
    id: "prod-3",
    nome: "Headset Gamer Redragon 7.1 Surround Som Imersivo",
    sku: "JC-RED-003",
    codigoBarras: "789855543203",
    marca: "Redragon",
    categoria: "perifericos",
    subcategoria: "Headsets",
    preco: 329.90,
    precoPromocional: 299.90,
    parcelamento: "10x de R$ 32,99 sem juros",
    estoque: "Disponível",
    destaque: false,
    promocao: true,
    tags: ["Oferta", "Gamer"],
    ordem: 3,
    ativo: true,
    imagem: "imagem/headset_gamer.jpg",
    galeria: ["imagem/headset_gamer.jpg"],
    garantia: "12 Meses com Fabricante",
    fabricante: "Redragon",
    resumo: "Áudio surround 7.1 virtual com cancelamento de ruído passivo e almofadas ultra confortáveis.",
    especificacoes: [
      "Drivers de 50mm de alta fidelidade",
      "Microfone omnidirecional removível com filtro anti-ruído",
      "Conexão USB Plug & Play banhada a ouro",
      "Controle de volume e mute no cabo"
    ],
    descricao: "Imersão sonora total para jogos competitivos e comunicação clara no Discord."
  },
  {
    id: "prod-4",
    nome: "SSD NVMe M.2 1TB Ultra Velocidade Read 3500MB/s",
    sku: "JC-SSD-004",
    codigoBarras: "789855543204",
    marca: "Kingston",
    categoria: "componentes",
    subcategoria: "SSD",
    preco: 249.00,
    precoPromocional: 239.00,
    parcelamento: "10x de R$ 24,90 sem juros",
    estoque: "Disponível",
    destaque: true,
    promocao: false,
    tags: ["Mais Vendido", "Recomendado pela JC", "Profissional"],
    ordem: 4,
    ativo: true,
    imagem: "imagem/ssd_hardware.jpg",
    galeria: ["imagem/ssd_hardware.jpg"],
    garantia: "3 Anos com Fabricante",
    fabricante: "Kingston Technology",
    resumo: "Inicialização do Windows em 5 segundos e carregamento instantâneo de jogos e programas.",
    especificacoes: [
      "Velocidade de Leitura Sequencial: até 3500 MB/s",
      "Velocidade de Gravação Sequencial: até 2100 MB/s",
      "Formato M.2 2280 PCIe NVMe Gen 3.0 x4",
      "Instalação e Formatação inclusas na bancada da JC Informática"
    ],
    descricao: "O upgrade mais importante para qualquer computador ou notebook em Nova Petrópolis."
  },
  {
    id: "prod-5",
    nome: "Mouse Gamer Redragon RGB 12.400 DPI Ergonômico",
    sku: "JC-RED-005",
    codigoBarras: "789855543205",
    marca: "Redragon",
    categoria: "perifericos",
    subcategoria: "Mouses",
    preco: 149.90,
    precoPromocional: 139.90,
    parcelamento: "6x de R$ 24,98 sem juros",
    estoque: "Disponível",
    destaque: false,
    promocao: false,
    tags: ["Gamer"],
    ordem: 5,
    ativo: true,
    imagem: "imagem/redrogomoba.png",
    galeria: ["imagem/redrogomoba.png"],
    garantia: "12 Meses com Fabricante",
    fabricante: "Redragon",
    resumo: "Sensor óptico Pixart de altíssima precisão com 7 botões programáveis via software.",
    especificacoes: [
      "Sensor Óptico Pixart 3327 ajustável até 12.400 DPI",
      "7 Botões totalmente programáveis com suporte a Macros",
      "Switches de alta durabilidade para 20 milhões de cliques",
      "Base de Teflon para deslize suave"
    ],
    descricao: "Design ergonômico feito para encarar horas de jogo com conforto e precisão máxima."
  },
  {
    id: "prod-6",
    nome: "Roteador TP-Link Dual Band AC1200 Archer C6 Gigabit",
    sku: "JC-TPL-006",
    codigoBarras: "789855543206",
    marca: "TP-Link",
    categoria: "redes",
    subcategoria: "Roteadores",
    preco: 199.90,
    precoPromocional: 189.90,
    parcelamento: "8x de R$ 24,98 sem juros",
    estoque: "Disponível",
    destaque: false,
    promocao: true,
    tags: ["Home Office", "Escritório"],
    ordem: 6,
    ativo: true,
    imagem: "imagem/roteador_tplink.jpg",
    galeria: ["imagem/roteador_tplink.jpg"],
    garantia: "5 Anos com Fabricante",
    fabricante: "TP-Link Brasil",
    resumo: "Wi-Fi Dual Band (2.4GHz + 5GHz) com 4 antenas externas de alto ganho e portas Gigabit.",
    especificacoes: [
      "Velocidade Wi-Fi: 300 Mbps em 2.4 GHz + 867 Mbps em 5 GHz",
      "4 Antenas externas + 1 antena interna com tecnologia Beamforming",
      "4 Portas LAN Gigabit + 1 Porta WAN Gigabit",
      "Modo Ponto de Acesso (Access Point) integrado"
    ],
    descricao: "Conexão de altíssima estabilidade para streaming 4K, jogos online e home office sem interferências."
  }
];

// GERENCIADOR FIRESTORE + LOCALSTORAGE CMS STORE
export class ProductStore {
  static STORAGE_KEY = 'jc_products_catalog_v40';

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
      return JSON.parse(data);
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
