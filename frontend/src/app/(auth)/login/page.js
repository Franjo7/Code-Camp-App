import React from 'react'

const page = () => {
  return (
    <section className='mt-8'>
      <h1 className='text-center text-white text-4xl'>Login</h1>
      <form className='flex flex-col gap-6 max-w-md mx-auto mt-8'>
        <input type='email' placeholder='Your Email' className='bg-white rounded-md p-3' required />
        <input type='password' placeholder='Your Password' className='bg-white rounded-md p-3' required />
        <a href='/forgot-password' className='text-white text-left px-1'>Forgot Password?</a>
        <button className='bg-primary text-white rounded-md p-4'>Login</button>
      </form>
      <p className='text-center text-white mt-4'>
        Don't have an account? <a href='/register' className='underline'>Register</a>
      </p>
    </section>
  )
}

export default page