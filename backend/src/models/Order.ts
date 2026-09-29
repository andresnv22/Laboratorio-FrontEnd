import { Schema, model, InferSchemaType, Types } from 'mongoose';

const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] as const;

const orderItemSchema = new Schema(
  {
    productId: { type: String, required: true, ref: 'Product' },
    name: { type: String, required: true },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    cartId: { type: String, default: null },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true },
    customerAddress: { type: String, required: true },
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ORDER_STATUSES, default: 'pending' },
    items: { type: [orderItemSchema], required: true },
  },
  { timestamps: true }
);

orderSchema.index({ customerEmail: 1 });

export type OrderDoc = InferSchemaType<typeof orderSchema> & { _id: Types.ObjectId };
export const Order = model<OrderDoc>('Order', orderSchema);
export { ORDER_STATUSES };
