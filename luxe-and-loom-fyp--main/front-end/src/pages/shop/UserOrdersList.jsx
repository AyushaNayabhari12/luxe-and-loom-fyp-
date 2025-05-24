import { Typography } from "@material-tailwind/react";
import OrderListTable from "../../components/shop/OrderListTable";
import useAuthContext from "../../hooks/useAuthContext";

const UserOrderList = () => {
  const { currentUser } = useAuthContext();

  return (
    <div className="bg-white p-20 rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <Typography variant="h5">My Orders</Typography>
      </div>
      <OrderListTable
        queryKey={["user-orders", currentUser?._id]}
        endpoint={`/orders/user/${currentUser?._id}`}
      />
    </div>
  );
};

export default UserOrderList;
