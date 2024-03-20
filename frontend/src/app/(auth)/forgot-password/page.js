"use client"
import React, { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Email must be a valid email address'),
});

const ForgotPasswordPage = () => {
  const { register, handleSubmit, reset, formState: { errors, isDirty, dirtyFields, isValid }, trigger } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  useEffect(() => {
    trigger();
  }, [trigger]);

  const formSubmit = (data) => {
    console.log(data);
  };

  return (
    <section className='mt-10'>
      <h1 className='text-center text-white text-4xl'>Reset Your Password</h1>
      <form className='flex flex-col gap-2 max-w-md mx-auto mt-5' autoComplete='off' onSubmit={handleSubmit(formSubmit)}>
        <input type='email' placeholder='Your Email' className='input' {...register('email')} />
        <p className='error-message'>{dirtyFields.email && errors.email?.message}</p>
        <button type='submit' className={`button rounded-md p-3 ${!isValid ? 'disabled-button' : 'enabled-button'}`} 
        disabled={!isValid}>Send Email</button>
      </form>
      <p className='text-center text-white mt-4'>
        Remembered your password? <a href='/login' className='underline'>Login</a>
      </p>
    </section>
  );
};

export default ForgotPasswordPage;
