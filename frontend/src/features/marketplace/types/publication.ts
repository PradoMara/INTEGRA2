export type Publication = {
  id: string;
  title: string;
  description?: string;
  price?: number | string;
  images?: string[];
  attributes?: Record<string, string | number>;
  seller?: {
    id?: string | number;
    name?: string;
    avatarUrl?: string;
    reputation?: number; // añadido para rating del vendedor
  };
  stock?: number;
  location?: string;
  campus?: string;       // añadido para chips/atributos
  category?: string;     // si tu fuente usa "category"
  categoryName?: string; // compat si viene como categoryName
  condition?: string;    // "Usado", "Nuevo", etc.
  createdAt?: string | number | Date; // compat con fechaPublicacion del modal
};