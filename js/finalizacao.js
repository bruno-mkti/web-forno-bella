/* ==========================================================================
   FORNO BELLA — Página de finalização (confirmação do pedido/agendamento)
   ========================================================================== */

function formatarDataBr(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

function montarMensagemWhatsapp(pedido) {
  const linhas = pedido.itens.map(i => `• ${i.quantidade}x ${i.nome}`).join("\n");

  if (pedido.tipo === "agendamento") {
    return `Olá! Quero confirmar meu agendamento *${pedido.numero}* na Forno Bella:\n\n` +
      `${linhas}\n\n` +
      `Retirada: ${formatarDataBr(pedido.dataRetirada)} às ${pedido.horaRetirada}\n` +
      `Nome: ${pedido.cliente.nome}\n` +
      `Total: ${formatarPreco(pedido.total)}`;
  }

  const entregaTexto = pedido.entrega === "entrega"
    ? `Entrega no endereço: ${pedido.endereco}`
    : "Retirada no balcão";

  return `Olá! Quero confirmar meu pedido *${pedido.numero}* na Forno Bella:\n\n` +
    `${linhas}\n\n` +
    `${entregaTexto}\n` +
    `Pagamento: ${pedido.pagamento}\n` +
    `Nome: ${pedido.cliente.nome}\n` +
    `Total: ${formatarPreco(pedido.total)}`;
}

/* ---------- GA4 / GTM: dataLayer ---------- */

window.dataLayer = window.dataLayer || [];

function dispararEventoPurchase(pedido) {
  // Trava para não contar a mesma compra de novo se o cliente atualizar
  // (F5) ou voltar para esta página de finalização.
  const chave = `ga4_purchase_${pedido.numero}`;
  try {
    if (window.sessionStorage.getItem(chave)) return;
    window.sessionStorage.setItem(chave, "1");
  } catch (e) {
    // Sem sessionStorage disponível: segue sem a trava.
  }

  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: "purchase",
    ecommerce: {
      transaction_id: pedido.numero,
      currency: "BRL",
      value: Number(pedido.total.toFixed(2)),
      shipping: Number((pedido.taxaEntrega || 0).toFixed(2)),
      items: pedido.itens.map(item => ({
        item_id: item.id,
        item_name: item.nome,
        price: item.preco,
        quantity: item.quantidade,
      })),
    },
  });
}

function renderizarFinalizacao() {
  const pedido = lerPedido();
  const conteudo = document.getElementById("final-content");
  const vazio = document.getElementById("final-empty");

  if (!pedido) {
    if (conteudo) conteudo.style.display = "none";
    if (vazio) vazio.style.display = "block";
    return;
  }
  if (conteudo) conteudo.style.display = "block";
  if (vazio) vazio.style.display = "none";

  dispararEventoPurchase(pedido);

  document.getElementById("final-numero").textContent = pedido.numero;

  const tituloEl = document.getElementById("final-titulo");
  const detalhesEl = document.getElementById("final-detalhes");

  if (pedido.tipo === "agendamento") {
    tituloEl.textContent = "Agendamento confirmado!";
    detalhesEl.innerHTML = `
      <div class="ticket-row"><span class="ticket-label">Cliente</span><span>${pedido.cliente.nome}</span></div>
      <div class="ticket-row"><span class="ticket-label">Retirada</span><span>${formatarDataBr(pedido.dataRetirada)} às ${pedido.horaRetirada}</span></div>
      <div class="ticket-row"><span class="ticket-label">Pagamento</span><span>Na retirada</span></div>
    `;
  } else {
    tituloEl.textContent = "Pedido confirmado!";
    const entregaTexto = pedido.entrega === "entrega" ? `Entrega — ${pedido.endereco}` : "Retirada no balcão";
    detalhesEl.innerHTML = `
      <div class="ticket-row"><span class="ticket-label">Cliente</span><span>${pedido.cliente.nome}</span></div>
      <div class="ticket-row"><span class="ticket-label">Entrega</span><span>${entregaTexto}</span></div>
      <div class="ticket-row"><span class="ticket-label">Pagamento</span><span style="text-transform:capitalize;">${pedido.pagamento}</span></div>
    `;
  }

  const listaItens = document.getElementById("final-itens");
  listaItens.innerHTML = pedido.itens.map(item => `
    <div class="ticket-row">
      <span class="ticket-label">${item.quantidade}× ${item.nome}</span>
      <span>${formatarPreco(item.preco * item.quantidade)}</span>
    </div>
  `).join("");

  document.getElementById("final-total").textContent = formatarPreco(pedido.total);

  const botaoWpp = document.getElementById("final-whatsapp");
  if (botaoWpp) {
    botaoWpp.href = linkWhatsapp(montarMensagemWhatsapp(pedido));
  }
}

document.addEventListener("DOMContentLoaded", renderizarFinalizacao);
