import natural from "natural";
const { WordTokenizer } = natural;

import { UserActivity } from "./userActivity.js";

const tokenizer = new WordTokenizer();

export async function generateTextEmbedding(text) {
  const tokens = tokenizer.tokenize(text.toLowerCase());

  const embedding = Array(128).fill(0);
  tokens.forEach((token, i) => {
    embedding[i % 128] += token.charCodeAt(0);
  });
  return embedding.map((v) => v / Math.max(1, Math.max(...embedding)));
}

export async function generateUserEmbedding(userId) {
  const activity = await UserActivity.findOne({ user: userId })
    .populate("productViews.productId")
    .populate("previousOrders.order");

  if (!activity) return Array(128).fill(0); // Default empty embedding

  let embedding = Array(128).fill(0);
  let totalWeight = 0;

  // Weight views (less important)
  activity.productViews.forEach((view) => {
    if (view.productId && view.productId.embedding.length === 128) {
      const recencyWeight =
        1 / (1 + (Date.now() - view.viewedAt) / (1000 * 60 * 60 * 24)); // Decay over days
      const weight = 1 * recencyWeight; // Views have lower base weight
      view.productId.embedding.forEach((val, i) => {
        embedding[i] += val * weight;
      });
      totalWeight += weight;
    }
  });

  // Weight purchases (more important)
  activity.previousOrders.forEach((order) => {
    if (order.order && order.order.products) {
      const recencyWeight =
        1 / (1 + (Date.now() - order.purchasedAt) / (1000 * 60 * 60 * 24));
      const weight = 3 * recencyWeight; // Purchases have higher base weight
      order.order.products.forEach((product) => {
        if (product.embedding && product.embedding.length === 128) {
          product.embedding.forEach((val, i) => {
            embedding[i] += val * weight;
          });
          totalWeight += weight;
        }
      });
    }
  });

  // Normalize embedding
  if (totalWeight > 0) {
    embedding = embedding.map((val) => val / totalWeight);
  }

  // Incorporate search queries (optional)
  const queryText = activity.searchQueries.map((q) => q.query).join(" ");
  if (queryText) {
    const queryEmbedding = await generateTextEmbedding(queryText);
    embedding = embedding.map(
      (val, i) => (val + queryEmbedding[i] * 0.2) / 1.2,
    );
  }

  return embedding;
}
