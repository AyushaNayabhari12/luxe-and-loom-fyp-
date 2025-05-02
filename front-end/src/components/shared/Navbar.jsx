import { ShoppingBag } from 'lucide-react';
import React from 'react';
import Logo from './Logo';
import UserProfileDown from './UserProfileDown';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { Link } from 'react-router';
import { useFetchCart } from '../../hooks/useFetchOrder';

const Navbar = ({ bgTransparent }) => {
  const { data } = useFetchCart();
  return (
    <nav
      className={`relative z-10 flex items-center justify-between px-6 py-4 lg:px-12  text-white ${
        bgTransparent ? 'bg-transparent' : 'bg-gray-900'
      }`}>
      <Logo whiteText />

      <div className='flex gap-x-16'>
        <div className='flex items-center space-x-8'>
          <Link to='/'>Home</Link>

          <Link to='/shop'>Shop</Link>

          <Link to='/customize'>Customize</Link>

          <Link to='/shop/orders'>Orders</Link>

          <Link to='/about'>About Us</Link>
        </div>

        <div className='flex items-center gap-x-4'>
          <div className='relative w-fit cursor-pointer'>
            <Link to='/shop/cart'>
              <div className='relative'>
                <div className='w-[20px] h-[20px] bg-red-500 absolute text-sm flex justify-center items-center rounded-full -right-1 -top-3'>
                  {data?.orderItems?.length || 0}
                </div>

                <HiOutlineShoppingCart className='w-7 h-7 text-white' />
              </div>
            </Link>
          </div>
          <UserProfileDown />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

