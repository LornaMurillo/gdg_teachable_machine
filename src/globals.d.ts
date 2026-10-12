// Declara que existe tmImage, que se carga desde una etiqueta script en index.html.
// Se usa any porque esta librería externa no tiene aquí una descripción detallada para TypeScript.
declare const tmImage: any;

// Indica a TypeScript que se pueden importar archivos CSS desde el código.
// El archivo de estilos lo procesa Vite cuando se construye o ejecuta el proyecto.
declare module '*.css';
