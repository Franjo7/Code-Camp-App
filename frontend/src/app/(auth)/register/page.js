"use client"
import React, { useState, useEffect } from 'react';

const page = () => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [tel, setTel] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({}); 
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [firstName, lastName, tel, email, password, confirmPassword]);

  const validateForm = () => {
    let errors = {};

    if(!firstName) {
      errors.firstName = 'First Name is required';
    }
    else if (!/^[A-Za-z]+$/.test(firstName)) {
      errors.firstName = 'First Name must contain only letters';
    }

    if(!lastName) {
      errors.lastName = 'Last Name is required';
    }
    else if (!/^[A-Za-z]+$/.test(lastName)) {
      errors.lastName = 'Last Name must contain only letters';
    }

    if(!tel) {
      errors.tel = 'Phone Number is required';
    }
    else if (!/^\+[0-9]{3} [0-9]{2} [0-9]{3}-[0-9]{3}$/.test(tel)) {
      errors.tel = 'Phone Number must be in the format +387 63 XXX-XXX';
    }

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

    if(!confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
    }
    else if (confirmPassword.length < 8) {
      errors.confirmPassword = 'Password must be at least 8 characters long';
    }
    else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      <h1 className='text-center text-white text-4xl'>Register</h1>
      <form className='flex flex-col gap-2 max-w-md mx-auto mt-5' autoComplete='off' onSubmit={handleSubmit}>
        <input type='text' value={firstName} placeholder='Your First Name' className='bg-white rounded-md p-3' onChange={(e) => setFirstName(e.target.value)} />
        {errors.firstName && <p className="error-message">{errors.firstName}</p>}
        <input type='text' value={lastName} placeholder='Your Last Name' className='bg-white rounded-md p-3' onChange={(e) => setLastName(e.target.value)} required />
        {errors.lastName && <p className="error-message">{errors.lastName}</p>}
        <input type='tel' value={tel} placeholder='Your Phone Number' className='bg-white rounded-md p-3' onChange={(e) => setTel(e.target.value)} required />
        {errors.tel && <p className="error-message">{errors.tel}</p>}
        <input type='email' value={email} placeholder='Your Email' className='bg-white rounded-md p-3' onChange={(e) => setEmail(e.target.value)} required />
        {errors.email && <p className="error-message">{errors.email}</p>}
        <input type='password' value={password} placeholder='Your Password' className='bg-white rounded-md p-3' onChange={(e) => setPassword(e.target.value)} required />
        {errors.password && <p className="error-message">{errors.password}</p>}
        <input type='password' value={confirmPassword} placeholder='Confirm Your Password' className='bg-white rounded-md p-3' onChange={(e) => setConfirmPassword(e.target.value)} required />
        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
        <button className={`bg-primary text-white rounded-md p-3 ${!isFormValid && 'opacity-50 cursor-not-allowed'}`} disabled={!isFormValid} 
        type="submit">Register</button>

      </form>
      <p className='text-center text-white mt-4'>
        Already have an account? <a href='/login' className='underline'>Login</a>
      </p>
    </section>
  )
}

export default page
