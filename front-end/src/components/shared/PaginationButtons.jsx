import { Button, Typography } from '@material-tailwind/react';
import { useNavigate, useSearchParams } from 'react-router';

const PaginationButtons = ({ hasNextPage, hasPrevPage }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  const searchObj = Object.fromEntries([...searchParams.entries()]);

  const next = () => {
    if (hasNextPage) {
      setSearchParams({
        ...searchObj,
        page: page + 1,
      });
    }
  };

  const prev = () => {
    if (hasPrevPage) {
      setSearchParams({
        ...searchObj,
        page: page - 1,
      });
    }
  };

  return (
    <div className='w-full flex items-center justify-between py-8'>
      <Typography
        variant='paragraph'
        color='blue-gray'
        className='font-semibold'>
        Page {page}
      </Typography>

      <div className='flex gap-2'>
        <Button
          variant='outlined'
          type='button'
          size='sm'
          onClick={prev}
          disabled={!hasPrevPage}>
          Previous
        </Button>

        <Button
          type='button'
          variant='outlined'
          size='sm'
          onClick={next}
          disabled={!hasNextPage}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default PaginationButtons;

