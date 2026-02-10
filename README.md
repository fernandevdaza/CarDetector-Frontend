# Car Detector Frontend

Este es el frontend para la aplicación de detección de vehículos. Está construido con React, TypeScript y Vite, utilizando TailwindCSS para los estilos y Leaflet para los mapas.

## 📋 Requisitos Previos

Asegúrate de tener instalado lo siguiente antes de comenzar:

- **Node.js** (versión 18 o superior recomendada)
- **npm** (generalmente incluido con Node.js)

## 🚀 Instalación y Puesta en Marcha

Sigue estos pasos para instalar y ejecutar el proyecto localmente:

1.  **Instalar dependencias:**

    Dento del directorio del proyecto, ejecuta:

    ```bash
    npm install
    ```

2.  **Iniciar el servidor de desarrollo:**

    Para comenzar a trabajar en el proyecto, usa el siguiente comando:

    ```bash
    npm run dev
    ```

    Esto iniciará el servidor local, generalmente en `http://localhost:5173` (la terminal te mostrará la URL exacta).
   
    IMPORTANTE!
    Cambia el BASE_URL en el archivo src/api/carDetectionApi.ts para que apunte a tu backend. Pon la ip del server y el puerto 80.
    Ejemplo: const BASE_URL = 'http://1.2.3.4:80';

    Si encuentras errores de lint, puedes corregirlos ejecutando:

    ```bash
    npm run lint
    ```

    Esto corregirá los errores de lint y los mostrará en la terminal.
## 🛠️ Scripts Disponibles

En el `package.json` encontrarás los siguientes scripts útiles:

-   `npm run dev`: Inicia el servidor de desarrollo con recarga rápida (HMR).
-   `npm run build`: Compila el proyecto para producción en la carpeta `dist`.
-   `npm run preview`: Sirve localmente la versión de producción construida para probarla.
-   `npm run lint`: Ejecuta ESLint para buscar y reportar problemas en el código.

## 📦 Tecnologías Principales

-   [React](https://react.dev/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Vite](https://vitejs.dev/)
-   [TailwindCSS](https://tailwindcss.com/)
-   [Leaflet](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/)

## 📝 Configuración Adicional

### ESLint

El proyecto incluye una configuración básica de ESLint. Si necesitas reglas más estrictas para producción, puedes consultar la documentación original de la plantilla de Vite o expandir el archivo `eslint.config.js`.
