# ASTRODIA

Sitio web educativo de exploración astrológica, desarrollado con React y Vite.

## Funcionalidades

- Perfiles individuales de Sol, Luna y Ascendente.
- 1728 combinaciones astrológicas.
- Selección manual de signos.
- Cálculo de Sol, Luna y Ascendente a partir de fecha, hora y localidad.
- Conversión de horarios históricos de Argentina.
- Cálculo local con Swiss Ephemeris WebAssembly.
- Diseño responsive para escritorio, tablet y celular.

## Publicar el sitio en GitHub Pages

La carpeta ya incluye el workflow `.github/workflows/deploy-pages.yml`. GitHub ejecutará automáticamente `npm ci` y `npm run build` cada vez que se haga un `push` a la rama `main`.

1. Crear un repositorio público llamado `astrodia` en GitHub.
2. Subir el contenido de esta carpeta a la rama `main`.
3. Entrar en `Settings > Pages`.
4. En `Build and deployment`, elegir `GitHub Actions`.
5. Ir a la pestaña `Actions` y esperar a que finalice el workflow `Publicar ASTRODIA en GitHub Pages`.
6. Volver a `Settings > Pages`: allí aparecerá la URL pública del sitio.

GitHub ejecuta los comandos de instalación y compilación en sus propios servidores. Las personas que visiten el enlace no necesitan Node.js ni npm; solo un navegador.

No elegir `Deploy from a branch` con `main` y `/root` para este proyecto. Esa opción sirve cuando el repositorio ya contiene archivos web finales listos para el navegador. ASTRODIA contiene código React que primero debe ser compilado por Vite, por eso se publica mediante `GitHub Actions`.

## Ejecutar el proyecto localmente

Requiere Node.js y npm.

```bash
npm install
npm run dev
```

Después, abrir la dirección que indique Vite, normalmente `http://localhost:5173/`.

Para generar la versión de producción:

```bash
npm run build
```

## Estructura principal

- `src/`: componentes, estilos y lógica de la aplicación.
- `data/`: perfiles y combinaciones astrológicas.
- `public/img/`: imágenes utilizadas por el sitio.
- `public/swiss/`: archivo local de Swiss Ephemeris WebAssembly.
- `word/`: documentos originales de trabajo.

## Nota

ASTRODIA es un proyecto educativo y de entretenimiento. Las interpretaciones no constituyen afirmaciones científicas ni determinantes sobre la personalidad.
