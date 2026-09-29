import { Schema, model, InferSchemaType, Types } from 'mongoose';

const cartItemSchema = new Schema(
  {
    cartId: { type: String, required: true },
    productId: { type: String, required: true, ref: 'Product' },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { timestamps: true }
);

// Un mismo producto no puede aparecer dos veces en el mismo carrito.
cartItemSchema.index({ cartId: 1, productId: 1 }, { unique: true });

export type CartItemDoc = InferSchemaType<typeof cartItemSchema> & { _id: Types.ObjectId };
export const CartItem = model<CartItemDoc>('CartItem', cartItemSchema);
