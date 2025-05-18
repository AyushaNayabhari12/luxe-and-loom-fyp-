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
      } catch (error) {
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

        return res?.data || [];
      } catch (error) {
        return [];
      }
    },
    enabled: !!product,
  });
};
