"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaHome, FaQuestionCircle, FaSignInAlt, FaBars, FaTimes, FaUserCircle, FaUserLock, FaChalkboardTeacher, FaPaperPlane, FaBook, FaChevronDown } from 'react-icons/fa';
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
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
      setId(null);
    }
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
    <header className="flex items-center justify-between p-5 relative">

      {/* Logo */}
      <img src="./logo.svg" alt="logo" className="w-32 md:w-48" />

      {/* Desktop Navigation */}
      <nav className="hidden md:flex text-lg items-center gap-10 text-white">
        <Link href='/' className={`flex items-center link ${pathname === '/' ? 'active' : ''}`} onClick={closeMenu}>
          <FaHome className="mr-1" /> <span className="ml-1">Home</span>
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
          <>
            <Link href='/workshops' className={`flex items-center link ${pathname === '/workshops' ? 'active' : ''}`} onClick={closeMenu}>
              <FaChalkboardTeacher className="mr-1" /> <span className="ml-1">Workshops</span>
            </Link>
            <Link href='/applications' className={`flex items-center link ${pathname === '/applications' ? 'active' : ''}`} onClick={closeMenu}>
              <FaPaperPlane className="mr-1" /> <span className="ml-1">Applications</span>
            </Link>
            <Link href='/tests' className={`flex items-center link ${pathname === '/tests' ? 'active' : ''}`} onClick={closeMenu}>
              <FaBook className="mr-1" /> <span className="ml-1">Tests</span>
            </Link>
          </>
        )}

        {/* User Profile Dropdown */}
        {cookies.token ? (
          <div className="relative items-center">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center bg-secondary px-4 py-2 hover:bg-gray-600 cursor-pointer">
              <FaUserCircle className="mr-1" />
              <span className="ml-1">{firstName}</span>
              <FaChevronDown className="ml-2" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 w-40 mt-2 bg-secondary text-white shadow-lg border border-gray-300">
                <div className="p-2 hover:underline">
                  <Link href={`/user/edit/${id}`} onClick={() => setDropdownOpen(false)}>
                    Your Profile
                  </Link>
                </div>
                <div className="p-2 hover:underline">
                  <Link href={`/workshops/${id}`} onClick={() => setDropdownOpen(false)}>
                    Your Workshops
                  </Link>
                </div>
                <div className="p-2 hover:underline cursor-pointer" onClick={() => { setDropdownOpen(false); handleLogout()}}>
                  Logout
                </div>
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

      {/* Mobile Navigation Toggle */}
      <div className='md:hidden'>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes className="text-white text-2xl" /> : <FaBars className="text-white text-2xl" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 p-10 bg-secondary text-white z-50">
          <button onClick={closeMenu} className="absolute top-5 right-5 text-white text-2xl">
            <FaTimes />
          </button>
          <div className="flex flex-col items-center h-1/2">
            <Link href='/' className='block p-3' onClick={closeMenu}>
              <div className="flex items-center">
                <FaHome className="mr-1" />
                <span>Home</span>
              </div>
            </Link>
            <Link href='/faq' className='block p-3' onClick={closeMenu}>
              <div className="flex items-center">
                <FaQuestionCircle className="mr-1" />
                <span>FAQ</span>
              </div>
            </Link>
            {role?.includes('admin') && (
            <Link href='/admin' className='block p-3' onClick={closeMenu}>
              <div className="flex items-center">
                <FaUserLock className="mr-1" />
                <span>Admin</span>
              </div>
            </Link>
            )}
            {role?.includes('professor') && (
            <>
              <Link href='/workshops' className='block p-3' onClick={closeMenu}>
                <div className="flex items-center">
                  <FaChalkboardTeacher className="mr-1" />
                  <span>Workshops</span>
                </div>
              </Link>
              <Link href='/applications' className='block p-3' onClick={closeMenu}>
                <div className="flex items-center">
                  <FaPaperPlane className="mr-1" />
                  <span>Applications</span>
                </div>
              </Link>
              <Link href='/tests' className='block p-3' onClick={closeMenu}>
                <div className="flex items-center">
                  <FaBook className="mr-1" />
                  <span>Tests</span>
                </div>
              </Link>
            </>
            )}
            {cookies.token ? (
              <div className="flex flex-col items-center block p-3" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="flex items-center">
                  <FaUserCircle className="mr-1" />
                  <span>{firstName}</span>
                  <FaChevronDown className="ml-2" />
                </div>
                {dropdownOpen && (
                  <div className="flex flex-col items-center p-3">
                    <div className="block p-3 underline underline-offset-4">
                      <Link href={`/user/edit/${id}`} onClick={closeMenu}>Your Profile</Link>
                    </div>
                    <div className='block p-3 underline underline-offset-4'>
                      <Link href={`/workshops/${id}`} onClick={closeMenu}>Your Workshops</Link>
                    </div>
                    <div className='block p-3 underline underline-offset-4' onClick={handleLogout}>Logout</div>
                  </div>
                )}
              </div>
            ) : (
              <Link href='/login' className='block p-3' onClick={closeMenu}>
                <div className="flex items-center">
                  <FaSignInAlt className="mr-1" />
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