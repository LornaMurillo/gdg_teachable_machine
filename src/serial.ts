import { log } from "./dom";

// Guarda el puerto serial que el usuario selecciona.
let port: any = null;
// Guarda el canal usado para escribir datos hacia Arduino.
let writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
// Recuerda la última orden para no enviar la misma una y otra vez.
let lastCmd = "";
// Convierte texto en bytes, que es el formato que se envía por serial.
const enc = new TextEncoder();

// Informa si el navegador ofrece la función Web Serial.
export const isSupported = (): boolean => "serial" in navigator;

// Abre una conexión con Arduino; usa 9600 baudios si no se indica otro valor.
export async function connectArduino(baudRate = 9600): Promise<boolean> {
  // Si el navegador no soporta esta función, muestra una ayuda y falla.
  if (!isSupported()) { alert("Web Serial no soportada. Usa Chrome o Edge."); return false; }
  // Intenta pedir el puerto, abrirlo y preparar el canal de escritura.
  try {
    // Muestra al usuario la ventana para elegir el puerto de Arduino.
    port = await (navigator as any).serial.requestPort();
    // Abre el puerto a la velocidad acordada con el programa de Arduino.
    await port.open({ baudRate });
    // Obtiene el canal por el que se enviarán los comandos.
    writer = port.writable.getWriter();
    // Añade al registro que la conexión está lista.
    log(`Arduino conectado (${baudRate} baud).`);
    // Informa que la conexión funcionó.
    return true;
  } catch {
    // Informa si el usuario canceló o el puerto no pudo abrirse.
    log("Conexión cancelada o fallida.");
    // Informa que no se pudo conectar.
    return false;
  }
}

// Cierra la conexión con Arduino y limpia los datos guardados.
export async function disconnectArduino(): Promise<void> {
  // Intenta liberar el canal y cerrar el puerto; ignora errores durante el cierre.
  try { writer?.releaseLock(); await port?.close(); } catch { /* ignore */ }
  // Borra las referencias para indicar que ya no hay conexión.
  writer = null; port = null; lastCmd = "";
  // Anota el cierre en el registro de la página.
  log("Arduino desconectado.");
}

/** Envía una orden a Arduino solo cuando es distinta de la anterior. */
export async function sendCommand(cmd: string): Promise<void> {
  // Si la orden no cambió, no hace falta volver a enviarla.
  if (cmd === lastCmd) return;
  // Recuerda esta orden para compararla con la siguiente.
  lastCmd = cmd;
  // Si Arduino no está conectado, registra la orden pero no intenta enviarla.
  if (!writer) { log(`(sin Arduino) comando '${cmd}'`); return; }
  // Intenta convertir la orden y escribirla en el puerto.
  try { await writer.write(enc.encode(cmd)); log(`→ Serial: '${cmd}'`); }
  // Si la escritura falla, avisa en el registro.
  catch { log("Error al escribir en el puerto."); }
}
