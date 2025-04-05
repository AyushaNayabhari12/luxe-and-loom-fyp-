import { Carousel } from '@material-tailwind/react';
import { Link } from 'react-router';
import { formatImageUrl } from '../../utils/index';

const ProductCard = ({ product }) => {
  if (!product) return null;

  const { _id, images, name, basePrice } = product;

  return (
    <div>
      <div className='h-[300px] w-full'>
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

      <div className='mt-3'>
        <h2 className='text-lg font-semibold'>{name}</h2>

        <div className='flex items-center justify-between'>
          <p className=''>NPR {basePrice}</p>
          <Link
            to={`${_id}`}
            className='text-blue-500 hover:underline'>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

