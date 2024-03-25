"use client"
import React, { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const schema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Email must be a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long'),
});

const page = () => {
  const { register, handleSubmit, formState: { errors, isDirty, dirtyFields, isValid }, trigger } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  useEffect(() => {
    trigger();
  }, [trigger]);

  const router = useRouter();

  const formSubmit = (data, e) => {
    e.preventDefault();
    axios.post(process.env.NEXT_PUBLIC_URL_USER + 'user/login', data)
      .then((response) => {
        router.push('/');
      })
      .catch((error) => {
        alert('Invalid email or password');
      });
  };

  return (
    <section className='mt-10'>
      <h1 className='text-center text-white text-4xl'>Login</h1>
      <form className='flex flex-col gap-2 max-w-md mx-auto mt-5' autoComplete='off' onSubmit={handleSubmit(formSubmit)}>
        <input type='email' placeholder='Your Email' className='input' {...register('email')} />
        <p className='error-message'>{dirtyFields.email && errors.email?.message}</p>
        <input type='password' placeholder='Your Password' className='input' {...register('password')} />
        <p className='error-message'>{dirtyFields.password && errors.password?.message}</p>
        <a href='/forgot-password' className='text-white text-right'>Forgot Password?</a>
        <button type='submit' className={`button rounded-md p-3 ${!isValid ? 'disabled-button' : 'enabled-button'}`} 
        disabled={!isValid}>Login</button>
      </form>
      <p className='text-center text-white mt-4'>
        Don't have an account? <a href='/register' className='underline'>Register</a>
      </p>
    </section>
  );
};

export default page;