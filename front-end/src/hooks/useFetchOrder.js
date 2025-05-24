import { useQuery } from "@tanstack/react-query";
import useAuthContext from "./useAuthContext";
import { getRequest } from "../utils/apiHandler";

export const useFetchCart = () => {
  const { currentUser } = useAuthContext();

  return useQuery({
    queryKey: ["Cart Items", currentUser?._id],
    queryFn: async () => {
      try {
        const res = await getRequest({
          endpoint: "/orders/cart",
        });

        return res?.data;
      } catch (error) {
        return null;
      }
    },
  });
};
