"use client"
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function EditUser() {
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const [user, setUser] = useState({});

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + `user/getUser/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } 
    }
    if (id) {
      getUser();
    }
  }, [id]);

  return (
    <section className='mt-10'>
      <h1 className='text-center text-white text-4xl font-bold'>Update User</h1>
      <form className='flex flex-col gap-2 max-w-md mx-auto mt-5'>
      <input type='text' placeholder={user.firstName} className='input' />
      <input type='text' placeholder={user.lastName} className='input' />
      <input type='text' placeholder={user.tel} className='input' />
      <input type='email' placeholder={user.email} className='input' />
      <input type='text' placeholder={user.role} className='input' />
      <button type='submit' className='button rounded-md p-3 enabled-button'>Update</button>
      </form>
    </section>
  );
}