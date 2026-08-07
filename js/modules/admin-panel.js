/* ============================================================
   ADMINISTRATIVE DASHBOARD PANEL ENGINE (admin.html)
   ============================================================ */
import { ProductStore } from './firebase-config.js';

export class AdminPanelEngine {
  constructor() {
    this.statsContainer = document.getElementById('admin-stats-grid');
    this.tableBody = document.getElementById('admin-products-table-body');
    this.form = document.getElementById('admin-product-form');
    this.modal = document.getElementById('admin-modal');
    this.openAddBtn = document.getElementById('btn-open-add-modal');
    this.closeModalBtn = document.getElementById('btn-close-modal');
    this.resetDefaultBtn = document.getElementById('btn-reset-defaults');

    // Filtros e Pesquisa
    this.searchInput = document.getElementById('admin-search-input');
    this.categoryFilter = document.getElementById('admin-filter-category');
    this.brandFilter = document.getElementById('admin-filter-brand');
    this.stockFilter = document.getElementById('admin-filter-stock');

    this.editingId = null;
    this.activeTab = 'tab-info';
    this.init();
  }

  init() {
    if (!this.tableBody) return;
    this.bindEvents();
    this.bindTabs();
    this.populateFilterDropdowns();
    this.renderStats();
    this.renderTable();
  }

  bindEvents() {
    if (this.openAddBtn) {
      this.openAddBtn.addEventListener('click', () => this.openModal(null, 'tab-info'));
    }

    if (this.closeModalBtn) {
      this.closeModalBtn.addEventListener('click', () => this.closeModal());
    }

    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    if (this.resetDefaultBtn) {
      this.resetDefaultBtn.addEventListener('click', () => {
        if (confirm('Deseja restaurar os produtos padrão do banco de dados?')) {
          ProductStore.saveProducts(ProductStore.getProducts());
          this.populateFilterDropdowns();
          this.renderStats();
          this.renderTable();
        }
      });
    }

    // Pesquisa e Filtros Instantâneos
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => this.renderTable());
    }
    if (this.categoryFilter) {
      this.categoryFilter.addEventListener('change', () => this.renderTable());
    }
    if (this.brandFilter) {
      this.brandFilter.addEventListener('change', () => this.renderTable());
    }
    if (this.stockFilter) {
      this.stockFilter.addEventListener('change', () => this.renderTable());
    }

    // Input da foto para atualizar preview
    const mainImgInput = document.getElementById('input-imagem');
    const previewImg = document.getElementById('modal-img-preview');
    if (mainImgInput && previewImg) {
      mainImgInput.addEventListener('input', () => {
        previewImg.src = mainImgInput.value.trim() || 'imagem/teclado_redragon.jpg';
      });
    }

    // Upload Firebase Storage
    const fileInput = document.getElementById('input-file-imagem');
    const uploadStatus = document.getElementById('upload-status-lbl');
    if (fileInput) {
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (uploadStatus) uploadStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando imagem para o Firebase Storage...';

        try {
          const downloadUrl = await ProductStore.uploadImageToStorage(file);
          document.getElementById('input-imagem').value = downloadUrl;
          if (previewImg) previewImg.src = downloadUrl;
          if (uploadStatus) uploadStatus.innerHTML = '<i class="fas fa-check-circle" style="color:#00C853;"></i> Imagem salva no Firebase Storage!';
        } catch (err) {
          if (uploadStatus) uploadStatus.innerHTML = '<i class="fas fa-exclamation-triangle" style="color:#E53935;"></i> Erro ao enviar imagem.';
          alert('Erro ao enviar imagem: ' + err.message);
        }
      });
    }

    // Botões da Aba de Compartilhar
    const copyLinkBtn = document.getElementById('modal-btn-copy-link');
    const openProdBtn = document.getElementById('modal-btn-open-prod');
    const copyWaBtn = document.getElementById('modal-btn-copy-wa');

    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', () => {
        if (!this.editingId) return;
        const product = ProductStore.getProductById(this.editingId);
        if (product) {
          const url = `${window.location.origin}/produto.html?id=${encodeURIComponent(product.id)}`;
          navigator.clipboard.writeText(url).then(() => alert(`🔗 Link copiado para a área de transferência:\n${url}`));
        }
      });
    }

    if (openProdBtn) {
      openProdBtn.addEventListener('click', () => {
        if (!this.editingId) return;
        const url = `${window.location.origin}/produto.html?id=${encodeURIComponent(this.editingId)}`;
        window.open(url, '_blank');
      });
    }

    if (copyWaBtn) {
      copyWaBtn.addEventListener('click', () => {
        if (!this.editingId) return;
        const product = ProductStore.getProductById(this.editingId);
        if (product) this.generateMarketingCopy(product);
      });
    }
  }

  bindTabs() {
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        this.switchTab(targetTab);
      });
    });
  }

  switchTab(tabId) {
    this.activeTab = tabId;
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.admin-tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === tabId);
    });
  }

  populateFilterDropdowns() {
    const products = ProductStore.getProducts();

    if (this.categoryFilter) {
      const categories = [...new Set(products.map(p => p.categoria).filter(Boolean))].sort();
      this.categoryFilter.innerHTML = '<option value="all">Todas as Categorias</option>' +
        categories.map(c => `<option value="${c}">${c.toUpperCase()}</option>`).join('');
    }

    if (this.brandFilter) {
      const brands = [...new Set(products.map(p => p.marca).filter(Boolean))].sort();
      this.brandFilter.innerHTML = '<option value="all">Todas as Marcas</option>' +
        brands.map(b => `<option value="${b}">${b}</option>`).join('');
    }
  }

  getFilteredProducts() {
    let products = ProductStore.getProducts();

    const query = (this.searchInput ? this.searchInput.value.trim().toLowerCase() : '');
    const cat = (this.categoryFilter ? this.categoryFilter.value : 'all');
    const brand = (this.brandFilter ? this.brandFilter.value : 'all');
    const stock = (this.stockFilter ? this.stockFilter.value : 'all');

    return products.filter(p => {
      // Busca instantânea
      const nameMatch = (p.nome || p.titulo || '').toLowerCase().includes(query);
      const brandMatch = (p.marca || '').toLowerCase().includes(query);
      const catMatch = (p.categoria || '').toLowerCase().includes(query);
      const skuMatch = (p.codigo || p.sku || '').toLowerCase().includes(query);
      const matchesQuery = !query || nameMatch || brandMatch || catMatch || skuMatch;

      // Filtro por Categoria
      const matchesCat = (cat === 'all') || (p.categoria === cat);

      // Filtro por Marca
      const matchesBrand = (brand === 'all') || (p.marca === brand);

      // Filtro por Disponibilidade
      const matchesStock = (stock === 'all') || ((p.estoque || 'Disponível') === stock);

      return matchesQuery && matchesCat && matchesBrand && matchesStock;
    });
  }

  renderStats() {
    if (!this.statsContainer) return;
    const stats = ProductStore.getDashboardStats();

    this.statsContainer.innerHTML = `
      <div class="stat-card">
        <div class="stat-icon" style="background: rgba(0, 55, 255, 0.15); color: var(--blue-light);"><i class="fas fa-box"></i></div>
        <div class="stat-info">
          <span class="stat-val">${stats.total}</span>
          <span class="stat-lbl">Total de Produtos</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: rgba(255, 184, 0, 0.15); color: #FFB800;"><i class="fas fa-fire"></i></div>
        <div class="stat-info">
          <span class="stat-val">${stats.destaques}</span>
          <span class="stat-lbl">Em Destaque</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: rgba(0, 200, 83, 0.15); color: #00C853;"><i class="fas fa-check-circle"></i></div>
        <div class="stat-info">
          <span class="stat-val">${stats.total - stats.promocoes}</span>
          <span class="stat-lbl">Pronta Entrega</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: rgba(156, 39, 176, 0.15); color: #BA68C8;"><i class="fas fa-layer-group"></i></div>
        <div class="stat-info">
          <span class="stat-val">${stats.totalCategorias}</span>
          <span class="stat-lbl">Categorias</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: rgba(33, 150, 243, 0.15); color: #64B5F6;"><i class="fas fa-copyright"></i></div>
        <div class="stat-info">
          <span class="stat-val">${stats.totalMarcas}</span>
          <span class="stat-lbl">Marcas Ativas</span>
        </div>
      </div>
    `;
  }

  openModal(product = null, defaultTab = 'tab-info') {
    if (!this.modal || !this.form) return;

    this.switchTab(defaultTab);

    if (product) {
      this.editingId = product.id;
      document.getElementById('modal-title').innerHTML = `<i class="fas fa-edit"></i> Editar: ${product.nome || product.titulo}`;
      document.getElementById('input-nome').value = product.nome || product.titulo || '';
      document.getElementById('input-categoria').value = product.categoria || 'perifericos';
      
      const subEl = document.getElementById('input-subcategoria');
      if (subEl) subEl.value = product.subcategoria || '';

      document.getElementById('input-marca').value = product.marca || '';
      
      const codEl = document.getElementById('input-codigo');
      if (codEl) codEl.value = product.codigo || product.sku || '';

      const precEl = document.getElementById('input-preco');
      if (precEl) precEl.value = (product.preco !== undefined && product.preco !== null) ? product.preco : '';

      const estEl = document.getElementById('input-estoque');
      if (estEl) estEl.value = product.estoque || 'Disponível';

      const garEl = document.getElementById('input-garantia');
      if (garEl) garEl.value = product.garantia || '';

      document.getElementById('input-ordem').value = product.ordem || 1;
      document.getElementById('input-imagem').value = product.imagem || '';

      const previewImg = document.getElementById('modal-img-preview');
      if (previewImg) previewImg.src = product.imagem || 'imagem/teclado_redragon.jpg';

      document.getElementById('input-galeria').value = (product.galeria || []).join('\n');
      document.getElementById('input-destaque').checked = !!product.destaque;
      document.getElementById('input-ativo').checked = product.ativo !== false;
      document.getElementById('input-especificacoes').value = (product.especificacoes || product.specs || []).join('\n');
      document.getElementById('input-descricao').value = product.descricao || product.resumo || '';
    } else {
      this.editingId = null;
      document.getElementById('modal-title').innerHTML = '<i class="fas fa-plus-circle"></i> Adicionar Novo Produto';
      this.form.reset();
      document.getElementById('input-ativo').checked = true;
      document.getElementById('input-ordem').value = ProductStore.getProducts().length + 1;
      const previewImg = document.getElementById('modal-img-preview');
      if (previewImg) previewImg.src = 'imagem/teclado_redragon.jpg';
    }

    this.modal.style.display = 'flex';
  }

  closeModal() {
    if (this.modal) {
      this.modal.style.display = 'none';
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const specsRaw = document.getElementById('input-especificacoes').value;
    const galeriaRaw = document.getElementById('input-galeria').value;

    const specsArray = specsRaw.split('\n').map(s => s.trim()).filter(Boolean);
    const galeriaArray = galeriaRaw.split('\n').map(g => g.trim()).filter(Boolean);
    const mainImg = document.getElementById('input-imagem').value.trim() || 'imagem/teclado_redragon.jpg';

    if (galeriaArray.length === 0) {
      galeriaArray.push(mainImg);
    }

    const priceInputVal = document.getElementById('input-preco').value.trim();
    const priceNum = priceInputVal !== '' ? parseFloat(priceInputVal) : null;

    const productData = {
      nome: document.getElementById('input-nome').value.trim(),
      categoria: document.getElementById('input-categoria').value,
      subcategoria: document.getElementById('input-subcategoria') ? document.getElementById('input-subcategoria').value.trim() : '',
      marca: document.getElementById('input-marca').value.trim(),
      codigo: document.getElementById('input-codigo') && document.getElementById('input-codigo').value.trim() ? document.getElementById('input-codigo').value.trim() : 'JC-STORE',
      sku: document.getElementById('input-codigo') && document.getElementById('input-codigo').value.trim() ? document.getElementById('input-codigo').value.trim() : 'JC-STORE',
      preco: priceNum,
      estoque: document.getElementById('input-estoque') ? document.getElementById('input-estoque').value : 'Disponível',
      garantia: document.getElementById('input-garantia') ? document.getElementById('input-garantia').value.trim() : '',
      ordem: parseInt(document.getElementById('input-ordem').value) || 1,
      imagem: mainImg,
      galeria: galeriaArray,
      destaque: document.getElementById('input-destaque').checked,
      ativo: document.getElementById('input-ativo').checked,
      especificacoes: specsArray.slice(0, 6),
      resumo: document.getElementById('input-descricao').value.trim().substring(0, 160),
      descricao: document.getElementById('input-descricao').value.trim()
    };

    if (this.editingId) {
      ProductStore.updateProduct(this.editingId, productData);
    } else {
      ProductStore.addProduct(productData);
    }

    this.closeModal();
    this.populateFilterDropdowns();
    this.renderStats();
    this.renderTable();
  }

  duplicateProduct(id) {
    const original = ProductStore.getProductById(id);
    if (!original) return;

    const duplicated = {
      ...original,
      id: 'prod-' + Date.now(),
      nome: `(Cópia) ${original.nome || original.titulo}`,
      codigo: `${original.codigo || 'JC'}-COPY-${Math.floor(Math.random() * 1000)}`,
      ordem: (original.ordem || 1) + 1
    };

    ProductStore.addProduct(duplicated);
    this.populateFilterDropdowns();
    this.renderStats();
    this.renderTable();
    alert(`📋 Produto duplicado com sucesso!\n\nNovo produto: ${duplicated.nome}`);
  }

  renderTable() {
    const products = this.getFilteredProducts();

    if (products.length === 0) {
      this.tableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; padding: 40px; color: var(--gray);">
            <i class="fas fa-search" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
            Nenhum produto encontrado para a pesquisa ou filtros selecionados.
          </td>
        </tr>
      `;
      return;
    }

    let html = '';
    products.forEach(p => {
      const stockStatus = p.estoque || 'Disponível';
      const isPreOrder = stockStatus === 'Sob Encomenda' || stockStatus === 'Fora de Estoque';
      const stockBadgeHtml = `<span class="stock-status-badge ${isPreOrder ? 'pre-order' : 'in-stock'}" style="font-size: 11px; padding: 3px 8px;"><i class="fas ${isPreOrder ? 'fa-clock' : 'fa-check'}"></i> ${stockStatus}</span>`;

      const isAtivo = p.ativo !== false;

      html += `
        <tr class="${!isAtivo ? 'row-inactive' : ''}">
          <td style="font-weight: 700; color: var(--blue-light);">${p.ordem || '-'}</td>
          <td>
            <img src="${p.imagem}" alt="${p.nome || p.titulo}" class="admin-thumb" style="width: 44px; height: 44px; object-fit: contain; background: #000; padding: 2px; border-radius: 6px;" />
          </td>
          <td>
            <strong>${p.nome || p.titulo}</strong>
            <br />
            <small style="color: var(--gray);">Ref: ${p.codigo || p.sku || '-'}</small>
          </td>
          <td><span class="admin-badge">${p.categoria}</span></td>
          <td><strong>${p.marca || '-'}</strong></td>
          <td>${stockBadgeHtml}</td>
          <td>
            <button type="button" class="status-toggle-btn ${isAtivo ? 'active-status' : 'inactive-status'}" data-id="${p.id}" style="padding: 4px 8px; font-size: 11px;">
              <i class="fas ${isAtivo ? 'fa-check-circle' : 'fa-eye-slash'}"></i> ${isAtivo ? 'Ativo' : 'Inativo'}
            </button>
          </td>
          <td>
            <div class="admin-actions-grid">
              <button type="button" class="btn-action-sm btn-action-edit action-edit-btn" data-id="${p.id}" title="✏ Editar Informações">
                <i class="fas fa-edit"></i> ✏ Editar
              </button>
              <button type="button" class="btn-action-sm btn-action-photos action-photos-btn" data-id="${p.id}" title="📷 Trocar Imagens">
                <i class="fas fa-camera"></i> 📷 Fotos
              </button>
              <button type="button" class="btn-action-sm btn-action-share action-share-btn" data-id="${p.id}" title="📤 Copiar Link WhatsApp">
                <i class="fas fa-share-alt"></i> 📤 Compartilhar
              </button>
              <button type="button" class="btn-action-sm btn-action-view action-view-btn" data-id="${p.id}" title="👁 Abrir no Navegador">
                <i class="fas fa-external-link-alt"></i> 👁 Visualizar
              </button>
              <button type="button" class="btn-action-sm btn-action-duplicate action-duplicate-btn" data-id="${p.id}" title="📋 Duplicar Produto">
                <i class="fas fa-copy"></i> 📋 Duplicar
              </button>
              <button type="button" class="btn-action-sm btn-action-delete action-delete-btn" data-id="${p.id}" title="🗑 Excluir">
                <i class="fas fa-trash-alt"></i> 🗑 Excluir
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    this.tableBody.innerHTML = html;
    this.bindTableActions();
  }

  bindTableActions() {
    // ✏ Editar
    this.tableBody.querySelectorAll('.action-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const product = ProductStore.getProductById(btn.dataset.id);
        if (product) this.openModal(product, 'tab-info');
      });
    });

    // 📷 Fotos (Abre diretamente na aba de fotos)
    this.tableBody.querySelectorAll('.action-photos-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const product = ProductStore.getProductById(btn.dataset.id);
        if (product) this.openModal(product, 'tab-photos');
      });
    });

    // 📤 Compartilhar
    this.tableBody.querySelectorAll('.action-share-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const product = ProductStore.getProductById(btn.dataset.id);
        if (product) {
          const productUrl = `${window.location.origin}/produto.html?id=${encodeURIComponent(product.id)}`;
          navigator.clipboard.writeText(productUrl).then(() => {
            alert(`📤 Link do produto copiado com sucesso!\n\n${productUrl}\n\nAgora você pode colar no WhatsApp do cliente.`);
          });
        }
      });
    });

    // 👁 Visualizar
    this.tableBody.querySelectorAll('.action-view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const product = ProductStore.getProductById(btn.dataset.id);
        if (product) {
          const productUrl = `${window.location.origin}/produto.html?id=${encodeURIComponent(product.id)}`;
          window.open(productUrl, '_blank');
        }
      });
    });

    // 📋 Duplicar
    this.tableBody.querySelectorAll('.action-duplicate-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.duplicateProduct(btn.dataset.id);
      });
    });

    // 🗑 Excluir
    this.tableBody.querySelectorAll('.action-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja excluir este produto do catálogo?')) {
          ProductStore.deleteProduct(btn.dataset.id);
          this.populateFilterDropdowns();
          this.renderStats();
          this.renderTable();
        }
      });
    });

    // Status Toggle
    this.tableBody.querySelectorAll('.status-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        ProductStore.toggleStatus(btn.dataset.id);
        this.renderStats();
        this.renderTable();
      });
    });
  }

  generateMarketingCopy(product) {
    const name = product.nome || product.titulo;
    const brand = product.marca || 'JC Informática';
    const stock = product.estoque || 'Disponível';
    const productUrl = `${window.location.origin}/produto.html?id=${encodeURIComponent(product.id)}`;

    const copyText = `Olá! Confira os detalhes deste produto em nossa Vitrine Digital - JC Informática:\n\n` +
      `📦 *${name}*\n` +
      `🏷️ Marca: ${brand}\n` +
      `✅ Disponibilidade: ${stock}\n\n` +
      `🔗 Acesse a vitrine para fotos e especificações completas:\n${productUrl}\n\n` +
      `💬 Qualquer dúvida, estou à disposição aqui no WhatsApp!`;

    navigator.clipboard.writeText(copyText).then(() => {
      alert(`Link e mensagem do produto copiados com sucesso!\n\nAgora você pode colar no WhatsApp do cliente:\n\n${copyText}`);
    });
  }
}

