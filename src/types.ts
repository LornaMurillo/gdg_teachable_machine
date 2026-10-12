// Describe una predicción: el nombre de una clase y qué tan seguro está el modelo.
export interface Prediction { className: string; probability: number; }
// Define los comandos básicos permitidos en el código TypeScript.
export type Command = "0" | "1" | "2";
