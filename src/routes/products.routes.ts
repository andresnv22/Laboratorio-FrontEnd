import { Router } from 'express';
import { ProductsController } from '../controllers/products.controller';
import { asyncHandler } from '../lib/asyncHandler';

export const productsRouter = Router();

productsRouter.get('/', asyncHandler(ProductsController.list));
productsRouter.get('/:id', asyncHandler(ProductsController.getById));
productsRouter.get('/:id/related', asyncHandler(ProductsController.getRelated));
productsRouter.post('/', asyncHandler(ProductsController.create));
productsRouter.put('/:id', asyncHandler(ProductsController.update));
productsRouter.delete('/:id', asyncHandler(ProductsController.remove));
