import type { Chat } from "@/features/chat/types/chat";

export const mockChats: Chat[] = [
  {
    id: 1,
    nombre: "Demo Usuario",
    ultimoMensaje: "¡Hola, esto es un chat demo!",
    mensajes: [
      { id: 1, texto: "¡Hola!", autor: "yo", estado: "enviado", hora: "08:00" },
      { id: 2, texto: "¿Cómo estás?", autor: "otro", estado: "recibido", hora: "08:01" }
    ]
  }
];