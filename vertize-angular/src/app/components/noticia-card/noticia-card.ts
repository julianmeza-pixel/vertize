import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Noticia } from '../../models/noticia.model';
import { NoticiasService } from '../../services/noticias.service';

/**
 * Tarjeta de noticia reutilizada en inicio, listado y favoritas.
 * Recibe datos por input() y notifica acciones por output().
 */
@Component({
  selector: 'app-noticia-card',
  imports: [RouterLink],
  templateUrl: './noticia-card.html'
})
export class NoticiaCard {
  private readonly servicio = inject(NoticiasService);

  readonly noticia = input.required<Noticia>();
  readonly mostrarGuardar = input(true);
  readonly mostrarQuitar = input(false);
  readonly quitar = output<number>();

  esFavorita(): boolean {
    return this.servicio.esFavorita(this.noticia().id);
  }

  alternarFavorita(): void {
    this.servicio.alternarFavorita(this.noticia().id);
  }
}
