/* ==========================================================================
   FORNO BELLA — Agendamento de retirada de marmitas
   ========================================================================== */

const JANELAS_RETIRADA = [
  { inicio: "11:00", fim: "14:00" },
  { inicio: "18:00", fim: "21:00" },
];

// Horários já sem vaga (simulação — em produção viria de uma API/back-end)
const HORARIOS_INDISPONIVEIS = ["12:00", "12:30", "19:00"];

let horarioSelecionado = null;

function gerarHorarios() {
  const horarios = [];
  JANELAS_RETIRADA.forEach(janela => {
    let [h, m] = janela.inicio.split(":").map(Number);
    const [hFim, mFim] = janela.fim.split(":").map(Number);
    while (h < hFim || (h === hFim && m < mFim)) {
      horarios.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      m += 30;
      if (m >= 60) { m = 0; h += 1; }
    }
  });
  return horarios;
}

function preencherSelectMarmitas() {
  const select = document.getElementById("ag-marmita");
  if (!select) return;
  const marmitas = PRODUCTS.filter(p => p.categoria === "marmitas");
  select.innerHTML = marmitas.map(m =>
    `<option value="${m.id}">${m.nome} — ${formatarPreco(m.preco)}</option>`
  ).join("");
}

function renderizarHorarios() {
  const container = document.getElementById("time-slots");
  if (!container) return;
  const horarios = gerarHorarios();

  container.innerHTML = horarios.map(h => `
    <button type="button" class="time-slot" data-hora="${h}"
      aria-pressed="false" ${HORARIOS_INDISPONIVEIS.includes(h) ? "disabled" : ""}>
      ${h}
    </button>
  `).join("");

  container.querySelectorAll(".time-slot").forEach(btn => {
    btn.addEventListener("click", () => {
      container.querySelectorAll(".time-slot").forEach(b => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      horarioSelecionado = btn.getAttribute("data-hora");
      const erro = document.getElementById("erro-horario");
      if (erro) erro.style.display = "none";
    });
  });
}

function iniciarDataMinima() {
  const input = document.getElementById("ag-data");
  if (!input) return;
  const hoje = new Date();
  input.min = hoje.toISOString().split("T")[0];
  input.value = hoje.toISOString().split("T")[0];
}

function validarCampo(campo, condicaoValida) {
  const wrapper = campo.closest(".field");
  if (!wrapper) return condicaoValida;
  wrapper.classList.toggle("has-error", !condicaoValida);
  return condicaoValida;
}

function iniciarFormularioAgendamento() {
  const form = document.getElementById("form-agendamento");
  if (!form) return;

  preencherSelectMarmitas();
  renderizarHorarios();
  iniciarDataMinima();

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nome = document.getElementById("ag-nome");
    const telefone = document.getElementById("ag-telefone");
    const data = document.getElementById("ag-data");
    const marmita = document.getElementById("ag-marmita");
    const quantidade = document.getElementById("ag-quantidade");

    let valido = true;
    valido = validarCampo(nome, nome.value.trim().length >= 3) && valido;
    valido = validarCampo(telefone, telefone.value.trim().length >= 8) && valido;
    valido = validarCampo(data, !!data.value) && valido;
    valido = validarCampo(quantidade, Number(quantidade.value) >= 1) && valido;

    const erroHorario = document.getElementById("erro-horario");
    if (!horarioSelecionado) {
      if (erroHorario) erroHorario.style.display = "block";
      valido = false;
    }

    if (!valido) {
      form.querySelector(".has-error")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const produto = encontrarProduto(marmita.value);
    const qtd = Number(quantidade.value);

    const pedido = {
      tipo: "agendamento",
      numero: gerarNumeroPedido(),
      criadoEm: new Date().toISOString(),
      cliente: { nome: nome.value.trim(), telefone: telefone.value.trim() },
      dataRetirada: data.value,
      horaRetirada: horarioSelecionado,
      itens: [{ id: produto.id, nome: produto.nome, preco: produto.preco, quantidade: qtd, icone: produto.icone }],
      observacoes: document.getElementById("ag-observacoes")?.value.trim() || "",
      total: produto.preco * qtd,
    };

    salvarPedido(pedido);
    window.location.href = "finalizacao.html";
  });
}

document.addEventListener("DOMContentLoaded", iniciarFormularioAgendamento);
