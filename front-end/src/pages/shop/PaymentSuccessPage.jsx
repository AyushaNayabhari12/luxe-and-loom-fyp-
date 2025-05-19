import {
  Button,
  Card,
  CardBody,
  CardHeader,
  DialogFooter,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import {
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoHomeOutline,
} from "react-icons/io5";
import { postRequest } from "../../utils/apiHandler";
import { useNavigate, useSearchParams } from "react-router";
import { base64ToFile } from "../../utils/index.js";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const amount = searchParams.get("amount") || "";
  const purchaseOrderId = searchParams.get("purchase_order_id") || "";
  const transactionId = searchParams.get("transaction_id") || "";
  const mobile = searchParams.get("mobile") || "";
  const status = searchParams.get("status") || "";

  const checkoutCart = async () => {
    try {
      setLoading(true);

      const { size, quantity, customizedImage } =
        JSON.parse(localStorage.getItem("customizedShawlOrder")) || {};

      if (size && quantity && customizedImage) {
        const formData = new FormData();

        formData.append("quantity", quantity);
        formData.append("customizedImage", base64ToFile(customizedImage));
        formData.append("size", size);
        formData.append("transactionId", transactionId);

        await postRequest({
          endpoint: "/orders/buy-now",
          data: formData,
        });

        localStorage.removeItem("customizedShawlOrder");

        return;
      }

      await postRequest({
        endpoint: "/orders/cart/checkout",
        data: {
          transactionId,
        },
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status !== "Completed") {
      setErrorMessage(
        "Payment status is not completed. Please check your transaction.",
      );
    }

    if (status === "Completed") {
      checkoutCart();
    }
  }, []);

  const DetailItem = ({ label, value }) => (
    <div className="flex justify-between items-center py-1">
      <Typography variant="small" color="blue-gray">
        {label}
      </Typography>
      <Typography variant="small" className="font-medium">
        {value}
      </Typography>
    </div>
  );

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center bg-white text-gray-700">
        <Spinner className="h-16 w-16 text-blue-500 mb-4" />

        <h2 className="text-xl font-semibold">Processing Payment...</h2>
        <p className="text-sm text-gray-500 mt-1">
          Please wait while we confirm your payment.
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <Card className="w-full max-w-md">
          <CardHeader
            floated={false}
            shadow={false}
            className="flex flex-col items-center gap-2 bg-red-50 py-6"
          >
            <IoAlertCircleOutline className="text-red-600" size={48} />
            <Typography variant="h5" color="red">
              Payment Failed
            </Typography>
          </CardHeader>
          <CardBody>
            <Typography color="gray" className="text-center">
              {errorMessage}
            </Typography>
          </CardBody>
          <DialogFooter className="justify-center pb-4">
            <Button
              color="red"
              variant="gradient"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <IoHomeOutline size={20} /> Back to Home
            </Button>
          </DialogFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-20">
      <Card className="w-full max-w-md">
        <CardHeader
          floated={false}
          shadow={false}
          className="flex flex-col items-center gap-2 bg-green-50 py-6"
        >
          <IoCheckmarkCircleOutline className="text-green-600" size={48} />
          <Typography variant="h5" color="green">
            Payment Successful!
          </Typography>
          <Typography color="gray">
            Your transaction has been completed.
          </Typography>
        </CardHeader>

        <CardBody className="space-y-4">
          <div>
            <Typography variant="h6">Order Details</Typography>

            <DetailItem label="Order ID" value={purchaseOrderId} />

            <DetailItem
              label="Amount"
              value={`NPR ${parseInt(amount) / 100}`}
            />
          </div>

          <div className="border-t pt-4">
            <Typography variant="h6">Payment Details</Typography>
            <DetailItem label="Transaction ID" value={transactionId} />
            <DetailItem label="Payment Status" value={status} />
            <DetailItem label="Mobile" value={mobile} />
          </div>
        </CardBody>

        <DialogFooter className="justify-center pb-4">
          <Button
            color="green"
            variant="gradient"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <IoHomeOutline size={20} /> Back to Home
          </Button>
        </DialogFooter>
      </Card>
    </div>
  );
}
