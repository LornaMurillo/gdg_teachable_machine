import { $ } from "./dom";

type Look = [body: string, skin: string, hair: string];

const CAST: Look[] = [
  ["#4285F4", "#ffd7b5", "#3c2a1e"], ["#EA4335", "#f1c27d", "#202124"],
  ["#FBBC04", "#ffd7b5", "#8d5524"], ["#34A853", "#c68642", "#202124"],
  ["#4285F4", "#f1c27d", "#fbbc04"], ["#EA4335", "#ffd7b5", "#5f6368"],
];

function sprite([body, skin, hair]: Look): string {
  const r = (x: number, y: number, w: number, h: number, f: string, c = "") =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"${c ? ` class="${c}"` : ""}/>`;
  return `<svg viewBox="0 0 12 16" xmlns="http://www.w3.org/2000/svg">
    ${r(3, 0, 6, 2, hair)}${r(3, 2, 6, 4, skin)}${r(4, 3, 1, 1, "#202124")}${r(7, 3, 1, 1, "#202124")}
    ${r(2, 6, 8, 6, body)}${r(1, 7, 1, 4, skin)}${r(10, 7, 1, 4, skin)}
    ${r(3, 12, 2, 4, "#3c4043", "la")}${r(7, 12, 2, 4, "#3c4043", "lb")}</svg>`;
}

export function initWalkers(): void {
  const ft = $("ft");
  CAST.forEach((look, i) => {
    const d = document.createElement("div");
    d.className = "w";
    d.style.setProperty("--d", `${16 + (i % 3) * 3}s`);
    d.style.setProperty("--dl", `${-i * 3}s`);
    d.style.bottom = `${18 + (i % 2) * 2}px`;
    d.innerHTML = sprite(look);
    ft.appendChild(d);
  });
}
