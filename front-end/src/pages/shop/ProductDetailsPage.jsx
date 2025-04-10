import {
  Button,
  Carousel,
  Input,
  Option,
  Select,
  Tooltip,
} from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import ProductCard from '../../components/shop/ProductCard';
import { COLORS, SIZES } from '../../config';
import { formatImageUrl } from '../../utils';
import { getRequest, postRequest } from '../../utils/apiHandler';
import TryOn from '../../components/shop/TryOn';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const carouselRef = useRef(null);

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
    queryKey: ['PRODUCT_BY_ID', id],
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

  const { data: similarProducts } = useQuery({
    queryKey: ['Similar Products', id, product?.category],
    queryFn: async () => {
      try {
        const category = product.category ?? '';

        const res = await getRequest({
          endpoint: `/products/similar?category=${category}&currentProduct=${id}`,
        });

        return res?.data || [];
      } catch (error) {
        return [];
      }
    },
    enabled: !!product,
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
    category,
    sizes = SIZES,
    colors = COLORS,
  } = product;

  return (
    <div className='p-20'>
      <div className='grid grid-cols-2 gap-x-20'>
        <div>
          <div className='h-[500px] w-full'>
            <Carousel
              ref={carouselRef}
              className='rounded-xl relative'
              autoplay
              autoplayDelay={2000}
              prevArrow={() => (
                <button
                  className='absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition'
                  onClick={() => carouselRef.current?.prev()}>
                  <IoIosArrowBack size={20} />
                </button>
              )}
              nextArrow={() => (
                <button className='absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition'>
                  <IoIosArrowForward
                    size={20}
                    onClick={() => carouselRef.current?.next()}
                  />
                </button>
              )}
              navigation={({ setActiveIndex, activeIndex, length }) => (
                <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10'>
                  {new Array(length).fill('').map((_, i) => (
                    <button
                      key={i}
                      className={`h-3 w-3 rounded-full ${
                        activeIndex === i ? 'bg-black' : 'bg-gray-500'
                      }`}
                      onClick={() => setActiveIndex(i)}
                    />
                  ))}
                </div>
              )}>
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
          <h2 className='text-2xl font-semibold'>
            {name.toUpperCase()}{' '}
            <span className='text-sm text-gray-500'>({category})</span>
          </h2>

          <h3 className='text-gray-600'>{description}</h3>

          <p className='text-xl font-bold'>NPR {basePrice}</p>

          <TryOn images={images || []} />

          {/* Add to cart btn */}
          {stock < 1 ? (
            <div>
              <span className=' bg-red-600 text-white px-3 py-1 text-sm font-semibold rounded-lg'>
                Out of Stock
              </span>
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
                            cartDetails.color === color
                              ? 'ring-2 ring-black'
                              : ''
                          }`}
                          title={color}
                          onClick={() => handleColorToggle(color)}
                          style={{
                            backgroundColor: color.toLowerCase(),
                          }}></div>
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

      {similarProducts && similarProducts?.length !== 0 && (
        <div className='pt-20 space-y-5'>
          <h1 className='text-xl font-bold'> Similar Products </h1>
          <div className='grid grid-cols-4 gap-10 max-w-7xl mx-auto'>
            {similarProducts?.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;

