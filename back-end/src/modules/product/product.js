import mongoose from 'mongoose';
import { generateTextEmbedding } from '../recommendation/vectorEmbeddings.js';
import { getProductFeatureInSingleString } from '../../utils/index.js';

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
    embedding: [{ type: Number }],
  },
  {
    timestamps: true,
  }
);

productSchema.pre('save', async function (next) {
  if (this.isDeleted) return next();

  const text = getProductFeatureInSingleString(this);

  const embedding = await generateTextEmbedding(text);

  this.embedding = embedding;

  next();
});

export const Product = mongoose.model('Product', productSchema);

