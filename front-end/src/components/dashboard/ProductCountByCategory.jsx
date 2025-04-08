import { Typography } from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';

import Chart from 'react-apexcharts';
import { getRequest } from '../../utils/apiHandler';

const ProductCountByCategory = () => {
  const { data } = useQuery({
    queryKey: ['ProductCountByCategory'],
    queryFn: async () => {
      const response = await getRequest({
        endpoint: '/dashboard/products-by-category',
      });
      return response.data || [];
    },
  });

  return (
    <div className='flex-1 bg-white rounded shadow-sm py-4 px-3 flex flex-col'>
      <Typography variant='h6'>Products count by category</Typography>

      {data && (
        <div className='mt-8'>
          <Chart
            type='pie'
            series={data?.map(el => el.count)}
            options={{
              labels: data?.map(el => el.category),
              legend: {
                show: true,
                position: 'bottom',
              },
            }}
            height={350}
          />
        </div>
      )}
    </div>
  );
};

export default ProductCountByCategory;

