import {
  Typography,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Button,
  Tooltip,
} from '@material-tailwind/react';
import { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { COLORS, SIZES } from '../../config';

const FilterSidebar = () => {
  const [openAccordion, setOpenAccordion] = useState(1);
  const [price, setPrice] = useState([1600, 4000]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const toggleAccordion = value => {
    setOpenAccordion(openAccordion === value ? 0 : value);
  };

  const handleClearFilters = () => {
    setPrice([1600, 4000]);
    setSelectedColors([]);
    setSelectedSizes([]);
  };

  const handleColorToggle = color => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleSizeToggle = size => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  return (
    <div className='w-full max-w-xs bg-white'>
      <Typography variant='h5' className='mb-4 text-black'>
        Filter by
      </Typography>

      <hr className='mb-4' />

      {/* Price Filter */}
      <div className='mb-4'>
        <div className='flex justify-between items-center mb-2'>
          <Typography variant='paragraph' className='font-medium text-black'>
            Price
          </Typography>
          <FiMinus className='text-lg' />
        </div>
        <div className='flex items-center justify-between'>
          <input
            type='range'
            min='1600'
            max='4000'
            value={price[0]}
            onChange={e => setPrice([+e.target.value, price[1]])}
            className='w-full accent-black'
          />
          <input
            type='range'
            min='1600'
            max='4000'
            value={price[1]}
            onChange={e => setPrice([price[0], +e.target.value])}
            className='w-full accent-black'
          />
        </div>
        <div className='flex justify-between mt-2 text-sm text-gray-700'>
          <span>NPR {price[0]}</span>
          <span>NPR {price[1]}</span>
        </div>
      </div>

      <hr className='mb-4' />

      {/* Color Filter */}
      <Accordion open={openAccordion === 2}>
        <AccordionHeader onClick={() => toggleAccordion(2)}>
          <div className='flex justify-between w-full items-center'>
            <Typography variant='paragraph' className='text-black'>
              Color
            </Typography>
            {openAccordion === 2 ? <FiMinus /> : <FiPlus />}
          </div>
        </AccordionHeader>
        <AccordionBody className='text-sm text-gray-700'>
          <div className='grid grid-cols-6 gap-y-4 px-1'>
            {COLORS.map((color, index) => (
              <Tooltip key={index} content={color} placement='top'>
                <div
                  className={`w-6 h-6 rounded-full border cursor-pointer ${
                    selectedColors.includes(color) ? 'ring-2 ring-black' : ''
                  }`}
                  title={color}
                  onClick={() => handleColorToggle(color)}
                  style={{ backgroundColor: color.toLowerCase() }}></div>
              </Tooltip>
            ))}
          </div>

          <hr className='my-4' />
        </AccordionBody>
      </Accordion>

      {/* Size Filter */}
      <Accordion open={openAccordion === 3}>
        <AccordionHeader onClick={() => toggleAccordion(3)}>
          <div className='flex justify-between w-full items-center'>
            <Typography variant='paragraph' className='text-black'>
              Size
            </Typography>
            {openAccordion === 3 ? <FiMinus /> : <FiPlus />}
          </div>
        </AccordionHeader>
        <AccordionBody className='text-sm text-gray-700'>
          <div className='flex flex-col gap-2'>
            {SIZES.map((size, index) => (
              <label key={index} className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={selectedSizes.includes(size)}
                  onChange={() => handleSizeToggle(size)}
                />
                <span>{size}</span>
              </label>
            ))}
          </div>
        </AccordionBody>
      </Accordion>

      {/* Clear Filter Button */}
      <div className='mt-6'>
        <Button
          size='sm'
          color='gray'
          variant='outlined'
          className='w-full'
          onClick={handleClearFilters}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterSidebar;

