import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {

    return (
        <>
    
      <div className='flex flex-auto min-h-screen '>
        <Sidebar />
        <div className='grow'>
          <Navbar  />
          <div className='mx-0'>{children}</div>
        </div>
      </div>
    </>
  );
};

export default Layout
