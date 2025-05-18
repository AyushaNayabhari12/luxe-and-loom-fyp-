import { sendSuccessResponse } from "../../utils/apiResponseHandler.js";
import { Product } from "../product/product.js";
import { getRecommendations } from "./recommendation.js";

export async function getRecommendedProducts(req, res) {
  const userId = req.userId;
  const { category } = req.query;

  let recommendations = await getRecommendations(userId);

  if (!recommendations || recommendations.length === 0) {
    recommendations = await Product.find({ category }).limit(4);
  }

  sendSuccessResponse({
    res,
    message: "Recommendations fetched successfully",
    data: recommendations,
  });
}
