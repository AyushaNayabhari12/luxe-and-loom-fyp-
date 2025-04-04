// import { UserIcon } from '@heroicons/react/24/solid';
import { useLocation } from 'react-router';
import UserProfileDown from '../../shared/UserProfileDown';
import { SIDEBAR_LINKS } from './sidebarLinks';

export default function Header() {
  const { pathname } = useLocation();

  const currentPageTitle = SIDEBAR_LINKS.find(link => {
    if (link.path === '/dashboard') {
      return pathname === link.path;
    }

    return pathname.includes(link.path) && link.path !== '/dashboard';
  })?.name;

  return (
    <div className='bg-white border-b border-gray-200  h-16 px-4 flex items-center  justify-between'>
      <div className='flex items-center justify-between w-full'>
        <div>
          <p className='font-bold text-xl'>{currentPageTitle}</p>
        </div>

        <div>
          <UserProfileDown />
        </div>
      </div>
    </div>
  );
}

