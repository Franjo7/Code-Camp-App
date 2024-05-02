"use client"
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ApplicationEdit() {
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const [application, setApplication] = useState({});
  const [initialApplication, setInitialApplication] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getApplication() {
      try {
        const token = localStorage.getItem('user._id');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + `application/applicationForWorkshop/${id}`, { headers });
        setApplication(response.data);
        setInitialApplication(response.data);
      } catch (error) {
        console.error('Error fetching application:', error);
      }
    }
    if (id) {
      getApplication();
    }
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setApplication({ ...application, [name]: value });
    const isValueChanged = initialApplication[name] !== value;
    setIsDirty(isValueChanged);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const applicationDataToUpdate = {
        user: application.user,
        workshop: application.workshop,
        registrationDate: application.registrationDate,
        status: application.status,
        points: application.points,
        evaluation: application.evaluation,
        remark: application.remark
      };
      const token = localStorage.getItem('user._id');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.put(process.env.NEXT_PUBLIC_URL_USER + `application/manageApplication/${id}`, applicationDataToUpdate, { headers });
      toast.success('Application updated successfully!');
      router.push('/applications');
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('Error while updating application. Please try again.');
    }
  };

  return (
    <section className='container'>
      <h1 className='main-title'>Update Application</h1>
      <form className='form-container' onSubmit={handleSubmit}>
        <input type='text' name='user' placeholder='User' className='input' value={application.user || ''} onChange={handleInputChange} disabled />
        <input type='text' name='workshop' placeholder='Workshop' className='input' value={application.workshop || ''} onChange={handleInputChange} disabled />
        <input type='date' name='registrationDate' className='input' value={application.registrationDate || ''} onChange={handleInputChange} disabled />
        <select name='status' className='input' value={application.status || ''} onChange={handleInputChange}>
          <option value='Pending...'>Pending...</option>
          <option value='Rejected'>Rejected</option>
          <option value='Approved'>Approved</option>
        </select>
        <input type='text' name='points' placeholder='Points' className='input' value={application.points || ''} onChange={handleInputChange} />
        <input type='text' name='evaluation' placeholder='Evaluation' className='input' value={application.evaluation || ''} onChange={handleInputChange} />
        <input type='text' name='remark' placeholder='Remark' className='input' value={application.remark || ''} onChange={handleInputChange} />
        <button type='submit' className={`button ${!isDirty ? 'disabled-button' : 'enabled-button'}`} disabled={!isDirty}>Update</button>
      </form>
    </section>
  );
}