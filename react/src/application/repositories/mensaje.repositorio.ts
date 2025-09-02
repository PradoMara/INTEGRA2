import {Mensaje} from "../entities/mensaje";

export interface MensajeRepository {
    /**
     * Guarda un nuevo mensaje en una conversación.
     * @param mensaje La instancia del mensaje a guardar.
     */
    guardar(mensaje: Mensaje): Promise<void>;

    /**
     * Obtiene todos los mensajes de una conversación, ordenados cronológicamente.
     * @param El ID de la conversación.
     * @returns Un arreglo de mensajes.
     */
    obtenerPorConversacion(conversacionId: string): Promise<Mensaje[]>;

    /**
     * Marca un mensaje específico como leído.
     * @param El ID del mensaje a marcar.
     */
    marcarComoLeido(mensajeId: string): Promise<void>;
}