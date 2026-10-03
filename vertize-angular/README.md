# Vertize — Aplicación Angular (Entrega final)

Versión final de **Vertize**, plataforma web de noticias sobre inteligencia artificial y tecnología, construida con **Angular 21** (componentes standalone, signals, enrutamiento y formularios reactivos). Reutiliza la identidad visual y las funcionalidades F01–F10 definidas en la maquetación de la Entrega 1 e implementadas con HTML/CSS/JS en la Entrega 2.

Sitio desplegado: https://julianmeza-pixel.github.io/vertize/

## Cómo ejecutar el proyecto

Requiere Node.js 20.19+ / 22.12+ y npm.

```bash
cd vertize-angular
npm install
npm start
```

La aplicación queda disponible en `http://localhost:4200`.

Otros comandos:

| Comando | Descripción |
|---|---|
| `npm run build` | Compila para producción y deja el sitio estático en `../docs` (base `/vertize/`) |
| `npm run start` | Servidor de desarrollo con recarga automática |

## Estructura

```
src/app/
├── app.ts / app.html        # Componente raíz: header + router-outlet + footer
├── app.routes.ts            # Rutas con carga diferida (lazy loading)
├── app.config.ts            # Proveedores: HttpClient, enrutador (hash), locale es
├── models/
│   └── noticia.model.ts     # Interfaces Noticia / NuevaNoticia y lista de categorías
├── services/
│   └── noticias.service.ts  # Datos: JSON + localStorage (favoritas, altas, bajas) con signals
├── components/              # Componentes reutilizables
│   ├── header/              # Encabezado y menú (responsive)
│   ├── footer/              # Pie de página
│   ├── noticia-card/        # Tarjeta de noticia (input/output)
│   └── boletin/             # Formulario de suscripción al boletín
└── pages/                   # Una vista por ruta
    ├── home/                # Inicio
    ├── noticias/            # Listado: búsqueda, filtros, orden, paginación
    ├── detalle/             # Detalle de una noticia (/noticias/:id)
    ├── favoritas/           # Colección personal
    ├── contacto/            # Formulario con validaciones (Reactive Forms)
    └── gestion/             # Mini CRUD (crear / eliminar noticias)
public/
├── data/noticias.json       # Catálogo base
└── covers/*.svg             # Portadas por categoría
tools/gen-covers.mjs         # Script que generó las portadas SVG
```

## Conceptos de Angular aplicados

- **Componentes standalone** y composición (`app-noticia-card` se reutiliza en inicio, listado y favoritas).
- **Data binding**: interpolación `{{ }}`, de propiedad `[src]`, de eventos `(click)`, de clases `[class.activo]` y bidireccional con `[ngModel]`/`(ngModelChange)` y `formControlName`.
- **Control de flujo nativo**: `@if`, `@for` (con `track`), `@empty`.
- **Signals y `computed()`** para el estado (filtros del listado, favoritas, catálogo vigente).
- **Servicio inyectable** (`NoticiasService`) como única fuente de datos, con `HttpClient` para cargar el JSON.
- **Enrutamiento** con parámetros (`/noticias/:id`), `routerLink`, `routerLinkActive` y *input binding* de parámetros de ruta.
- **Formularios reactivos** con validadores (`required`, `minLength`, `pattern`, `requiredTrue`).
- **Pipes** (`date`) con el locale `es`.

## Persistencia

- Catálogo base: `public/data/noticias.json` (se consulta con `HttpClient`).
- Favoritas, noticias creadas y noticias eliminadas: `localStorage` (claves `vertize_favoritos`, `vertize_noticias_extra`, `vertize_noticias_eliminadas`).

## Despliegue

El sitio se publica en **GitHub Pages** desde la carpeta `docs/` de la rama `main`. Se usa enrutamiento por hash (`#/ruta`) para que la recarga de cualquier página funcione en hospedaje estático sin reglas de reescritura.

Para volver a publicar tras cambios:

```bash
npm run build
git add -A
git commit -m "Actualizar despliegue"
git push
```
