export type Publication = {
  id: string;
  title: string;
  description?: string;
  price?: number | string;
  images?: string[]; // primera imagen = principal
  attributes?: Record<string, string | number>;
  seller?: {
    id?: string;
    name?: string;
    avatarUrl?: string;
  };
  stock?: number;
  location?: string;
  createdAt?: string;
};