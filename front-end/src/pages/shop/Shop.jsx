import { Input } from '@material-tailwind/react';
import FilterSidebar from '../../components/shop/FilterSidebar';
import ProductCard from '../../components/shop/ProductCard';
import { FaSearch } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { getRequest } from '../../utils/apiHandler';
import { useState } from 'react';
import useDebounce from '../../hooks/useDebounce';

const Shop = () => {
  const [searchText, setSearchText] = useState('');
  const debouncedSearchTextValue = useDebounce(searchText, 1000);

  const { data: response, isLoading } = useQuery({
    queryKey: [debouncedSearchTextValue, 'Products'],
    queryFn: async ({ queryKey }) => {
      try {
        const [_searchText, _role] = queryKey;

        const queryString = `search=${_searchText}`;

        const res = await getRequest({
          endpoint: `/products?${queryString}`,
        });

        return res?.data || [];
      } catch (error) {
        return [];
      }
    },
  });

  if (isLoading) {
    return <div className='p-20'> Fetching Data...</div>;
  }

  return (
    <div className='flex p-10'>
      <div className='w-[18%] py-1'>
        {/* Filter Sidebar */}
        <FilterSidebar />
      </div>

      {/* Main Content */}

      <div className='flex flex-col flex-1'>
        <div className='flex flex-col md:flex-row gap-y-4 justify-between items-center px-8'>
          <div className='text-xl'>Products</div>

          <div className='flex flex-col md:flex-row gap-y-4 gap-x-4 py-1'>
            <div className='w-72'>
              <Input label='Search Product' icon={<FaSearch />} type='text' />
            </div>
          </div>
        </div>

        <div className='p-8 h-full flex-1 min-h-0 overflow-auto scrollbar-hide'>
          <div className='grid grid-cols-3 gap-x-5 gap-y-8'>
            {response?.products?.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;

