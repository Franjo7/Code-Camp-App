"use client";
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
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
  StartDate: yup
    .date()
    .required('Start Date is required')
    .min(new Date(), 'Invalid Start Date'),
  EndDate: yup
    .date()
    .required('End Date is required')
    .min(yup.ref('StartDate'), 'Invalid End Date'),
  professor: yup
    .string()
    .required('Professor not selected'),
});

export default function WorkshopEdit() {
  const { register, handleSubmit, formState: { errors, isValid }, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const pathname = usePathname();
  const id = pathname.split('/').pop();
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

  useEffect(() => {
    if (id) {
      async function getWorkshop() {
        try {
          const token = localStorage.getItem('user._id');
          const headers = { Authorization: `Bearer ${token}` };
          const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + `workshop/${id}`, { headers });
          setValue('name', response.data.name);
          setValue('description', response.data.description);
          setValue('StartDate', response.data.StartDate);
          setValue('EndDate', response.data.EndDate);
        } catch (error) {
          console.error('Error fetching workshop:', error);
        }
      }
      getWorkshop();
    }
  }, [id, setValue]);  

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('user._id');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(process.env.NEXT_PUBLIC_URL_USER + `workshop/update/${id}`, data, { headers });
      toast.success('Workshop updated successfully!');
      router.push('/workshops');
    } catch (error) {
      toast.error('Error while updating workshop. Please try again.');
    }
  };

  const isButtonEnabled = () => {
    return isValid && !Object.keys(errors).length;
  };

  return (
    <section className='container'>
      <h1 className='main-title'>Update Workshop</h1>
      <form className='form-container' onSubmit={handleSubmit(onSubmit)}>
        <input type='text' placeholder='Name' className='input' {...register('name')} />
        <p className='error-message'>{errors.name?.message}</p>
        <textarea placeholder='Description' className='input min-h-32' {...register('description')} />
        <p className='error-message'>{errors.description?.message}</p>
        <input type='date' className='input' {...register('StartDate')} />
        <p className='error-message'>{errors.StartDate?.message}</p>
        <input type='date' className='input' {...register('EndDate')} />
        <p className='error-message'>{errors.EndDate?.message}</p>
        <select name='professor' className='input' {...register('professor')} >
          <option value=''>Select Professor</option>
          {professors.map((professor) => (
            <option key={professor._id} value={professor._id}>
              {professor.firstName} {professor.lastName}
            </option>
          ))}
        </select>
        <p className='error-message'>{errors.professor?.message}</p>
        <button type='submit' className={`button ${!isButtonEnabled() ? 'disabled-button' : 'enabled-button'}`} disabled={!isButtonEnabled()} >
          Update
        </button>
      </form>
    </section>
  );
}