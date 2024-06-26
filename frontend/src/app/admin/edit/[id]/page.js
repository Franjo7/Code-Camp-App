"use client"
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function EditUser() {
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const [user, setUser] = useState({});
  const [initialUser, setInitialUser] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + `user/getUser/${id}`);
        setUser(response.data);
        setInitialUser(response.data);
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
    const isValueChanged = initialUser[name] !== value;
    setIsDirty(isValueChanged);
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
      const token = localStorage.getItem('user._id');
      const headers = {Authorization: `Bearer ${token}`};

      await axios.put(process.env.NEXT_PUBLIC_URL_USER + `admin/update/${id}`, userDataToUpdate, {headers});
      toast.success('User updated successfully!');
      router.push('/admin');
    }
    catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
          const errorMessage = error.response.data.error.message;
          const errorCode = error.response.data.error.code;
          console.error(`Error code: ${errorCode}, Message: ${errorMessage}`);
      } else {
          console.error('An error occurred:', error);
      }
    }  
  };  

  return (
    <section className='container'>
      <h1 className='main-title'>Update User</h1>
      <form className='form-container' onSubmit={handleSubmit}>
        <input type='text' name='firstName' placeholder='First Name' className='input' value={user.firstName || ''} onChange={handleInputChange} />
        <input type='text' name='lastName' placeholder='Last Name' className='input' value={user.lastName || ''} onChange={handleInputChange} />
        <input type='text' name='tel' placeholder='Tel' className='input' value={user.tel || ''} onChange={handleInputChange} />
        <input type='email' name='email' placeholder='Email' className='input' value={user.email || ''} onChange={handleInputChange} />
        <select name='role' className='input' value={user.role || ''} onChange={handleInputChange}>
          <option value='admin'>Admin</option>
          <option value='user'>User</option>
          <option value='professor'>Professor</option>
        </select>
        <button type='submit' className={`button ${!isDirty ? 'disabled-button' : 'enabled-button'}`} disabled={!isDirty}>Update</button>
      </form>
    </section>
  );
}