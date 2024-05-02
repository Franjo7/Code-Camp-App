"use client"
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';

export default function EditProfile() {
  const { register, handleSubmit } = useForm();
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const [user, setUser] = useState({});
  const [initialUser, setInitialUser] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      async function getUser() {
        try {
          const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + `user/getUser/${id}`);
          setUser(response.data);
          setInitialUser(response.data);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
      getUser();
    }
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
    const isValueChanged = initialUser[name] !== value;
    setIsDirty(isValueChanged);
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('user._id');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(process.env.NEXT_PUBLIC_URL_USER + `user/update/${id}`, data, { headers });
      toast.success('Profile updated successfully!');
      router.push('/');
    } catch (error) {
      toast.error('Error while updating profile. Please try again.');
    }
  };

  return (
    <section className='container'>
      <h1 className='main-title'>Update Your Profile</h1>
      <form className='form-container' onSubmit={handleSubmit(onSubmit)}>
        <input type='text' name='firstName' placeholder='Your First Name' className='input' value={user.firstName || ''} {...register('firstName')} onChange={handleInputChange} />
        <input type='text' name='lastName' placeholder='Your Last Name' className='input' value={user.lastName || ''} {...register('lastName')} onChange={handleInputChange} />
        <input type='text' name='tel' placeholder='Your Phone Number' className='input' value={user.tel || ''} {...register('tel')} onChange={handleInputChange} />
        <input type='email' name='email' placeholder='Your Email' className='input' value={user.email || ''} {...register('email')} onChange={handleInputChange} />
        <input type='password' name='password' placeholder='Your Password' className='input' {...register('password')} onChange={handleInputChange} />
        <button type='submit' className={`button ${!isDirty ? 'disabled-button' : 'enabled-button'}`} disabled={!isDirty}>Update</button>
      </form>
    </section>
  );
}