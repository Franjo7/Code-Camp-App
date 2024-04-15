"use client"
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function WorkshopEdit() {
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const [workshop, setWorkshop] = useState({});
  const router = useRouter();
  const [professors, setProfessors] = useState([]);

  useEffect(() => { 
    async function getProfessors() {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + 'user/getProfessors');
        console.log('Professors:', response.data);
        setProfessors(response.data);
      } catch (error) {
        console.error('Error fetching professors:', error);
      }
    }
    getProfessors();
  }
  , []);

  useEffect(() => {
    async function getWorkshop() {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + `workshop/${id}`);
        setWorkshop(response.data);
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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const workshopDataToUpdate = {
        name: workshop.name,
        description: workshop.description,
        date: workshop.date,
        professor: workshop.professor
      };
      const token = localStorage.getItem('user._id');
      const headers = {Authorization: `Bearer ${token}`};

      await axios.put(process.env.NEXT_PUBLIC_URL_USER + `workshop/update/${id}`, workshopDataToUpdate, {headers});
      toast.success('Workshop updated successfully');
      router.push('/workshops');
    } 
    catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error.message;
        const errorCode = error.response.data.error.code;
        console.error(`Error code: ${errorCode}, Message: ${errorMessage}`);
      } else {
        console.error('An error occurred:', error);
      }
    }
  }  

  return (
    <section className='container'>
      <h1 className='main-title'>Update Workshop</h1>
      <form className='flex flex-col gap-2 max-w-md mx-auto mt-5' onSubmit={handleSubmit}>
        <input type='text' name='name' placeholder='Name' className='input' value={workshop.name || ''} onChange={handleInputChange} />
        <input type='text' n  ame='description' placeholder='Description' className='input' value={workshop.description || ''} onChange={handleInputChange} />
        <input type='date' name='date' placeholder='Date' className='input' value={workshop.date || ''} onChange={handleInputChange} />
        <select name='professor' className='input' value={workshop.professor || ''} onChange={handleInputChange}>
          <option value=''>Select Professor</option>
          {professors.map((professor) => (
            <option key={professor._id} value={professor._id}>{professor.firstName} {professor.lastName}</option>
          ))}
          </select>
        <button type='submit' className='button rounded-md p-3 enabled-button'>Update</button>
      </form>
    </section>
  );
}