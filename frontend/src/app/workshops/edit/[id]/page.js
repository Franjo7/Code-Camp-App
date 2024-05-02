"use client"
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function WorkshopEdit() {
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const [workshop, setWorkshop] = useState({});
  const [initialWorkshop, setInitialWorkshop] = useState({});
  const [professors, setProfessors] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
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
    async function getWorkshop() {
      try {
        const token = localStorage.getItem('user._id');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + `workshop/${id}`,{ headers });
        setWorkshop(response.data);
        setInitialWorkshop(response.data);
      } catch (error) {
        console.error('Error fetching workshop:', error);
      }
    }
    if (id) {
      getWorkshop();
    }
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setWorkshop({ ...workshop, [name]: value });
    const isValueChanged = initialWorkshop[name] !== value;
    setIsDirty(isValueChanged);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const workshopDataToUpdate = {
        name: workshop.name,
        description: workshop.description,
        StartDate: workshop.StartDate,
        EndDate: workshop.EndDate,
        professor: workshop.professor
      };
      const token = localStorage.getItem('user._id');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.put(process.env.NEXT_PUBLIC_URL_USER + `workshop/update/${id}`, workshopDataToUpdate, { headers });
      toast.success('Workshop updated successfully!');
      router.push('/workshops');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error.message;
        const errorCode = error.response.data.error.code;
        console.error(`Error code: ${errorCode}, Message: ${errorMessage}`);
      } else {
        console.error('An error occurred:', error);
      }
    }
  };

  return (
    <section className='container'>
      <h1 className='main-title'>Update Workshop</h1>
      <form className='flex flex-col gap-2 max-w-md mx-auto mt-5' onSubmit={handleSubmit}>
        <input type='text' name='name' placeholder='Name' className='input' value={workshop.name || ''} onChange={handleInputChange} />
        <input type='text' name='description' placeholder='Description' className='input' value={workshop.description || ''} onChange={handleInputChange} />
        <input type='date' name='StartDate' className='input' value={workshop.StartDate || ''} onChange={handleInputChange} />
        <input type='date' name='EndDate' className='input' value={workshop.EndDate || ''} onChange={handleInputChange} />
        <select name='professor' className='input' value={workshop.professor || ''} onChange={handleInputChange}>
          <option value=''>Select Professor</option>
            {professors.map((professor) => (
              <option key={professor._id} value={professor._id}>{professor.firstName} {professor.lastName}</option>
            ))}
        </select>
        <button type='submit' className={`button ${!isDirty ? 'disabled-button' : 'enabled-button'}`} disabled={!isDirty}>Update Workshop</button>
      </form>
    </section>
  );
}