import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className='h-screen w-screen overflow-hidden flex flex-row'>
      {/* Sidebar */}
      <Sidebar />

      {/* Body */}
      <div className='flex flex-col flex-1'>
        {/* Header */}
        <Header />

        <div className='md:px-8 bg-gray-100 h-[100%] flex-1 min-h-0 overflow-auto'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

