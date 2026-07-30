/* ============================================================
   SEO & SCHEMA.ORG INJECTOR ENGINE (JC Informática)
   ============================================================ */
export function injectProductSEO(product) {
  if (!product) return;

  // 1. Atualiza o Título e a Meta Description da página
  const pageTitle = `${product.titulo} | JC Informática – Nova Petrópolis, RS`;
  document.title = pageTitle;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.content = `${product.titulo}. Compre na JC Informática em Nova Petrópolis, RS com pronta entrega e suporte presencial.`;
  }

  // 2. Atualiza OpenGraph Meta Tags
  updateMeta('property', 'og:title', pageTitle);
  updateMeta('property', 'og:description', `${product.titulo} no valor de R$ ${parseFloat(product.preco).toFixed(2)}. Confira na JC Informática!`);
  updateMeta('property', 'og:image', window.location.origin + '/' + product.imagem);
  updateMeta('property', 'og:url', window.location.href);

  // 3. Injeta Microdados Schema.org JSON-LD para o Google (Rich Snippets)
  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.titulo,
    "image": [window.location.origin + '/' + product.imagem],
    "description": product.descricao || product.titulo,
    "sku": product.sku || "JC-STORE",
    "brand": {
      "@type": "Brand",
      "name": product.marca || "JC Informática"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "BRL",
      "price": parseFloat(product.preco).toFixed(2),
      "availability": product.emEstoque !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "JC Informática"
      }
    }
  };

  let scriptEl = document.getElementById('schema-product-jsonld');
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'schema-product-jsonld';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }
  scriptEl.textContent = JSON.stringify(schemaData);
}

function updateMeta(attr, name, value) {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = value;
}
