/* =============================================================
   VERTIZE — gestion.js
   Mini CRUD de noticias (F05, F06): publicación de nuevas notas y
   eliminación de noticias existentes, con persistencia en
   localStorage y confirmación previa al borrado.
   ============================================================= */

const CAMPOS_GESTION = ['titulo', 'categoria', 'autor', 'tiempo', 'descripcion', 'contenido'];

const validadoresGestion = {
  titulo: (input) => input.value.trim().length >= 8,
  categoria: (input) => input.value !== '',
  autor: (input) => input.value.trim().length >= 3,
  tiempo: (input) => Number(input.value) >= 1 && Number(input.value) <= 30,
  descripcion: (input) => input.value.trim().length >= 20,
  contenido: (input) => input.value.trim().length >= 40
};

function poblarCategorias() {
  const select = document.getElementById('categoria');
  CATEGORIAS.forEach((categoria) => {
    const opcion = document.createElement('option');
    opcion.value = categoria;
    opcion.textContent = categoria;
    select.appendChild(opcion);
  });
}

function validarCampoGestion(nombreCampo) {
  const input = document.getElementById(nombreCampo);
  const wrapper = document.getElementById(`campo-${nombreCampo}`);
  const valido = validadoresGestion[nombreCampo](input);
  wrapper.classList.toggle('error', !valido);
  return valido;
}

function plantillaTarjetaMini(noticia) {
  return `
    <article class="tarjeta-mini" data-id="${noticia.id}">
      <img src="${noticia.imagen}" alt="">
      <div class="tarjeta-mini__cuerpo">
        <span class="tarjeta-mini__meta">${escaparHTML(noticia.categoria)}</span>
        <h5>${escaparHTML(noticia.titulo)}</h5>
        <span class="tarjeta-mini__meta">Por ${escaparHTML(noticia.autor)}</span>
      </div>
      <button class="btn-eliminar" data-id="${noticia.id}">🗑 Eliminar</button>
    </article>
  `;
}

async function renderizarCatalogoVigente() {
  const contenedor = document.getElementById('catalogo-vigente');
  const noticias = (await obtenerNoticias()).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  contenedor.innerHTML = noticias.length
    ? noticias.map(plantillaTarjetaMini).join('')
    : '<p class="estado-vacio">El catálogo está vacío.</p>';
}

async function iniciarGestion() {
  poblarCategorias();
  await renderizarCatalogoVigente();

  const formulario = document.getElementById('form-gestion');
  const mensajeConfirmacion = document.getElementById('mensaje-confirmacion-gestion');
  const catalogo = document.getElementById('catalogo-vigente');

  CAMPOS_GESTION.forEach((nombreCampo) => {
    const input = document.getElementById(nombreCampo);
    const wrapper = document.getElementById(`campo-${nombreCampo}`);
    const evento = input.tagName === 'SELECT' ? 'change' : 'input';
    input.addEventListener('blur', () => {
      wrapper.dataset.tocado = 'true';
      validarCampoGestion(nombreCampo);
    });
    input.addEventListener(evento, () => {
      if (wrapper.dataset.tocado === 'true') validarCampoGestion(nombreCampo);
    });
  });

  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    mensajeConfirmacion.classList.remove('visible');

    let primerInvalido = null;
    CAMPOS_GESTION.forEach((nombreCampo) => {
      document.getElementById(`campo-${nombreCampo}`).dataset.tocado = 'true';
      const valido = validarCampoGestion(nombreCampo);
      if (!valido && !primerInvalido) primerInvalido = nombreCampo;
    });

    if (primerInvalido) {
      document.getElementById(primerInvalido).focus();
      return;
    }

    await crearNoticia({
      titulo: document.getElementById('titulo').value.trim(),
      categoria: document.getElementById('categoria').value,
      autor: document.getElementById('autor').value.trim(),
      tiempoLectura: document.getElementById('tiempo').value,
      imagen: document.getElementById('imagen').value.trim(),
      descripcion: document.getElementById('descripcion').value.trim(),
      contenido: document.getElementById('contenido').value.trim()
    });

    formulario.reset();
    CAMPOS_GESTION.forEach((nombreCampo) => {
      const wrapper = document.getElementById(`campo-${nombreCampo}`);
      wrapper.classList.remove('error');
      wrapper.dataset.tocado = 'false';
    });
    mensajeConfirmacion.classList.add('visible');
    await renderizarCatalogoVigente();
    mensajeConfirmacion.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  catalogo.addEventListener('click', async (evento) => {
    const boton = evento.target.closest('.btn-eliminar');
    if (!boton) return;
    const confirmado = window.confirm('¿Eliminar esta noticia del catálogo? Esta acción no se puede deshacer.');
    if (!confirmado) return;
    await eliminarNoticia(boton.dataset.id);
    await renderizarCatalogoVigente();
  });
}

document.addEventListener('DOMContentLoaded', iniciarGestion);
