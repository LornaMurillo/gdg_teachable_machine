// Atajo para buscar un elemento HTML por su id sin repetir document.getElementById.
// T permite que TypeScript sepa si buscamos un botón, una caja de texto u otro elemento.
export const $ = <T extends HTMLElement = HTMLElement>(id: string): T =>
  // Busca el elemento y lo devuelve con el tipo solicitado.
  document.getElementById(id) as T;

// Agrega un mensaje al registro de actividad que aparece en la página.
export function log(text: string): void {
  // Busca la caja donde se muestran los mensajes.
  const el = $("log");
  // Agrega el mensaje al final, junto con la hora actual.
  el.textContent += `[${new Date().toLocaleTimeString()}] ${text}\n`;
  // Desplaza la caja hasta abajo para que se vea el mensaje más reciente.
  el.scrollTop = el.scrollHeight;
}

// Cambia el mensaje principal de estado que aparece en la interfaz.
export const setMsg = (text: string): void => { $("msg").textContent = text; };
