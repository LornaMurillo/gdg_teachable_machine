import type { Prediction } from "./types";

// Aquí se guarda el modelo de Teachable Machine mientras está cargado.
let model: any = null;
// Aquí se guarda el objeto que controla la cámara web.
let webcam: any = null;
// Indica si el ciclo de análisis debe seguir ejecutándose.
let running = false;
// Guarda el identificador del último ciclo para poder cancelarlo.
let rafId = 0;

// Carga el modelo, enciende la cámara y devuelve los nombres de sus clases.
export async function startModel(baseUrl: string, camEl: HTMLElement): Promise<string[]> {
  // Asegura que la dirección termine en una barra diagonal.
  const url = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
  // Descarga la configuración y los datos del modelo publicado.
  model = await tmImage.load(url + "model.json", url + "metadata.json");
  // Prepara una cámara de 400 por 300 píxeles; true muestra la imagen como espejo.
  webcam = new tmImage.Webcam(400, 300, true); // true = espejo
  // Pide permiso y prepara el video de la cámara.
  await webcam.setup();
  // Comienza a capturar imágenes.
  await webcam.play();
  // Limpia el espacio de cámara anterior, si lo había.
  camEl.innerHTML = "";
  // Coloca la imagen de la cámara dentro de la página.
  camEl.appendChild(webcam.canvas);
  // Permite que el ciclo de análisis comience.
  running = true;
  // Devuelve los nombres de las clases configuradas al entrenar el modelo.
  return model.getClassLabels() as string[];
}

// Repite el análisis de la cámara y entrega cada resultado a onFrame. 
export function startLoop(onFrame: (p: Prediction[]) => Promise<void> | void): void {
  // Esta función analiza un cuadro y luego programa el siguiente.
  const tick = async (): Promise<void> => {
    // Si se detuvo el análisis, no hace más trabajo.
    if (!running) return;
    // Actualiza la imagen actual de la cámara.
    webcam.update();
    // Pide al modelo una predicción para la imagen visible.
    const preds: Prediction[] = await model.predict(webcam.canvas);
    // Entrega los resultados a la función que actualiza la página y Arduino.
    await onFrame(preds);
    // Programa otro análisis para el siguiente momento de dibujo del navegador.
    rafId = requestAnimationFrame(tick);
  };
  // Inicia el primer análisis; los siguientes se programan desde tick.
  tick();
}

// Detiene el análisis y apaga la cámara.
export function stopModel(): void {
  // Hace que tick termine cuando intente ejecutarse otra vez.
  running = false;
  // Cancela el análisis que el navegador hubiera programado.
  cancelAnimationFrame(rafId);
  // Detiene la cámara si estaba preparada.
  webcam?.stop();
  // Borra la referencia para indicar que ya no hay cámara activa.
  webcam = null;
}
