import { log } from "./dom";

let port: any = null;
let writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
let lastCmd = "";
const enc = new TextEncoder();

export const isSupported = (): boolean => "serial" in navigator;

export async function connectArduino(baudRate = 9600): Promise<boolean> {
  if (!isSupported()) { alert("Web Serial no soportada. Usa Chrome o Edge."); return false; }
  try {
    port = await (navigator as any).serial.requestPort();
    await port.open({ baudRate });
    writer = port.writable.getWriter();
    log(`Arduino conectado (${baudRate} baud).`);
    return true;
  } catch {
    log("Conexión cancelada o fallida.");
    return false;
  }
}

export async function disconnectArduino(): Promise<void> {
  try { writer?.releaseLock(); await port?.close(); } catch { /* ignore */ }
  writer = null; port = null; lastCmd = "";
  log("Arduino desconectado.");
}

/** Envía el comando solo si cambió respecto al anterior. */
export async function sendCommand(cmd: string): Promise<void> {
  if (cmd === lastCmd) return;
  lastCmd = cmd;
  if (!writer) { log(`(sin Arduino) comando '${cmd}'`); return; }
  try { await writer.write(enc.encode(cmd)); log(`→ Serial: '${cmd}'`); }
  catch { log("Error al escribir en el puerto."); }
}
