import { Carousel } from '@material-tailwind/react';
import React, { useRef } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useParams } from 'react-router';
import ProductCard from '../../components/shop/ProductCard';
import TryOn from '../../components/shop/TryOn';
import {
  useFetchProductById,
  useFetchSimilarProducts,
} from '../../hooks/useFetchProducts';
import { formatImageUrl } from '../../utils';

import AddToCartDialog from '../../components/shop/AddToCartDialog.jsx';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const carouselRef = useRef(null);

  const { data: product, isLoading } = useFetchProductById(id);

  const { data: similarProducts } = useFetchSimilarProducts(product);

  if (isLoading) {
    return <div className='p-20'> Fetching Data...</div>;
  }

  const { images, name, basePrice, description, stock, category } = product;

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
            <AddToCartDialog product={product} />
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

