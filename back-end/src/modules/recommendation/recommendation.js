import { Product } from "../product/product.js";
import { generateUserEmbedding } from "./vectorEmbeddings.js";

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
}

export async function getRecommendations(userId, limit = 4) {
  const userEmbedding = await generateUserEmbedding(userId);
  const products = await Product.find({ embedding: { $ne: [] } });

  const recommendations = products
    .map((product) => {
      return {
        product,
        similarity: Math.ceil(
          cosineSimilarity(userEmbedding, product.embedding),
        ),
      };
    })
    .filter((rec) => rec.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map((rec) => rec.product);

  return recommendations;
}
