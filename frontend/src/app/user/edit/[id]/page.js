"use client";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { usePathname, useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required('First Name is required')
    .matches(/^[A-Za-zčćđšžČĆĐŠŽ]+$/, 'First Name must contain only letters'),
  lastName: yup
    .string()
    .required('Last Name is required')
    .matches(/^[A-Za-zčćđšžČĆĐŠŽ]+$/, 'Last Name must contain only letters'),
  tel: yup
    .string()
    .required('Phone Number is required')
    .matches(/^\+387 63 [0-9]{3}-[0-9]{3}$/, 'Phone Number must be in the format +387 63 XXX-XXX'),
  email: yup
    .string()
    .required('Email is required')
    .email('Email must be a valid email address'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long'),
});

export default function EditProfile() {
  const { register, handleSubmit, formState: { errors, isValid, dirtyFields } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const [user, setUser] = useState({});
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split('/').pop();

  useEffect(() => {
    if (id) {
      async function getUser() {
        try {
          const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + `user/getUser/${id}`);
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
      getUser();
    }
  }, [id]);

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
      <form className='flex flex-col gap-2 max-w-md mx-auto mt-5' onSubmit={handleSubmit(onSubmit)}>
        <input type='text' name='firstName' placeholder='Your First Name' className='input' defaultValue={user.firstName || ''} {...register('firstName')} />
        <p className='error-message'>{dirtyFields.firstName && errors.firstName?.message}</p>
        <input type='text' name='lastName' placeholder='Your Last Name' className='input' defaultValue={user.lastName || ''} {...register('lastName')} />
        <p className='error-message'>{dirtyFields.lastName && errors.lastName?.message}</p>
        <input type='text' name='tel' placeholder='Your Phone Number' className='input' defaultValue={user.tel || ''} {...register('tel')} />
        <p className='error-message'>{dirtyFields.tel && errors.tel?.message}</p>
        <input type='email' name='email' placeholder='Your Email' className='input' defaultValue={user.email || ''} {...register('email')} />
        <p className='error-message'>{dirtyFields.email && errors.email?.message}</p>
        <input type='password' name='password' placeholder='Your Password' className='input' {...register('password')} />
        <p className='error-message'>{dirtyFields.password && errors.password?.message}</p>
        <button type='submit' className={`button rounded-md p-3 ${!isValid ? 'disabled-button' : 'enabled-button'}`} disabled={!isValid}>Update</button>
      </form>
    </section>
  );
}