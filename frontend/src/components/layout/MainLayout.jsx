import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export const MainLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      <main className="flex-grow-1 py-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

