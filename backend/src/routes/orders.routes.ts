import { Router } from 'express';
import { OrdersController } from '../controllers/orders.controller';
import { requireCartId } from '../middleware/cartId';
import { asyncHandler } from '../lib/asyncHandler';

export const ordersRouter = Router();

// El checkout necesita saber qué carrito convertir en pedido.
ordersRouter.post('/checkout', requireCartId, asyncHandler(OrdersController.checkout));
ordersRouter.get('/', asyncHandler(OrdersController.listByEmail));
ordersRouter.get('/:id', asyncHandler(OrdersController.getById));
ordersRouter.patch('/:id/status', asyncHandler(OrdersController.updateStatus));
