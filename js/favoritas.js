/* =============================================================
   VERTIZE — favoritas.js
   Colección personal de favoritas (F03, F04): lectura desde
   localStorage, filtro por categoría y acción de vaciar la lista.
   ============================================================= */

const estadoFavoritas = {
  todas: [],
  categoria: 'Todas'
};

function categoriasPresentes(noticias) {
  const unicas = new Set(noticias.map((n) => n.categoria));
  return CATEGORIAS.filter((categoria) => unicas.has(categoria));
}

function construirChipsFavoritas(noticias) {
  const contenedor = document.getElementById('chips-categoria-favoritas');
  const categorias = categoriasPresentes(noticias);
  contenedor.insertAdjacentHTML(
    'beforeend',
    categorias.map((c) => `<button class="chip" data-categoria="${c}">${c}</button>`).join('')
  );

  contenedor.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.chip');
    if (!boton) return;
    estadoFavoritas.categoria = boton.dataset.categoria;
    contenedor.querySelectorAll('.chip').forEach((c) => c.classList.remove('activo'));
    boton.classList.add('activo');
    renderizarFavoritas();
  });
}

function renderizarFavoritas() {
  const grid = document.getElementById('grid-favoritas');
  const vacio = document.getElementById('estado-vacio-favoritas');

  const filtradas = estadoFavoritas.categoria === 'Todas'
    ? estadoFavoritas.todas
    : estadoFavoritas.todas.filter((n) => n.categoria === estadoFavoritas.categoria);

  if (filtradas.length === 0) {
    grid.innerHTML = '';
    vacio.classList.remove('oculto');
  } else {
    vacio.classList.add('oculto');
    grid.innerHTML = filtradas.map((n) => plantillaTarjeta(n, { mostrarGuardar: false, mostrarQuitar: true })).join('');
  }
}

async function recargarFavoritas() {
  estadoFavoritas.todas = await obtenerNoticiasFavoritas();
  renderizarFavoritas();
}

async function iniciarFavoritas() {
  const grid = document.getElementById('grid-favoritas');
  try {
    estadoFavoritas.todas = await obtenerNoticiasFavoritas();
  } catch (error) {
    grid.innerHTML = `<p class="estado-vacio">No fue posible cargar tus favoritas. ${error.message}</p>`;
    return;
  }

  construirChipsFavoritas(estadoFavoritas.todas);
  renderizarFavoritas();

  grid.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-accion="quitar-favorito"]');
    if (!boton) return;
    alternarFavorito(boton.dataset.id);
    estadoFavoritas.todas = estadoFavoritas.todas.filter((n) => n.id !== Number(boton.dataset.id));
    renderizarFavoritas();
  });

  document.getElementById('btn-vaciar-favoritas').addEventListener('click', () => {
    if (estadoFavoritas.todas.length === 0) return;
    const confirmado = window.confirm('¿Vaciar por completo tu colección de favoritas? Esta acción no se puede deshacer.');
    if (!confirmado) return;
    vaciarFavoritos();
    estadoFavoritas.todas = [];
    renderizarFavoritas();
  });
}

document.addEventListener('DOMContentLoaded', iniciarFavoritas);
