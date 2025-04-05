import { Schema } from 'mongoose';

const orderItemSchema = Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

export default orderItemSchema;

