"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaHome, FaUser, FaQuestionCircle, FaSignInAlt, FaBars, FaTimes, FaUserCircle, FaUserLock, FaChalkboardTeacher } from 'react-icons/fa';
import { useCookies } from 'react-cookie';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const [cookies, , removeCookie] = useCookies(['token']);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [role, setRole] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [id, setId] = useState(null);

  useEffect(() => {
    const token = cookies.token;
    if (token) {
      const decodedToken = jwtDecode(token);
      const id = decodedToken.user._id;
      const userRole = decodedToken.user.role;
      const userFirstName = decodedToken.user.firstName;
      setRole(userRole);
      setFirstName(userFirstName);
      setId(id);
    } 
    else {
      setRole(null);
      setFirstName('');
      setId('');
    }

    return () => {};
  }, [cookies.token]);

  const handleLogout = () => {
    removeCookie('token');
    window.localStorage.removeItem('user._id');
    toast.success('You have successfully logged out!');
    router.push('/login');
    closeMenu();
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="flex items-center justify-between px-3 py-3 md:px-10 relative z-10">
      <img src="./logo.svg" alt="logo" className="w-32 md:w-48" />
      <nav className="hidden md:flex text-lg items-center gap-10 text-white">
        <Link href='/' className={`flex items-center link ${pathname === '/' ? 'active' : ''}`} onClick={closeMenu}>
          <FaHome className="mr-1" /> <span className="ml-1">Home</span>
        </Link>
        <Link href='/about' className={`flex items-center link ${pathname === '/about' ? 'active' : ''}`} onClick={closeMenu}>
          <FaUser className="mr-1" /> <span className="ml-1">About</span>
        </Link>
        <Link href='/faq' className={`flex items-center link ${pathname === '/faq' ? 'active' : ''}`} onClick={closeMenu}>
          <FaQuestionCircle className="mr-1" /> <span className="ml-1">FAQ</span>
        </Link>
        {role?.includes('admin') && (
          <Link href='/admin' className={`flex items-center link ${pathname === '/admin' ? 'active' : ''}`} onClick={closeMenu}>
            <FaUserLock className="mr-1" /> <span className="ml-1">Admin</span>
          </Link>
        )}
        {role?.includes('professor') && (
          <Link href='/workshops' className={`flex items-center link ${pathname === '/workshops' ? 'active' : ''}`} onClick={closeMenu}>
          <FaChalkboardTeacher className="mr-1 size-5" /> <span className="ml-1">Workshops</span>
        </Link>
        )}
        {cookies.token ? (
          <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center bg-secondary px-4 py-2 hover:bg-gray-600 cursor-pointer">
              <FaUserCircle className="mr-1" />
              <span className="ml-1">{firstName}</span>
            </button>
            {isOpen && (
              <div className="absolute right-0 cursor-pointer px-3 py-3 bg-black">
                <div className="py-2 px-2 hover:underline">
                  <Link href={`/user/edit/${id}`} onClick={closeMenu}>Profile</Link>
                </div>
                <div className="py-2 px-2 hover:underline" onClick={handleLogout}>Logout</div>
              </div>
            )}
          </div>
        ) : (
          <Link href='/login' onClick={closeMenu}>
            <div className="flex items-center bg-secondary px-4 py-2 hover:bg-gray-600 cursor-pointer">
              <FaSignInAlt className="mr-1" /> <span className="ml-1">Login</span>
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
                <FaHome className="mr-1 md:mr-0 md:mb-1" />
                <span>Home</span>
              </div>
            </Link>
            <Link href='/about' className='block py-2 px-4' onClick={closeMenu}>
              <div className="flex items-center">
                <FaUser className="mr-1 md:mr-0 md:mb-1" />
                <span>About</span>
              </div>
            </Link>
            <Link href='/faq' className='block py-2 px-4' onClick={closeMenu}>
              <div className="flex items-center">
                <FaQuestionCircle className="mr-1 md:mr-0 md:mb-1" />
                <span>FAQ</span>
              </div>
            </Link>
            {role?.includes('admin') && (
            <Link href='/admin' className='block py-2 px-4' onClick={closeMenu}>
              <div className="flex items-center">
                <FaUserLock className="mr-1 md:mr-0 md:mb-1" />
                <span>Admin</span>
              </div>
            </Link>
            )}
            {role?.includes('professor') && (
            <Link href='/workshops' className='block py-2 px-4' onClick={closeMenu}>
              <div className="flex items-center">
                <FaChalkboardTeacher className="mr-1 md:mr-0 md:mb-1" />
                <span>Workshops</span>
              </div>
            </Link>
            )}
            {cookies.token ? (
              <div className="py-2 px-4 cursor-pointer relative" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center">
                  <FaUserCircle className="mr-1 md:mr-0 md:mb-1" />
                  <span>{firstName}</span>
                </div>
                {isOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-secondary text-white py-2 rounded-md shadow-lg">
                    <div className="py-2 px-4 hover:underline">
                      <Link href={`/user/edit/${id}`} onClick={closeMenu}>Profile</Link>
                    </div>
                    <div className='py-2 px-4 hover:underline' onClick={handleLogout}>Logout</div>
                  </div>
                )}
              </div>
            ) : (
              <Link href='/login' className='block py-2 px-4' onClick={closeMenu}>
                <div className="flex items-center">
                  <FaSignInAlt className="mr-1 md:mr-0 md:mb-1" />
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