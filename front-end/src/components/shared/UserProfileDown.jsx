import {
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from '@material-tailwind/react';
import React from 'react';
import useAuthContext from '../../hooks/useAuthContext';
import { formatImageUrl } from '../../utils';

import { CiLogout, CiSettings } from 'react-icons/ci';
import { SlLock } from 'react-icons/sl';
import { Link } from 'react-router';
import { MdDashboard } from 'react-icons/md';

const UserProfileDown = () => {
  const { currentUser, logOut } = useAuthContext();

  if (!currentUser)
    return (
      <div>
        <Link to='/sign-in'>
          <Button>Sign In</Button>
        </Link>
      </div>
    );

  return (
    <>
      <Menu>
        <MenuHandler>
          <div className='w-8 h-8 rounded-full overflow-hidden cursor-pointer'>
            <img
              src={formatImageUrl(currentUser?.profileImage)}
              alt='User'
              className='w-full h-full cursor-pointer rounded-full object-cover'
            />
          </div>
        </MenuHandler>
        <MenuList>
          {currentUser.role === 'admin' && (
            <MenuItem>
              <Link to='/dashboard'>
                <div className='flex items-center space-x-5'>
                  <MdDashboard size='25px' />
                  <p>Dashboard</p>
                </div>
              </Link>
            </MenuItem>
          )}

          <MenuItem>
            <Link to='/my-profile'>
              <div className='flex items-center space-x-5'>
                <CiSettings size='25px' />
                <p>Manage Account</p>
              </div>
            </Link>
          </MenuItem>

          <MenuItem>
            <Link to='/change-password'>
              <div className='flex items-center space-x-5'>
                <SlLock size='20px' />
                <p>Change Password</p>
              </div>
            </Link>
          </MenuItem>

          <MenuItem>
            <div className='flex items-center space-x-5' onClick={logOut}>
              <CiLogout size='20px' />
              <p>Sign out</p>
            </div>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export default UserProfileDown;

