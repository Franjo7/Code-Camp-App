import React from 'react'
import Link from 'next/link'
import { FaHome, FaUser, FaEnvelope, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 md:px-10">
      <img src="./logo.svg" alt="logo" className="w-32 md:w-48" />
      <nav className="hidden md:flex text-white text-lg items-center gap-6">
        <Link href='/'>
          <div className="flex items-center">
            <FaHome className="mr-1" /> Home
          </div>
        </Link>
        <Link href='/about'>
          <div className="flex items-center">
            <FaUser className="mr-1" /> About
          </div>
        </Link>
        <Link href='/contact'>
          <div className="flex items-center">
            <FaEnvelope className="mr-1" /> Contact
          </div>
        </Link>
      </nav>
      <div className='text-white text-lg flex items-center gap-2'>
        <Link href='/login'>
          <div className="flex items-center bg-gray-700 rounded-full px-4 py-2 hover:bg-gray-600">
            <FaSignInAlt className="mr-1 text-xl" /> Login
          </div>
        </Link>
        <Link href='/register'>
          <div className="flex items-center bg-primary rounded-full px-4 py-2 enabled-button">
            <FaUserPlus className="mr-1 text-xl" /> Register
          </div>
        </Link>
      </div>
    </header>
  )
}

export default Navbar