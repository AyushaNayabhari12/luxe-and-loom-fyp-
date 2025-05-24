import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../utils/apiHandler";

export const useFetchProductById = (id) => {
  return useQuery({
    queryKey: ["PRODUCT_BY_ID", id],
    queryFn: async () => {
      try {
        const res = await getRequest({
          endpoint: `/products/${id}`,
        });

        return res?.data || [];
      } catch {
        return [];
      }
    },
    enabled: !!id,
  });
};

export const useFetchSimilarProducts = (product) => {
  return useQuery({
    queryKey: ["Similar Products", product?.id, product?.category],
    queryFn: async () => {
      try {
        const category = product.category ?? "";
        const currentProduct = product._id || product.id || "";

        // Fetch recommendations, excluding already viewed and soft-deleted server-side
        const res = await getRequest({
          endpoint: `/recommendations?category=${category}&currentProduct=${currentProduct}`,
        });

        // As safety, filter out any deleted or current items client-side
        return (res?.data || []).filter(
          (p) => !p.isDeleted && p._id !== currentProduct
        );
      } catch {
        return [];
      }
    },
    enabled: !!product,
  });
};
