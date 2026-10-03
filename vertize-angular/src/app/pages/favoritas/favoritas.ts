import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoticiaCard } from '../../components/noticia-card/noticia-card';
import { CATEGORIAS } from '../../models/noticia.model';
import { NoticiasService } from '../../services/noticias.service';

/** Colección personal de favoritas (F03, F04): filtro por categoría, quitar una y vaciar todas. */
@Component({
  selector: 'app-favoritas',
  imports: [RouterLink, NoticiaCard],
  templateUrl: './favoritas.html'
})
export class Favoritas {
  protected readonly servicio = inject(NoticiasService);

  readonly categoria = signal('Todas');

  /** Solo se ofrecen los filtros de las categorías que realmente tienen favoritas. */
  readonly categoriasPresentes = computed(() => {
    const presentes = new Set(this.servicio.favoritas().map((n) => n.categoria));
    return CATEGORIAS.filter((c) => presentes.has(c));
  });

  readonly visibles = computed(() => {
    const todas = this.servicio.favoritas();
    const categoria = this.categoria();
    return categoria === 'Todas' ? todas : todas.filter((n) => n.categoria === categoria);
  });

  quitar(id: number): void {
    this.servicio.alternarFavorita(id);
    if (!this.categoriasPresentes().includes(this.categoria())) this.categoria.set('Todas');
  }

  vaciar(): void {
    if (this.servicio.favoritas().length === 0) return;
    if (!window.confirm('¿Vaciar por completo tu colección de favoritas? Esta acción no se puede deshacer.')) return;
    this.servicio.vaciarFavoritas();
    this.categoria.set('Todas');
  }
}
