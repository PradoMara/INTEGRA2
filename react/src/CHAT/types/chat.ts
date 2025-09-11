export type EstadoMensaje = "enviando" | "enviado" | "leido" | "no-leido";

export interface Chat {
  id: number;
  nombre: string;
  ultimoMensaje: string;
}

export interface Mensaje {
  id: number;
  texto: string;
  autor: "yo" | "otro";
  estado?: EstadoMensaje; // solo aplica a mensajes propios
}
