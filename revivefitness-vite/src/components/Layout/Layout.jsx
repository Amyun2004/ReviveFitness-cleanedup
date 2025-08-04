import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import EmptySpace from '../Navbar/EmptySpace'
export default function Layout() {
  return (
    <>
      <EmptySpace/>
      <Navbar />
      <main style={{ flex: 1 }}>   {/* optional flex if you’re using a flex body */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
