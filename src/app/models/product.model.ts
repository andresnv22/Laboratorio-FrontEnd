export interface Product {
  id: string;
  name: string;
  category: 'Bloques' | 'Peluches' | 'Vehículos' | 'Juegos de mesa';
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  ageRange: string;
  description: string;
  pieces?: number;
  material?: string;
  colorHex: string;
  bgHex: string;
  iconHex: string;
}
