// Importa los estilos para que Vite los aplique a la página.
import "./styles.css";
// Trae funciones para buscar elementos y mostrar mensajes.
import { $, log, setMsg } from "./dom";
// Trae funciones que cargan y detienen el modelo de IA.
import { startModel, startLoop, stopModel } from "./teachable";
// Trae funciones para conectar Arduino y enviarle órdenes.
import { connectArduino, disconnectArduino, sendCommand } from "./serial";
// Trae funciones que actualizan los controles y los resultados en pantalla.
import { renderMaps, updatePanel, setSerialUI, setRunningUI } from "./ui";
// Trae la función que dibuja los personajes animados del pie de página.
import { initWalkers } from "./walkers";
// Trae la forma de los resultados que devuelve el modelo.
import type { Prediction } from "./types";

// Guarda qué orden corresponde a cada clase del modelo.
let mapping: string[] = [];
// Guarda la confianza mínima necesaria para aceptar una predicción: 0.85 equivale a 85%.
let threshold = 0.85;
// Guarda el último comando
let lastCmd = "";

// Se ejecuta cuando se pide cargar el modelo y la cámara.
async function onLoad(): Promise<void> {
  // Lee la dirección escrita y quita espacios sobrantes.
  const url = $<HTMLInputElement>("url").value.trim();
  // Si no hay dirección, muestra una indicación y termina esta función.
  if (!url) { setMsg("Pega primero la URL del modelo."); return; }
  // Intenta cargar el modelo; si algo falla, el bloque catch lo informa.
  try {
    setMsg("Cargando modelo y cámara…");
    // Desactiva el botón para evitar iniciar la carga varias veces.
    $<HTMLButtonElement>("bLoad").disabled = true;
    // Carga el modelo y la cámara; espera hasta que estén listos.
    const labels = await startModel(url, $("cam"));
    // Asigna órdenes iniciales: primera clase 1, segunda 2 y las demás 0.
    mapping = labels.map((_, i) => (i === 0 ? "1" : i === 1 ? "2" : "0"));
    // Crea en pantalla un selector de orden para cada clase.
    renderMaps(labels, mapping);
    // Actualiza los botones para indicar que el modelo está funcionando.
    setRunningUI(true);
    setMsg(`Modelo listo (${labels.length} clases).`);
    // Anota en el registro los nombres de las clases cargadas.
    log(`Modelo cargado: ${labels.join(", ")}`);
    // Empieza a analizar imágenes; onFrame procesa cada resultado.
    startLoop(onFrame);
  } catch (e) {
    // Muestra el error en la consola del navegador para ayudar a encontrar la causa.
    console.error(e);
    // Avisa que se revise la dirección del modelo y el permiso de cámara.
    setMsg("Error: revisa la URL y los permisos de la cámara.");
    // Devuelve los botones a su estado de modelo detenido.
    setRunningUI(false);
  }
}

// Procesa los resultados que el modelo obtiene de una imagen de la cámara.
async function onFrame(preds: Prediction[]): Promise<void> {
  // Encuentra la clase con el porcentaje de confianza más alto.
  const top = preds.reduce((a, b) => (b.probability > a.probability ? b : a));
  // Usa la orden asignada si supera el mínimo; si no, manda 0 (reposo).
  const cmd = top.probability >= threshold ? mapping[preds.indexOf(top)] ?? "0" : "0";
  // Actualiza la clase, los porcentajes y la orden que muestra la página.
  updatePanel(preds, top, cmd, threshold);

  // Solo envía el comando si es DIFERENTE al último enviado
  if (cmd !== lastCmd) {
    lastCmd = cmd;
    await sendCommand(cmd);
  }

  // Envía la orden a Arduino; await espera a que termine el intento de envío.
  await sendCommand(cmd);
}

// Al pulsar Cargar, llama a la función que prepara modelo y cámara.
$("bLoad").onclick = onLoad;
// Al pulsar Detener, para el análisis y actualiza el mensaje y los botones.
$("bStop").onclick = () => { stopModel(); setRunningUI(false); setMsg("Detenido."); };
// Al pulsar Conectar, abre el selector de puertos y refleja el resultado.
$("bConn").onclick = async () => setSerialUI(await connectArduino());
// Al pulsar Desconectar, cierra el puerto y muestra que ya no está conectado.
$("bDisc").onclick = async () => { await disconnectArduino(); setSerialUI(false); };
// Reacciona cuando se mueve el control del umbral de confianza.
$<HTMLInputElement>("th").oninput = (e) => {
  // Convierte el valor del control (por ejemplo, 85) en un número.
  const v = Number((e.target as HTMLInputElement).value);
  // Convierte el porcentaje a decimal para compararlo con la predicción.
  threshold = v / 100;
  // Muestra el nuevo porcentaje junto al control.
  $("thv").textContent = v + "%";
};

// Añade los personajes animados de la parte inferior de la página.
initWalkers();
