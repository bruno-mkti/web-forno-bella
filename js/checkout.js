/* ==========================================================================
   FORNO BELLA — Checkout
   ========================================================================== */

const TAXA_ENTREGA = 8.90;

function renderizarResumoCheckout() {
  const itens = carrinhoObter();
  const container = document.getElementById("checkout-content");
  const vazio = document.getElementById("checkout-empty");

  if (itens.length === 0) {
    if (container) container.style.display = "none";
    if (vazio) vazio.style.display = "block";
    return;
  }
  if (container) container.style.display = "grid";
  if (vazio) vazio.style.display = "none";

  const lista = document.getElementById("resumo-itens");
  lista.innerHTML = itens.map(item => `
    <div class="ticket-row">
      <span class="ticket-label">${item.quantidade}× ${item.nome}</span>
      <span>${formatarPreco(item.preco * item.quantidade)}</span>
    </div>
  `).join("");

  atualizarTotais();
}

function tipoEntregaSelecionado() {
  return document.querySelector('input[name="entrega"]:checked')?.value || "retirada";
}

function atualizarTotais() {
  const subtotal = carrinhoSubtotal();
  const entrega = tipoEntregaSelecionado() === "entrega" ? TAXA_ENTREGA : 0;

  document.getElementById("resumo-subtotal").textContent = formatarPreco(subtotal);
  const linhaEntrega = document.getElementById("linha-entrega");
  if (entrega > 0) {
    linhaEntrega.style.display = "flex";
    document.getElementById("resumo-entrega").textContent = formatarPreco(entrega);
  } else {
    linhaEntrega.style.display = "none";
  }
  document.getElementById("resumo-total").textContent = formatarPreco(subtotal + entrega);
}

function alternarCamposEndereco() {
  const campos = document.getElementById("campos-endereco");
  if (!campos) return;
  campos.style.display = tipoEntregaSelecionado() === "entrega" ? "block" : "none";
}

function validarCampo(campo, condicaoValida) {
  const wrapper = campo.closest(".field");
  if (!wrapper) return condicaoValida;
  wrapper.classList.toggle("has-error", !condicaoValida);
  return condicaoValida;
}

/* ---------- GA4 / GTM: dataLayer ---------- */

window.dataLayer = window.dataLayer || [];

function dispararEventoBeginCheckout() {
  const itens = carrinhoObter();
  if (itens.length === 0) return;
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: "begin_checkout",
    ecommerce: {
      currency: "BRL",
      value: Number(carrinhoSubtotal().toFixed(2)),
      items: itens.map(item => ({
        item_id: item.id,
        item_name: item.nome,
        price: item.preco,
        quantity: item.quantidade,
      })),
    },
  });
}

function iniciarCheckout() {
  renderizarResumoCheckout();
  // Dispara só na carga inicial da página — não a cada atualização do
  // carrinho (troca de quantidade, endereço etc.), para não gerar
  // vários begin_checkout duplicados na mesma visita.
  dispararEventoBeginCheckout();
  document.addEventListener("carrinho:atualizado", renderizarResumoCheckout);

  document.querySelectorAll('input[name="entrega"]').forEach(radio => {
    radio.addEventListener("change", () => {
      alternarCamposEndereco();
      atualizarTotais();
    });
  });
  alternarCamposEndereco();

  const form = document.getElementById("form-checkout");
  if (!form) return;

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (carrinhoObter().length === 0) return;

    const nome = document.getElementById("ck-nome");
    const telefone = document.getElementById("ck-telefone");
    const pagamento = document.querySelector('input[name="pagamento"]:checked');
    const entrega = tipoEntregaSelecionado();

    let valido = true;
    valido = validarCampo(nome, nome.value.trim().length >= 3) && valido;
    valido = validarCampo(telefone, telefone.value.trim().length >= 8) && valido;

    let endereco = "";
    if (entrega === "entrega") {
      const rua = document.getElementById("ck-endereco");
      const bairro = document.getElementById("ck-bairro");
      valido = validarCampo(rua, rua.value.trim().length >= 5) && valido;
      valido = validarCampo(bairro, bairro.value.trim().length >= 2) && valido;
      endereco = `${rua.value.trim()}, ${bairro.value.trim()}`;
    }

    if (!pagamento) valido = false;

    if (!valido) {
      form.querySelector(".has-error")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const itens = carrinhoObter();
    const subtotal = carrinhoSubtotal();
    const taxaEntrega = entrega === "entrega" ? TAXA_ENTREGA : 0;

    const pedido = {
      tipo: "pedido",
      numero: gerarNumeroPedido(),
      criadoEm: new Date().toISOString(),
      cliente: { nome: nome.value.trim(), telefone: telefone.value.trim() },
      entrega,
      endereco,
      pagamento: pagamento.value,
      observacoes: document.getElementById("ck-observacoes")?.value.trim() || "",
      itens: itens.map(i => ({ id: i.id, nome: i.nome, preco: i.preco, quantidade: i.quantidade, icone: i.icone })),
      subtotal,
      taxaEntrega,
      total: subtotal + taxaEntrega,
    };

    salvarPedido(pedido);
    carrinhoLimpar();
    window.location.href = "finalizacao.html";
  });
}

document.addEventListener("DOMContentLoaded", iniciarCheckout);
