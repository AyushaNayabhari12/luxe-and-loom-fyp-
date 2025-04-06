import { Carousel } from '@material-tailwind/react';
import { Link } from 'react-router';
import { formatImageUrl } from '../../utils/index';

const ProductCard = ({ product }) => {
  if (!product) return null;

  const { _id, images, name, basePrice, category, stock } = product;

  return (
    <div>
      <div className='h-[300px] w-full relative'>
        <Carousel className='rounded-xl' autoplay autoplayDelay={2000} loop>
          {images?.map((image, index) => (
            <img
              key={index}
              src={formatImageUrl(image)}
              alt={name}
              className='h-full w-full object-cover'
            />
          ))}
        </Carousel>

        {/* "Out of Stock" badge */}
        {stock <= 0 && (
          <span className='absolute top-2 right-2 bg-red-600 text-white px-3 py-1 text-sm font-semibold rounded-lg'>
            Out of Stock
          </span>
        )}
      </div>

      <div className='mt-3'>
        <h2 className='text-lg font-semibold'>
          {name} <span className='text-sm text-gray-500'>({category})</span>
        </h2>

        <div className='flex items-center justify-between mt-2'>
          <p className=''>NPR {basePrice}</p>

          <Link to={`/shop/${_id}`} className='text-blue-500 hover:underline'>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

