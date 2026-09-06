# Forno Bella — E-commerce de Pizzaria & Restaurante

Site completo em HTML, CSS e JavaScript puro (sem frameworks, sem build).

## Estrutura de pastas

```
pizzaria-ecommerce/
├── index.html          → Página inicial (hero + cardápio + carrinho)
├── agendamento.html     → Agendamento de retirada de marmitas
├── checkout.html        → Checkout (entrega/retirada + pagamento)
├── finalizacao.html     → Confirmação do pedido + botão do WhatsApp
├── css/
│   └── style.css        → Todo o estilo do site (tokens de cor/tipografia no topo)
├── js/
│   ├── products.js       → Catálogo de produtos (edite aqui preços e itens)
│   ├── cart.js           → Lógica do carrinho (localStorage)
│   ├── order.js          → Lógica do pedido/agendamento (localStorage)
│   ├── whatsapp.js        → Botão flutuante do WhatsApp
│   ├── main.js           → Menu mobile (compartilhado)
│   ├── menu.js            → Abas e renderização do cardápio (só na home)
│   ├── agendamento.js     → Formulário de agendamento de marmitas
│   ├── checkout.js        → Formulário de checkout
│   └── finalizacao.js     → Página de confirmação
└── README.md
```

## Como usar

1. Abra `index.html` num navegador (duplo clique já funciona) ou publique a pasta
   inteira num serviço de hospedagem (Netlify, Vercel, GitHub Pages, cPanel, etc.).
2. Não há back-end: carrinho e pedidos ficam salvos no `localStorage` do navegador
   do próprio cliente, só para permitir a navegação entre as páginas do fluxo de compra.

## Personalização essencial antes de publicar

- **Número do WhatsApp:** edite `WHATSAPP_NUMERO` em `js/whatsapp.js`
  (formato: DDI + DDD + número, só números, ex.: `5511987654321`).
- **Cardápio e preços:** edite o array `PRODUCTS` em `js/products.js`.
- **Horários de retirada de marmita:** edite `JANELAS_RETIRADA` em `js/agendamento.js`.
- **Endereço, telefone e horário de funcionamento:** edite o rodapé/seção
  "Sobre" em `index.html`.
- **Taxa de entrega:** edite `TAXA_ENTREGA` em `js/checkout.js`.

## Fluxo de compra

`index.html` (adicionar itens ao carrinho) → `checkout.html` (dados, entrega/retirada,
pagamento) → `finalizacao.html` (resumo + confirmação via WhatsApp).

## Fluxo de agendamento de marmita

`agendamento.html` (marmita, data, horário e dados) → `finalizacao.html`
(resumo + confirmação via WhatsApp).

## Observações técnicas

- Sem dependências externas além da fonte do Google Fonts (Fraunces + Nunito Sans).
- Totalmente responsivo (testado de 360px a desktop).
- O carrinho e o pedido usam `localStorage` com fallback em memória caso o
  navegador bloqueie o armazenamento local — nesse caso, os dados não
  persistem ao recarregar a página.
