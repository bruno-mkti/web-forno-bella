/* ==========================================================================
   FORNO BELLA — Botão flutuante do WhatsApp
   Troque WHATSAPP_NUMERO pelo número real do restaurante (com DDI 55 e DDD).
   ========================================================================== */

const WHATSAPP_NUMERO = "5511999999999"; // <-- substitua pelo número real
const WHATSAPP_MENSAGEM_PADRAO = "Olá! Vim pelo site da Forno Bella e gostaria de fazer um pedido. 🍕";

function linkWhatsapp(mensagem) {
  const texto = encodeURIComponent(mensagem || WHATSAPP_MENSAGEM_PADRAO);
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${texto}`;
}

function montarBotaoFlutuante() {
  if (document.querySelector(".wa-float")) return;

  const link = document.createElement("a");
  link.href = linkWhatsapp();
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.className = "wa-float";
  link.setAttribute("aria-label", "Falar no WhatsApp com a Forno Bella");
  link.innerHTML = `
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.22.6 4.36 1.74 6.25L4 29l7.9-1.7a12 12 0 0 0 4.12.73h.01c6.62 0 12.02-5.4 12.02-12.02C28.05 8.4 22.65 3 16.02 3zm7.06 17.1c-.3.85-1.5 1.56-2.46 1.76-.65.14-1.5.25-4.36-.94-3.66-1.52-6.02-5.2-6.2-5.44-.18-.24-1.48-1.97-1.48-3.76 0-1.79.94-2.66 1.28-3.03.3-.32.66-.4.88-.4.22 0 .44 0 .63.01.2.01.47-.08.74.56.3.7.99 2.44 1.08 2.62.09.18.15.4.03.64-.12.24-.18.4-.36.61-.18.21-.38.47-.54.63-.18.18-.37.37-.16.73.21.36.94 1.55 2.02 2.52 1.39 1.24 2.56 1.63 2.92 1.81.36.18.57.15.78-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.8-.18.33.12 2.06.97 2.42 1.15.36.18.6.27.68.42.09.16.09.9-.21 1.75z"/>
    </svg>
  `;

  const tooltip = document.createElement("span");
  tooltip.className = "wa-tooltip";
  tooltip.textContent = "Fale conosco no WhatsApp";

  document.body.appendChild(link);
  document.body.appendChild(tooltip);
}

document.addEventListener("DOMContentLoaded", montarBotaoFlutuante);
