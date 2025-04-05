import React from 'react';
import { Outlet } from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div>
      <Navbar />

      <div>
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;

