/* =============================================================
   VERTIZE — contacto.js
   Formulario de contacto (F08): validación de campos obligatorios,
   formato de correo, longitud mínima del mensaje y aceptación de
   la política de privacidad. El botón de envío permanece inactivo
   mientras exista algún error.
   ============================================================= */

const CAMPOS_CONTACTO = ['nombre', 'correo', 'motivo', 'asunto', 'mensaje', 'politica'];
const LONGITUD_MINIMA_MENSAJE = 20;

const validadoresContacto = {
  nombre: (input) => input.value.trim().length >= 3,
  correo: (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()),
  motivo: (input) => input.value !== '',
  asunto: (input) => input.value.trim().length >= 5,
  mensaje: (input) => input.value.trim().length >= LONGITUD_MINIMA_MENSAJE,
  politica: (input) => input.checked
};

function elementoCampo(nombreCampo) {
  return document.getElementById(nombreCampo);
}

function wrapperCampo(nombreCampo) {
  return document.getElementById(`campo-${nombreCampo}`);
}

function validarCampoContacto(nombreCampo) {
  const input = elementoCampo(nombreCampo);
  const wrapper = wrapperCampo(nombreCampo);
  const valido = validadoresContacto[nombreCampo](input);
  wrapper.classList.toggle('error', !valido);
  return valido;
}

function todosLosCamposValidos() {
  return CAMPOS_CONTACTO.every((nombre) => validadoresContacto[nombre](elementoCampo(nombre)));
}

function actualizarBotonEnvio() {
  document.getElementById('btn-enviar').disabled = !todosLosCamposValidos();
}

function actualizarContadorMensaje() {
  const longitud = elementoCampo('mensaje').value.trim().length;
  const contador = document.getElementById('contador-mensaje');
  contador.textContent = `${longitud} / ${LONGITUD_MINIMA_MENSAJE} mín.`;
  contador.style.color = longitud >= LONGITUD_MINIMA_MENSAJE ? 'var(--verde-700)' : 'var(--rojo-600)';
}

function iniciarContacto() {
  const formulario = document.getElementById('form-contacto');
  const mensajeConfirmacion = document.getElementById('mensaje-confirmacion');

  CAMPOS_CONTACTO.forEach((nombreCampo) => {
    const input = elementoCampo(nombreCampo);
    const wrapper = wrapperCampo(nombreCampo);

    const revalidar = () => {
      if (wrapper.dataset.tocado === 'true') validarCampoContacto(nombreCampo);
      actualizarBotonEnvio();
      if (nombreCampo === 'mensaje') actualizarContadorMensaje();
    };

    input.addEventListener('blur', () => {
      wrapper.dataset.tocado = 'true';
      validarCampoContacto(nombreCampo);
      actualizarBotonEnvio();
    });

    input.addEventListener(input.type === 'checkbox' ? 'change' : 'input', revalidar);
    if (input.tagName === 'SELECT') input.addEventListener('change', revalidar);
  });

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    mensajeConfirmacion.classList.remove('visible');

    let primerCampoInvalido = null;
    CAMPOS_CONTACTO.forEach((nombreCampo) => {
      wrapperCampo(nombreCampo).dataset.tocado = 'true';
      const valido = validarCampoContacto(nombreCampo);
      if (!valido && !primerCampoInvalido) primerCampoInvalido = nombreCampo;
    });

    if (primerCampoInvalido) {
      elementoCampo(primerCampoInvalido).focus();
      return;
    }

    mensajeConfirmacion.classList.add('visible');
    formulario.reset();
    CAMPOS_CONTACTO.forEach((nombreCampo) => {
      wrapperCampo(nombreCampo).classList.remove('error');
      wrapperCampo(nombreCampo).dataset.tocado = 'false';
    });
    actualizarContadorMensaje();
    actualizarBotonEnvio();
    mensajeConfirmacion.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  actualizarContadorMensaje();
  actualizarBotonEnvio();
}

document.addEventListener('DOMContentLoaded', iniciarContacto);
