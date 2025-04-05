import mongoose from 'mongoose';
import orderItemSchema from './orderItem.js';
import { Product } from '../product/product.js';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    total: {
      type: Number,
    },
    orderItems: {
      type: [orderItemSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['cart', 'shipped', 'delivered', 'cancelled'],
      default: 'cart',
    },
    deliveryAddress: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre('save', async function (next) {
  let total = 0;

  for (const el of this.orderItems) {
    const product = await Product.findById(el?.product?.toString());
    if (product) {
      total += el.quantity * product.basePrice;
    }
  }

  this.total = Number(total.toFixed(2));
  next();
});

export const Order = mongoose.model('Order', orderSchema);

