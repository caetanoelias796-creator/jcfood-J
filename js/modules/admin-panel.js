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

    this.editingId = null;
    this.init();
  }

  init() {
    if (!this.tableBody) return;
    this.bindEvents();
    this.renderStats();
    this.renderTable();
  }

  bindEvents() {
    if (this.openAddBtn) {
      this.openAddBtn.addEventListener('click', () => this.openModal(null));
    }

    if (this.closeModalBtn) {
      this.closeModalBtn.addEventListener('click', () => this.closeModal());
    }

    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    if (this.resetDefaultBtn) {
      this.resetDefaultBtn.addEventListener('click', () => {
        if (confirm('Deseja restaurar os produtos padrão do banco de dados Firebase?')) {
          ProductStore.saveProducts(ProductStore.getProducts());
          this.renderStats();
          this.renderTable();
        }
      });
    }

    const fileInput = document.getElementById('input-file-imagem');
    const uploadStatus = document.getElementById('upload-status-lbl');
    if (fileInput) {
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (uploadStatus) uploadStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando para o Firebase Storage...';

        try {
          const downloadUrl = await ProductStore.uploadImageToStorage(file);
          document.getElementById('input-imagem').value = downloadUrl;
          if (uploadStatus) uploadStatus.innerHTML = '<i class="fas fa-check-circle" style="color:#00C853;"></i> Imagem salva no Firebase Storage!';
        } catch (err) {
          if (uploadStatus) uploadStatus.innerHTML = '<i class="fas fa-exclamation-triangle" style="color:#E53935;"></i> Erro ao enviar imagem.';
          alert('Erro ao enviar imagem para o Firebase Storage: ' + err.message);
        }
      });
    }
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
        <div class="stat-icon" style="background: rgba(0, 200, 83, 0.15); color: #00C853;"><i class="fas fa-tags"></i></div>
        <div class="stat-info">
          <span class="stat-val">${stats.promocoes}</span>
          <span class="stat-lbl">Em Promoção</span>
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

  openModal(product = null) {
    if (!this.modal || !this.form) return;

    if (product) {
      this.editingId = product.id;
      document.getElementById('modal-title').textContent = 'Editar Produto da Vitrine';
      document.getElementById('input-nome').value = product.nome || product.titulo || '';
      document.getElementById('input-categoria').value = product.categoria || 'perifericos';
      
      const subEl = document.getElementById('input-subcategoria');
      if (subEl) subEl.value = product.subcategoria || '';

      document.getElementById('input-marca').value = product.marca || '';
      
      const codEl = document.getElementById('input-codigo');
      if (codEl) codEl.value = product.codigo || product.sku || '';

      const precEl = document.getElementById('input-preco');
      if (precEl) precEl.value = (product.preco !== undefined && product.preco !== null) ? product.preco : '';

      const precPromEl = document.getElementById('input-preco-promocional');
      if (precPromEl) precPromEl.value = (product.precoPromocional !== undefined && product.precoPromocional !== null) ? product.precoPromocional : '';

      const estEl = document.getElementById('input-estoque');
      if (estEl) estEl.value = product.estoque || 'Disponível';

      const garEl = document.getElementById('input-garantia');
      if (garEl) garEl.value = product.garantia || '';

      document.getElementById('input-ordem').value = product.ordem || 1;
      document.getElementById('input-imagem').value = product.imagem || '';
      document.getElementById('input-galeria').value = (product.galeria || []).join('\n');
      document.getElementById('input-destaque').checked = !!product.destaque;
      document.getElementById('input-ativo').checked = product.ativo !== false;
      document.getElementById('input-especificacoes').value = (product.especificacoes || product.specs || []).join('\n');
      document.getElementById('input-descricao').value = product.descricao || product.resumo || '';
    } else {
      this.editingId = null;
      document.getElementById('modal-title').textContent = 'Adicionar Novo Produto na Vitrine';
      this.form.reset();
      document.getElementById('input-ativo').checked = true;
      document.getElementById('input-ordem').value = ProductStore.getProducts().length + 1;
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
    const promoInputVal = document.getElementById('input-preco-promocional') ? document.getElementById('input-preco-promocional').value.trim() : '';

    const priceNum = priceInputVal !== '' ? parseFloat(priceInputVal) : null;
    const promoNum = promoInputVal !== '' ? parseFloat(promoInputVal) : priceNum;

    const productData = {
      nome: document.getElementById('input-nome').value.trim(),
      categoria: document.getElementById('input-categoria').value,
      subcategoria: document.getElementById('input-subcategoria') ? document.getElementById('input-subcategoria').value.trim() : '',
      marca: document.getElementById('input-marca').value.trim(),
      codigo: document.getElementById('input-codigo') && document.getElementById('input-codigo').value.trim() ? document.getElementById('input-codigo').value.trim() : 'JC-STORE',
      sku: document.getElementById('input-codigo') && document.getElementById('input-codigo').value.trim() ? document.getElementById('input-codigo').value.trim() : 'JC-STORE',
      preco: priceNum,
      precoPromocional: promoNum,
      estoque: document.getElementById('input-estoque') ? document.getElementById('input-estoque').value : 'Disponível',
      garantia: document.getElementById('input-garantia') ? document.getElementById('input-garantia').value.trim() : '',
      ordem: parseInt(document.getElementById('input-ordem').value) || 1,
      imagem: mainImg,
      galeria: galeriaArray,
      destaque: document.getElementById('input-destaque').checked,
      ativo: document.getElementById('input-ativo').checked,
      especificacoes: specsArray.slice(0, 6), // Máximo 6 principais características
      resumo: document.getElementById('input-descricao').value.trim().substring(0, 160),
      descricao: document.getElementById('input-descricao').value.trim()
    };

    if (this.editingId) {
      ProductStore.updateProduct(this.editingId, productData);
    } else {
      ProductStore.addProduct(productData);
    }

    this.closeModal();
    this.renderStats();
    this.renderTable();
  }

  renderTable() {
    const products = ProductStore.getProducts();

    if (products.length === 0) {
      this.tableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; padding: 40px; color: var(--gray);">
            Nenhum produto cadastrado no momento.
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
            <img src="${p.imagem}" alt="${p.nome || p.titulo}" class="admin-thumb" />
          </td>
          <td>
            <strong>${p.nome || p.titulo}</strong>
            <br />
            <small style="color: var(--gray);">Ref: ${p.codigo || p.sku || '-'}</small>
          </td>
          <td><span class="admin-badge">${p.categoria}</span></td>
          <td>${p.marca || '-'}</td>
          <td>${stockBadgeHtml}</td>
          <td>
            <button type="button" class="status-toggle-btn ${isAtivo ? 'active-status' : 'inactive-status'}" data-id="${p.id}">
              <i class="fas ${isAtivo ? 'fa-check-circle' : 'fa-eye-slash'}"></i> ${isAtivo ? 'Ativo' : 'Inativo'}
            </button>
          </td>
          <td>
            <div class="admin-actions">
              <button type="button" class="btn-action share-btn-admin" data-id="${p.id}" title="📤 Compartilhar Link do Produto (Copiar para WhatsApp)" style="background: rgba(0, 200, 83, 0.15); color: #00C853; border: 1px solid rgba(0, 200, 83, 0.3); font-weight: bold;">
                <i class="fas fa-share-alt"></i> 📤 Compartilhar
              </button>
              <button type="button" class="btn-action copy-marketing-btn" data-id="${p.id}" title="Gerar Mensagem Completa com Link para o WhatsApp">
                <i class="fab fa-whatsapp"></i>
              </button>
              <button type="button" class="btn-action edit-btn" data-id="${p.id}" title="Editar">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="btn-action delete-btn" data-id="${p.id}" title="Excluir">
                <i class="fas fa-trash-alt"></i>
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
    const editBtns = this.tableBody.querySelectorAll('.edit-btn');
    const deleteBtns = this.tableBody.querySelectorAll('.delete-btn');
    const statusBtns = this.tableBody.querySelectorAll('.status-toggle-btn');
    const mktBtns = this.tableBody.querySelectorAll('.copy-marketing-btn');
    const shareBtns = this.tableBody.querySelectorAll('.share-btn-admin');

    shareBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const product = ProductStore.getProductById(id);
        if (product) {
          const productUrl = `${window.location.origin}/produto.html?id=${encodeURIComponent(product.id)}`;
          navigator.clipboard.writeText(productUrl).then(() => {
            alert(`📤 Link do produto copiado com sucesso!\n\n${productUrl}\n\nAgora cole no WhatsApp do cliente.`);
          });
        }
      });
    });

    mktBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const product = ProductStore.getProductById(id);
        if (product) {
          this.generateMarketingCopy(product);
        }
      });
    });

    editBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const product = ProductStore.getProductById(id);
        if (product) {
          this.openModal(product);
        }
      });
    });

    deleteBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (confirm('Tem certeza que deseja excluir este produto do catálogo?')) {
          ProductStore.deleteProduct(id);
          this.renderStats();
          this.renderTable();
        }
      });
    });

    statusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        ProductStore.toggleStatus(id);
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
