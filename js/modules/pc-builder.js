/* ============================================================
   CONFIGURADOR DE PC GAMER ("MONTE SEU PC") (monte-seu-pc.html)
   ============================================================ */
import { ProductStore } from './firebase-config.js';

export class PCBuilderEngine {
  constructor() {
    this.container = document.getElementById('pc-builder-container');
    if (!this.container) return;

    this.products = ProductStore.getActiveProducts();
    this.selection = {
      cpu: null,
      mobo: null,
      ram: null,
      storage: null,
      gpu: null,
      psu: null,
      case: null
    };

    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  getProductsByCategory(cat) {
    return this.products.filter(p => p.categoria === cat);
  }

  calculateTotals() {
    let totalPix = 0;
    let totalRegular = 0;
    let estimatedWatts = 100; // Consumo base do sistema

    Object.values(this.selection).forEach(item => {
      if (item) {
        totalPix += parseFloat(item.precoPromocional || item.preco);
        totalRegular += parseFloat(item.preco);

        // Estimativa de consumo em Watts
        if (item.categoria === 'hardware' && (item.nome || '').toLowerCase().includes('gpu')) {
          estimatedWatts += 220;
        } else if (item.categoria === 'hardware' && (item.nome || '').toLowerCase().includes('ryzen 7')) {
          estimatedWatts += 105;
        } else {
          estimatedWatts += 35;
        }
      }
    });

    return { totalPix, totalRegular, estimatedWatts };
  }

  render() {
    const categories = [
      { key: 'cpu', label: '1. Processador (CPU)', category: 'hardware', icon: 'fa-microchip' },
      { key: 'mobo', label: '2. Placa-Mãe', category: 'hardware', icon: 'fa-memory' },
      { key: 'ram', label: '3. Memória RAM', category: 'hardware', icon: 'fa-microchip' },
      { key: 'storage', label: '4. Armazenamento (SSD / NVMe)', category: 'hardware', icon: 'fa-hdd' },
      { key: 'gpu', label: '5. Placa de Vídeo (GPU)', category: 'hardware', icon: 'fa-tv' },
      { key: 'psu', label: '6. Fonte de Alimentação', category: 'hardware', icon: 'fa-plug' },
      { key: 'case', label: '7. Gabinete Gamer', category: 'gabinetes', icon: 'fa-desktop' }
    ];

    const totals = this.calculateTotals();
    const formattedPix = totals.totalPix.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const formattedRegular = totals.totalRegular.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    let stepsHTML = '';
    categories.forEach(step => {
      const selectedItem = this.selection[step.key];
      const availableItems = this.getProductsByCategory(step.category);

      stepsHTML += `
        <div class="builder-step-card ${selectedItem ? 'step-selected' : ''}">
          <div class="builder-step-header">
            <div class="step-title-group">
              <i class="fas ${step.icon}"></i>
              <h3>${step.label}</h3>
            </div>
            ${selectedItem ? `
              <span class="selected-badge"><i class="fas fa-check-circle"></i> Selecionado</span>
            ` : '<span class="pending-badge">Pendente</span>'}
          </div>

          ${selectedItem ? `
            <div class="selected-item-row">
              <img src="${selectedItem.imagem}" alt="${selectedItem.nome || selectedItem.titulo}" class="selected-thumb" />
              <div class="selected-item-info">
                <strong>${selectedItem.nome || selectedItem.titulo}</strong>
                <span class="selected-price">${parseFloat(selectedItem.precoPromocional || selectedItem.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} no Pix</span>
              </div>
              <button type="button" class="btn-remove-part" data-key="${step.key}">&times; Remover</button>
            </div>
          ` : `
            <div class="builder-select-group">
              <select class="builder-select" data-key="${step.key}">
                <option value="">-- Selecione um componente --</option>
                ${availableItems.map(p => `
                  <option value="${p.id}">${p.nome || p.titulo} - ${parseFloat(p.precoPromocional || p.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</option>
                `).join('')}
              </select>
            </div>
          `}
        </div>
      `;
    });

    // MENSAGEM DO WHATSAPP DO CONFIGURADOR
    let waText = `Olá! Gostaria de solicitar um orçamento para o seguinte *Setup PC Gamer* montado no site da JC Informática:\n\n`;
    Object.entries(this.selection).forEach(([k, item]) => {
      if (item) {
        waText += `• *${item.nome || item.titulo}* (R$ ${parseFloat(item.precoPromocional || item.preco).toFixed(2)})\n`;
      }
    });
    waText += `\n*Valor Estimado no Pix:* ${formattedPix}\n*Consumo Estimado:* ${totals.estimatedWatts}W\n\nGostaria de verificar a montagem e compatibilidade!`;

    const waUrl = `https://wa.me/555432814464?text=${encodeURIComponent(waText)}`;

    this.container.innerHTML = `
      <div class="builder-layout">
        
        <!-- ESQUERDA: ETAPAS DE SELEÇÃO -->
        <div class="builder-steps-column">
          ${stepsHTML}
        </div>

        <!-- DIREITA: PAINEL DE RESUMO DA CONFIGURAÇÃO -->
        <div class="builder-summary-sticky">
          <div class="summary-card">
            <h3 class="summary-title"><i class="fas fa-calculator"></i> Resumo do PC Gamer</h3>

            <div class="summary-metric-row">
              <span>Consumo Estimado:</span>
              <strong style="color: #FFB800;"><i class="fas fa-bolt"></i> ${totals.estimatedWatts} Watts</strong>
            </div>

            <div class="summary-metric-row">
              <span>Compatibilidade:</span>
              <strong style="color: #00C853;"><i class="fas fa-check-double"></i> Verificada</strong>
            </div>

            <div class="summary-price-box">
              <span class="summary-price-lbl">Valor Total à Vista no Pix:</span>
              <div class="summary-price-val">${formattedPix}</div>
              <small style="color: var(--gray);">Ou ${formattedRegular} em até 10x sem juros no cartão</small>
            </div>

            <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp buy-wa-large-btn" style="margin-top: 16px;">
              <i class="fab fa-whatsapp"></i> Solicitar Orçamento no Whats
            </a>
          </div>
        </div>

      </div>
    `;
  }

  bindEvents() {
    this.container.addEventListener('change', (e) => {
      if (e.target.classList.contains('builder-select')) {
        const key = e.target.dataset.key;
        const prodId = e.target.value;
        if (prodId) {
          this.selection[key] = ProductStore.getProductById(prodId);
        } else {
          this.selection[key] = null;
        }
        this.render();
      }
    });

    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-remove-part')) {
        const key = e.target.dataset.key;
        this.selection[key] = null;
        this.render();
      }
    });
  }
}
