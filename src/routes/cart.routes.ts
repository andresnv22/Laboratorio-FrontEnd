import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { requireCartId } from '../middleware/cartId';
import { asyncHandler } from '../lib/asyncHandler';

export const cartRouter = Router();

cartRouter.use(requireCartId);

cartRouter.get('/', asyncHandler(CartController.get));
cartRouter.post('/items', asyncHandler(CartController.addItem));
cartRouter.patch('/items/:productId', asyncHandler(CartController.updateItem));
cartRouter.delete('/items/:productId', asyncHandler(CartController.removeItem));
cartRouter.delete('/', asyncHandler(CartController.clear));
