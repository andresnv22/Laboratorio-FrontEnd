import { Request, Response } from 'express';
import { z } from 'zod';
import { CartService } from '../services/cart.service';

const addItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().default(1),
});

const updateQuantitySchema = z.object({
  quantity: z.number().int().nonnegative(),
});

export const CartController = {
  async get(req: Request, res: Response) {
    const cart = await CartService.get(req.cartId!);
    res.json(cart);
  },

  async addItem(req: Request, res: Response) {
    const { productId, quantity } = addItemSchema.parse(req.body);
    const cart = await CartService.addItem(req.cartId!, productId, quantity);
    res.status(201).json(cart);
  },

  async updateItem(req: Request, res: Response) {
    const { quantity } = updateQuantitySchema.parse(req.body);
    const cart = await CartService.updateItemQuantity(req.cartId!, req.params.productId, quantity);
    res.json(cart);
  },

  async removeItem(req: Request, res: Response) {
    const cart = await CartService.removeItem(req.cartId!, req.params.productId);
    res.json(cart);
  },

  async clear(req: Request, res: Response) {
    const cart = await CartService.clear(req.cartId!);
    res.json(cart);
  },
};
