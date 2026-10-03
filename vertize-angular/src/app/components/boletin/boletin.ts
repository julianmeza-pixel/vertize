import { Component, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * Formulario de suscripción al boletín, reutilizado en el pie de página y en el detalle.
 * Valida el formato del correo y confirma la suscripción en pantalla.
 */
@Component({
  selector: 'app-boletin',
  imports: [FormsModule],
  templateUrl: './boletin.html'
})
export class Boletin {
  readonly variante = input<'pie' | 'panel'>('pie');

  readonly correo = signal('');
  readonly suscrito = signal(false);
  readonly intentoFallido = signal(false);

  suscribir(): void {
    const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correo().trim());
    this.intentoFallido.set(!valido);
    this.suscrito.set(valido);
    if (valido) this.correo.set('');
  }
}
