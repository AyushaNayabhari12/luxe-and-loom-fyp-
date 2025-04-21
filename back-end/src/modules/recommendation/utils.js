import { UserActivity } from './userActivity.js';

export async function logSearch(userId, query) {
  if (!userId || !query) return;

  await UserActivity.findOneAndUpdate(
    { user: userId },
    { $push: { searchQueries: { query } } },
    { upsert: true, new: true }
  );
}

export async function logProductView(userId, productId) {

  if (!userId || !productId) return;

  await UserActivity.findOneAndUpdate(
    { user: userId },
    { $push: { productViews: { productId } } },
    { upsert: true, new: true }
  );
}

export async function logOrder(userId, orderId) {

  if (!userId || !orderId) return;

  await UserActivity.findOneAndUpdate(
    { user: userId },
    { $push: { previousOrders: { orderId } } },
    { upsert: true, new: true }
  );
}




