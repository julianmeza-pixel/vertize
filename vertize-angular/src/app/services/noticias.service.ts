import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { CATEGORIAS, NuevaNoticia, Noticia } from '../models/noticia.model';

const CLAVES = {
  FAVORITOS: 'vertize_favoritos',
  EXTRA: 'vertize_noticias_extra',
  ELIMINADAS: 'vertize_noticias_eliminadas'
} as const;

function leer<T>(clave: string, porDefecto: T): T {
  try {
    const valor = localStorage.getItem(clave);
    return valor ? (JSON.parse(valor) as T) : porDefecto;
  } catch {
    return porDefecto;
  }
}

function guardar(clave: string, valor: unknown): void {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    /* almacenamiento no disponible (modo privado o cuota llena): la sesión sigue en memoria */
  }
}

/** Convierte una categoría en el nombre del archivo de portada (p. ej. "Hardware y Chips" -> "hardware-y-chips"). */
function slugCategoria(categoria: string): string {
  return categoria
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Fuente única de datos de la aplicación.
 * Combina el catálogo base (JSON) con las altas y bajas del usuario y gestiona las favoritas.
 * Todo el estado se expone como signals, de modo que las vistas se actualizan solas.
 */
@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private readonly http = inject(HttpClient);

  private readonly base = signal<Noticia[]>([]);
  private readonly extra = signal<Noticia[]>(leer(CLAVES.EXTRA, []));
  private readonly eliminadas = signal<number[]>(leer(CLAVES.ELIMINADAS, []));
  private readonly favoritosIds = signal<number[]>(leer(CLAVES.FAVORITOS, []));

  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);

  /** Catálogo vigente: base + creadas - eliminadas. */
  readonly noticias = computed(() =>
    [...this.base(), ...this.extra()].filter((n) => !this.eliminadas().includes(n.id))
  );

  readonly destacadas = computed(() => this.noticias().filter((n) => n.destacada).slice(0, 3));

  readonly favoritas = computed(() =>
    this.noticias().filter((n) => this.favoritosIds().includes(n.id))
  );

  constructor() {
    this.http.get<Noticia[]>('data/noticias.json').subscribe({
      next: (datos) => {
        this.base.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No fue posible cargar el catálogo de noticias.');
        this.cargando.set(false);
      }
    });
  }

  porId(id: number): Noticia | undefined {
    return this.noticias().find((n) => n.id === id);
  }

  relacionadas(noticia: Noticia, maximo = 3): Noticia[] {
    return this.noticias()
      .filter((n) => n.categoria === noticia.categoria && n.id !== noticia.id)
      .slice(0, maximo);
  }

  /* ----------------------------- CRUD (F05, F06) ----------------------------- */

  crear(datos: NuevaNoticia): Noticia {
    const maxId = this.noticias().reduce((max, n) => Math.max(max, n.id), 0);
    const nueva: Noticia = {
      id: maxId + 1,
      categoria: datos.categoria,
      autor: datos.autor,
      fecha: new Date().toISOString().slice(0, 10),
      tiempoLectura: Number(datos.tiempoLectura) || 4,
      titulo: datos.titulo,
      descripcion: datos.descripcion,
      imagen: datos.imagen || this.portadaDeCategoria(datos.categoria),
      destacada: false,
      cita: '',
      datoInteres: '',
      contenido: datos.contenido ? [datos.contenido] : []
    };
    this.extra.update((lista) => [...lista, nueva]);
    guardar(CLAVES.EXTRA, this.extra());
    return nueva;
  }

  eliminar(id: number): void {
    if (this.extra().some((n) => n.id === id)) {
      this.extra.update((lista) => lista.filter((n) => n.id !== id));
      guardar(CLAVES.EXTRA, this.extra());
    } else {
      this.eliminadas.update((lista) => [...lista, id]);
      guardar(CLAVES.ELIMINADAS, this.eliminadas());
    }
    if (this.favoritosIds().includes(id)) {
      this.favoritosIds.update((lista) => lista.filter((f) => f !== id));
      guardar(CLAVES.FAVORITOS, this.favoritosIds());
    }
  }

  portadaDeCategoria(categoria: string): string {
    const conocida = CATEGORIAS.includes(categoria);
    return `covers/${conocida ? slugCategoria(categoria) : 'inteligencia-artificial'}.svg`;
  }

  /* ------------------------------ Favoritas (F03, F04) ------------------------------ */

  esFavorita(id: number): boolean {
    return this.favoritosIds().includes(id);
  }

  alternarFavorita(id: number): void {
    this.favoritosIds.update((lista) =>
      lista.includes(id) ? lista.filter((f) => f !== id) : [...lista, id]
    );
    guardar(CLAVES.FAVORITOS, this.favoritosIds());
  }

  vaciarFavoritas(): void {
    this.favoritosIds.set([]);
    guardar(CLAVES.FAVORITOS, []);
  }
}
