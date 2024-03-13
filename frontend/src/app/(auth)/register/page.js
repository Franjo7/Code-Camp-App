import React from 'react'

const page = () => {
  return (
    <section className='mt-8'>
      <h1 className='text-center text-white text-4xl'>Register</h1>
      <form className='flex flex-col gap-4 max-w-md mx-auto mt-8'>
        <input type='text' placeholder='Your Name' className='bg-white rounded-md p-3' required />
        <input type='text' placeholder='Your Last Name' className='bg-white rounded-md p-3' required />  
        <input type='number' placeholder='Your Phone Number' className='bg-white rounded-md p-3' required />
        <input type='email' placeholder='Your Email' className='bg-white rounded-md p-3' required />
        <input type='password' placeholder='Your Password' className='bg-white rounded-md p-3' required />
        <input type='password' placeholder='Confirm Your Password' className='bg-white rounded-md p-3' required />
        <input type='file' placeholder='Upload Your CV' className='bg-white rounded-md p-3' required />
        <button className='bg-primary text-white rounded-md p-4'>Register</button>
      </form>
      <p className='text-center text-white mt-4'>
        Already have an account? <a href='/login' className='underline'>Login</a>
      </p>
    </section>
  )
}

export default page