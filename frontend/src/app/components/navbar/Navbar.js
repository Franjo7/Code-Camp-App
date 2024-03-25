import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <header className="flex items-center justify-between">
        <nav className="text-white flex items-center gap-4">
          <img src="./logo.svg" alt="logo" className="mr-16 logo" href="/" />
          <Link href='/'>Home</Link>
          <Link href='/about'>About</Link>
          <Link href='/contact'>Contact</Link>
        </nav>
        <nav className='text-white text-1xl flex items-center gap-4'>
          <Link href='/login'>Login</Link>
          <Link href='/register' className="bg-primary rounded-full px-8 py-2">Register</Link>
        </nav>
    </header>
  )
}

export default Navbar