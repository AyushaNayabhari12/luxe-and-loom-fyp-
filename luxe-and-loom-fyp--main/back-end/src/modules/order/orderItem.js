import { Schema } from "mongoose";

const orderItemSchema = Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  customizedImage: {
    type: String, // base64 or uploaded image URL
  },
  price: {
    type: Number,
  },
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

export default orderItemSchema;
