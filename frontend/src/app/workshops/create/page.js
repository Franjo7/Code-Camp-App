"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required'),
  description: yup
    .string()
    .required('Description is required')
    .min(200, 'Description should have at least 200 characters')
    .max(1000, 'Description should not exceed 1000 characters'),
  startDate: yup
    .date()
    .required('Start Date is required')
    .min(new Date(), 'Invalid Start Date'),
  endDate: yup
    .date()
    .required('End Date is required')
    .min(yup.ref('startDate'), 'Invalid End Date'),
  professor: yup
    .string()
    .required('Professor not selected'),
});

export default function WorkshopCreate() {
  const { register, handleSubmit, formState: { errors, isValid }} = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const [professors, setProfessors] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getProfessors() {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + 'user/getProfessors');
        setProfessors(response.data);
      } catch (error) {
        console.error('Error fetching professors:', error);
      }
    }
    getProfessors();
  }, []);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('user._id');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(process.env.NEXT_PUBLIC_URL_USER + 'workshop/create', data, { headers });
      toast.success('Workshop created successfully!');
      router.push('/workshops');
    } catch (error) {
      toast.error('Error while creating workshop. Please try again.');
    }
  };

  return (
    <section className='container'>
      <h1 className='main-title'>Create New Workshop</h1>
      <form className='form-container' onSubmit={handleSubmit(onSubmit)}>
        <input type='text' placeholder='Name' autoComplete='off' className='input' {...register('name')} />
        <p className='error-message'>{errors.name?.message}</p>
        <textarea placeholder='Description' autoComplete='off' className='input min-h-32' {...register('description')} />
        <p className='error-message'>{errors.description?.message}</p>
        <input type='date' placeholder='Start Date' autoComplete='off' className='input' {...register('startDate')} />
        <p className='error-message'>{errors.startDate?.message}</p>
        <input type='date' placeholder='End Date' autoComplete='off' className='input' {...register('endDate')} />
        <p className='error-message'>{errors.endDate?.message}</p>
        <select name='professor' className='input' {...register('professor')}>
          <option value=''>Select Professor</option>
          {professors.map((professor) => (
            <option key={professor._id} value={professor._id}>
              {professor.firstName} {professor.lastName}
            </option>
          ))}
        </select>
        <p className='error-message'>{errors.professor?.message}</p>
        <button type='submit' className={`button ${!isValid ? 'disabled-button' : 'enabled-button'}`} disabled={!isValid}>
          Create
        </button>
      </form>
    </section>
  );
}