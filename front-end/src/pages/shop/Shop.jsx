import { Alert, Input } from '@material-tailwind/react';
import FilterSidebar from '../../components/shop/FilterSidebar';
import ProductCard from '../../components/shop/ProductCard';
import { FaSearch } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { getRequest } from '../../utils/apiHandler';
import { useEffect, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';
import { useSearchParams } from 'react-router';
import PaginationButtons from '../../components/shared/PaginationButtons';

const Shop = () => {
  const [searchText, setSearchText] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const searchObj = Object.fromEntries([...searchParams.entries()]);
  const { price = '', colors = '', keyword = '', sizes = '', page = 1} = searchObj;

  const debouncedSearchTextValue = useDebounce(searchText, 1000);

  const { data: response, isLoading } = useQuery({
    queryKey: [price, colors, keyword, sizes, page, 'Products'],
    queryFn: async () => {
      try {
        const queryString = `keyword=${keyword}&price=${price}&colors=${colors}&sizes=${sizes}&page=${page}&limit=9`;

        const res = await getRequest({
          endpoint: `/products?${queryString}`,
        });

        return res?.data || [];
      } catch (error) {
        return [];
      }
    },
  });

  useEffect(() => {
    if (debouncedSearchTextValue) {
      setSearchParams({
        ...searchObj,
        keyword: debouncedSearchTextValue,
      });
    }
  }, [debouncedSearchTextValue]);

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
              <Input
                label='Search Product'
                icon={<FaSearch />}
                type='text'
                onChange={e => setSearchText(e.target.value)}
                value={searchText}
              />
            </div>
          </div>
        </div>
        <div className='p-8 h-full flex-1 min-h-0 overflow-auto scrollbar-hide'>
          {response?.products && response?.products?.length === 0 ? (
            <div>
              <Alert color='blue-gray'>No Products Found</Alert>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-3 gap-x-5 gap-y-8'>
                {response?.products?.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              <PaginationButtons
                hasNextPage={response?.pagination?.hasNextPage}
                hasPrevPage={response?.pagination?.hasPrevPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;

