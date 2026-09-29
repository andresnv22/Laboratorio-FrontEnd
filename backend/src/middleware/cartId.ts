import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../lib/errors';

// El frontend genera un UUID por navegador (p. ej. guardado en localStorage)
// y lo envía en cada llamada al carrito con el header `x-cart-id`.
// Así no necesitamos autenticación para tener un carrito por visitante.
declare module 'express-serve-static-core' {
  interface Request {
    cartId?: string;
  }
}

export function requireCartId(req: Request, res: Response, next: NextFunction): void {
  const cartId = req.header('x-cart-id');
  if (!cartId || cartId.trim().length === 0) {
    next(ApiError.badRequest('Falta el header "x-cart-id" que identifica el carrito del visitante'));
    return;
  }
  req.cartId = cartId;
  next();
}
