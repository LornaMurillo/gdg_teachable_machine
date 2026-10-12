import { $ } from "./dom";
import type { Prediction } from "./types";

const COLORS = ["#4285F4", "#EA4335", "#FBBC04", "#34A853"];

export function renderMaps(labels: string[], mapping: string[]): void {
  const box = $("maps");
  box.innerHTML = "";
  labels.forEach((name, i) => {
    const row = document.createElement("div");
    row.className = "map";
    const label = document.createElement("span");
    label.textContent = name;
    label.style.fontWeight = "600";
    const sel = document.createElement("select");
    [["1", "'1' · Tono agudo"], ["2", "'2' · Tono grave"], ["0", "'0' · Reposo"]].forEach(([v, t]) => {
      const o = document.createElement("option");
      o.value = v; o.textContent = t; o.selected = v === mapping[i];
      sel.appendChild(o);
    });
    sel.onchange = () => { mapping[i] = sel.value; };
    row.append(label, sel);
    box.appendChild(row);
  });
}

export function updatePanel(preds: Prediction[], top: Prediction, cmd: string, threshold: number): void {
  const pct = Math.round(top.probability * 100);
  $("sc").textContent = top.className;
  $("sp").textContent = pct + "%";
  $("spb").style.width = pct + "%";
  $("spb").style.background = pct >= threshold * 100 ? "var(--g)" : "var(--y)";
  $("sm").textContent = `'${cmd}'`;
  $("preds").innerHTML = preds.map((p, i) => {
    const v = Math.round(p.probability * 100);
    return `<div class="pr"><span>${p.className}</span><div class="bar"><div style="width:${v}%;background:${COLORS[i % 4]}"></div></div><b>${v}%</b></div>`;
  }).join("");
}

export function setSerialUI(on: boolean): void {
  $("sd").className = "dot" + (on ? " on" : "");
  $("st").textContent = on ? "Conectado" : "Desconectado";
  $<HTMLButtonElement>("bConn").disabled = on;
  $<HTMLButtonElement>("bDisc").disabled = !on;
}

export function setRunningUI(on: boolean): void {
  $<HTMLButtonElement>("bLoad").disabled = on;
  $<HTMLButtonElement>("bStop").disabled = !on;
  if (!on) $("cam").textContent = "La cámara aparecerá aquí";
}
