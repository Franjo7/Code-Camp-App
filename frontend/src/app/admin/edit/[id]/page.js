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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userDataToUpdate = {
        firstName: user.firstName,
        lastName: user.lastName,
        tel: user.tel,
        email: user.email,
        role: user.role
      };
  
      await axios.put(process.env.NEXT_PUBLIC_URL_USER + `user/update/${id}`, userDataToUpdate);
      alert('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };  

  return (
    <section className='mt-10'>
      <h1 className='text-center text-white text-4xl font-bold'>Update User</h1>
      <form className='flex flex-col gap-2 max-w-md mx-auto mt-5' onSubmit={handleSubmit}>
        <input type='text' name='firstName' placeholder='First Name' className='input' value={user.firstName || ''} onChange={handleInputChange} />
        <input type='text' name='lastName' placeholder='Last Name' className='input' value={user.lastName || ''} onChange={handleInputChange} />
        <input type='text' name='tel' placeholder='Tel' className='input' value={user.tel || ''} onChange={handleInputChange} />
        <input type='email' name='email' placeholder='Email' className='input' value={user.email || ''} onChange={handleInputChange} />
        <select name='role' className='input' value={user.role || ''  } onChange={handleInputChange}>
          <option value=''>Select Role</option>
          <option value='admin'>Admin</option>
          <option value='user'>User</option>
        </select>
        <button type='submit' className='button rounded-md p-3 enabled-button'>Update</button>
      </form>
    </section>
  );
}