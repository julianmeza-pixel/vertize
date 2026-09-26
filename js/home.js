/* =============================================================
   VERTIZE — home.js
   Renderiza las noticias destacadas en la página de inicio (F01).
   ============================================================= */

async function iniciarHome() {
  const contenedor = document.getElementById('grid-destacadas');
  try {
    const noticias = await obtenerNoticias();
    const destacadas = noticias.filter((n) => n.destacada).slice(0, 3);
    contenedor.innerHTML = destacadas.map((n) => plantillaTarjeta(n)).join('');
    activarBotonesFavorito(contenedor);
  } catch (error) {
    contenedor.innerHTML = `<p class="estado-vacio">No fue posible cargar las noticias destacadas. ${error.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', iniciarHome);
