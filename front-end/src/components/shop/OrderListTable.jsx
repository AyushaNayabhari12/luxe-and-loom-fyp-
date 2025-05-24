// import { Alert, Button, Typography } from "@material-tailwind/react";
// import { useQuery } from "@tanstack/react-query";
// import { format } from "date-fns";
// import { useState } from "react";
// import { v4 as uuid } from "uuid";
// import { getRequest } from "../../utils/apiHandler";
// import OrderInvoice from "./OrderInvoice";
// import useAuthContext from "../../hooks/useAuthContext.js";

// const OrderListTable = ({ queryKey, endpoint }) => {
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const { currentUser } = useAuthContext();

//   const handleOpenDialog = () => {
//     setOpenDialog(!openDialog);
//   };

//   const { data: orders, isLoading } = useQuery({
//     queryKey: queryKey,
//     queryFn: async () => {
//       const res = await getRequest({ endpoint });
//       return res?.data || [];
//     },
//     enabled: !!currentUser?._id,
//   });

//   const TABLE_HEAD = [
//     "Order ID",
//     "Total",
//     "Date",
//     "Delivery Address",
//     "Transaction Id",
//     "Actions",
//   ];

//   if (isLoading) return <div>Fetching Orders...</div>;

//   return (
//     <>
//       {orders?.length === 0 ? (
//         <Alert>No orders found.</Alert>
//       ) : (
//         <div className="overflow-auto">
//           <table className="w-full table-auto text-left ">
//             <thead>
//               <tr>
//                 {TABLE_HEAD.map((head) => (
//                   <th
//                     key={uuid()}
//                     className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
//                   >
//                     <Typography
//                       variant="small"
//                       color="blue-gray"
//                       className="font-normal leading-none opacity-70"
//                     >
//                       {head}
//                     </Typography>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {orders?.map((order, index) => {
//                 const {
//                   _id,
//                   total,
//                   createdAt,
//                   deliveryAddress,
//                   transactionId,
//                 } = order;

//                 const isLast = index === orders.length - 1;
//                 const classes = isLast
//                   ? "p-4"
//                   : "p-4 border-b border-blue-gray-50";

//                 return (
//                   <tr key={_id}>
//                     <td className={classes}>
//                       <Typography
//                         variant="small"
//                         className="font-normal opacity-70"
//                       >
//                         {_id?.toUpperCase()}
//                       </Typography>
//                     </td>

//                     <td className={classes}>
//                       <Typography
//                         variant="small"
//                         className="font-normal opacity-70"
//                       >
//                         NPR {total}
//                       </Typography>
//                     </td>

//                     <td className={classes}>
//                       <Typography
//                         variant="small"
//                         className="font-normal opacity-70"
//                       >
//                         {format(new Date(createdAt), "MMMM d, yyyy")}
//                       </Typography>
//                     </td>

//                     <td className={classes}>
//                       <Typography
//                         variant="small"
//                         className="font-normal opacity-70"
//                       >
//                         {deliveryAddress}
//                       </Typography>
//                     </td>

//                     <td className={classes}>
//                       <Typography
//                         variant="small"
//                         className="font-normal opacity-70"
//                       >
//                         {transactionId}
//                       </Typography>
//                     </td>

//                     <td className={classes}>
//                       <Button
//                         size="sm"
//                         onClick={() => {
//                           setSelectedOrder(order);
//                           handleOpenDialog();
//                         }}
//                       >
//                         View Items
//                       </Button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {selectedOrder && (
//         <OrderInvoice
//           order={selectedOrder}
//           openDialog={openDialog}
//           handleOpenDialog={handleOpenDialog}
//         />
//       )}
//     </>
//   );
// };

// export default OrderListTable;



import { Alert, Button, Typography } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { getRequest } from "../../utils/apiHandler";
import OrderInvoice from "./OrderInvoice";
import useAuthContext from "../../hooks/useAuthContext.js";

const OrderListTable = ({ queryKey, endpoint }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { currentUser } = useAuthContext();

  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };

  const { data: orders, isLoading } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const res = await getRequest({ endpoint });
      return res?.data || [];
    },
    enabled: !!currentUser?._id,
  });

  const TABLE_HEAD = [
    "Order ID",
    "User Name",        // Added User Name header
    "Total",
    "Date",
    "Delivery Address",
    "Transaction Id",
    "Actions",
  ];

  if (isLoading) return <div>Fetching Orders...</div>;

  return (
    <>
      {orders?.length === 0 ? (
        <Alert>No orders found.</Alert>
      ) : (
        <div className="overflow-auto">
          <table className="w-full table-auto text-left ">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={uuid()}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders?.map((order, index) => {
                const {
                  _id,
                  total,
                  createdAt,
                  deliveryAddress,
                  transactionId,
                  user, // Assuming user object is present on order
                } = order;

                const isLast = index === orders.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={_id}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        className="font-normal opacity-70"
                      >
                        {_id?.toUpperCase()}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Typography
                        variant="small"
                        className="font-normal opacity-70"
                      >
                        {user?.name || "N/A"} {/* Display user name */}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Typography
                        variant="small"
                        className="font-normal opacity-70"
                      >
                        NPR {total}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Typography
                        variant="small"
                        className="font-normal opacity-70"
                      >
                        {format(new Date(createdAt), "MMMM d, yyyy")}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Typography
                        variant="small"
                        className="font-normal opacity-70"
                      >
                        {deliveryAddress}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Typography
                        variant="small"
                        className="font-normal opacity-70"
                      >
                        {transactionId}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          handleOpenDialog();
                        }}
                      >
                        View Items
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <OrderInvoice
          order={selectedOrder}
          openDialog={openDialog}
          handleOpenDialog={handleOpenDialog}
        />
      )}
    </>
  );
};

export default OrderListTable;
