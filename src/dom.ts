export const $ = <T extends HTMLElement = HTMLElement>(id: string): T =>
  document.getElementById(id) as T;

export function log(text: string): void {
  const el = $("log");
  el.textContent += `[${new Date().toLocaleTimeString()}] ${text}\n`;
  el.scrollTop = el.scrollHeight;
}

export const setMsg = (text: string): void => { $("msg").textContent = text; };
