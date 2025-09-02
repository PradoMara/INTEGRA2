import { Conversacion } from '../entities/conversacion'

export interface ConversacionRepository {
    /**
     * Guarda una nueva conversación.
     * @param conversacion La instancia de la conversación a guardar.
     */
    guardar(conversacion: Conversacion): Promise<void>;

    /**
     * Busca una conversación por su ID.
     * @param El ID único de la conversación.
     * @returns La conversación encontrada o nula si no existe.
     */
    obtenerPorId(id: string): Promise<Conversacion | null>;

    /**
     * Obtiene una lista de conversaciones de un usuario.
     * @param El ID del usuario.
     * @returns Un areglo de conversaciones.
     */
    obtenerPorUsuario(usuarioId: string): Promise<Conversacion[]>;
}