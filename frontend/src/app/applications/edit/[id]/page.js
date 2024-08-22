"use client";
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['Pending...', 'Rejected', 'Approved'], 'Invalid Status'),
  points: yup
    .number()
    .required('Points are required')
    .min(0, 'Invalid Points')
    .max(100, 'Invalid Points'),
  evaluation: yup
    .string()
    .required('Evaluation is required')
    .oneOf(['not evaluated', 'Fail', 'Pass'], 'Invalid Evaluation'),
  remark: yup
    .string()
});

export default function ApplicationEdit() {
  const { register, handleSubmit, formState: { errors, isValid }, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const router = useRouter();

  useEffect(() => {
    async function getApplication() {
      try {
        const token = localStorage.getItem('user._id');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + `application/applicationForWorkshop/${id}`, { headers });
        setValue('user', response.data.user);
        setValue('workshop', response.data.workshop);
        setValue('registrationDate', response.data.registrationDate);
        setValue('status', response.data.status);
        setValue('points', response.data.points);
        setValue('evaluation', response.data.evaluation);
        setValue('remark', response.data.remark);
      } catch (error) {
        console.error('Error fetching application:', error);
      }
    }
    if (id) {
      getApplication();
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('user._id');
      const headers = { Authorization: `Bearer ${token}` };
      const payload = { ...data, points: data.points.toString() };
      await axios.put(process.env.NEXT_PUBLIC_URL_USER + `application/manageApplication/${id}`, payload, { headers });
      toast.success('Application updated successfully!');
      router.push('/applications');
    } catch (error) {
      toast.error('Error while updating application. Please try again.');
    }
  };

  const isButtonEnabled = () => {
    return isValid && !Object.keys(errors).length;
  }

  return (
    <section className='container'>
      <h1 className='main-title'>Update Application</h1>
      <form className='form-container' onSubmit={handleSubmit(onSubmit)}>
        <input type='text' placeholder='User' className='input' {...register('user')} disabled />
        <p className='error-message'>{errors.user?.message}</p>
        <input type='text' placeholder='Workshop' className='input' {...register('workshop')} disabled />
        <p className='error-message'>{errors.workshop?.message}</p>
        <input type='date' className='input' {...register('registrationDate')} disabled />
        <p className='error-message'>{errors.registrationDate?.message}</p>
        <select className='input' {...register('status')}>
          <option value='Pending...'>Pending...</option>
          <option value='Rejected'>Rejected</option>
          <option value='Approved'>Approved</option>
        </select>
        <p className='error-message'>{errors.status?.message}</p>
        <input type='number' placeholder='Points' className='input' {...register('points')} />
        <p className='error-message'>{errors.points?.message}</p>
        <select className='input' {...register('evaluation')}>
          <option value='not evaluated'>Not Evaluated</option>
          <option value='Fail'>Fail</option>
          <option value='Pass'>Pass</option>
        </select>
        <p className='error-message'>{errors.evaluation?.message}</p>
        <input type='text' placeholder='Remark' className='input' {...register('remark')} />
        <p className='error-message'>{errors.remark?.message}</p>
        <button type='submit' className={`button ${!isButtonEnabled() ? 'disabled-button' : 'enabled-button'}`} disabled={!isButtonEnabled()} >
          Update
        </button>
      </form>
    </section>
  );
}