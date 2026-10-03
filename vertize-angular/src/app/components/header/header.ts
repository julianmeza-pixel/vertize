import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface EnlaceMenu {
  ruta: string;
  etiqueta: string;
  exacto: boolean;
}

/** Encabezado común a todas las vistas: fecha de edición, logotipo, menú de cinco páginas y acceso a la cuenta. */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html'
})
export class Header {
  readonly menuAbierto = signal(false);

  readonly enlaces: EnlaceMenu[] = [
    { ruta: '/', etiqueta: 'Inicio', exacto: true },
    { ruta: '/noticias', etiqueta: 'Noticias', exacto: false },
    { ruta: '/favoritas', etiqueta: 'Favoritas', exacto: true },
    { ruta: '/contacto', etiqueta: 'Contacto', exacto: true },
    { ruta: '/gestion', etiqueta: 'Gestión', exacto: true }
  ];

  readonly fechaEdicion = (() => {
    const hoy = new Date().toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return hoy.charAt(0).toUpperCase() + hoy.slice(1);
  })();

  alternarMenu(): void {
    this.menuAbierto.update((abierto) => !abierto);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }
}
