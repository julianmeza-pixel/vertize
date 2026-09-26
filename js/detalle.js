/* =============================================================
   VERTIZE — detalle.js
   Vista de detalle de una noticia (F02): título, imagen principal,
   cuerpo del artículo, cita destacada, dato de interés y noticias
   relacionadas en la columna lateral.
   ============================================================= */

function obtenerIdDesdeURL() {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get('id');
}

function plantillaRelacionada(noticia) {
  return `
    <a class="relacionada" href="detalle.html?id=${noticia.id}">
      <img src="${noticia.imagen}" alt="">
      <div>
        <h5>${escaparHTML(noticia.titulo)}</h5>
        <span>${escaparHTML(noticia.categoria)} · ${noticia.tiempoLectura} min</span>
      </div>
    </a>
  `;
}

function plantillaDetalle(noticia, relacionadas) {
  const guardado = esFavorito(noticia.id);
  const parrafos = (noticia.contenido || [])
    .map((parrafo, indice) => {
      let bloqueExtra = '';
      if (indice === 0 && noticia.cita) {
        bloqueExtra = `<blockquote class="cita-destacada">"${escaparHTML(noticia.cita)}"</blockquote>`;
      }
      if (indice === 1 && noticia.datoInteres) {
        bloqueExtra += `<div class="dato-interes"><strong>Dato de interés</strong>${escaparHTML(noticia.datoInteres)}</div>`;
      }
      return `<p>${escaparHTML(parrafo)}</p>${bloqueExtra}`;
    })
    .join('');

  return `
    <div class="detalle-encabezado">
      <span class="titulo-eyebrow">${escaparHTML(noticia.categoria)}</span>
      <h1>${escaparHTML(noticia.titulo)}</h1>
      <div class="detalle-meta">
        <span>Por ${escaparHTML(noticia.autor)}</span>
        <span>·</span>
        <span>${formatearFecha(noticia.fecha)}</span>
        <span>·</span>
        <span>⏱ ${noticia.tiempoLectura} min de lectura</span>
      </div>
      <div class="detalle-acciones">
        <button class="btn-icono ${guardado ? 'activo' : ''}" id="btn-favorito-detalle" title="Guardar en favoritas">${guardado ? '★' : '☆'}</button>
        <button class="btn-icono" id="btn-compartir" title="Compartir">↗</button>
        <button class="btn-icono" id="btn-copiar" title="Copiar enlace">🔗</button>
      </div>
    </div>

    <div class="detalle-layout">
      <div>
        <div class="detalle-imagen">
          <img src="${noticia.imagen}" alt="Imagen principal: ${escaparHTML(noticia.titulo)}">
        </div>
        <div class="detalle-cuerpo">${parrafos || '<p>Esta noticia todavía no tiene contenido detallado.</p>'}</div>
      </div>

      <aside>
        <div class="panel-lateral">
          <h4>Noticias relacionadas</h4>
          ${relacionadas.length ? relacionadas.map(plantillaRelacionada).join('') : '<p class="texto-atenuado">No hay más noticias en esta categoría todavía.</p>'}
        </div>
        <div class="panel-suscripcion">
          <strong>Suscríbete al newsletter de VERTIZE</strong>
          <p class="texto-atenuado" style="font-size:0.82rem;">Recibe cada semana los análisis más leídos, sin costo.</p>
          <form data-form="boletin">
            <input type="email" placeholder="tucorreo@ejemplo.com" required>
            <button type="submit" class="btn btn-primario" style="justify-content:center;">Suscribirme</button>
          </form>
        </div>
      </aside>
    </div>
  `;
}

async function iniciarDetalle() {
  const contenedor = document.getElementById('contenido-detalle');
  const id = obtenerIdDesdeURL();

  if (!id) {
    contenedor.innerHTML = '<p class="estado-vacio">No se especificó ninguna noticia. <a href="noticias.html">Volver al listado</a>.</p>';
    return;
  }

  let noticia;
  let todas;
  try {
    todas = await obtenerNoticias();
    noticia = todas.find((n) => n.id === Number(id));
  } catch (error) {
    contenedor.innerHTML = `<p class="estado-vacio">No fue posible cargar la noticia. ${error.message}</p>`;
    return;
  }

  if (!noticia) {
    contenedor.innerHTML = '<p class="estado-vacio">La noticia solicitada no existe o fue eliminada. <a href="noticias.html">Volver al listado</a>.</p>';
    return;
  }

  document.title = `${noticia.titulo} — Vertize`;

  const relacionadas = todas
    .filter((n) => n.categoria === noticia.categoria && n.id !== noticia.id)
    .slice(0, 3);

  contenedor.innerHTML = plantillaDetalle(noticia, relacionadas);
  inicializarBoletin();

  const botonFavorito = document.getElementById('btn-favorito-detalle');
  botonFavorito.addEventListener('click', () => {
    const activo = alternarFavorito(noticia.id);
    botonFavorito.classList.toggle('activo', activo);
    botonFavorito.textContent = activo ? '★' : '☆';
  });

  document.getElementById('btn-copiar').addEventListener('click', async (evento) => {
    const boton = evento.currentTarget;
    try {
      await navigator.clipboard.writeText(window.location.href);
      const original = boton.textContent;
      boton.textContent = '✓';
      setTimeout(() => (boton.textContent = original), 1500);
    } catch (error) {
      window.prompt('Copia el enlace de esta noticia:', window.location.href);
    }
  });

  document.getElementById('btn-compartir').addEventListener('click', async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: noticia.titulo, url: window.location.href });
      } catch (error) {
        /* el usuario canceló el diálogo de compartir */
      }
    } else {
      window.prompt('Copia el enlace para compartir esta noticia:', window.location.href);
    }
  });
}

document.addEventListener('DOMContentLoaded', iniciarDetalle);
