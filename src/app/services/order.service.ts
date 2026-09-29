import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import { CheckoutData, Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_URL}/orders`;

  // Convierte el carrito actual (identificado por x-cart-id) en un pedido.
  // El backend vacía el carrito al terminar.
  checkout(data: CheckoutData): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/checkout`, data);
  }
}
