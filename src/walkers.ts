import { $ } from "./dom";

// Define los colores de ropa, piel y cabello de cada personaje.
type Look = [body: string, skin: string, hair: string];

// Apariencias disponibles para los personajes animados.
const CAST: Look[] = [
  ["#4285F4", "#ffd7b5", "#3c2a1e"], ["#EA4335", "#f1c27d", "#202124"],
  ["#FBBC04", "#ffd7b5", "#8d5524"], ["#34A853", "#c68642", "#202124"],
  ["#4285F4", "#f1c27d", "#fbbc04"], ["#EA4335", "#ffd7b5", "#5f6368"],
];

// Dibuja un personaje pequeño en formato SVG usando los colores recibidos.
function sprite([body, skin, hair]: Look): string {
  // Ayuda a crear un rectángulo SVG; c es una clase CSS opcional.
  const r = (x: number, y: number, w: number, h: number, f: string, c = "") =>
    // Devuelve el texto SVG que dibuja el rectángulo.
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"${c ? ` class="${c}"` : ""}/>`;
  // Arma el dibujo con rectángulos para cabello, cara, cuerpo, brazos y piernas.
  return `<svg viewBox="0 0 12 16" xmlns="http://www.w3.org/2000/svg">
    ${r(3, 0, 6, 2, hair)}${r(3, 2, 6, 4, skin)}${r(4, 3, 1, 1, "#202124")}${r(7, 3, 1, 1, "#202124")}
    ${r(2, 6, 8, 6, body)}${r(1, 7, 1, 4, skin)}${r(10, 7, 1, 4, skin)}
    ${r(3, 12, 2, 4, "#3c4043", "la")}${r(7, 12, 2, 4, "#3c4043", "lb")}</svg>`;
}

// Crea y coloca en el pie de página todos los personajes animados.
export function initWalkers(): void {
  // Busca el pie de página donde irán los personajes.
  const ft = $("ft");
  // Repite la creación para cada apariencia de CAST.
  CAST.forEach((look, i) => {
    // Crea el contenedor de este personaje.
    const d = document.createElement("div");
    // La clase w aplica el movimiento definido en CSS.
    d.className = "w";
    // Da a cada personaje una velocidad ligeramente distinta.
    d.style.setProperty("--d", `${16 + (i % 3) * 3}s`);
    // Desfase para que no todos comiencen a caminar al mismo tiempo.
    d.style.setProperty("--dl", `${-i * 3}s`);
    // Alterna un poco la altura de cada personaje.
    d.style.bottom = `${18 + (i % 2) * 2}px`;
    // Inserta el dibujo SVG con los colores de este personaje.
    d.innerHTML = sprite(look);
    // Añade el personaje al pie de página.
    ft.appendChild(d);
  });
}
