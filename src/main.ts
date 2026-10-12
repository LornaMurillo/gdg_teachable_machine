import "./styles.css";
import { $, log, setMsg } from "./dom";
import { startModel, startLoop, stopModel } from "./teachable";
import { connectArduino, disconnectArduino, sendCommand } from "./serial";
import { renderMaps, updatePanel, setSerialUI, setRunningUI } from "./ui";
import { initWalkers } from "./walkers";
import type { Prediction } from "./types";

let mapping: string[] = [];
let threshold = 0.85;

async function onLoad(): Promise<void> {
  const url = $<HTMLInputElement>("url").value.trim();
  if (!url) { setMsg("⚠️ Pega primero la URL del modelo."); return; }
  try {
    setMsg("Cargando modelo y cámara…");
    $<HTMLButtonElement>("bLoad").disabled = true;
    const labels = await startModel(url, $("cam"));
    mapping = labels.map((_, i) => (i === 0 ? "1" : i === 1 ? "2" : "0"));
    renderMaps(labels, mapping);
    setRunningUI(true);
    setMsg(`✅ Modelo listo (${labels.length} clases).`);
    log(`Modelo cargado: ${labels.join(", ")}`);
    startLoop(onFrame);
  } catch (e) {
    console.error(e);
    setMsg("❌ Error: revisa la URL y los permisos de la cámara.");
    setRunningUI(false);
  }
}

async function onFrame(preds: Prediction[]): Promise<void> {
  const top = preds.reduce((a, b) => (b.probability > a.probability ? b : a));
  const cmd = top.probability >= threshold ? mapping[preds.indexOf(top)] ?? "0" : "0";
  updatePanel(preds, top, cmd, threshold);
  await sendCommand(cmd);
}

$("bLoad").onclick = onLoad;
$("bStop").onclick = () => { stopModel(); setRunningUI(false); setMsg("Detenido."); };
$("bConn").onclick = async () => setSerialUI(await connectArduino());
$("bDisc").onclick = async () => { await disconnectArduino(); setSerialUI(false); };
$<HTMLInputElement>("th").oninput = (e) => {
  const v = Number((e.target as HTMLInputElement).value);
  threshold = v / 100;
  $("thv").textContent = v + "%";
};

initWalkers();
