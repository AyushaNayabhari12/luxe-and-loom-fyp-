// import { UserIcon } from '@heroicons/react/24/solid';
import { Chip } from '@material-tailwind/react';
import useAuthContext from '../../../hooks/useAuthContext';
import Logo from '../../shared/Logo';
import { useLocation } from 'react-router';
import { SIDEBAR_LINKS } from './sidebarLinks';

export default function Header() {
  const { currentUser } = useAuthContext();
  const { pathname } = useLocation();

  const currentPageTitle = SIDEBAR_LINKS.find(
    link => link.path === pathname
  )?.name;

  return (
    <div className='bg-white border-b border-gray-200  h-16 px-4 flex items-center  justify-between'>
      <div className='flex justify-between w-full'>
        <div>
          <p className='font-bold text-xl'>{currentPageTitle}</p>
        </div>

        <Chip value={currentUser?.role} color='black' />
      </div>
    </div>
  );
}

