import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { CiDollar } from 'react-icons/ci';
import { FaUsers } from 'react-icons/fa';
import { MdInventory2, MdOutlineReceiptLong } from 'react-icons/md';
import OrdersOverTime from '../../components/dashboard/OrdersOverTime';
import ProductCountByCategory from '../../components/dashboard/ProductCountByCategory';
import { getRequest } from '../../utils/apiHandler';

const Dashboard = () => {
  const { data: metrics = {} } = useQuery({
    queryKey: ['metrics'],
    queryFn: async () => {
      const response = await getRequest({
        endpoint: '/dashboard/metrics',
      });
      return response.data;
    },
  });

  const formatNumber = number => {
    if (!number) return '000';

    return number > 100 ? number : number > 10 ? `0${number}` : `00${number}`;
  };

  return (
    <div>
      <div className='grid grid-cols-4 gap-x-8'>
        <div className='bg-white px-8 py-5 flex items-center gap-x-4 rounded shadow-sm'>
          <div className='h-[50px] w-[50px] flex items-center justify-center bg-blue-50 rounded-full'>
            <FaUsers size='30px' className='text-blue-600' />
          </div>
          <div>
            <p className='text-xl font-bold'>
              {formatNumber(metrics?.totalUsers)}
            </p>
            <p className='text-sm text-gray-600'>Total Users</p>
          </div>
        </div>

        <div className='bg-white px-8 py-5 flex items-center gap-x-4 rounded shadow-sm'>
          <div className='h-[50px] w-[50px] flex items-center justify-center bg-green-50 rounded-full'>
            <MdInventory2 size='30px' className='text-green-600' />
          </div>
          <div>
            <p className='text-xl font-bold'>
              {' '}
              {formatNumber(metrics?.totalProducts)}
            </p>
            <p className='text-sm text-gray-600'>Total Products</p>
          </div>
        </div>

        <div className='bg-white px-8 py-5 flex items-center gap-x-4 rounded shadow-sm'>
          <div className='h-[50px] w-[50px] flex items-center justify-center bg-deep-orange-50 rounded-full'>
            <MdOutlineReceiptLong
              size='30px'
              className='text-deep-orange-600'
            />
          </div>
          <div>
            <p className='text-xl font-bold'>
              {formatNumber(metrics?.totalOrders)}
            </p>
            <p className='text-sm text-gray-600'>Total Orders</p>
          </div>
        </div>

        <div className='bg-white px-8 py-5 flex items-center gap-x-4 rounded shadow-sm'>
          <div className='h-[50px] w-[50px] flex items-center justify-center bg-purple-50 rounded-full'>
            <CiDollar size='30px' className='text-purple-600' />
          </div>
          <div>
            <p className='text-xl font-bold'>
              {formatNumber(metrics?.totalRevenue)}
            </p>
            <p className='text-sm text-gray-600'>Total Revenue</p>
          </div>
        </div>
      </div>

      <div className='flex gap-x-8 mt-10'>
        <div className='w-[40%]'>
          <ProductCountByCategory />
        </div>
        <div className='flex-1'>
          <OrdersOverTime />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

