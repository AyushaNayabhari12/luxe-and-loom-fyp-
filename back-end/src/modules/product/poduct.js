import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    images: [String],
    stock: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum: ['Shawl', 'Scarf', 'Wrap'],
      default: 'Shawl',
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model('Product', productSchema);

