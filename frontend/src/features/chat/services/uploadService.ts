// frontend/src/features/chat/services/uploadService.ts

/**
 * Define la respuesta de la API al subir una imagen
 * (basado en routes/upload.js)
 */
interface UploadApiResponse {
  ok: boolean;
  imageUrl: string;
  filename: string;
  message?: string;
}

/**
 * Servicio para subir un archivo de imagen al backend.
 *
 * @param file El objeto File (de un <input type="file">).
 * @param token El token JWT del usuario autenticado.
 * @returns La respuesta de la API con la URL de la imagen.
 */
export const uploadImageService = async (
  file: File,
  token: string
): Promise<UploadApiResponse> => {

  // Usa la variable de entorno o fallback a localhost
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const endpoint = `${API_BASE_URL}/api/upload-image`;

  // 1. Crear el FormData para enviar la imagen
  const formData = new FormData();
  
  // 2. El nombre del campo DEBE ser "image", como lo espera Multer
  //
  formData.append("image", file);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        // 3. Añadir el token de autenticación
        Authorization: `Bearer ${token}`,
        // NO añadir 'Content-Type', el navegador lo hace por ti
      },
      body: formData,
    });

    const data: UploadApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al subir la imagen");
    }

    // 4. Devolver la respuesta (ej. { ok: true, imageUrl: "/uploads/..." })
    return data;

  } catch (error) {
    console.error("Error en uploadImageService:", error);
    throw error;
  }
};