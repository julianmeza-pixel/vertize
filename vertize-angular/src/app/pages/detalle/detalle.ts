import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Boletin } from '../../components/boletin/boletin';
import { NoticiasService } from '../../services/noticias.service';

/**
 * Detalle de una noticia (F02). El parámetro de ruta :id llega como input()
 * gracias a withComponentInputBinding().
 */
@Component({
  selector: 'app-detalle',
  imports: [RouterLink, DatePipe, Boletin],
  templateUrl: './detalle.html'
})
export class Detalle {
  private readonly servicio = inject(NoticiasService);
  private readonly titulo = inject(Title);

  readonly id = input.required<string>();
  protected readonly cargando = this.servicio.cargando;

  readonly noticia = computed(() => this.servicio.porId(Number(this.id())));
  readonly relacionadas = computed(() => {
    const actual = this.noticia();
    return actual ? this.servicio.relacionadas(actual) : [];
  });
  readonly esFavorita = computed(() => {
    const actual = this.noticia();
    return actual ? this.servicio.esFavorita(actual.id) : false;
  });
  readonly enlaceCopiado = signal(false);

  constructor() {
    effect(() => {
      const actual = this.noticia();
      if (actual) this.titulo.setTitle(`${actual.titulo} — Vertize`);
    });
  }

  alternarFavorita(): void {
    const actual = this.noticia();
    if (actual) this.servicio.alternarFavorita(actual.id);
  }

  async copiarEnlace(): Promise<void> {
    try {
      await navigator.clipboard.writeText(window.location.href);
      this.enlaceCopiado.set(true);
      setTimeout(() => this.enlaceCopiado.set(false), 1500);
    } catch {
      window.prompt('Copia el enlace de esta noticia:', window.location.href);
    }
  }

  async compartir(): Promise<void> {
    const actual = this.noticia();
    if (!actual) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: actual.titulo, url: window.location.href });
      } catch {
        /* el usuario canceló el diálogo de compartir */
      }
    } else {
      window.prompt('Copia el enlace para compartir esta noticia:', window.location.href);
    }
  }
}
