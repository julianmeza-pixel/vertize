/* =============================================================
   VERTIZE — ui.js
   Utilidades de interfaz compartidas entre todas las páginas:
   menú móvil, resaltado de sección activa, formato de fecha y
   plantilla de tarjeta de noticia.
   ============================================================= */

const CATEGORIAS = [
  'Inteligencia Artificial',
  'Modelos de Lenguaje',
  'Hardware y Chips',
  'Ingeniería de Software',
  'Ética y Sociedad',
  'Robótica'
];

function inicializarNavegacion() {
  const encabezado = document.querySelector('.encabezado');
  const boton = document.querySelector('.menu-toggle');
  if (!boton || !encabezado) return;

  boton.addEventListener('click', () => {
    const abierto = encabezado.classList.toggle('nav-abierto');
    boton.setAttribute('aria-expanded', abierto ? 'true' : 'false');
  });

  const pagina = document.body.dataset.pagina;
  document.querySelectorAll('.menu-principal a').forEach((enlace) => {
    if (enlace.dataset.pagina === pagina) {
      enlace.classList.add('activo');
    }
    enlace.addEventListener('click', () => encabezado.classList.remove('nav-abierto'));
  });
}

function formatearFecha(fechaIso) {
  const fecha = new Date(fechaIso + 'T00:00:00');
  return fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
}

function escaparHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

/**
 * Genera el marcado de una tarjeta de noticia.
 * @param {object} noticia
 * @param {{mostrarGuardar?: boolean, mostrarQuitar?: boolean}} opciones
 */
function plantillaTarjeta(noticia, opciones = {}) {
  const { mostrarGuardar = true, mostrarQuitar = false } = opciones;
  const guardado = esFavorito(noticia.id);

  const botonGuardar = mostrarGuardar
    ? `<button class="tarjeta__guardar ${guardado ? 'activo' : ''}" data-accion="favorito" data-id="${noticia.id}" aria-label="Guardar en favoritas" title="Guardar en favoritas">${guardado ? '★' : '☆'}</button>`
    : '';

  const botonQuitar = mostrarQuitar
    ? `<button class="btn-texto" data-accion="quitar-favorito" data-id="${noticia.id}">🗑 Quitar</button>`
    : '';

  return `
    <article class="tarjeta" data-id="${noticia.id}" data-categoria="${escaparHTML(noticia.categoria)}">
      <div class="tarjeta__media">
        <span class="tarjeta__categoria">${escaparHTML(noticia.categoria)}</span>
        ${botonGuardar}
        <img src="${noticia.imagen}" alt="Imagen de portada: ${escaparHTML(noticia.titulo)}" loading="lazy">
      </div>
      <div class="tarjeta__cuerpo">
        <div class="tarjeta__meta">
          <span>Por ${escaparHTML(noticia.autor)}</span>
          <span>⏱ ${noticia.tiempoLectura} min</span>
        </div>
        <h3 class="tarjeta__titulo">${escaparHTML(noticia.titulo)}</h3>
        <p class="tarjeta__descripcion">${escaparHTML(noticia.descripcion)}</p>
        <div class="tarjeta__pie">
          <a class="tarjeta__accion" href="detalle.html?id=${noticia.id}">Leer noticia →</a>
          ${botonQuitar}
        </div>
      </div>
    </article>
  `;
}

function activarBotonesFavorito(contenedor, alCambiar) {
  contenedor.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-accion="favorito"]');
    if (!boton) return;
    const id = boton.dataset.id;
    const activo = alternarFavorito(id);
    boton.classList.toggle('activo', activo);
    boton.textContent = activo ? '★' : '☆';
    if (typeof alCambiar === 'function') alCambiar(id, activo);
  });
}

function inicializarFechaEdicion() {
  const nodo = document.getElementById('fecha-edicion');
  if (!nodo) return;
  const hoy = new Date().toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
  nodo.textContent = hoy.charAt(0).toUpperCase() + hoy.slice(1);
}

function inicializarBoletin() {
  document.querySelectorAll('[data-form="boletin"]').forEach((formulario) => {
    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const campo = formulario.querySelector('input[type="email"]');
      const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campo.value.trim());
      if (valido) {
        campo.value = '';
        campo.placeholder = '¡Gracias por suscribirte!';
      } else {
        campo.focus();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  inicializarNavegacion();
  inicializarFechaEdicion();
  inicializarBoletin();
});
