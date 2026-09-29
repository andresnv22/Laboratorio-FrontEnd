import { Order } from '../models/Order';
import { CartItem } from '../models/CartItem';
import { ApiError } from '../lib/errors';
import { CartService } from './cart.service';

export interface CheckoutInput {
  cartId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
}

export const OrdersService = {
  async checkout(input: CheckoutInput) {
    const cart = await CartService.get(input.cartId);
    if (cart.items.length === 0) {
      throw ApiError.badRequest('El carrito está vacío, no se puede crear el pedido');
    }

    const order = await Order.create({
      cartId: input.cartId,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerAddress: input.customerAddress,
      subtotal: cart.subtotal,
      shipping: cart.shipping,
      total: cart.total,
      status: 'pending',
      items: cart.items.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        unitPrice: item.product.price,
        quantity: item.quantity,
      })),
    });

    // Nota: esto no es una transacción atómica con la creación del pedido.
    // Para un MongoDB Atlas o un replica set local se podría envolver ambos
    // pasos en una sesión ($session + withTransaction) si se necesita
    // atomicidad estricta; para el alcance de esta tienda es suficiente.
    await CartItem.deleteMany({ cartId: input.cartId });

    return order;
  },

  async getById(id: string) {
    const order = await Order.findById(id);
    if (!order) {
      throw ApiError.notFound(`No existe un pedido con id "${id}"`);
    }
    return order;
  },

  async listByCustomerEmail(customerEmail: string) {
    return Order.find({ customerEmail: customerEmail.toLowerCase() }).sort({ createdAt: -1 });
  },

  async updateStatus(id: string, status: string) {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
    if (!order) {
      throw ApiError.notFound(`No existe un pedido con id "${id}"`);
    }
    return order;
  },
};
