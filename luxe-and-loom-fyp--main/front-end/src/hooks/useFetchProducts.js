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

        const res = await getRequest({
          endpoint: `/recommendations?category=${category}`,
        });

        // Remove any soft-deleted products just in case
        return (res?.data || []).filter((p) => !p.isDeleted);
      } catch {
        return [];
      }
    },
    enabled: !!product,
  });
};
