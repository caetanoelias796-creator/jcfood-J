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
      document.getElementById('modal-title').textContent = 'Editar Produto V3.1';
      document.getElementById('input-nome').value = product.nome || '';
      document.getElementById('input-categoria').value = product.categoria || 'perifericos';
      
      const subEl = document.getElementById('input-subcategoria');
      if (subEl) subEl.value = product.subcategoria || '';

      document.getElementById('input-marca').value = product.marca || '';
      document.getElementById('input-codigo').value = product.codigo || product.sku || '';
      
      const barEl = document.getElementById('input-barras');
      if (barEl) barEl.value = product.codigoBarras || '';

      document.getElementById('input-preco').value = product.preco || '';
      document.getElementById('input-preco-promocional').value = product.precoPromocional || '';
      document.getElementById('input-parcelamento').value = product.parcelamento || '';

      const estEl = document.getElementById('input-estoque');
      if (estEl) estEl.value = product.estoque || 'Disponível';

      const garEl = document.getElementById('input-garantia');
      if (garEl) garEl.value = product.garantia || '12 Meses com Fabricante';

      const fabEl = document.getElementById('input-fabricante');
      if (fabEl) fabEl.value = product.fabricante || '';

      const tagEl = document.getElementById('input-tags');
      if (tagEl) tagEl.value = (product.tags || []).join(', ');

      document.getElementById('input-ordem').value = product.ordem || 1;
      document.getElementById('input-imagem').value = product.imagem || '';
      document.getElementById('input-galeria').value = (product.galeria || []).join('\n');
      document.getElementById('input-destaque').checked = !!product.destaque;
      document.getElementById('input-promocao').checked = !!product.promocao;
      document.getElementById('input-ativo').checked = product.ativo !== false;
      document.getElementById('input-especificacoes').value = (product.especificacoes || []).join('\n');
      
      const resEl = document.getElementById('input-resumo');
      if (resEl) resEl.value = product.resumo || '';

      document.getElementById('input-descricao').value = product.descricao || '';
    } else {
      this.editingId = null;
      document.getElementById('modal-title').textContent = 'Adicionar Novo Produto V3.1 (Cadastro 30s)';
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
    const tagsRaw = document.getElementById('input-tags') ? document.getElementById('input-tags').value : '';

    const specsArray = specsRaw.split('\n').map(s => s.trim()).filter(Boolean);
    const galeriaArray = galeriaRaw.split('\n').map(g => g.trim()).filter(Boolean);
    const tagsArray = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
    const mainImg = document.getElementById('input-imagem').value.trim() || 'imagem/teclado_redragon.jpg';

    if (galeriaArray.length === 0) {
      galeriaArray.push(mainImg);
    }

    const priceNum = parseFloat(document.getElementById('input-preco').value);
    const promoNum = parseFloat(document.getElementById('input-preco-promocional').value) || priceNum;

    const productData = {
      nome: document.getElementById('input-nome').value.trim(),
      categoria: document.getElementById('input-categoria').value,
      subcategoria: document.getElementById('input-subcategoria') ? document.getElementById('input-subcategoria').value.trim() : '',
      marca: document.getElementById('input-marca').value.trim(),
      codigo: document.getElementById('input-codigo').value.trim() || 'JC-STORE',
      sku: document.getElementById('input-codigo').value.trim() || 'JC-STORE',
      codigoBarras: document.getElementById('input-barras') ? document.getElementById('input-barras').value.trim() : '',
      preco: priceNum,
      precoPromocional: promoNum,
      parcelamento: document.getElementById('input-parcelamento').value.trim() || `10x de R$ ${(priceNum/10).toFixed(2).replace('.',',')} sem juros`,
      estoque: document.getElementById('input-estoque') ? document.getElementById('input-estoque').value : 'Disponível',
      garantia: document.getElementById('input-garantia') ? document.getElementById('input-garantia').value.trim() : '12 Meses com Fabricante',
      fabricante: document.getElementById('input-fabricante') ? document.getElementById('input-fabricante').value.trim() : '',
      tags: tagsArray,
      ordem: parseInt(document.getElementById('input-ordem').value) || 1,
      imagem: mainImg,
      galeria: galeriaArray,
      destaque: document.getElementById('input-destaque').checked,
      promocao: document.getElementById('input-promocao').checked,
      ativo: document.getElementById('input-ativo').checked,
      especificacoes: specsArray,
      resumo: document.getElementById('input-resumo') ? document.getElementById('input-resumo').value.trim() : '',
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
      const formattedPrice = parseFloat(p.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const formattedPromo = p.precoPromocional ? parseFloat(p.precoPromocional).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : formattedPrice;
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
            <small style="color: var(--gray);">Cód: ${p.codigo || p.sku || '-'}</small>
          </td>
          <td><span class="admin-badge">${p.categoria}</span></td>
          <td>${p.marca || '-'}</td>
          <td>
            <span style="font-weight: 700; color: #00C853;">${formattedPromo}</span>
            ${p.precoPromocional && p.precoPromocional < p.preco ? `<br/><small style="text-decoration:line-through; color:var(--gray);">${formattedPrice}</small>` : ''}
          </td>
          <td>
            <button type="button" class="status-toggle-btn ${isAtivo ? 'active-status' : 'inactive-status'}" data-id="${p.id}">
              <i class="fas ${isAtivo ? 'fa-check-circle' : 'fa-eye-slash'}"></i> ${isAtivo ? 'Ativo' : 'Inativo'}
            </button>
          </td>
          <td>
            <div class="admin-actions">
              <button type="button" class="btn-action copy-marketing-btn" data-id="${p.id}" title="Gerar Copy Marketing (Instagram/Whats)">
                <i class="fas fa-bullhorn"></i>
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
    const pricePix = parseFloat(product.precoPromocional || product.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const code = product.codigo || product.sku || 'JC-STORE';

    const copyText = `🚀 OPORTUNIDADE EM NOVA PETRÓPOLIS - JC INFORMÁTICA! 💻🔥\n\n` +
      `📦 ${name}\n` +
      `🏷️ Código: ${code}\n` +
      `💰 Apenas ${pricePix} à vista no Pix / Dinheiro!\n` +
      `💳 Ou no cartão em até 10x sem juros!\n\n` +
      `✨ Pronta entrega na nossa loja física ou envio rápido na região!\n\n` +
      `📲 Chame agora no WhatsApp: (54) 3281-4464\n` +
      `📍 Av. 15 de Novembro, 1540 - Sala 110, Centro, Nova Petrópolis - RS\n\n` +
      `#JCInformatica #NovaPetropolis #PCGamer #Hardware #SetupGamer #${(product.marca || 'Informatica').replace(/\s+/g, '')}`;

    navigator.clipboard.writeText(copyText).then(() => {
      alert(`Legenda para Instagram/WhatsApp gerada e copiada para a área de transferência!\n\n${copyText}`);
    });
  }
}
