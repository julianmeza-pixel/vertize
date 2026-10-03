import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Boletin } from '../boletin/boletin';

/** Pie de página común: navegación, redacción, suscripción al boletín y aviso legal. */
@Component({
  selector: 'app-footer',
  imports: [RouterLink, Boletin],
  templateUrl: './footer.html'
})
export class Footer {}
