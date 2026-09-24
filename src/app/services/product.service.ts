import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly products: Product[] = [
    {
      id: 'mega-torre-bloques',
      name: 'Mega Torre de Bloques 200 pzs',
      category: 'Bloques',
      price: 89900,
      compareAtPrice: 105900,
      rating: 4.2,
      reviewCount: 186,
      ageRange: '6–8 años',
      description:
        'Torre de bloques de construcción de 200 piezas compatibles, ideal para desarrollar la motricidad fina y la creatividad. Incluye base giratoria y bolsa de almacenamiento reutilizable.',
      pieces: 200,
      material: 'Plástico ABS libre de BPA',
      colorHex: '#E24C4C',
      bgHex: '#FFECEC',
      iconHex: '#E24C4C',
    },
    {
      id: 'osito-suave',
      name: 'Osito Suave Grande 45cm',
      category: 'Peluches',
      price: 64900,
      rating: 4.8,
      reviewCount: 94,
      ageRange: '0–2 años',
      description:
        'Peluche de oso extra suave de 45cm, hipoalergénico y lavable a máquina. El compañero perfecto para la hora de dormir.',
      material: 'Felpa hipoalergénica',
      colorHex: '#B8860B',
      bgHex: '#FDEFD9',
      iconHex: '#B8860B',
    },
    {
      id: 'camion-bomberos',
      name: 'Camión de Bomberos a Control Remoto',
      category: 'Vehículos',
      price: 129900,
      rating: 4.4,
      reviewCount: 57,
      ageRange: '6–8 años',
      description:
        'Camión de bomberos a control remoto con luces y sonido reales, escalera extensible y control de largo alcance.',
      material: 'Plástico resistente + metal',
      colorHex: '#2E9191',
      bgHex: '#E4F5F3',
      iconHex: '#2E9191',
    },
    {
      id: 'aventura-tablero',
      name: 'Aventura en el Tablero',
      category: 'Juegos de mesa',
      price: 74900,
      rating: 4.6,
      reviewCount: 132,
      ageRange: '6–99 años',
      description:
        'Juego de mesa familiar de estrategia y aventura para 2 a 6 jugadores. Partidas de 30 a 45 minutos.',
      material: 'Cartón + madera',
      colorHex: '#6B4D9E',
      bgHex: '#EFEAFB',
      iconHex: '#6B4D9E',
    },
    {
      id: 'bloques-magneticos',
      name: 'Set de Bloques Magnéticos',
      category: 'Bloques',
      price: 99900,
      rating: 4.5,
      reviewCount: 41,
      ageRange: '3–5 años',
      description: 'Set de 60 piezas magnéticas translúcidas para construir estructuras 2D y 3D.',
      pieces: 60,
      material: 'Plástico ABS + imanes',
      colorHex: '#E24C4C',
      bgHex: '#FFECEC',
      iconHex: '#E24C4C',
    },
    {
      id: 'balon-espuma',
      name: 'Balón de Espuma Multicolor',
      category: 'Vehículos',
      price: 29900,
      rating: 4.1,
      reviewCount: 22,
      ageRange: '3–5 años',
      description: 'Balón liviano de espuma de alta densidad, ideal para juegos de interior.',
      material: 'Espuma EVA',
      colorHex: '#2E9191',
      bgHex: '#E4F5F3',
      iconHex: '#2E9191',
    },
  ];

  getAll(): Product[] {
    return this.products;
  }

  getById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  getFeatured(): Product[] {
    return this.products.slice(0, 4);
  }

  getRelated(excludeId: string): Product[] {
    return this.products.filter((p) => p.id !== excludeId).slice(0, 4);
  }
}
