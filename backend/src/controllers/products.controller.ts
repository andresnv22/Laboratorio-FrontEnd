import { Request, Response } from 'express';
import { z } from 'zod';
import { ProductsService } from '../services/products.service';
import { CATEGORIES } from '../models/Product';

const listQuerySchema = z.object({
  category: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  search: z.string().optional(),
});

const slugId = z
  .string()
  .min(1)
  .regex(/^[a-z0-9-]+$/, 'El id debe ser un slug en minúsculas, números y guiones (p. ej. "osito-suave")');

const productBodySchema = z.object({
  _id: slugId,
  name: z.string().min(1),
  category: z.enum(CATEGORIES),
  price: z.number().int().nonnegative(),
  compareAtPrice: z.number().int().nonnegative().nullable().optional(),
  ageRange: z.string().min(1),
  description: z.string().min(1),
  pieces: z.number().int().nonnegative().nullable().optional(),
  material: z.string().nullable().optional(),
  colorHex: z.string().min(1),
  bgHex: z.string().min(1),
  iconHex: z.string().min(1),
});

const productUpdateSchema = productBodySchema.omit({ _id: true }).partial();

export const ProductsController = {
  async list(req: Request, res: Response) {
    const filters = listQuerySchema.parse(req.query);
    const products = await ProductsService.list(filters);
    res.json(products);
  },

  async getById(req: Request, res: Response) {
    const product = await ProductsService.getById(req.params.id);
    res.json(product);
  },

  async getRelated(req: Request, res: Response) {
    const related = await ProductsService.getRelated(req.params.id);
    res.json(related);
  },

  async create(req: Request, res: Response) {
    const data = productBodySchema.parse(req.body);
    const product = await ProductsService.create(data);
    res.status(201).json(product);
  },

  async update(req: Request, res: Response) {
    const data = productUpdateSchema.parse(req.body);
    const product = await ProductsService.update(req.params.id, data);
    res.json(product);
  },

  async remove(req: Request, res: Response) {
    await ProductsService.remove(req.params.id);
    res.status(204).send();
  },
};
