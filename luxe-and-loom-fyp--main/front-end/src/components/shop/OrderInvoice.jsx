import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Card,
  CardBody,
} from "@material-tailwind/react";
import { format } from "date-fns";
import { Link } from "react-router";
import { SERVER_URL } from "../../config";

const OrderInvoice = ({ order, openDialog, handleOpenDialog }) => {
  return (
    <Dialog open={openDialog} handler={handleOpenDialog} size="lg">
      <DialogHeader className="text-black">🧾 Order Invoice</DialogHeader>

      <DialogBody className="text-black space-y-6">
        {/* CUSTOMER DETAILS */}
        <Card className="bg-gray-50 shadow-none border border-gray-200">
          <CardBody className="grid grid-cols-3 gap-4 text-sm text-gray-800 p-4">
            <div>
              <p className="text-gray-500">Order ID</p>
              <p className="font-medium">{order._id.toUpperCase()}</p>
            </div>

            <div>
              <p className="text-gray-500">Order Date</p>
              <p className="font-medium">
                {format(new Date(order.createdAt), "MMMM d, yyyy")}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Customer</p>
              <p className="font-medium">{order.user?.name || "N/A"}</p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{order.user?.email || "N/A"}</p>
            </div>

            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium">{order.user?.phoneNum || "N/A"}</p>
            </div>

            <div>
              <p className="text-gray-500">Transaction Id</p>
              <p className="font-medium">{order?.transactionId || "N/A"}</p>
            </div>

            <div>
              <p className="text-gray-500">Delivery Address</p>
              <p className="font-medium">{order?.deliveryAddress || "N/A"}</p>
            </div>

            <div>
              <p className="text-gray-500">Grand Total</p>
              <p className="font-medium">NPR {order.total}</p>
            </div>
          </CardBody>
        </Card>

        {/* ORDER ITEMS */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-3 border border-gray-200">SN</th>
                <th className="p-3 border border-gray-200">Product</th>
                <th className="p-3 border border-gray-200">Size</th>
                <th className="p-3 border border-gray-200">Color</th>
                <th className="p-3 border border-gray-200">Qty</th>
                <th className="p-3 border border-gray-200">Price</th>
                <th className="p-3 border border-gray-200">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item, index) => (
                <tr key={item._id} className="text-sm text-gray-700">
                  <td className="p-3 border border-gray-200">{index + 1}</td>
                  <td className="p-3 border border-gray-200">
                    <Link
                      to={`${
                        item?.product
                          ? `/shop/${item.product._id}`
                          : `${SERVER_URL}/${item?.customizedImage}`
                      }`}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      {item.product?.name || "Customized Shawls"}
                    </Link>
                  </td>

                  <td className="p-3 border border-gray-200">
                    {item.size || "Customized Shawls"}
                  </td>

                  <td className="p-3 border border-gray-200">
                    {item?.color || "N/A"}
                  </td>

                  <td className="p-3 border border-gray-200">
                    {item.quantity}
                  </td>
                  <td className="p-3 border border-gray-200">
                    NPR {item.product?.basePrice?.toFixed(2) || item?.price}
                  </td>
                  <td className="p-3 border border-gray-200">
                    NPR{" "}
                    {(
                      item.product?.basePrice || item?.price * item.quantity
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogBody>

      <DialogFooter>
        <Button variant="filled" color="blue" onClick={handleOpenDialog}>
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default OrderInvoice;
