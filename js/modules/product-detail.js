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
    const prodCode = p.codigo || p.sku || 'JC-STORE';
    const priceNum = parseFloat(p.preco);
    const promoNum = p.precoPromocional ? parseFloat(p.precoPromocional) : (priceNum * 0.95);
    
    const formattedPrice = promoNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const formattedOriginal = (p.preco && p.preco > promoNum) ? priceNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : null;
    const installmentText = p.parcelamento || `10x de ${(priceNum/10).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros`;

    const galleryImages = p.galeria && p.galeria.length > 0 ? p.galeria : [p.imagem];
    const mainImg = galleryImages[0];

    // FORMATO DE MENSAGEM DO WHATSAPP RIGOROSAMENTE CONFORME EXIGIDO
    const waTextRaw = `Olá!\n\nTenho interesse no produto:\n\n${prodName}\n\nCódigo: ${prodCode}\n\nPreço: ${formattedPrice}\n\nVi este produto no site da JC Informática e gostaria de mais informações.`;
    const waUrl = `https://wa.me/555432814464?text=${encodeURIComponent(waTextRaw)}`;

    const specsListHTML = (p.especificacoes || p.specs || []).map(s => `
      <tr>
        <td><i class="fas fa-check-circle" style="color: var(--blue);"></i> ${s}</td>
      </tr>
    `).join('');

    const pageUrl = window.location.href;

    this.container.innerHTML = `
      <!-- BREADCRUMB -->
      <nav class="breadcrumb-nav" aria-label="Navegação caminho de pão">
        <div class="container">
          <ul class="breadcrumb-list">
            <li><a href="/">Início</a></li>
            <li><i class="fas fa-chevron-right"></i></li>
            <li><a href="produtos">Produtos</a></li>
            <li><i class="fas fa-chevron-right"></i></li>
            <li><a href="produtos" class="active-cat">${p.categoria}</a></li>
            <li><i class="fas fa-chevron-right"></i></li>
            <li class="active">${prodName}</li>
          </ul>
        </div>
      </nav>

      <!-- PRODUCT MAIN CONTAINER -->
      <section class="product-detail-section">
        <div class="container product-detail-inner">
          
          <!-- ESQUERDA: GALERIA DE FOTOS COM ZOOM -->
          <div class="product-gallery-block">
            <div class="main-image-stage" id="image-zoom-stage">
              <span class="gallery-badge"><i class="fas fa-shield-alt"></i> Garantia Oficial JC</span>
              <img id="main-product-img" src="${mainImg}" alt="${prodName}" />
            </div>
            ${galleryImages.length > 1 ? `
              <div class="gallery-thumbnails">
                ${galleryImages.map((imgUrl, idx) => `
                  <button type="button" class="thumb-btn ${idx === 0 ? 'active' : ''}" data-src="${imgUrl}">
                    <img src="${imgUrl}" alt="Foto ${idx + 1}" />
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- DIREITA: PAINEL DE COMPRA & PREÇOS -->
          <div class="product-buy-block">
            <div class="product-header-info">
              <div class="product-tags-row">
                <span class="brand-badge">${p.marca || 'JC Informática'}</span>
                ${p.subcategoria ? `<span class="subcat-tag-badge"><i class="fas fa-layer-group"></i> ${p.subcategoria}</span>` : ''}
                <span class="sku-tag">SKU: ${prodCode}</span>
                <span class="stock-status-badge ${p.estoque === 'Sob Encomenda' ? 'pre-order' : 'in-stock'}">
                  <i class="fas ${p.estoque === 'Sob Encomenda' ? 'fa-clock' : 'fa-check'}"></i> ${p.estoque || 'Disponível'}
                </span>
              </div>
              <h1 class="product-page-title">${prodName}</h1>
              
              <!-- TAGS DO PRODUTO -->
              ${(p.tags && p.tags.length > 0) ? `
                <div class="product-tags-badges-list" style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;">
                  ${p.tags.map(t => `<span class="prod-tag-pill">${t}</span>`).join('')}
                </div>
              ` : ''}
            </div>

            <!-- QUADRO DE PREÇOS KABUM / APPLE / DELL -->
            <div class="price-highlight-card">
              ${formattedOriginal ? `
                <div class="original-price-row">
                  De: <span class="old-price">${formattedOriginal}</span>
                  <span class="discount-pill">Economize ${(priceNum - promoNum).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              ` : ''}

              <div class="pix-price-box">
                <span class="pix-label">Preço à vista no Pix / Dinheiro:</span>
                <div class="pix-val">${formattedPrice}</div>
              </div>

              <div class="card-price-box">
                <i class="far fa-credit-card"></i> Ou em <strong>${installmentText}</strong> no cartão
              </div>
            </div>

            <!-- BOTÃO UNIFICADO WHATSAPP (ÚNICO BOTÃO DE COMPRA) -->
            <div class="product-actions-group">
              <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp buy-wa-large-btn">
                <i class="fab fa-whatsapp"></i> Comprar pelo WhatsApp
              </a>
            </div>

            <!-- COMPARTILHAMENTO SOCIAL -->
            <div class="social-share-row">
              <span class="share-label"><i class="fas fa-share-alt"></i> Compartilhar:</span>
              <a href="https://api.whatsapp.com/send?text=${encodeURIComponent('Confira este produto na JC Informática: ' + prodName + ' - ' + pageUrl)}" target="_blank" rel="noopener" class="share-btn share-wa" title="Compartilhar no WhatsApp">
                <i class="fab fa-whatsapp"></i>
              </a>
              <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}" target="_blank" rel="noopener" class="share-btn share-fb" title="Compartilhar no Facebook">
                <i class="fab fa-facebook-f"></i>
              </a>
              <button type="button" id="copy-product-link-btn" class="share-btn share-copy" title="Copiar Link">
                <i class="fas fa-link"></i>
              </button>
              <span id="copy-toast" class="copy-toast" style="display:none;">Link copiado!</span>
            </div>

            <!-- VANTAGENS RÁPIDAS LOJA FÍSICA -->
            <div class="store-guarantees-grid">
              <div class="guarantee-item">
                <i class="fas fa-store"></i>
                <div>
                  <strong>Retirada na Loja</strong>
                  <span>Av. 15 de Novembro, 1540 - NP</span>
                </div>
              </div>
              <div class="guarantee-item">
                <i class="fas fa-tools"></i>
                <div>
                  <strong>Suporte &amp; Teste na Hora</strong>
                  <span>Bancada técnica presencial</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- ABAS DE INFORMAÇÕES E ESPECIFICAÇÕES -->
      <section class="product-specs-section">
        <div class="container">
          <div class="specs-tab-wrapper">
            <h2 class="specs-section-title"><i class="fas fa-list-alt"></i> Especificações Técnicas</h2>
            
            <p class="product-description-text">${p.descricao || 'Produto de alta qualidade com garantia de procedência e suporte técnico especializado da JC Informática.'}</p>

            <table class="specs-table">
              <tbody>
                ${specsListHTML}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- PRODUTOS RELACIONADOS -->
      <section class="related-products-section">
        <div class="container">
          <h2 class="related-section-title"><i class="fas fa-fire"></i> Produtos Relacionados da Mesma Categoria</h2>
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
      const formattedPrice = (p.precoPromocional || p.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const productUrl = `produto.html?id=${encodeURIComponent(p.id)}`;

      html += `
        <article class="product-card">
          <a href="${productUrl}" class="product-image-wrapper">
            <img src="${p.imagem}" alt="${prodName}" loading="lazy" />
          </a>
          <div class="product-info">
            <h3 class="product-title"><a href="${productUrl}">${prodName}</a></h3>
            <div class="product-footer">
              <span class="price-value">${formattedPrice}</span>
              <a href="${productUrl}" class="btn btn-primary product-buy-btn">Ver Produto</a>
            </div>
          </div>
        </article>
      `;
    });
    gridEl.innerHTML = html;
  }
}
