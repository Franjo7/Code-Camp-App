"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { FaHome, FaUser, FaQuestionCircle, FaSignInAlt, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [cookies, , removeCookie] = useCookies(['token']);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    removeCookie('token');
    window.localStorage.removeItem('user._id');
    router.push('/login');
    closeMenu();
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="flex items-center justify-between px-3 py-3 md:px-10 relative z-10 text-white">
      <img src="./logo.svg" alt="logo" className="w-32 md:w-48" />
      <nav className="hidden md:flex text-lg items-center gap-10">
        <Link href='/' className='flex items-center' onClick={closeMenu}>
          <FaHome className="mr-1" /> <span className="ml-1">Home</span>
        </Link>
        <Link href='/about' className="flex items-center" onClick={closeMenu}>
          <FaUser className="mr-1" /> <span className="ml-1">About</span>
        </Link>
        <Link href='/faq' className="flex items-center" onClick={closeMenu}>
          <FaQuestionCircle className="mr-1" /> <span className="ml-1">FAQ</span>
        </Link>
        {cookies.token ? (
          <div onClick={handleLogout} className="flex items-center bg-secondary rounded-full px-4 py-2 hover:bg-gray-600 cursor-pointer">
            <FaSignOutAlt className="mr-1 text-xl" /> <span className="ml-1">Logout</span>
          </div>
        ) : (
          <Link href='/login' onClick={closeMenu}>
            <div className="flex items-center bg-secondary rounded-full px-4 py-2 hover:bg-gray-600 cursor-pointer">
              <FaSignInAlt className="mr-1 text-xl" /> <span className="ml-1">Login</span>
            </div>
          </Link>
        )}
      </nav>
      <div className='md:hidden'>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes className="text-white text-2xl" /> : <FaBars className="text-white text-2xl" />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-16 mt-1 right-0 bg-secondary text-white overflow-y-auto">
          <div className="flex flex-col items-center">
            <Link href='/' className='block py-2 px-4' onClick={closeMenu}>
              <div className="flex items-center">
                <FaHome className="text-xl mr-1 md:mr-0 md:mb-1" />
                <span>Home</span>
              </div>
            </Link>
            <Link href='/about' className='block py-2 px-4' onClick={closeMenu}>
              <div className="flex items-center">
                <FaUser className="text-xl mr-1 md:mr-0 md:mb-1" />
                <span>About</span>
              </div>
            </Link>
            <Link href='/faq' className='block py-2 px-4' onClick={closeMenu}>
              <div className="flex items-center">
                <FaQuestionCircle className="text-xl mr-1 md:mr-0 md:mb-1" />
                <span>FAQ</span>
              </div>
            </Link>
            {cookies.token ? (
              <div onClick={handleLogout} className="block py-2 px-4 cursor-pointer">
                <div className="flex items-center" onClick={closeMenu}>
                  <FaSignOutAlt className="text-xl mr-1 md:mr-0 md:mb-1" />
                  <span>Logout</span>
                </div>
              </div>
            ) : (
              <Link href='/login' className='block py-2 px-4' onClick={closeMenu}>
                <div className="flex items-center">
                  <FaSignInAlt className="text-xl mr-1 md:mr-0 md:mb-1" />
                  <span>Login</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;