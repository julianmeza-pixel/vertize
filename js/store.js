/* =============================================================
   VERTIZE — store.js
   Acceso a datos: carga del JSON base, mezcla con noticias creadas
   y eliminadas por el usuario (persistidas en localStorage) y
   gestión de la colección de favoritas.
   ============================================================= */

const CLAVES = {
  FAVORITOS: 'vertize_favoritos',
  EXTRA: 'vertize_noticias_extra',
  ELIMINADAS: 'vertize_noticias_eliminadas'
};

let cacheBase = null;

async function cargarNoticiasBase() {
  if (cacheBase) return cacheBase;
  const respuesta = await fetch('data/noticias.json');
  if (!respuesta.ok) throw new Error('No fue posible cargar el catálogo de noticias.');
  cacheBase = await respuesta.json();
  return cacheBase;
}

function leerJSON(clave, porDefecto) {
  try {
    const valor = localStorage.getItem(clave);
    return valor ? JSON.parse(valor) : porDefecto;
  } catch (error) {
    return porDefecto;
  }
}

function guardarJSON(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

/** Devuelve el catálogo vigente: noticias base + creadas - eliminadas. */
async function obtenerNoticias() {
  const base = await cargarNoticiasBase();
  const extra = leerJSON(CLAVES.EXTRA, []);
  const eliminadas = leerJSON(CLAVES.ELIMINADAS, []);
  return [...base, ...extra].filter((noticia) => !eliminadas.includes(noticia.id));
}

async function obtenerNoticiaPorId(id) {
  const noticias = await obtenerNoticias();
  return noticias.find((noticia) => noticia.id === Number(id));
}

async function crearNoticia(datos) {
  const noticias = await obtenerNoticias();
  const maxId = noticias.reduce((max, n) => Math.max(max, n.id), 0);
  const extra = leerJSON(CLAVES.EXTRA, []);
  const nueva = {
    id: maxId + 1,
    categoria: datos.categoria,
    autor: datos.autor,
    fecha: new Date().toISOString().slice(0, 10),
    tiempoLectura: Number(datos.tiempoLectura) || 4,
    titulo: datos.titulo,
    descripcion: datos.descripcion,
    imagen: datos.imagen || `https://picsum.photos/seed/vertizeextra${maxId + 1}/900/560`,
    destacada: false,
    cita: '',
    datoInteres: '',
    contenido: datos.contenido ? [datos.contenido] : []
  };
  extra.push(nueva);
  guardarJSON(CLAVES.EXTRA, extra);
  return nueva;
}

async function eliminarNoticia(id) {
  id = Number(id);
  const extra = leerJSON(CLAVES.EXTRA, []);
  const siguePresenteEnExtra = extra.some((n) => n.id === id);

  if (siguePresenteEnExtra) {
    guardarJSON(CLAVES.EXTRA, extra.filter((n) => n.id !== id));
  } else {
    const eliminadas = leerJSON(CLAVES.ELIMINADAS, []);
    if (!eliminadas.includes(id)) {
      eliminadas.push(id);
      guardarJSON(CLAVES.ELIMINADAS, eliminadas);
    }
  }

  const favoritos = leerJSON(CLAVES.FAVORITOS, []);
  if (favoritos.includes(id)) {
    guardarJSON(CLAVES.FAVORITOS, favoritos.filter((f) => f !== id));
  }
}

/* ---------------------- Favoritos ---------------------- */

function obtenerIdsFavoritos() {
  return leerJSON(CLAVES.FAVORITOS, []);
}

function esFavorito(id) {
  return obtenerIdsFavoritos().includes(Number(id));
}

function alternarFavorito(id) {
  id = Number(id);
  const favoritos = obtenerIdsFavoritos();
  const indice = favoritos.indexOf(id);
  if (indice >= 0) {
    favoritos.splice(indice, 1);
  } else {
    favoritos.push(id);
  }
  guardarJSON(CLAVES.FAVORITOS, favoritos);
  return favoritos.includes(id);
}

function vaciarFavoritos() {
  guardarJSON(CLAVES.FAVORITOS, []);
}

async function obtenerNoticiasFavoritas() {
  const ids = obtenerIdsFavoritos();
  const noticias = await obtenerNoticias();
  return noticias.filter((n) => ids.includes(n.id));
}
