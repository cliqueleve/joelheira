"use strict";

const product = window.produtoCliqueLeve;
const all = (selector) => [...document.querySelectorAll(selector)];

function httpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

function setText(selector, value) {
  if (!value) return;
  for (const element of all(selector)) {
    element.textContent = value;
    element.hidden = false;
  }
}

const gallery = document.querySelector("#galeria");
const thumbnails = all(".thumbs button");
document.querySelector(".thumbs").hidden = false;
for (const thumbnail of thumbnails) {
  thumbnail.addEventListener("click", () => {
    gallery.src = thumbnail.dataset.photo;
    gallery.alt = thumbnail.dataset.alt;
    for (const button of thumbnails) {
      button.setAttribute("aria-pressed", String(button === thumbnail));
    }
  });
}

if (product) {
  setText("[data-name]", product.nome);
  setText("#descricao", product.descricao);
  if (product.materiais) setText("#materiais", "Materiais: " + product.materiais);
  if (product.nome) document.title = product.nome + " | CliqueLeve";
  if (Number.isFinite(product.preco) && product.preco >= 0) {
    setText("[data-price]", new Intl.NumberFormat("pt-BR", {
      style: "currency", currency: "BRL",
    }).format(product.preco));
  }

  for (const [key, value] of Object.entries(product.faq)) {
    setText('[data-faq="' + key + '"]', value);
  }
  if (!product.faq.entrega) setText('[data-faq="entrega"]', product.envio);

  const support = httpsUrl(product.suporteUrl);
  if (support) {
    const link = document.querySelector("#suporte");
    link.href = support.href;
    link.hidden = false;
    if (!product.faq.suporte) {
      setText('[data-faq="suporte"]', "Use o canal oficial da CliqueLeve para falar com o atendimento.");
    }
  }

  const policies = document.querySelector("#politicas");
  for (const [label, value] of [
    ["Pagamento", product.pagamento], ["Envio", product.envio], ["Devolução", product.devolucao],
  ]) {
    if (!value) continue;
    const name = document.createElement("dt");
    const description = document.createElement("dd");
    name.textContent = label;
    description.textContent = value;
    policies.append(name, description);
  }
  if (policies.childElementCount) {
    policies.hidden = false;
    document.querySelector("#politicas-pendentes").hidden = true;
  }

  function renderCards(container, items, isGuide) {
    items.forEach((item, index) => {
      const card = document.createElement(isGuide ? "li" : "article");
      const title = document.createElement("h3");
      const text = document.createElement("p");
      if (isGuide) {
        const step = document.createElement("span");
        step.textContent = String(index + 1).padStart(2, "0");
        step.setAttribute("aria-hidden", "true");
        card.append(step);
      }
      title.textContent = item.titulo;
      text.textContent = item.texto;
      card.append(title, text);
      if (item.imagem) {
        const image = document.createElement("img");
        image.src = item.imagem;
        image.alt = item.alt || "";
        image.loading = "lazy";
        card.append(image);
      }
      container.append(card);
    });
  }

  if (product.beneficios.length) {
    renderCards(document.querySelector("#detalhes"), product.beneficios, false);
  }
  if (product.etapas.length) {
    const steps = document.querySelector("#etapas");
    renderCards(steps, product.etapas, true);
    steps.hidden = false;
    document.querySelector("#manual-pendente").hidden = true;
    if (!product.faq.uso) {
      setText('[data-faq="uso"]', "Confira a seção Guia de uso para ver as etapas de colocação e ajuste.");
    }
  }

  const checkout = httpsUrl(product.checkoutUrl);
  const checkoutLinks = all("[data-checkout]");
  const sizeSelectors = [];
  function updateCheckout(size) {
    const destination = checkout && new URL(checkout);
    if (destination && size && product.checkoutParametroTamanho) {
      destination.searchParams.set(product.checkoutParametroTamanho, size);
    }
    for (const link of checkoutLinks) {
      if (destination) link.href = destination.href;
    }
    for (const select of sizeSelectors) select.value = size;
  }

  if (product.tamanhos.length) {
    for (const [index, container] of all("[data-variants]").entries()) {
      const label = document.createElement("label");
      const select = document.createElement("select");
      const sizeInCheckout = checkout && !product.checkoutParametroTamanho;
      if (sizeInCheckout) {
        container.textContent = "Tamanhos disponíveis: " + product.tamanhos.join(", ") +
          ". Escolha seu tamanho no checkout.";
        continue;
      }
      select.id = "tamanho-" + index;
      label.htmlFor = select.id;
      label.textContent = "Tamanho";
      for (const size of product.tamanhos) select.add(new Option(size, size));
      select.addEventListener("change", () => updateCheckout(select.value));
      sizeSelectors.push(select);
      container.append(label, select);
    }
  }
  if (checkout) {
    updateCheckout(product.tamanhos[0]);
    for (const link of checkoutLinks) link.hidden = false;
    for (const element of all("[data-stock], [data-purchase-info]")) element.hidden = true;
  }
}

if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
  document.body.classList.add("motion");
  for (const element of all(".reveal")) observer.observe(element);
}
