import { Request, Response } from 'express';
import { z } from 'zod';
import { OrdersService } from '../services/orders.service';
import { ApiError } from '../lib/errors';
import { ORDER_STATUSES } from '../models/Order';

const checkoutSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerAddress: z.string().min(1),
});

const statusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

export const OrdersController = {
  async checkout(req: Request, res: Response) {
    const data = checkoutSchema.parse(req.body);
    const order = await OrdersService.checkout({ cartId: req.cartId!, ...data });
    res.status(201).json(order);
  },

  async getById(req: Request, res: Response) {
    const order = await OrdersService.getById(req.params.id);
    res.json(order);
  },

  async listByEmail(req: Request, res: Response) {
    const email = req.query.email;
    if (typeof email !== 'string' || email.length === 0) {
      throw ApiError.badRequest('Debes indicar ?email= para listar los pedidos de un cliente');
    }
    const orders = await OrdersService.listByCustomerEmail(email);
    res.json(orders);
  },

  async updateStatus(req: Request, res: Response) {
    const { status } = statusSchema.parse(req.body);
    const order = await OrdersService.updateStatus(req.params.id, status);
    res.json(order);
  },
};
