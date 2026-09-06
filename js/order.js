/* ==========================================================================
   FORNO BELLA — Pedido (compartilhado entre agendamento, checkout e finalização)
   ========================================================================== */

const ORDER_KEY = "fornobella_pedido";

function gerarNumeroPedido() {
  return "FB" + Math.floor(1000 + Math.random() * 9000);
}

function salvarPedido(pedido) {
  try {
    window.localStorage.setItem(ORDER_KEY, JSON.stringify(pedido));
  } catch (e) {
    window.__ultimoPedidoMemoria = pedido;
  }
}

function lerPedido() {
  try {
    const raw = window.localStorage.getItem(ORDER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* segue para o fallback */ }
  return window.__ultimoPedidoMemoria || null;
}

function limparPedido() {
  try {
    window.localStorage.removeItem(ORDER_KEY);
  } catch (e) { /* ignora */ }
  window.__ultimoPedidoMemoria = null;
}
