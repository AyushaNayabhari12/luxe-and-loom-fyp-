import mongoose from 'mongoose';

const PRODUCT_CATEGORIES = [
  'Shawl',
  'Scarf',
  'Wrap',
  'Kurti',
  'Blouse',
  'Jacket',
  'Sweater',
  'Cardigan',
  'Coat',
  'Poncho',
  'Cape',
  'Dress',
  'Skirt',
  'Top',
  'Tunic',
  'Dupatta',
  'Saree',
  'Lehenga',
  'Pant',
  'Palazzo',
  'Leggings',
  'Set',
  'Ethnic Wear',
  'Winter Wear',
  'Casual Wear',
  'Formal Wear',
];

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
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model('Product', productSchema);

