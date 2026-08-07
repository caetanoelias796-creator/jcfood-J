/* ============================================================
   SINGLE PRODUCT DETAIL ENGINE (produto.html)
   Inspirado nas páginas de produto Apple, Dell, Kabum & Pichau
   ============================================================ */
import { ProductStore } from './firebase-config.js';
import { injectProductSEO } from './seo-schema.js';

export class ProductDetailEngine {
  constructor() {
    this.container = document.getElementById('product-detail-container');
    if (!this.container) return;
    this.init();
  }

  getProductIDFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  async init() {
    this.productId = this.getProductIDFromURL();

    // 1. Tenta buscar no ProductStore (LocalStorage / Memory)
    this.product = ProductStore.getProductById(this.productId);

    // 2. Se não encontrou, tenta buscar em produtos.json como fallback dinâmico
    if (!this.product && this.productId) {
      try {
        const res = await fetch('produtos.json');
        if (res.ok) {
          const jsonProducts = await res.json();
          const clean = String(this.productId).trim().toLowerCase();
          this.product = jsonProducts.find(p => 
            String(p.id).toLowerCase() === clean || 
            String(p.codigo || '').toLowerCase() === clean || 
            String(p.sku || '').toLowerCase() === clean
          );
        }
      } catch (err) {
        console.warn('Erro ao carregar produtos.json fallback:', err);
      }
    }

    // 3. Se não houver ID informado na URL, carrega o primeiro produto disponível
    if (!this.product) {
      this.product = ProductStore.getActiveProducts()[0];
    }

    if (!this.product) {
      this.renderNotFound();
      return;
    }

    injectProductSEO(this.product);
    this.render();
    this.bindGalleryEvents();
    this.bindSocialShareEvents();
    this.renderRelatedProducts();
  }

  renderNotFound() {
    this.container.innerHTML = `
      <div class="container" style="padding: 100px 0; text-align: center;">
        <i class="fas fa-exclamation-triangle" style="font-size: 56px; color: #FFB800; margin-bottom: 20px;"></i>
        <h2>Produto não encontrado</h2>
        <p style="color: var(--gray); margin-bottom: 24px;">O produto que você procura não está mais disponível ou o link é inválido.</p>
        <a href="produtos" class="btn btn-primary"><i class="fas fa-arrow-left"></i> Voltar para o Catálogo</a>
      </div>
    `;
  }

  render() {
    const p = this.product;
    const prodName = p.nome || p.titulo;
    const prodBrand = p.marca || 'JC Informática';
    const prodStock = p.estoque || 'Disponível';
    const isPreOrder = prodStock === 'Sob Encomenda' || prodStock === 'Fora de Estoque';
    const shortDesc = p.resumo || p.descricao || 'Confira os detalhes e disponibilidade deste item na JC Informática.';
    const warranty = p.garantia || '';

    const galleryImages = p.galeria && p.galeria.length > 0 ? p.galeria : [p.imagem];
    const mainImg = galleryImages[0] || 'imagem/teclado_redragon.jpg';

    // Principais características (Máximo 6)
    const rawSpecs = p.especificacoes || p.specs || [];
    const mainFeatures = rawSpecs.slice(0, 6);

    const pageUrl = window.location.href;

    const refCode = p.codigo || p.sku || '-';
    // Mensagem automática para WhatsApp com Código de Referência
    const waTextRaw = `Olá! Tenho interesse no produto:\n\n*${prodName}*\n📌 Referência (Ref): ${refCode}\n🏷️ Marca: ${prodBrand}\n✅ Disponibilidade: ${prodStock}\n\nConfira no catálogo digital: ${pageUrl}`;
    const waUrl = `https://wa.me/555432814464?text=${encodeURIComponent(waTextRaw)}`;

    this.container.innerHTML = `
      <!-- BREADCRUMB -->
      <nav class="breadcrumb-nav" aria-label="Navegação caminho de pão">
        <div class="container">
          <ul class="breadcrumb-list">
            <li><a href="/">Início</a></li>
            <li><i class="fas fa-chevron-right"></i></li>
            <li><a href="produtos">Catálogo Digital</a></li>
            ${p.categoria ? `
              <li><i class="fas fa-chevron-right"></i></li>
              <li><a href="produtos?categoria=${encodeURIComponent(p.categoria)}" class="active-cat">${p.categoria}</a></li>
            ` : ''}
            <li><i class="fas fa-chevron-right"></i></li>
            <li class="active">${prodName}</li>
          </ul>
        </div>
      </nav>

      <!-- PRODUCT MAIN SHOWCASE CONTAINER (CATÁLOGO DIGITAL) -->
      <section class="product-detail-section">
        <div class="container product-detail-inner">
          
          <!-- ESQUERDA: FOTOS E GALERIA DO PRODUTO -->
          <div class="product-gallery-block">
            <div class="main-image-stage" id="image-zoom-stage">
              <span class="gallery-badge ${isPreOrder ? 'pre-order' : 'in-stock'}">
                <i class="fas ${isPreOrder ? 'fa-clock' : 'fa-check-circle'}"></i> ${prodStock}
              </span>
              <img id="main-product-img" src="${mainImg}" alt="${prodName}" />
            </div>
            ${galleryImages.length > 1 ? `
              <div class="gallery-thumbnails">
                ${galleryImages.map((imgUrl, idx) => `
                  <button type="button" class="thumb-btn ${idx === 0 ? 'active' : ''}" data-src="${imgUrl}" aria-label="Ver foto ${idx + 1}">
                    <img src="${imgUrl}" alt="Foto ${idx + 1} - ${prodName}" />
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- DIREITA: INFORMAÇÕES DO CATÁLOGO DIGITAL -->
          <div class="product-buy-block showcase-mode">
            <div class="product-header-info">
              <div class="product-tags-row">
                <span class="brand-badge"><i class="fas fa-tag"></i> ${prodBrand}</span>
                <span class="ref-code-badge" style="font-size: 12px; font-weight: 700; color: var(--blue-light); background: rgba(0, 55, 255, 0.15); padding: 4px 10px; border-radius: 8px; border: 1px solid rgba(0, 55, 255, 0.3);">
                  <i class="fas fa-barcode"></i> Ref: ${refCode}
                </span>
                <span class="stock-status-badge ${isPreOrder ? 'pre-order' : 'in-stock'}">
                  <i class="fas ${isPreOrder ? 'fa-clock' : 'fa-check'}"></i> ${prodStock}
                </span>
                ${warranty ? `
                  <span class="warranty-pill-tag">
                    <i class="fas fa-shield-alt"></i> Garantia: ${warranty}
                  </span>
                ` : ''}
              </div>
              <h1 class="product-page-title">${prodName}</h1>
            </div>

            <!-- DESCRIÇÃO CURTA -->
            <div class="showcase-short-desc">
              <p>${shortDesc}</p>
            </div>

            <!-- PRINCIPAIS CARACTERÍSTICAS (MÁXIMO 6) -->
            ${mainFeatures.length > 0 ? `
              <div class="showcase-features-box">
                <h3 class="features-box-title"><i class="fas fa-list-check"></i> Principais Características</h3>
                <ul class="features-bullet-list">
                  ${mainFeatures.map(feat => `
                    <li><i class="fas fa-check-circle"></i> <span>${feat}</span></li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}

            <!-- BOTÃO PRINCIPAL: TENHO INTERESSE NESTE PRODUTO -->
            <div class="product-actions-group">
              <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp buy-wa-large-btn showcase-primary-btn">
                <i class="fab fa-whatsapp"></i> 🟢 Tenho interesse neste produto
              </a>
            </div>

            <!-- COMPARTILHAMENTO E FERRAMENTAS PARA EQUIPE DE VENDAS -->
            <div class="social-share-row">
              <span class="share-label"><i class="fas fa-share-alt"></i> Enviar produto ao cliente:</span>
              <a href="https://api.whatsapp.com/send?text=${encodeURIComponent('Olá! Confira este produto em nossa vitrine digital JC Informática:\n\n*' + prodName + '*\nMarca: ' + prodBrand + '\n' + pageUrl)}" target="_blank" rel="noopener" class="share-btn share-wa" title="Enviar direto pelo WhatsApp">
                <i class="fab fa-whatsapp"></i> Enviar WhatsApp
              </a>
              <button type="button" id="copy-product-link-btn" class="share-btn share-copy" title="Copiar Link para envio">
                <i class="fas fa-link"></i> Copiar Link
              </button>
              <span id="copy-toast" class="copy-toast" style="display:none;">Link copiado com sucesso!</span>
            </div>

            <!-- INFORMAÇÕES DE ATENDIMENTO E LOJA FÍSICA -->
            <div class="store-guarantees-grid">
              <div class="guarantee-item">
                <i class="fas fa-store"></i>
                <div>
                  <strong>Visite Nossa Loja Física</strong>
                  <span>Av. 15 de Novembro, 1540 – Nova Petrópolis</span>
                </div>
              </div>
              <div class="guarantee-item">
                <i class="fas fa-comments"></i>
                <div>
                  <strong>Atendimento Direto</strong>
                  <span>Tire dúvidas e consulte disponibilidade pelo WhatsApp</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- PRODUTOS RELACIONADOS NA VITRINE -->
      <section class="related-products-section">
        <div class="container">
          <h2 class="related-section-title"><i class="fas fa-boxes"></i> Outros Produtos da Vitrine Digital</h2>
          <div class="products-grid" id="related-products-grid"></div>
        </div>
      </section>
    `;
  }

  bindGalleryEvents() {
    const mainImg = document.getElementById('main-product-img');
    const stage = document.getElementById('image-zoom-stage');
    const thumbs = document.querySelectorAll('.thumb-btn');

    thumbs.forEach(btn => {
      btn.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        const newSrc = btn.dataset.src;
        if (mainImg && newSrc) {
          mainImg.src = newSrc;
        }
      });
    });

    // Zoom no Hover
    if (stage && mainImg) {
      stage.addEventListener('mousemove', (e) => {
        const rect = stage.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        mainImg.style.transformOrigin = `${x}% ${y}%`;
        mainImg.style.transform = 'scale(1.8)';
      });

      stage.addEventListener('mouseleave', () => {
        mainImg.style.transformOrigin = 'center center';
        mainImg.style.transform = 'scale(1)';
      });
    }
  }

  bindSocialShareEvents() {
    const copyBtn = document.getElementById('copy-product-link-btn');
    const toast = document.getElementById('copy-toast');

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
          if (toast) {
            toast.style.display = 'inline-block';
            setTimeout(() => { toast.style.display = 'none'; }, 2500);
          }
        });
      });
    }
  }

  renderRelatedProducts() {
    const gridEl = document.getElementById('related-products-grid');
    if (!gridEl) return;

    const all = ProductStore.getActiveProducts();
    const related = all.filter(p => p.id !== this.product.id && p.categoria === this.product.categoria).slice(0, 3);
    const displayList = related.length > 0 ? related : all.filter(p => p.id !== this.product.id).slice(0, 3);

    let html = '';
    displayList.forEach(p => {
      const prodName = p.nome || p.titulo;
      const prodBrand = p.marca || 'JC Informática';
      const prodStock = p.estoque || 'Disponível';
      const productUrl = `produto.html?id=${encodeURIComponent(p.id)}`;

      html += `
        <article class="product-card">
          <a href="${productUrl}" class="product-image-wrapper">
            <span class="stock-badge in-stock"><i class="fas fa-check"></i> ${prodStock}</span>
            <img src="${p.imagem}" alt="${prodName}" loading="lazy" />
          </a>
          <div class="product-info">
            <div class="product-tags-row">
              <span class="brand-badge">${prodBrand}</span>
            </div>
            <h3 class="product-title"><a href="${productUrl}">${prodName}</a></h3>
            <div class="product-footer" style="margin-top: 14px; justify-content: flex-end;">
              <a href="${productUrl}" class="btn btn-outline" style="width: 100%; text-align: center;">Ver Detalhes</a>
            </div>
          </div>
        </article>
      `;
    });
    gridEl.innerHTML = html;
  }
}
