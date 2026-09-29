import { Schema, model, InferSchemaType } from 'mongoose';

const CATEGORIES = ['Bloques', 'Peluches', 'Vehículos', 'Juegos de mesa'] as const;

const productSchema = new Schema(
  {
    // Usamos un id de texto (slug) en vez de un ObjectId autogenerado, para que
    // coincida con las rutas del frontend Angular (/producto/mega-torre-bloques).
    _id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true, enum: CATEGORIES },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0, default: null },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    ageRange: { type: String, required: true },
    description: { type: String, required: true },
    pieces: { type: Number, min: 0, default: null },
    material: { type: String, default: null },
    colorHex: { type: String, required: true },
    bgHex: { type: String, required: true },
    iconHex: { type: String, required: true },
  },
  { timestamps: true }
);

productSchema.index({ category: 1 });
productSchema.index({ name: 'text' });

export type ProductDoc = InferSchemaType<typeof productSchema> & { _id: string };
export const Product = model<ProductDoc>('Product', productSchema);
export { CATEGORIES };
