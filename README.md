# NeoScout AI

Landing estática que promociona **NeoScout AI**, una plataforma ficticia de scouting y análisis futbolístico con enfoque en datos e IA. Incluye presentación del producto, catálogo de jugadores (datos simulados) y formulario de solicitud de acceso.

## Cómo correrlo en local

1. Clona o descarga el repositorio.
2. Abre la carpeta del proyecto en tu editor.
3. Sirve los archivos por **HTTP** (recomendado), porque `js/app.js` es un módulo ES (`import`) y muchos navegadores bloquean esos imports con `file://`.
   - En **VS Code / Cursor**: extensión *Live Server* o *Live Preview*, abriendo `index.html`.
   - Con **Node.js**: `npx --yes serve .` en la raíz del proyecto y entra a la URL que indique la terminal (suele ser `http://localhost:3000`).

## Ramas (equipo)

- **main**: base del repositorio.
- **miguel**: landing estática.
- **sofia**: parte desde la base para añadir JavaScript.

---

## API simulada (`js/mockApi.js`)

Convención REST de ejemplo. Todas las funciones simulan latencia de red y pueden fallar de forma aleatoria para probar errores en el front.

### `getPlayers()`

| | |
|---|---|
| **Equivale a** | `GET /api/players` |
| **Parámetros** | Ninguno. |
| **Retardo** | Entre ~800 ms y ~1600 ms. |
| **Éxito (200)** | `Promise` que resuelve con un **array** de objetos jugador: `{ id, name, position, age, rating, price, image }`. En algunos casos el array puede venir **vacío** (simula catálogo sin datos). |
| **Error** | `Promise` rechazada con `Error` y mensaje orientado al usuario. En consola se registra: `500 Internal Server Error` (`console.log`). |

### `submitContactForm(data)`

| | |
|---|---|
| **Equivale a** | `POST /api/contact` |
| **Parámetros** | Objeto `data` con: `nombre` (string), `email` (string), `telefono` (string), `club` (string). |
| **Retardo** | Entre ~1000 ms y ~1800 ms. |
| **Éxito (200)** | `Promise` que resuelve con `{ ok: true, message, requestId, echo }`. |
| **Error** | `Promise` rechazada con `Error` y mensaje orientado al usuario. En consola se registra: `500 Internal Server Error` (`console.log`). |

---

© Proyecto académico — sin backend real; las respuestas son simuladas en el navegador.
