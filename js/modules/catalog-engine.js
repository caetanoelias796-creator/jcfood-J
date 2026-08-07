/* ============================================================
   CATÁALOG ENGINE V3.1 (produtos.html)
   Filtros Avançados por Categoria, Subcategoria, Marca, Preço, Tags e Estoque
   ============================================================ */
import { ProductStore, CATEGORIES_V31, AVAILABLE_TAGS } from './firebase-config.js';

export class CatalogEngine {
  constructor() {
    this.gridEl = document.getElementById('products-grid');
    if (!this.gridEl) return;

    this.searchInput = document.getElementById('catalog-search');
    this.brandSelect = document.getElementById('filter-brand');
    this.priceSlider = document.getElementById('filter-price');
    this.priceValLabel = document.getElementById('price-val-label');
    this.sortSelect = document.getElementById('sort-products');
    this.categoryPills = document.querySelectorAll('.cat-pill');

    // Módulos V3.1
    this.subcategoryContainer = document.getElementById('subcategory-pills-container');
    this.tagsContainer = document.getElementById('tags-pills-container');
    this.stockSelect = document.getElementById('filter-stock');
    this.promoToggle = document.getElementById('filter-promo-only');

    this.activeCategory = 'all';
    this.activeSubcategory = 'all';
    this.activeTag = 'all';
    this.products = ProductStore.getActiveProducts();

    this.init();
  }

  init() {
    this.populateBrands();
    this.renderSubcategories();
    this.renderTags();
    this.bindURLParams();
    this.bindEvents();
    this.render();
  }

  populateBrands() {
    if (!this.brandSelect) return;
    const brands = [...new Set(this.products.map(p => p.marca).filter(Boolean))];
    let html = '<option value="all">Todas as Marcas</option>';
    brands.forEach(b => {
      html += `<option value="${b}">${b}</option>`;
    });
    this.brandSelect.innerHTML = html;
  }

  renderSubcategories() {
    if (!this.subcategoryContainer) return;

    if (this.activeCategory === 'all' || !CATEGORIES_V31[this.activeCategory]) {
      this.subcategoryContainer.style.display = 'none';
      this.subcategoryContainer.innerHTML = '';
      return;
    }

    const subcats = CATEGORIES_V31[this.activeCategory].subcategories || [];
    if (subcats.length === 0) {
      this.subcategoryContainer.style.display = 'none';
      return;
    }

    let html = `
      <button type="button" class="subcat-pill ${this.activeSubcategory === 'all' ? 'active' : ''}" data-subcat="all">Todas</button>
    `;
    subcats.forEach(sub => {
      html += `
        <button type="button" class="subcat-pill ${this.activeSubcategory === sub ? 'active' : ''}" data-subcat="${sub}">${sub}</button>
      `;
    });

    this.subcategoryContainer.innerHTML = html;
    this.subcategoryContainer.style.display = 'flex';
  }

  renderTags() {
    if (!this.tagsContainer) return;

    let html = `
      <button type="button" class="tag-filter-btn ${this.activeTag === 'all' ? 'active' : ''}" data-tag="all">Todas as Tags</button>
    `;
    AVAILABLE_TAGS.forEach(t => {
      html += `
        <button type="button" class="tag-filter-btn ${this.activeTag === t ? 'active' : ''}" data-tag="${t}">${t}</button>
      `;
    });
    this.tagsContainer.innerHTML = html;
  }

  bindURLParams() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category') || params.get('categoria');
    const brand = params.get('brand') || params.get('marca');

    if (cat) {
      this.activeCategory = cat;
      this.categoryPills.forEach(p => {
        p.classList.toggle('active', p.dataset.category === cat);
      });
      this.renderSubcategories();
    }

    if (brand && this.brandSelect) {
      this.brandSelect.value = brand;
    }
  }

  bindEvents() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => this.render());
    }
    if (this.brandSelect) {
      this.brandSelect.addEventListener('change', () => this.render());
    }
    if (this.priceSlider) {
      this.priceSlider.addEventListener('input', (e) => {
        if (this.priceValLabel) {
          this.priceValLabel.textContent = `Até R$ ${parseInt(e.target.value).toLocaleString('pt-BR')}`;
        }
        this.render();
      });
    }
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', () => this.render());
    }

    if (this.stockSelect) {
      this.stockSelect.addEventListener('change', () => this.render());
    }

    if (this.promoToggle) {
      this.promoToggle.addEventListener('change', () => this.render());
    }

    // Clique nas categorias principais
    this.categoryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        this.categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.activeCategory = pill.dataset.category;
        this.activeSubcategory = 'all';
        this.renderSubcategories();
        this.render();
      });
    });

    // Clique nas subcategorias
    if (this.subcategoryContainer) {
      this.subcategoryContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('subcat-pill')) {
          const subBtns = this.subcategoryContainer.querySelectorAll('.subcat-pill');
          subBtns.forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
          this.activeSubcategory = e.target.dataset.subcat;
          this.render();
        }
      });
    }

    // Clique nas Tags
    if (this.tagsContainer) {
      this.tagsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag-filter-btn')) {
          const tagBtns = this.tagsContainer.querySelectorAll('.tag-filter-btn');
          tagBtns.forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
          this.activeTag = e.target.dataset.tag;
          this.render();
        }
      });
    }
  }

  getFilteredProducts() {
    let list = ProductStore.getActiveProducts();

    // 1. Pesquisa por Texto (Nome, Marca, SKU, Descrição, Tags)
    if (this.searchInput && this.searchInput.value.trim()) {
      const q = this.searchInput.value.trim().toLowerCase();
      list = list.filter(p => 
        (p.nome || p.titulo || '').toLowerCase().includes(q) ||
        (p.marca || '').toLowerCase().includes(q) ||
        (p.sku || p.codigo || '').toLowerCase().includes(q) ||
        (p.subcategoria || '').toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }

    // 2. Filtro de Categoria Principal
    if (this.activeCategory !== 'all') {
      list = list.filter(p => p.categoria === this.activeCategory);
    }

    // 3. Filtro de Subcategoria
    if (this.activeSubcategory !== 'all') {
      list = list.filter(p => p.subcategoria === this.activeSubcategory);
    }

    // 4. Filtro de Tags
    if (this.activeTag !== 'all') {
      list = list.filter(p => (p.tags || []).includes(this.activeTag));
    }

    // 5. Filtro de Marca
    if (this.brandSelect && this.brandSelect.value !== 'all') {
      list = list.filter(p => p.marca === this.brandSelect.value);
    }

    // 6. Filtro de Estoque
    if (this.stockSelect && this.stockSelect.value !== 'all') {
      list = list.filter(p => (p.estoque || 'Disponível') === this.stockSelect.value);
    }

    // 7. Filtro de Apenas Promoções
    if (this.promoToggle && this.promoToggle.checked) {
      list = list.filter(p => p.promocao === true);
    }

    // 8. Filtro de Preço Máximo
    if (this.priceSlider && parseFloat(this.priceSlider.value) < parseFloat(this.priceSlider.max)) {
      const maxPrice = parseFloat(this.priceSlider.value);
      list = list.filter(p => {
        const val = p.precoPromocional !== null && p.precoPromocional !== undefined ? parseFloat(p.precoPromocional) : parseFloat(p.preco);
        return !isNaN(val) && val <= maxPrice;
      });
    }

    // 8. Ordenação
    const sortVal = this.sortSelect ? this.sortSelect.value : 'default';
    if (sortVal === 'name-az') {
      list.sort((a, b) => (a.nome || a.titulo).localeCompare(b.nome || b.titulo));
    } else if (sortVal === 'recent') {
      list.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
    } else {
      list.sort((a, b) => (a.ordem || 99) - (b.ordem || 99));
    }

    return list;
  }

  render() {
    const filtered = this.getFilteredProducts();

    if (filtered.length === 0) {
      this.gridEl.innerHTML = `
        <div class="no-products-found" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <i class="fas fa-search" style="font-size: 48px; color: var(--blue-light); margin-bottom: 16px;"></i>
          <h3 style="font-size: 20px; color: var(--white); margin-bottom: 8px;">Nenhum produto encontrado</h3>
          <p style="color: var(--gray); font-size: 14px;">Tente ajustar seus filtros de busca ou pesquise por outros termos.</p>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach(p => {
      const prodName = p.nome || p.titulo;
      const prodBrand = p.marca || 'JC Informática';
      const prodStock = p.estoque || 'Disponível';
      const isPreOrder = prodStock === 'Sob Encomenda' || prodStock === 'Fora de Estoque';
      const productUrl = `produto.html?id=${encodeURIComponent(p.id)}`;

      const pageUrl = window.location.origin + window.location.pathname.replace(/produtos\.html|produtos/g, '') + productUrl;
      const waTextRaw = `Olá! Tenho interesse no produto:\n\n*${prodName}*\nMarca: ${prodBrand}\nDisponibilidade: ${prodStock}\n\nConfira no catálogo digital: ${pageUrl}`;
      const waUrl = `https://wa.me/555432814464?text=${encodeURIComponent(waTextRaw)}`;

      // Características (até 2 no card)
      const rawSpecs = p.especificacoes || p.specs || [];
      const specsPreview = rawSpecs.slice(0, 2);

      html += `
        <article class="product-card" data-id="${p.id}" data-category="${p.categoria}">
          <a href="${productUrl}" class="product-image-wrapper" aria-label="${prodName}">
            <span class="stock-badge ${isPreOrder ? 'pre-order' : 'in-stock'}">
              <i class="fas ${isPreOrder ? 'fa-clock' : 'fa-check'}"></i> ${prodStock}
            </span>
            <img src="${p.imagem}" alt="${prodName}" loading="lazy" />
          </a>

          <div class="product-info">
            <div class="product-tags-row">
              <span class="brand-badge">${prodBrand}</span>
              <span class="ref-code-badge" style="font-size: 11px; font-weight: 700; color: var(--blue-light); background: rgba(0, 55, 255, 0.12); padding: 2px 7px; border-radius: 6px;">Ref: ${p.codigo || p.sku || '-'}</span>
              ${p.categoria ? `<span class="subcat-tag-badge">${p.categoria}</span>` : ''}
            </div>

            <h3 class="product-title">
              <a href="${productUrl}">${prodName}</a>
            </h3>

            ${specsPreview.length > 0 ? `
              <ul class="product-specs">
                ${specsPreview.map(s => `<li><i class="fas fa-check-circle" style="color:var(--blue-light);"></i> ${s}</li>`).join('')}
              </ul>
            ` : ''}

            <div class="product-footer showcase-card-footer" style="margin-top: 16px; display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="${productUrl}" class="btn btn-outline" style="flex: 1; text-align: center; font-size: 13px; padding: 8px 12px;">
                Ver Produto
              </a>
              <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp" style="flex: 1.3; text-align: center; font-size: 12px; padding: 8px 10px; white-space: nowrap;" title="Tenho interesse neste produto">
                <i class="fab fa-whatsapp"></i> Tenho interesse
              </a>
            </div>
          </div>
        </article>
      `;
    });

    this.gridEl.innerHTML = html;
  }
}
