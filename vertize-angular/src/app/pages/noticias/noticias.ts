import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NoticiaCard } from '../../components/noticia-card/noticia-card';
import { CATEGORIAS } from '../../models/noticia.model';
import { NoticiasService } from '../../services/noticias.service';

type Orden = 'recientes' | 'antiguas' | 'lectura-asc' | 'lectura-desc';

const NOTICIAS_POR_PAGINA = 6;

/**
 * Listado de noticias (F01, F07): buscador, filtros por categoría, orden y paginación.
 * El resultado es un computed() que se recalcula solo cuando cambia algún criterio.
 */
@Component({
  selector: 'app-noticias',
  imports: [FormsModule, RouterLink, NoticiaCard],
  templateUrl: './noticias.html'
})
export class Noticias {
  protected readonly servicio = inject(NoticiasService);

  readonly categorias = CATEGORIAS;
  readonly texto = signal('');
  readonly categoria = signal('Todas');
  readonly orden = signal<Orden>('recientes');
  readonly pagina = signal(1);

  readonly filtradas = computed(() => {
    let resultado = [...this.servicio.noticias()];

    if (this.categoria() !== 'Todas') {
      resultado = resultado.filter((n) => n.categoria === this.categoria());
    }

    const texto = this.texto().trim().toLowerCase();
    if (texto) {
      resultado = resultado.filter((n) =>
        [n.titulo, n.descripcion, n.autor, n.categoria].join(' ').toLowerCase().includes(texto)
      );
    }

    switch (this.orden()) {
      case 'antiguas':
        return resultado.sort((a, b) => a.fecha.localeCompare(b.fecha));
      case 'lectura-asc':
        return resultado.sort((a, b) => a.tiempoLectura - b.tiempoLectura);
      case 'lectura-desc':
        return resultado.sort((a, b) => b.tiempoLectura - a.tiempoLectura);
      default:
        return resultado.sort((a, b) => b.fecha.localeCompare(a.fecha));
    }
  });

  readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.filtradas().length / NOTICIAS_POR_PAGINA))
  );

  readonly paginaActual = computed(() => Math.min(this.pagina(), this.totalPaginas()));

  readonly visibles = computed(() => {
    const inicio = (this.paginaActual() - 1) * NOTICIAS_POR_PAGINA;
    return this.filtradas().slice(inicio, inicio + NOTICIAS_POR_PAGINA);
  });

  readonly numerosPagina = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, i) => i + 1)
  );

  cambiarTexto(valor: string): void {
    this.texto.set(valor);
    this.pagina.set(1);
  }

  cambiarCategoria(valor: string): void {
    this.categoria.set(valor);
    this.pagina.set(1);
  }

  cambiarOrden(valor: Orden): void {
    this.orden.set(valor);
    this.pagina.set(1);
  }

  irAPagina(numero: number): void {
    this.pagina.set(numero);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
