import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { getRequest, postRequest } from '../../utils/apiHandler';
import { formatImageUrl } from '../../utils';
import {
  Alert,
  Button,
  Carousel,
  Input,
  Option,
  Select,
  Tooltip,
} from '@material-tailwind/react';
import { COLORS, SIZES } from '../../config';
import { toast } from 'sonner';

const ProductDetailsPage = () => {
  const { id } = useParams();

  const defaultCartDetails = {
    productId: id,
    size: '',
    color: '',
    quantity: 1,
  };

  const [cartDetails, setCartDetails] = useState(defaultCartDetails);
  const [loading, setLoading] = useState(false);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['Users'],
    queryFn: async ({ queryKey }) => {
      try {
        const [_searchText, _role] = queryKey;

        const res = await getRequest({
          endpoint: `/products/${id}`,
        });

        return res?.data || [];
      } catch (error) {
        return [];
      }
    },
  });

  const handleColorToggle = c => {
    setCartDetails(prevCartDetails => {
      return {
        ...prevCartDetails,
        color: prevCartDetails.color === c ? '' : c,
      };
    });
  };

  const handleSizeChange = size => {
    setCartDetails(prevCartDetails => {
      return {
        ...prevCartDetails,
        size,
      };
    });
  };

  const handleChangeQuantity = e => {
    const quantity = parseInt(e.target.value);
    setCartDetails(prevCartDetails => {
      return {
        ...prevCartDetails,
        quantity,
      };
    });
  };

  const handleAddToCart = async () => {
    try {
      if (!cartDetails.size || !cartDetails.quantity || !cartDetails.color) {
        toast.error('Please select size, color and quantity.');
        return;
      }

      if (cartDetails.quantity < 1) {
        toast.error('Quantity must be greater than 0.');
        return;
      }

      if (cartDetails.quantity > product.stock) {
        toast.error('Enteretd Quantity exceeds available stock.');
        return;
      }

      setLoading(true);

      const res = await postRequest({
        endpoint: '/orders/cart',
        data: cartDetails,
      });

      if (res.ok) {
        toast.success(res.message);
        setCartDetails(defaultCartDetails);
        return;
      }

      toast.error(res.message || 'An error occurred. Please try again.');
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div className='p-20'> Fetching Data...</div>;
  }

  const {
    images,
    name,
    basePrice,
    description,
    stock,
    sizes = SIZES,
    colors = COLORS,
  } = product;

  return (
    <div className='grid grid-cols-2 gap-x-20 p-20'>
      <div>
        <div className='h-[500px] w-full'>
          <Carousel className='rounded-xl'>
            {images?.map((image, index) => (
              <img
                key={index}
                src={formatImageUrl(image)}
                alt={name}
                className='h-full w-full object-cover'
              />
            ))}
          </Carousel>
        </div>
      </div>

      <div className='space-y-6'>
        <h2 className='text-2xl font-semibold'>{name.toUpperCase()}</h2>

        <h3 className='text-gray-600'>{description}</h3>

        <p className='text-xl font-bold'>NPR {basePrice}</p>

        {/* Add to cart btn */}
        {stock < 1 ? (
          <div>
            <p className='font-bold text-red-500'>Out of Stock</p>
          </div>
        ) : (
          <>
            <Button onClick={handleAddToCart} loading={loading}>
              Add to Cart
            </Button>

            <div className='flex gap-x-5 items-center pt-4'>
              <div className='text-xl'>Size :</div>

              <div>
                <Select
                  label='Select Size'
                  onChange={handleSizeChange}
                  value={cartDetails.size}>
                  {sizes.map((size, index) => (
                    <Option key={index} value={size}>
                      {size}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            <div className='flex gap-x-5 mt-4'>
              <div className='text-xl'>Color:</div>

              <div>
                <p className='mb-2 mt-1'>{cartDetails.color}</p>
                <div className='grid grid-cols-6 gap-4'>
                  {colors.map((color, index) => (
                    <Tooltip key={index} content={color} placement='top'>
                      <div
                        className={`w-6 h-6 rounded border cursor-pointer ${
                          cartDetails.color === color ? 'ring-2 ring-black' : ''
                        }`}
                        title={color}
                        onClick={() => handleColorToggle(color)}
                        style={{ backgroundColor: color.toLowerCase() }}></div>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </div>

            <div className='flex gap-x-5 items-center pt-4'>
              <div className='text-xl'>Quantity :</div>

              <div>
                <Input
                  label='Quantity'
                  type='number'
                  min={1}
                  onChange={handleChangeQuantity}
                  value={cartDetails.quantity}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;


