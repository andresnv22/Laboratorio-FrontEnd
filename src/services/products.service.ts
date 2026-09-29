import { FilterQuery } from 'mongoose';
import { Product, ProductDoc } from '../models/Product';
import { ApiError } from '../lib/errors';

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface ProductInput {
  _id: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number | null;
  ageRange: string;
  description: string;
  pieces?: number | null;
  material?: string | null;
  colorHex: string;
  bgHex: string;
  iconHex: string;
}

export const ProductsService = {
  async list(filters: ProductFilters) {
    const { category, minPrice, maxPrice, search } = filters;

    const query: FilterQuery<ProductDoc> = {};
    if (category) query.category = category;
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = { ...(minPrice !== undefined ? { $gte: minPrice } : {}), ...(maxPrice !== undefined ? { $lte: maxPrice } : {}) };
    }
    if (search) query.name = { $regex: search, $options: 'i' };

    return Product.find(query).sort({ createdAt: 1 });
  },

  async getById(id: string) {
    const product = await Product.findById(id);
    if (!product) {
      throw ApiError.notFound(`No existe un producto con id "${id}"`);
    }
    return product;
  },

  async getRelated(id: string, limit = 4) {
    const product = await ProductsService.getById(id);
    return Product.find({ category: product.category, _id: { $ne: id } }).limit(limit);
  },

  async create(data: ProductInput) {
    return Product.create(data);
  },

  async update(id: string, data: Partial<Omit<ProductInput, '_id'>>) {
    const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!product) {
      throw ApiError.notFound(`No existe un producto con id "${id}"`);
    }
    return product;
  },

  async remove(id: string) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw ApiError.notFound(`No existe un producto con id "${id}"`);
    }
  },
};
