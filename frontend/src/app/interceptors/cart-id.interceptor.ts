import { HttpInterceptorFn } from '@angular/common/http';
import { API_URL } from '../config/api.config';
import { getCartId } from '../services/cart-id';

// Agrega el header `x-cart-id` a todas las llamadas a nuestra API,
// que es como el backend sabe qué carrito es de este visitante.
export const cartIdInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(API_URL)) {
    return next(req);
  }
  return next(req.clone({ setHeaders: { 'x-cart-id': getCartId() } }));
};
