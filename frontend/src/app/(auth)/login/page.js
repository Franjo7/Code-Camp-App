"use client"
import React, { useState, useEffect } from 'react';

const page = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [email, password]);
  
  const validateForm = () => {
    let errors = {};

    if(!email) {
      errors.email = 'Email is required';
    }
    else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is not valid';
    }

    if(!password) {
      errors.password = 'Password is required';
    }
    else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const handleSubmit = () => {
    if (isFormValid) {
      alert('Form is valid');
    }
    else {
      alert('Form is invalid');
    }
  };

  return (
    <section className='mt-4'>
      <h1 className='text-center text-white text-4xl'>Login</h1>
      <form className='flex flex-col gap-2 max-w-md mx-auto mt-5' autoComplete='off' onSubmit={handleSubmit}>
        <input type='email' value={email} placeholder='Your Email' className='bg-white rounded-md p-3' onChange={(e) => setEmail(e.target.value)} required />
        {errors.email && <p className="error-message">{errors.email}</p>}
        <input type='password' value={password} placeholder='Your Password' className='bg-white rounded-md p-3' onChange={(e) => setPassword(e.target.value)} required />
        {errors.password && <p className="error-message">{errors.password}</p>}
        <a href='/forgot-password' className='text-white text-left py-5'>Forgot Password?</a>
        <button className={`bg-primary text-white rounded-md p-3 ${!isFormValid && 'opacity-50 cursor-not-allowed'}`} disabled={!isFormValid} 
        type="submit">Login</button>

      </form>
      <p className='text-center text-white mt-4'>
        Don't have an account? <a href='/register' className='underline'>Register</a>
      </p>
    </section>
  )
}

export default page