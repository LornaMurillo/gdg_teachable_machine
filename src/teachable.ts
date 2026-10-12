import type { Prediction } from "./types";

let model: any = null;
let webcam: any = null;
let running = false;
let rafId = 0;

/** Carga el modelo, enciende la cámara y devuelve las etiquetas de clase. */
export async function startModel(baseUrl: string, camEl: HTMLElement): Promise<string[]> {
  const url = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
  model = await tmImage.load(url + "model.json", url + "metadata.json");
  webcam = new tmImage.Webcam(400, 300, true); // true = espejo
  await webcam.setup();
  await webcam.play();
  camEl.innerHTML = "";
  camEl.appendChild(webcam.canvas);
  running = true;
  return model.getClassLabels() as string[];
}

/** Bucle de predicción; llama a onFrame con cada resultado. */
export function startLoop(onFrame: (p: Prediction[]) => Promise<void> | void): void {
  const tick = async (): Promise<void> => {
    if (!running) return;
    webcam.update();
    const preds: Prediction[] = await model.predict(webcam.canvas);
    await onFrame(preds);
    rafId = requestAnimationFrame(tick);
  };
  tick();
}

export function stopModel(): void {
  running = false;
  cancelAnimationFrame(rafId);
  webcam?.stop();
  webcam = null;
}
