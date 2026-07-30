/* ============================================================
   ASSISTENTE IA DE VENDAS (JC BOT)
   Recomendações inteligentes baseadas estritamente no estoque cadastrado
   ============================================================ */
import { ProductStore } from './firebase-config.js';

export class AIAssistantEngine {
  constructor() {
    this.widgetToggle = document.getElementById('ai-assistant-toggle');
    this.chatbox = document.getElementById('ai-chatbox');
    this.closeBtn = document.getElementById('ai-chatbox-close');
    this.sendBtn = document.getElementById('ai-send-btn');
    this.input = document.getElementById('ai-chat-input');
    this.body = document.getElementById('ai-chat-body');

    this.products = ProductStore.getActiveProducts();
    this.init();
  }

  init() {
    if (!this.widgetToggle) return;
    this.bindEvents();
  }

  bindEvents() {
    this.widgetToggle.addEventListener('click', () => {
      if (this.chatbox) {
        this.chatbox.classList.toggle('ai-chatbox-visible');
      }
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => {
        if (this.chatbox) {
          this.chatbox.classList.remove('ai-chatbox-visible');
        }
      });
    }

    if (this.sendBtn && this.input) {
      this.sendBtn.addEventListener('click', () => this.handleUserMessage());
      this.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleUserMessage();
      });
    }

    // Botões de perguntas rápidas
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('ai-quick-btn')) {
        const prompt = e.target.textContent;
        this.input.value = prompt;
        this.handleUserMessage();
      }
    });
  }

  handleUserMessage() {
    const query = this.input.value.trim();
    if (!query) return;

    this.appendMessage('user', query);
    this.input.value = '';

    // Efeito de digitação da IA
    setTimeout(() => {
      const response = this.generateAIResponse(query);
      this.appendMessage('ai', response.html);
    }, 600);
  }

  appendMessage(sender, htmlContent) {
    if (!this.body) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-msg ai-msg-${sender}`;
    msgDiv.innerHTML = htmlContent;
    this.body.appendChild(msgDiv);
    this.body.scrollTop = this.body.scrollHeight;
  }

  generateAIResponse(userText) {
    const lower = userText.toLowerCase();
    let matches = [];

    if (lower.includes('gta') || lower.includes('jogo') || lower.includes('gamer') || lower.includes('placa de vídeo') || lower.includes('gpu')) {
      matches = this.products.filter(p => p.categoria === 'gabinetes' || p.categoria === 'perifericos' || p.categoria === 'hardware');
    } else if (lower.includes('ssd') || lower.includes('notebook') || lower.includes('4.000') || lower.includes('4000') || lower.includes('upgrade')) {
      matches = this.products.filter(p => p.categoria === 'hardware');
    } else if (lower.includes('teclado') || lower.includes('mouse')) {
      matches = this.products.filter(p => p.categoria === 'perifericos');
    } else if (lower.includes('headset') || lower.includes('som') || lower.includes('fone')) {
      matches = this.products.filter(p => p.categoria === 'audio');
    } else if (lower.includes('roteador') || lower.includes('wifi') || lower.includes('internet')) {
      matches = this.products.filter(p => p.categoria === 'redes');
    } else {
      matches = this.products.slice(0, 2);
    }

    const selected = matches.slice(0, 2);

    if (selected.length === 0) {
      return {
        html: `<p>Olá! Temos diversas opções de peças e periféricos em nossa loja física em Nova Petrópolis. Clique no botão do WhatsApp para falar diretamente com nosso especialista técnico!</p>`
      };
    }

    let itemsHTML = selected.map(p => `
      <div class="ai-recommend-card">
        <img src="${p.imagem}" alt="${p.nome || p.titulo}" />
        <div>
          <strong>${p.nome || p.titulo}</strong>
          <span style="color:#00C853; font-weight:700;">${parseFloat(p.precoPromocional || p.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} no Pix</span>
          <a href="produto.html?id=${p.id}" class="ai-card-link">Ver Detalhes <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    `).join('');

    return {
      html: `
        <p>🤖 Com base no estoque atual da JC Informática, a melhor recomendação para você é:</p>
        ${itemsHTML}
      `
    };
  }
}
