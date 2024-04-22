"use client"
import React, { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const schema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Email must be a valid email address'),
});

const ForgotPasswordPage = () => {
  const { register, handleSubmit, reset, formState: { errors, dirtyFields, isValid }, trigger } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  useEffect(() => {
    trigger();
  }, [trigger]);

  const formSubmit = async (data) => {
    axios.post(process.env.NEXT_PUBLIC_URL_USER + `user/forgotPassword`, data)
      .then(() => { 
        toast.success('Email sent successfully, please check your inbox');
        reset();
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || 'Email sending failed, please try again');
      });
  }

  return (
    <section className='container'>
      <h1 className='main-title'>Reset Your Password</h1>
      <form className='flex flex-col gap-2 max-w-md mx-auto mt-5' autoComplete='off' onSubmit={handleSubmit(formSubmit)}>
        <input type='email' placeholder='Your Email' className='input' {...register('email')} />
        <p className='error-message'>{dirtyFields.email && errors.email?.message}</p>
        <button type='submit' className={`button rounded-md p-3 ${!isValid ? 'disabled-button' : 'enabled-button'}`} 
        disabled={!isValid}>Send Email</button>
      </form>
      <p className='text-center text-white mt-4'>
        Remembered your password? <Link href='/login' className='underline'>Login</Link>
      </p>
    </section>
  );
};

export default ForgotPasswordPage;
