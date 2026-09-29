export interface OrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  createdAt: string;
}

export interface CheckoutData {
  customerName: string;
  customerEmail: string;
  customerAddress: string;
}
