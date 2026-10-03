import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoticiaCard } from '../../components/noticia-card/noticia-card';
import { NoticiasService } from '../../services/noticias.service';

/** Página de inicio: bienvenida, noticias destacadas, llamado a la acción y pilares editoriales (F01). */
@Component({
  selector: 'app-home',
  imports: [RouterLink, NoticiaCard],
  templateUrl: './home.html'
})
export class Home {
  protected readonly servicio = inject(NoticiasService);

  readonly pilares = [
    { icono: '✅', titulo: 'Validación editorial', texto: 'Cada artículo se contrasta con al menos dos fuentes técnicas primarias antes de su publicación.' },
    { icono: '🔬', titulo: 'Revisión técnica especializada', texto: 'Antes y durante su redacción, los artículos son revisados por especialistas de la disciplina abordada.' },
    { icono: '📊', titulo: 'Comunidad abierta y trazabilidad', texto: 'Publicamos las fuentes, el código y los detalles técnicos referenciados en cada nota.' }
  ];
}
