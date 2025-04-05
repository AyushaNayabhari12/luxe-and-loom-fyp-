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
import { getRequest } from '../../../utils/apiHandler';
import { v4 as uuid } from 'uuid';

const AllOrderList = () => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const TABLE_HEAD = ['Order ID', 'Status', 'Total', 'Date', 'Actions'];

  const handleOpenDialog = order => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const { data: orders, isLoading } = useQuery({
    queryKey: ['all-orders', selectedStatus],
    queryFn: async () => {
      let endpoint = `/orders`;

      if (selectedStatus) endpoint += `?status=${selectedStatus}`;

      const res = await getRequest({ endpoint });
      return res?.data || [];
    },
  });

  if (isLoading) return <div className='p-20'>Fetching Orders...</div>;

  return (
    <div className='bg-white p-6 rounded-lg px-2 md:px-5 py-5 md:pt-3'>
      <div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4'>
        <Typography variant='h5'>All Orders</Typography>

        <div className='flex items-center gap-4'>
          <Select
            label='Filter by Status'
            value={selectedStatus}
            onChange={setSelectedStatus}>
            <Option value=''>All</Option>
            <Option value='shipped'>Shipped</Option>
            <Option value='delivered'>Delivered</Option>
            <Option value='cancelled'>Cancelled</Option>
          </Select>
        </div>
      </div>

      {orders?.length === 0 ? (
        <Alert>No orders found.</Alert>
      ) : (
        <div className='overflow-auto'>
          <table className='w-full text-left border border-gray-300'>
            <thead>
              <tr>
                {TABLE_HEAD.map(head => (
                  <th
                    key={uuid()}
                    className='border-y border-blue-gray-100 bg-blue-gray-50/50 p-4'>
                    <Typography
                      variant='small'
                      color='blue-gray'
                      className='font-normal leading-none opacity-70'>
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {orders?.map((order, index) => {
                const isLast = index === orders.length - 1;
                const classes = isLast
                  ? 'p-4'
                  : 'p-4 border-b border-blue-gray-50';
                return (
                  <tr key={order._id} className={classes}>
                    <td className='p-4 border-b border-gray-300'>
                      {order._id}
                    </td>
                    <td className='p-4 border-b border-gray-300 capitalize'>
                      {order.status}
                    </td>
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
                );
              })}
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

export default AllOrderList;

