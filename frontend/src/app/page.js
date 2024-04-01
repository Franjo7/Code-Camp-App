"use client"
import React from 'react';
import { FaHome, FaUser } from 'react-icons/fa';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="container">
      <div className="max-w-6xl mx-auto">
        <h1 className="main-title">Welcome to Code Camp</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col justify-center items-center bg-secondary p-8 rounded-lg">
            <FaHome className="text-5xl text-blue-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-4 text-white">About Us</h2>
            <p className="text-lg text-gray-300">
              We are a company  that offers coding workshops for beginners and advanced developers. Our workshops are designed to help you learn how to code and become a professional developer.
            </p>
          </div>
          <div className="flex flex-col justify-center items-center bg-gray-800 p-8 rounded-lg">
            <FaUser className="text-5xl text-blue-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-4 text-white">Register Now</h2>
            <p className="text-lg text-gray-300">
              If you already know that you want to join our Code Camp, you can register right away. Just click on the <Link href="/register" className="underline text-white">Register</Link> link and fill out the form. We are looking forward to welcoming you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
