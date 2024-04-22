"use client"
import React, { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Link from 'next/link';

const schema = yup.object().shape({
  newPassword: yup
    .string()
    .required('New Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
});

const ResetPasswordPage = () => {
  const { register, handleSubmit, formState: { errors, dirtyFields, isValid }, trigger } = useForm({
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
    <section className='container'>
      <h1 className='main-title'>Reset Your Password</h1>
      <form className='flex flex-col gap-2 max-w-md mx-auto mt-5' autoComplete='off' onSubmit={handleSubmit(formSubmit)}>
        <input type='password' placeholder='New Password' className='input' {...register('newPassword')} />
        <p className='error-message'>{dirtyFields.newPassword && errors.newPassword?.message}</p>
        <input type='password' placeholder='Confirm Password' className='input' {...register('confirmPassword')} />
        <p className='error-message'>{dirtyFields.confirmPassword && errors.confirmPassword?.message}</p>
        <button type='submit' className={`button rounded-md p-3 ${!isValid ? 'disabled-button' : 'enabled-button'}`} 
        disabled={!isValid}>Reset Password</button>
      </form>
      <p className='text-center text-white mt-4'>
        Remembered your password? <Link href='/login' className='underline'>Login</Link>
      </p>
    </section>
  );
};

export default ResetPasswordPage;