import React from 'react';
import { Gem } from 'lucide-react';

const Logo = () => {
  return (
    <div className='flex items-center space-x-2 text-2xl font-bold text-gray-800'>
      <Gem className='w-7 h-7 text-rose-500' />
      <span className='font-serif tracking-wide'>
        Luxe <span className='text-rose-500'>&</span> Loom
      </span>
    </div>
  );
};

export default Logo;

