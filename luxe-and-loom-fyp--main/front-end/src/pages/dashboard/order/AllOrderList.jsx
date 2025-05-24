import { Typography } from "@material-tailwind/react";
import OrderListTable from "../../../components/shop/OrderListTable";

const AllOrderList = () => {
  return (
    <div className="bg-white p-6 rounded-lg px-2 md:px-5 py-5 md:pt-3">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <Typography variant="h5">All Orders</Typography>
      </div>
      <OrderListTable queryKey={["all-orders"]} endpoint="/orders" />
    </div>
  );
};

export default AllOrderList;
