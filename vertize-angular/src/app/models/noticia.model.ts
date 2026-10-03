/** Modelo de datos de una noticia del catálogo (coincide con data/noticias.json). */
export interface Noticia {
  id: number;
  categoria: string;
  autor: string;
  fecha: string; // formato ISO: AAAA-MM-DD
  tiempoLectura: number; // minutos
  titulo: string;
  descripcion: string;
  imagen: string;
  destacada: boolean;
  cita: string;
  datoInteres: string;
  contenido: string[];
}

/** Datos que captura el formulario de gestión para crear una noticia. */
export type NuevaNoticia = Pick<
  Noticia,
  'titulo' | 'categoria' | 'autor' | 'tiempoLectura' | 'descripcion'
> & { imagen: string; contenido: string };

export const CATEGORIAS: readonly string[] = [
  'Inteligencia Artificial',
  'Modelos de Lenguaje',
  'Hardware y Chips',
  'Ingeniería de Software',
  'Ética y Sociedad',
  'Robótica'
];
