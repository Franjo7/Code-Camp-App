"use client";
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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
    .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, 'Invalid email address'),
  role: yup
    .string()
    .required('Role is required')
    .oneOf(['admin', 'user', 'professor'], 'Role not selected'),
});

export default function EditUser() {
  const { register, handleSubmit, formState: { errors, isValid }, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      async function getUser() {
        try {
          const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + `user/getUser/${id}`);
          setValue('firstName', response.data.firstName);
          setValue('lastName', response.data.lastName);
          setValue('tel', response.data.tel);
          setValue('email', response.data.email);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
      getUser();
    }
  }, [id, setValue]);

  const isButtonEnabled = () => {
    return isValid && !Object.keys(errors).length;
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('user._id');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(process.env.NEXT_PUBLIC_URL_USER + `admin/update/${id}`, data, { headers });
      toast.success('User updated successfully!');
      router.push('/admin');
    } catch (error) {
      toast.error('Error while updating profile. Please try again.');
    }
  };

  return (
    <section className='container'>
      <h1 className='main-title'>Update User</h1>
      <form className='form-container' onSubmit={handleSubmit(onSubmit)}>
        <input type='text' placeholder='First Name' className='input' {...register('firstName')} />
        <p className='error-message'>{errors.firstName?.message}</p>
        <input type='text' placeholder='Last Name' className='input' {...register('lastName')} />
        <p className='error-message'>{errors.lastName?.message}</p>
        <input type='text' placeholder='Phone Number' className='input' {...register('tel')} />
        <p className='error-message'>{errors.tel?.message}</p>
        <input type='email' placeholder='Email' className='input' {...register('email')} />
        <p className='error-message'>{errors.email?.message}</p>
        <select name='role' className='input' {...register('role')} >
          <option value=''>Select Role</option>
          <option value='admin'>Admin</option>
          <option value='user'>User</option>
          <option value='professor'>Professor</option>
        </select>
        <p className='error-message'>{errors.role?.message}</p>
        <button type='submit' className={`button ${!isButtonEnabled() ? 'disabled-button' : 'enabled-button'}`} disabled={!isButtonEnabled()}>
          Update
        </button>
      </form>
    </section>
  );
}