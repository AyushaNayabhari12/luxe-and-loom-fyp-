import { asyncErrorHandler, sendSuccessResponse } from "../../utils/index.js";
import { Product } from "../product/product.js";
import { getRecommendations } from "./recommendation.js";
import { Order } from "../order/order.js";
import { UserActivity } from "./userActivity.js";

export const getRecommendedProducts = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;
  const { category, currentProduct } = req.query;

  // Fetch user's previously viewed products for exclusion
  const activity = await UserActivity.findOne({ user: userId }).select('productViews.productId');
  const viewedIds = activity?.productViews.map(v => v.productId.toString()) || [];

  // Exclude products the user has already ordered
  const orders = await Order.find({ user: userId, status: 'checkout' }).select('orderItems.product');
  const purchasedIds = orders.flatMap(o => o.orderItems.map(item => item.product.toString()));

  // Get AI-based recommendations (excludes previously viewed), then remove current product if present
  let recommendations = await getRecommendations(userId, 4, category);
  if (currentProduct) {
    recommendations = recommendations.filter(
      (p) => p._id.toString() !== currentProduct.toString()
    );
  }

  // Exclude any products the user has already ordered
  if (purchasedIds.length) {
    recommendations = recommendations.filter(
      (p) => !purchasedIds.includes(p._id.toString())
    );
  }

  // Fallback to simple category match, excluding current, viewed, and purchased products
  if (!recommendations || recommendations.length === 0) {
    const fallbackQuery = { category, isDeleted: false };
    const exclusionIds = [];
    if (currentProduct) exclusionIds.push(currentProduct.toString());
    if (purchasedIds.length) exclusionIds.push(...purchasedIds);
    if (viewedIds.length) exclusionIds.push(...viewedIds);
    if (exclusionIds.length) {
      fallbackQuery._id = { $nin: exclusionIds };
    }
    recommendations = await Product.find(fallbackQuery).limit(4);
  }

  sendSuccessResponse({
    res,
    message: "Recommendations fetched successfully",
    data: recommendations,
  });
});
