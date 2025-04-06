import mongoose from 'mongoose';

const PRODUCT_CATEGORIES = ['Shawl', 'Scarf', 'Wrap'];

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
      enum: PRODUCT_CATEGORIES,
      default: 'Shawl',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sizes: {
      type: [String],
      required: true,
    },
    colors: {
      type: [String],
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model('Product', productSchema);

