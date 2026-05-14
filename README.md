# NeoScout AI

NeoScout AI es una landing page estática de presentación para una plataforma de scouting futbolístico con estilo futurista. El proyecto está construido en HTML, CSS y JavaScript, sin backend real, y simula datos de jugadores y envío de formulario mediante un módulo `mockApi.js`.

## Contenido del proyecto

- `index.html` — Página principal de la landing.
- `css/main.css` — Estilos del sitio, diseño responsivo y animaciones.
- `js/app.js` — Lógica de interacción: menú móvil, scroll reveal, carga de catálogo y validación del formulario.
- `js/mockApi.js` — API simulada que devuelve jugadores y procesa envíos de contacto.
- `assets/` — Imágenes e íconos usados en el diseño.

## Estructura de carpetas

- `assets/` — Recursos gráficos y iconos.
- `css/` — Estilos principales.
- `js/` — Código JavaScript de la aplicación.
- `index.html` — Documento HTML principal.

## Requisitos

- Navegador moderno (Chrome, Edge, Firefox, Safari).
- No se requiere backend ni instalación de dependencias.
- Para que el módulo ES funcione correctamente, es necesario servir el proyecto desde un servidor local.

## Cómo clonar el proyecto

```bash
git clone https://github.com/tu-usuario/NeoScout-AI.git
cd NeoScout-AI
```

## Cómo ejecutar el proyecto

### Opción recomendada: usar Live Server en VS Code

1. Abre la carpeta `NeoScout-AI` en Visual Studio Code.
2. Instala y habilita la extensión **Live Server** si aún no la tienes.
3. Haz clic en `Go Live` o ejecuta el comando `Live Server: Open with Live Server`.
4. Abre la URL local que aparece, por ejemplo: `http://127.0.0.1:5500/`.

### Opción alterna: usar un servidor estático local

Si no usas VS Code, puedes usar cualquier servidor estático. Ejemplo con Python (si está instalado):

```bash
cd NeoScout-AI
python -m http.server 8000
```

Luego abre `http://127.0.0.1:8000/` en tu navegador.

## Cómo probarlo

- Navega por la landing y revisa el menú, las secciones y las animaciones.
- En la sección de catálogo, el contenido se carga desde `js/mockApi.js`.
- En el formulario de contacto, completa los campos y envía para ver la respuesta simulada.
- También puedes prellenar el formulario usando parámetros en la URL, por ejemplo:

```text
http://127.0.0.1:5500/index.html?nombre=SOFIA+GIRALDO+GONZALEZ&email=sgiraldo_34%40cue.edu.co&telefono=3014019508&club=real+madrid
```

## Notas

- La app usa un módulo JavaScript (`type="module"`) y requiere ser servida desde HTTP para no romper la carga de los scripts.
- El proyecto es principalmente una landing estática con funcionalidades de demostración.
