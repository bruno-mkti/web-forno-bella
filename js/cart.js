/* ==========================================================================
   FORNO BELLA — Carrinho de compras
   Persiste os itens em localStorage para funcionar entre as páginas
   (index -> checkout -> finalização). Se o navegador bloquear o
   localStorage, cai para uma variável em memória (dura só a sessão atual).
   ========================================================================== */

const CART_KEY = "fornobella_carrinho";

const CartStore = (function () {
  let memoryFallback = [];
  let storageDisponivel = true;

  try {
    const teste = "__teste_storage__";
    window.localStorage.setItem(teste, "1");
    window.localStorage.removeItem(teste);
  } catch (e) {
    storageDisponivel = false;
  }

  function ler() {
    if (!storageDisponivel) return memoryFallback;
    try {
      const raw = window.localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return memoryFallback;
    }
  }

  function salvar(itens) {
    if (!storageDisponivel) {
      memoryFallback = itens;
      return;
    }
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(itens));
    } catch (e) {
      memoryFallback = itens;
    }
  }

  return { ler, salvar };
})();

function carrinhoObter() {
  return CartStore.ler();
}

function carrinhoSalvar(itens) {
  CartStore.salvar(itens);
  document.dispatchEvent(new CustomEvent("carrinho:atualizado"));
}

function carrinhoAdicionar(produtoId, quantidade = 1) {
  const produto = encontrarProduto(produtoId);
  if (!produto) return;
  const itens = carrinhoObter();
  const existente = itens.find(i => i.id === produtoId);
  if (existente) {
    existente.quantidade += quantidade;
  } else {
    itens.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      icone: produto.icone,
      quantidade,
    });
  }
  carrinhoSalvar(itens);
}

function carrinhoAtualizarQuantidade(produtoId, quantidade) {
  let itens = carrinhoObter();
  if (quantidade <= 0) {
    itens = itens.filter(i => i.id !== produtoId);
  } else {
    const item = itens.find(i => i.id === produtoId);
    if (item) item.quantidade = quantidade;
  }
  carrinhoSalvar(itens);
}

function carrinhoRemover(produtoId) {
  const itens = carrinhoObter().filter(i => i.id !== produtoId);
  carrinhoSalvar(itens);
}

function carrinhoLimpar() {
  carrinhoSalvar([]);
}

function carrinhoTotalItens() {
  return carrinhoObter().reduce((soma, i) => soma + i.quantidade, 0);
}

function carrinhoSubtotal() {
  return carrinhoObter().reduce((soma, i) => soma + i.quantidade * i.preco, 0);
}

/* ---------- UI: badge do header + drawer lateral ---------- */

function atualizarBadgeCarrinho() {
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    el.textContent = carrinhoTotalItens();
  });
}

function renderizarDrawerCarrinho() {
  const lista = document.getElementById("cart-items");
  const rodape = document.getElementById("cart-foot");
  if (!lista) return;

  const itens = carrinhoObter();

  if (itens.length === 0) {
    lista.innerHTML = `
      <div class="cart-empty">
        <p>Seu carrinho está vazio.</p>
        <p class="muted">Adicione uma pizza ou marmita do cardápio para começar.</p>
      </div>`;
    if (rodape) rodape.style.display = "none";
    return;
  }

  if (rodape) rodape.style.display = "block";

  lista.innerHTML = itens.map(item => `
    <div class="cart-item" data-item="${item.id}">
      <div class="cart-item-icon">${item.icone}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.nome}</div>
        <div class="cart-item-row">
          <div class="qty-control">
            <button type="button" data-action="menos" aria-label="Diminuir quantidade">−</button>
            <span>${item.quantidade}</span>
            <button type="button" data-action="mais" aria-label="Aumentar quantidade">+</button>
          </div>
          <strong>${formatarPreco(item.preco * item.quantidade)}</strong>
        </div>
        <button type="button" class="cart-item-remove" data-action="remover">Remover</button>
      </div>
    </div>
  `).join("");

  const totalEl = document.getElementById("cart-total");
  if (totalEl) totalEl.textContent = formatarPreco(carrinhoSubtotal());

  lista.querySelectorAll(".cart-item").forEach(linha => {
    const id = linha.getAttribute("data-item");
    const item = itens.find(i => i.id === id);
    linha.querySelector('[data-action="mais"]').addEventListener("click", () => {
      carrinhoAtualizarQuantidade(id, item.quantidade + 1);
    });
    linha.querySelector('[data-action="menos"]').addEventListener("click", () => {
      carrinhoAtualizarQuantidade(id, item.quantidade - 1);
    });
    linha.querySelector('[data-action="remover"]').addEventListener("click", () => {
      carrinhoRemover(id);
    });
  });
}

function abrirCarrinho() {
  document.getElementById("cart-overlay")?.classList.add("is-open");
  document.getElementById("cart-drawer")?.classList.add("is-open");
}

function fecharCarrinho() {
  document.getElementById("cart-overlay")?.classList.remove("is-open");
  document.getElementById("cart-drawer")?.classList.remove("is-open");
}

function iniciarCarrinhoUI() {
  atualizarBadgeCarrinho();
  renderizarDrawerCarrinho();

  document.querySelectorAll("[data-open-cart]").forEach(btn => {
    btn.addEventListener("click", abrirCarrinho);
  });
  document.getElementById("cart-close")?.addEventListener("click", fecharCarrinho);
  document.getElementById("cart-overlay")?.addEventListener("click", fecharCarrinho);

  document.addEventListener("carrinho:atualizado", () => {
    atualizarBadgeCarrinho();
    renderizarDrawerCarrinho();
  });
}

document.addEventListener("DOMContentLoaded", iniciarCarrinhoUI);
