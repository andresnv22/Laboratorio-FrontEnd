export type ProductCategory = 'Bloques' | 'Peluches' | 'Vehículos' | 'Juegos de mesa';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number | null;
  rating: number;
  reviewCount: number;
  ageRange: string;
  description: string;
  pieces?: number | null;
  material?: string | null;
  colorHex: string;
  bgHex: string;
  iconHex: string;
}

// Así llega un producto desde MongoDB: el identificador viene como `_id`.
export interface ApiProduct extends Omit<Product, 'id'> {
  _id: string;
}

export function toProduct(api: ApiProduct): Product {
  const { _id, ...rest } = api;
  return { ...rest, id: _id };
}
