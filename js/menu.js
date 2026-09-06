/* ==========================================================================
   FORNO BELLA — Renderização do cardápio na página inicial
   ========================================================================== */

let categoriaAtiva = "pizzas";

function renderizarCardapio() {
  const lista = document.getElementById("menu-list");
  if (!lista) return;

  const itens = PRODUCTS.filter(p => p.categoria === categoriaAtiva);

  lista.innerHTML = itens.map(produto => `
    <div class="menu-row">
      <div class="menu-icon">${produto.icone}</div>
      <div class="menu-body">
        <div class="menu-title-line">
          <span>${produto.nome}</span>
          <span class="leader"></span>
          <span class="menu-price">${formatarPreco(produto.preco)}</span>
        </div>
        <p class="menu-desc">${produto.descricao}</p>
        <div class="menu-row-actions">
          <button type="button" class="btn btn-outline btn-small" data-add="${produto.id}">
            Adicionar ao pedido
          </button>
        </div>
      </div>
    </div>
  `).join("");

  lista.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => {
      carrinhoAdicionar(btn.getAttribute("data-add"), 1);
      const original = btn.textContent;
      btn.textContent = "Adicionado ✓";
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 900);
    });
  });
}

function iniciarAbasCardapio() {
  const tabs = document.getElementById("menu-tabs");
  if (!tabs) return;

  tabs.innerHTML = CATEGORIAS.map(cat => `
    <button type="button" class="menu-tab" role="tab"
      aria-selected="${cat.id === categoriaAtiva}" data-categoria="${cat.id}">
      ${cat.label}
    </button>
  `).join("");

  tabs.querySelectorAll(".menu-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      categoriaAtiva = tab.getAttribute("data-categoria");
      tabs.querySelectorAll(".menu-tab").forEach(t =>
        t.setAttribute("aria-selected", t === tab ? "true" : "false")
      );
      renderizarCardapio();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  iniciarAbasCardapio();
  renderizarCardapio();
});
