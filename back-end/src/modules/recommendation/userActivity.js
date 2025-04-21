import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  searchQueries: [
    {
      query: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  productViews: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      viewedAt: { type: Date, default: Date.now },
    },
  ],
  previousOrders: [
    {
      order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
      purchasedAt: { type: Date, default: Date.now },
    },
  ],
});

export const UserActivity = mongoose.model('UserActivity', userActivitySchema);

