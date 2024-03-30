"use client"
import React, { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const page = () => {
  const { register, handleSubmit, reset, formState: { errors, isDirty, dirtyFields, isValid }, trigger, } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const router = useRouter();

  useEffect(() => {
    trigger();
  }, [trigger]);

  const formSubmit = (data, e) => {
    e.preventDefault();
    axios.post(process.env.NEXT_PUBLIC_URL_USER + `user/register`, data).then((response) => {
      router.push('/');
    }).catch((error) => {
      console.error('Error registering user:', error);
    });
    console.log(data);
  };

  return (
    <section className='container'>
      <h1 className='text-center text-white text-4xl font-bold'>Register</h1>
      <form className='flex flex-col gap-2 max-w-md mx-auto mt-5' autoComplete='off' onSubmit={handleSubmit(formSubmit)}>
        <input type='text' placeholder='Your First Name' className='input' {...register('firstName')} />
        <p className='error-message'>{dirtyFields.firstName && errors.firstName?.message}</p>
        <input type='text' placeholder='Your Last Name' className='input' {...register('lastName')} />
        <p className='error-message'>{dirtyFields.lastName && errors.lastName?.message}</p>
        <input type='tel' placeholder='Your Phone Number' className='input' {...register('tel')} />
        <p className='error-message'>{dirtyFields.tel && errors.tel?.message}</p>
        <input type='email' placeholder='Your Email' className='input' {...register('email')} />
        <p className='error-message'>{dirtyFields.email && errors.email?.message}</p>
        <input type='password' placeholder='Your Password' className='input' {...register('password')} />
        <p className='error-message'>{dirtyFields.password && errors.password?.message}</p>
        <input type='password' placeholder='Confirm Password' className='input' {...register('confirmPassword')} />
        <p className='error-message'>{dirtyFields.confirmPassword && errors.confirmPassword?.message}</p>
        <button type='submit' className={`button rounded-md p-3 ${!isValid ? 'disabled-button' : 'enabled-button'}`} 
        disabled={!isValid}>Register</button>
      </form>
      <p className='text-center text-white mt-4'>
        Already have an account? <a href='/login' className='underline'>Login</a>
      </p>
    </section>
  );
};

export default page;