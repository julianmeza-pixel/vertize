/* =============================================================
   VERTIZE — noticias.js
   Listado de noticias: buscador, filtros por categoría, orden y
   paginación (F01, F07), todo aplicado en memoria sin recargar
   la página.
   ============================================================= */

const NOTICIAS_POR_PAGINA = 6;

const estadoListado = {
  todas: [],
  texto: '',
  categoria: 'Todas',
  orden: 'recientes',
  pagina: 1
};

function construirChipsCategoria() {
  const contenedor = document.getElementById('chips-categoria');
  const chipsHTML = CATEGORIAS.map(
    (categoria) => `<button class="chip" data-categoria="${categoria}">${categoria}</button>`
  ).join('');
  contenedor.insertAdjacentHTML('beforeend', chipsHTML);

  contenedor.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.chip');
    if (!boton) return;
    estadoListado.categoria = boton.dataset.categoria;
    estadoListado.pagina = 1;
    contenedor.querySelectorAll('.chip').forEach((c) => c.classList.remove('activo'));
    boton.classList.add('activo');
    renderizarListado();
  });
}

function aplicarFiltros() {
  let resultado = [...estadoListado.todas];

  if (estadoListado.categoria !== 'Todas') {
    resultado = resultado.filter((n) => n.categoria === estadoListado.categoria);
  }

  const texto = estadoListado.texto.trim().toLowerCase();
  if (texto) {
    resultado = resultado.filter((n) =>
      [n.titulo, n.descripcion, n.autor, n.categoria]
        .join(' ')
        .toLowerCase()
        .includes(texto)
    );
  }

  switch (estadoListado.orden) {
    case 'antiguas':
      resultado.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      break;
    case 'lectura-asc':
      resultado.sort((a, b) => a.tiempoLectura - b.tiempoLectura);
      break;
    case 'lectura-desc':
      resultado.sort((a, b) => b.tiempoLectura - a.tiempoLectura);
      break;
    default:
      resultado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }

  return resultado;
}

function renderizarPaginacion(totalPaginas) {
  const nav = document.getElementById('paginacion');
  if (totalPaginas <= 1) {
    nav.innerHTML = '';
    return;
  }

  let botones = '';
  for (let i = 1; i <= totalPaginas; i++) {
    botones += `<button data-pagina="${i}" class="${i === estadoListado.pagina ? 'activo' : ''}">${i}</button>`;
  }
  nav.innerHTML = botones;
}

function renderizarListado() {
  const grid = document.getElementById('grid-listado');
  const contador = document.getElementById('contador-resultados');
  const vacio = document.getElementById('estado-vacio');

  const filtradas = aplicarFiltros();
  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / NOTICIAS_POR_PAGINA));
  estadoListado.pagina = Math.min(estadoListado.pagina, totalPaginas);

  const inicio = (estadoListado.pagina - 1) * NOTICIAS_POR_PAGINA;
  const visibles = filtradas.slice(inicio, inicio + NOTICIAS_POR_PAGINA);

  contador.textContent = `${filtradas.length} artículo${filtradas.length === 1 ? '' : 's'} encontrado${filtradas.length === 1 ? '' : 's'}`;

  if (visibles.length === 0) {
    grid.innerHTML = '';
    vacio.classList.remove('oculto');
  } else {
    vacio.classList.add('oculto');
    grid.innerHTML = visibles.map((n) => plantillaTarjeta(n)).join('');
  }

  renderizarPaginacion(totalPaginas);
  window.scrollTo({ top: grid.offsetTop - 90, behavior: 'smooth' });
}

async function iniciarListado() {
  const grid = document.getElementById('grid-listado');
  try {
    estadoListado.todas = await obtenerNoticias();
  } catch (error) {
    grid.innerHTML = `<p class="estado-vacio">No fue posible cargar el catálogo. ${error.message}</p>`;
    return;
  }

  construirChipsCategoria();
  renderizarListado();

  document.getElementById('campo-buscar').addEventListener('input', (evento) => {
    estadoListado.texto = evento.target.value;
    estadoListado.pagina = 1;
    renderizarListado();
  });

  document.getElementById('selector-orden').addEventListener('change', (evento) => {
    estadoListado.orden = evento.target.value;
    renderizarListado();
  });

  document.getElementById('paginacion').addEventListener('click', (evento) => {
    const boton = evento.target.closest('button[data-pagina]');
    if (!boton) return;
    estadoListado.pagina = Number(boton.dataset.pagina);
    renderizarListado();
  });

  activarBotonesFavorito(grid);
}

document.addEventListener('DOMContentLoaded', iniciarListado);
