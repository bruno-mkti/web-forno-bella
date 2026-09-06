/* ==========================================================================
   FORNO BELLA — Catálogo de produtos
   Edite aqui para adicionar, remover ou alterar preços dos itens do cardápio.
   ========================================================================== */

const PRODUCTS = [
  // ---------------- PIZZAS ----------------
  { id: "pz-marguerita", categoria: "pizzas", nome: "Marguerita", descricao: "Molho de tomate, muçarela de búfala, manjericão fresco e fio de azeite.", preco: 48.90, icone: "🍕" },
  { id: "pz-calabresa", categoria: "pizzas", nome: "Calabresa na Brasa", descricao: "Calabresa defumada na hora, cebola roxa e orégano.", preco: 46.90, icone: "🍕" },
  { id: "pz-quatroqueijos", categoria: "pizzas", nome: "Quatro Queijos", descricao: "Muçarela, provolone, gorgonzola e parmesão curado.", preco: 52.90, icone: "🍕" },
  { id: "pz-portuguesa", categoria: "pizzas", nome: "Portuguesa da Casa", descricao: "Presunto, ovos, cebola, azeitona preta e pimentão.", preco: 49.90, icone: "🍕" },
  { id: "pz-figo", categoria: "pizzas", nome: "Figo com Gorgonzola", descricao: "Figos caramelizados, gorgonzola e mel de laranjeira.", preco: 56.90, icone: "🍕" },
  { id: "pz-vegetariana", categoria: "pizzas", nome: "Horta do Chef", descricao: "Abobrinha grelhada, tomate seco, rúcula e ricota temperada.", preco: 47.90, icone: "🍕" },

  // ---------------- MARMITAS ----------------
  { id: "mm-frango", categoria: "marmitas", nome: "Marmita Frango Grelhado", descricao: "Frango grelhado, arroz integral, feijão e legumes salteados.", preco: 28.90, icone: "🍱" },
  { id: "mm-carne", categoria: "marmitas", nome: "Marmita Carne de Panela", descricao: "Carne cozida lentamente, purê de batata e legumes assados.", preco: 32.90, icone: "🍱" },
  { id: "mm-vegana", categoria: "marmitas", nome: "Marmita Vegana do Dia", descricao: "Grão-de-bico assado, quinoa, legumes da estação e molho tahine.", preco: 27.90, icone: "🍱" },
  { id: "mm-peixe", categoria: "marmitas", nome: "Marmita Peixe ao Forno", descricao: "Filé de peixe assado, arroz de brócolis e legumes na manteiga.", preco: 34.90, icone: "🍱" },

  // ---------------- BEBIDAS ----------------
  { id: "bb-suco", categoria: "bebidas", nome: "Suco Natural 400ml", descricao: "Laranja, maracujá ou limão, feito na hora.", preco: 11.90, icone: "🥤" },
  { id: "bb-refri", categoria: "bebidas", nome: "Refrigerante Lata", descricao: "Coca-cola, guaraná ou soda limonada — 350ml.", preco: 7.90, icone: "🥤" },
  { id: "bb-agua", categoria: "bebidas", nome: "Água com ou sem Gás", descricao: "Garrafa 500ml gelada.", preco: 5.50, icone: "🥤" },
  { id: "bb-vinho", categoria: "bebidas", nome: "Taça de Vinho da Casa", descricao: "Seleção tinto ou branco, harmonização sugerida pelo garçom.", preco: 22.00, icone: "🥤" },

  // ---------------- SOBREMESAS ----------------
  { id: "sb-tiramisu", categoria: "sobremesas", nome: "Tiramisù Clássico", descricao: "Camadas de café, mascarpone e cacau amargo.", preco: 19.90, icone: "🍰" },
  { id: "sb-pudim", categoria: "sobremesas", nome: "Pudim de Doce de Leite", descricao: "Receita da casa com calda cremosa.", preco: 14.90, icone: "🍰" },
  { id: "sb-brownie", categoria: "sobremesas", nome: "Brownie Quente", descricao: "Com sorvete de creme e calda de chocolate 70%.", preco: 18.90, icone: "🍰" },
];

const CATEGORIAS = [
  { id: "pizzas", label: "Pizzas" },
  { id: "marmitas", label: "Marmitas" },
  { id: "bebidas", label: "Bebidas" },
  { id: "sobremesas", label: "Sobremesas" },
];

function formatarPreco(valor){
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function encontrarProduto(id){
  return PRODUCTS.find(p => p.id === id) || null;
}
