import { $ } from "./dom";
import type { Prediction } from "./types";

// Colores usados para distinguir las barras de las clases.
const COLORS = ["#4285F4", "#EA4335", "#FBBC04", "#34A853"];

// Crea un selector para elegir la orden de cada clase del modelo.
export function renderMaps(labels: string[], mapping: string[]): void {
  // Encuentra el espacio de la página que contiene estos selectores.
  const box = $("maps");
  // Borra los selectores anteriores para crear los actuales desde cero.
  box.innerHTML = "";
  // Repite este trabajo una vez por cada clase del modelo.
  labels.forEach((name, i) => {
    // Crea una fila que contendrá el nombre y el selector de la clase.
    const row = document.createElement("div");
    // Le da a la fila la clase CSS que controla su apariencia.
    row.className = "map";
    // Crea el texto donde se verá el nombre de la clase.
    const label = document.createElement("span");
    // Muestra el nombre de la clase.
    label.textContent = name;
    // Hace que el nombre se vea más marcado.
    label.style.fontWeight = "600";
    // Crea el menú desplegable para elegir una orden.
    const sel = document.createElement("select");
    
    // Lista las órdenes disponibles y una descripción sencilla para cada una.
    [
      ["1", "'1' · Tono agudo"], 
      ["2", "'2' · Tono grave"], 
      ["0", "'0' · Reposo"],
      ["3", "'3' · Servo Izquierda (0°)"],
      ["4", "'4' · Servo Derecha (180°)"],
      ["5", "'5' · Servo Frente (90°)"],
      ["6", "'6' · Servo Atrás (45°)"]
    // Agrega cada orden de la lista como una opción del menú.
    ].forEach(([v, t]) => {
      // Crea una opción individual del menú.
      const o = document.createElement("option");
      // Guarda el carácter que se enviará a Arduino.
      o.value = v; 
      // Muestra el nombre de la orden en el menú.
      o.textContent = t; 
      // Marca como elegida la orden que ya está asignada a esta clase.
      o.selected = v === mapping[i];
      // Coloca esta opción dentro del menú.
      sel.appendChild(o);
    });
    
    // Cuando cambia la selección, guarda la nueva orden para esta clase.
    sel.onchange = () => { mapping[i] = sel.value; };
    // Junta el nombre y el selector dentro de la fila.
    row.append(label, sel);
    // Añade la fila completa a la página.
    box.appendChild(row);
  });
}

// Muestra la predicción actual, sus porcentajes y la orden elegida.
export function updatePanel(preds: Prediction[], top: Prediction, cmd: string, threshold: number): void {
  // Pasa la confianza de decimal (0.85) a porcentaje entero (85).
  const pct = Math.round(top.probability * 100);
  // Muestra el nombre de la clase más probable.
  $("sc").textContent = top.className;
  // Muestra el porcentaje de confianza.
  $("sp").textContent = pct + "%";
  // Ajusta el largo de la barra para que coincida con el porcentaje.
  $("spb").style.width = pct + "%";
  // Pinta la barra verde si se alcanza el umbral; si no, amarilla.
  $("spb").style.background = pct >= threshold * 100 ? "var(--g)" : "var(--y)";
  // Muestra el carácter que se envía a Arduino.
  $("sm").textContent = `'${cmd}'`;
  // Prepara una barra y un porcentaje para cada clase que predijo el modelo.
  $("preds").innerHTML = preds.map((p, i) => {
    // Convierte la confianza de esta clase en un porcentaje entero.
    const v = Math.round(p.probability * 100);
    // Construye el renglón con el nombre, la barra de confianza y el porcentaje.
    return `<div class="pr"><span>${p.className}</span><div class="bar"><div style="width:${v}%;background:${COLORS[i % 4]}"></div></div><b>${v}%</b></div>`;
    // Une todos los renglones en un solo contenido para la página.
  }).join("");
}

// Actualiza el indicador y los botones según el estado del puerto serial.
export function setSerialUI(on: boolean): void {
  // Cambia el punto de estado para que se vea conectado o desconectado.
  $("sd").className = "dot" + (on ? " on" : "");
  // Actualiza el texto junto al punto.
  $("st").textContent = on ? "Conectado" : "Desconectado";
  // Desactiva el botón de conectar si ya está conectado.
  $<HTMLButtonElement>("bConn").disabled = on;
  // Activa Desconectar solo cuando existe una conexión.
  $<HTMLButtonElement>("bDisc").disabled = !on;
}

// Actualiza los botones según se esté analizando el modelo o no.
export function setRunningUI(on: boolean): void {
  // No permite cargar de nuevo si ya se está ejecutando.
  $<HTMLButtonElement>("bLoad").disabled = on;
  // Permite detener solo si el análisis está activo.
  $<HTMLButtonElement>("bStop").disabled = !on;
  // Cuando se detiene, reemplaza el video por un mensaje de espera.
  if (!on) $("cam").textContent = "La cámara aparecerá aquí";
}
