"use client"
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export default function EditProfile() {
  const { register, handleSubmit, formState: { errors, isValid }, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const [initialUser, setInitialUser] = useState({});
  const router = useRouter();
  const formValues = watch();

  useEffect(() => {
    if (id) {
      async function getUser() {
        try {
          const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + `user/getUser/${id}`);
          setInitialUser(response.data);
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

  const hasChanges = () => {
    return (
      formValues.firstName !== initialUser.firstName ||
      formValues.lastName !== initialUser.lastName ||
      formValues.tel !== initialUser.tel ||
      formValues.email !== initialUser.email
    );
  };

  const isButtonEnabled = () => {
    return hasChanges() && isValid && !Object.keys(errors).length;
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
        <input type='text' placeholder='Your First Name' className='input' {...register('firstName')} />
        <p className='error-message'>{errors.firstName?.message}</p>
        <input type='text' placeholder='Your Last Name' className='input' {...register('lastName')} />
        <p className='error-message'>{errors.lastName?.message}</p>
        <input type='text' placeholder='Your Phone Number' className='input' {...register('tel')} />
        <p className='error-message'>{errors.tel?.message}</p>
        <input type='email' placeholder='Your Email' className='input'  {...register('email')} />
        <p className='error-message'>{errors.email?.message}</p>
        <input type='password' placeholder='Your Password' className='input' {...register('password')} />
        <p className='error-message'>{errors.password?.message}</p>
        <input type='password' placeholder='Confirm Password' className='input' {...register('confirmPassword')} />
        <p className='error-message'>{errors.confirmPassword?.message}</p>
        <button type='submit' className={`button ${!isButtonEnabled() ? 'disabled-button' : 'enabled-button'}`} disabled={!isButtonEnabled()}>Update</button>
      </form>
    </section>
  );
}