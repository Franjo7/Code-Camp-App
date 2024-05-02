"use client"
import React from 'react';
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
    .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, 'Invalid email address'),
});

const ForgotPasswordPage = () => {
  const { register, handleSubmit, reset, formState: { errors, dirtyFields, isValid } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const formSubmit = async (data) => {
    axios.post(process.env.NEXT_PUBLIC_URL_USER + `user/forgotPassword`, data)
      .then(() => { 
        toast.success('Email sent successfully, please check your inbox.');
        reset();
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || 'Error while sending email, please try again.');
      });
  }

  return (
    <section className='container'>
      <h1 className='main-title'>Reset Your Password</h1>
      <form className='form-container' autoComplete='off' onSubmit={handleSubmit(formSubmit)}>
        <input type='email' placeholder='Your Email' className='input' {...register('email')} />
        <p className='error-message'>{dirtyFields.email && errors.email?.message}</p>
        <button type='submit' className={`button ${!isValid ? 'disabled-button' : 'enabled-button'}`} 
        disabled={!isValid}>Submit</button>
      </form>
      <p className='text-center text-white mt-4'>
        Remembered your password? <Link href='/login' className='underline'>Login</Link>
      </p>
    </section>
  );
};

export default ForgotPasswordPage;