import React from 'react';
import { Gem } from 'lucide-react';
import { Link } from 'react-router';

const Logo = ({ whiteText }) => {
  return (
    <div>
      <Link to='/'>
        <div
          className={`
      flex items-center gap-2 font-bold text-xl ${
        whiteText ? 'text-white' : 'text-gray-900'
      }`}>
          <Gem className='w-7 h-7 text-rose-500' />
          <span className='font-serif tracking-wide'>
            Luxe <span className='text-rose-500'>&</span> Loom
          </span>
        </div>
      </Link>
    </div>
  );
};

export default Logo;

