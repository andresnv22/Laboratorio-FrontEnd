import { CartItem } from '../models/CartItem';
import { Product, ProductDoc } from '../models/Product';
import { ApiError } from '../lib/errors';

const SHIPPING_THRESHOLD = 150_000;
const SHIPPING_COST = 12_900;

export interface PopulatedCartItem {
  _id: unknown;
  cartId: string;
  productId: string;
  quantity: number;
  product: ProductDoc;
}

function computeTotals(items: { quantity: number; product: { price: number } }[]) {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  return { subtotal, shipping, total: subtotal + shipping };
}

async function loadCart(cartId: string) {
  const rawItems = await CartItem.find({ cartId }).sort({ createdAt: 1 }).lean();

  // Traemos los productos en una sola consulta y los unimos en memoria
  // (más simple y explícito que $lookup para este tamaño de carrito).
  const productIds = rawItems.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  const productsById = new Map(products.map((p) => [p._id, p]));

  const items: PopulatedCartItem[] = rawItems
    .filter((item) => productsById.has(item.productId))
    .map((item) => ({
      _id: item._id,
      cartId: item.cartId,
      productId: item.productId,
      quantity: item.quantity,
      product: productsById.get(item.productId) as ProductDoc,
    }));

  return { items, ...computeTotals(items) };
}

export const CartService = {
  async get(cartId: string) {
    return loadCart(cartId);
  },

  async addItem(cartId: string, productId: string, quantity: number) {
    const product = await Product.findById(productId);
    if (!product) {
      throw ApiError.notFound(`No existe un producto con id "${productId}"`);
    }

    await CartItem.findOneAndUpdate(
      { cartId, productId },
      { $inc: { quantity } },
      { upsert: true, setDefaultsOnInsert: true }
    );

    return loadCart(cartId);
  },

  async updateItemQuantity(cartId: string, productId: string, quantity: number) {
    if (quantity <= 0) {
      return CartService.removeItem(cartId, productId);
    }

    const existing = await CartItem.findOneAndUpdate({ cartId, productId }, { quantity }, { new: true });
    if (!existing) {
      throw ApiError.notFound('Ese producto no está en el carrito');
    }

    return loadCart(cartId);
  },

  async removeItem(cartId: string, productId: string) {
    await CartItem.deleteOne({ cartId, productId });
    return loadCart(cartId);
  },

  async clear(cartId: string) {
    await CartItem.deleteMany({ cartId });
    return loadCart(cartId);
  },
};
