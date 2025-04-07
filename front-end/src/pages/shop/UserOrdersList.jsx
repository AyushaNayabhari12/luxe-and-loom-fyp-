import {
  Alert,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Option,
  Select,
  Typography,
} from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useState } from 'react';
import useAuthContext from '../../hooks/useAuthContext';
import { getRequest } from '../../utils/apiHandler';

const UserOrderList = () => {
  const { currentUser } = useAuthContext();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = order => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const { data: orders, isLoading } = useQuery({
    queryKey: ['user-orders', currentUser?._id],
    queryFn: async () => {
      let endpoint = `/orders/user/${currentUser?._id}`;

      const res = await getRequest({ endpoint });
      return res?.data || [];
    },
    enabled: !!currentUser?._id,
  });

  if (isLoading) return <div className='p-20'>Fetching Orders...</div>;

  return (
    <div className='bg-white p-20 rounded-lg'>
      <div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4'>
        <Typography variant='h5'>My Orders</Typography>
      </div>

      {orders?.length === 0 ? (
        <Alert>No orders found.</Alert>
      ) : (
        <div className='overflow-auto'>
          <table className='w-full text-left border border-gray-300'>
            <thead>
              <tr>
                <th className='p-4 border-b border-gray-300'>Order ID</th>
                <th className='p-4 border-b border-gray-300'>Total</th>
                <th className='p-4 border-b border-gray-300'>Date</th>
                <th className='p-4 border-b border-gray-300'>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map(order => (
                <tr key={order._id}>
                  <td className='p-4 border-b border-gray-300'>{order._id}</td>
                  <td className='p-4 border-b border-gray-300'>
                    NPR {order.total}
                  </td>
                  <td className='p-4 border-b border-gray-300'>
                    {format(new Date(order.createdAt), 'MMMM d, yyyy')}
                  </td>
                  <td className='p-4 border-b border-gray-300'>
                    <Button size='sm' onClick={() => handleOpenDialog(order)}>
                      View Items
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <Dialog open={openDialog} handler={setOpenDialog} size='lg'>
          <DialogHeader className='text-black'>Order Invoice</DialogHeader>
          <DialogBody className='text-black'>
            <table className='w-full text-left border border-gray-300'>
              <thead>
                <tr>
                  <th className='p-2 border border-gray-300'>SN</th>
                  <th className='p-2 border border-gray-300'>Product Name</th>
                  <th className='p-2 border border-gray-300'>Quantity</th>
                  <th className='p-2 border border-gray-300'>Base Price</th>
                  <th className='p-2 border border-gray-300'>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.orderItems.map((item, index) => (
                  <tr key={item._id}>
                    <td className='p-2 border border-gray-300'>{index + 1}</td>
                    <td className='p-2 border border-gray-300'>
                      {item.product?.name || 'N/A'}
                    </td>
                    <td className='p-2 border border-gray-300'>
                      {item.quantity}
                    </td>
                    <td className='p-2 border border-gray-300'>
                      NPR {item.product?.basePrice}
                    </td>
                    <td className='p-2 border border-gray-300'>
                      NPR {(item.product?.basePrice * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='text-right font-semibold mt-4'>
              Total: NPR {selectedOrder.total}
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant='text' onClick={() => setOpenDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
};

export default UserOrderList;

