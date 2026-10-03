# Vertize — Plataforma web de noticias sobre IA y tecnología

Prototipo funcional (Entrega 2) del proyecto **Vertize**, desarrollado para el módulo de Desarrollo de Front-end del Politécnico Gran Colombiano. Construido con HTML, CSS y JavaScript (sin frameworks), a partir de la maquetación entregada en la Entrega 1.

Repositorio: https://github.com/julianmeza-pixel/vertize

## Versiones del proyecto

| Entrega | Tecnología | Ubicación | Etiqueta Git |
|---|---|---|---|
| 2 — Prototipo funcional | HTML, CSS y JavaScript | Raíz del repositorio (este directorio) | `entrega-2` |
| 3 — Entrega final | Angular 21 | [`vertize-angular/`](vertize-angular/) (código) y [`docs/`](docs/) (sitio compilado) | `entrega-3` |

**Sitio desplegado (Entrega 3):** https://julianmeza-pixel.github.io/vertize/

## Autores

- Julian Felipe Meza Gonzalez
- Jeisson Esteban Cetina Mariño
- Daniel Felipe Tamayo Rodríguez

Tutor: John Olarte Ramos

## Descripción

Vertize es una aplicación web tipo periódico digital especializada en inteligencia artificial, computación emergente y ética tecnológica. El usuario puede explorar un catálogo de noticias, leer el detalle de cada una, guardarlas en una colección personal de favoritas (persistida en el navegador con `localStorage`), enviar un mensaje de contacto con validaciones, y crear o eliminar noticias del catálogo mediante un módulo de gestión (mini CRUD).

## Estructura del proyecto

```
├── index.html          # Página de inicio (Home)
├── noticias.html        # Listado de noticias: buscador, filtros, orden, paginación
├── detalle.html          # Detalle de una noticia (?id=)
├── favoritas.html        # Colección personal de noticias guardadas
├── contacto.html         # Formulario de contacto con validaciones
├── gestion.html           # Mini CRUD: crear y eliminar noticias
├── css/
│   └── styles.css        # Hoja de estilos propia (paleta, tipografía, grid, responsive)
├── js/
│   ├── store.js          # Acceso a datos: JSON base + localStorage (favoritos, altas, bajas)
│   ├── ui.js              # Utilidades compartidas: navegación, plantilla de tarjeta, boletín
│   ├── home.js            # Lógica de la página de inicio
│   ├── noticias.js        # Lógica del listado (búsqueda, filtros, orden, paginación)
│   ├── detalle.js         # Lógica de la vista de detalle
│   ├── favoritas.js       # Lógica de la colección de favoritas
│   ├── contacto.js        # Validaciones del formulario de contacto
│   └── gestion.js         # Lógica de creación y eliminación de noticias
└── data/
    └── noticias.json      # Catálogo base de noticias (fuente de datos)
```

## Cómo ejecutar el proyecto localmente

El listado y el detalle cargan `data/noticias.json` mediante `fetch`, por lo que el navegador debe servir los archivos por HTTP (no abrir `index.html` directamente con doble clic, ya que los navegadores bloquean `fetch` sobre `file://`).

Cualquiera de estas opciones funciona:

```bash
npx serve .
```

```bash
python -m http.server 8000
```

Luego abre `http://localhost:8000` (o el puerto que indique la herramienta) en el navegador.

## Funcionalidades implementadas

| Código | Funcionalidad | Vista | Mecanismo |
|---|---|---|---|
| F01 | Catálogo de noticias en tarjetas | Inicio y listado | Recorrido del arreglo de noticias y generación de elementos en el DOM |
| F02 | Detalle completo de una noticia | Detalle | Parámetro `id` en la URL y búsqueda en el catálogo |
| F03 | Guardar noticia en favoritas | Listado, detalle y favoritas | Escritura del identificador en `localStorage` |
| F04 | Consultar, filtrar y vaciar favoritas | Favoritas | Lectura de `localStorage` y filtrado del arreglo |
| F05 | Crear una nueva noticia | Gestión | Captura del formulario y adición al catálogo (`localStorage`) |
| F06 | Eliminar una noticia existente | Gestión | Eliminación del arreglo, con confirmación previa |
| F07 | Buscar y filtrar por palabra clave o categoría | Listado | Métodos de búsqueda y filtrado sobre el arreglo, con orden y paginación |
| F08 | Enviar mensaje de contacto con validaciones | Contacto | Validación en JavaScript (campos obligatorios, formato de correo, longitud mínima) y mensaje de confirmación |
| F09 | Navegación entre un mínimo de cinco páginas | Todas | Menú principal con indicación de la sección activa |
| F10 | Visualización en móvil, tableta y escritorio | Todas | Retícula flexible y *media queries* en CSS |

## Tecnologías utilizadas

- HTML5 semántico
- CSS3 (variables, Grid, Flexbox, *media queries*) — hoja de estilos propia, sin frameworks
- JavaScript (ES6+) sin librerías externas
- `localStorage` para persistencia de favoritas y del mini CRUD
- Fuente tipográfica Poppins (Google Fonts)

## Entrega final

La Entrega 3 migra esta base funcional a Angular (componentes, servicios, enrutamiento y formularios reactivos) y la despliega en GitHub Pages. Consulta [`vertize-angular/README.md`](vertize-angular/README.md).

## Nota sobre las imágenes

Las imágenes de portada de las noticias son ilustrativas (servicio `picsum.photos`), ya que el alcance del módulo es de Front-end y no de generación de contenido editorial real.
