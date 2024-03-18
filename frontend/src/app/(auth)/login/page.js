"use client"
import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

const schema = yup.object().shape({
  email: yup.string().required('Email is required').email('Email must be a valid email address'),
  password: yup.string().required('Password is required')
})

const page = () => {

  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: yupResolver(schema)
  })

  const formSubmit = (data) => {
    console.log(data)
  }

  return (
    <section className='mt-4'>
      <h1 className='text-center text-white text-4xl'>Login</h1>
      <form className='flex flex-col gap-2 max-w-md mx-auto mt-5' autoComplete='off' onSubmit={handleSubmit(formSubmit)}>
        <input type='email' name='email' placeholder='Your Email' className='input' {...register('email')} />
        <p className='error-message'>{errors.email?.message}</p>
        <input type='password' name='password' placeholder='Your Password' className='input' {...register('password')} />
        <p className='error-message'>{errors.password?.message}</p>
        <button type='submit' className='bg-blue-500 text-white rounded-md p-3'>Login</button>
      </form>
      <p className='text-center text-white mt-4'>
        Don't have an account? <a href='/register' className='underline'>Register</a>
      </p>
    </section>
  )
}

export default page