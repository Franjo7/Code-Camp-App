"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function WorkshopCreate() {
  const [workshop, setWorkshop] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    professor: ''
  });
  const [professors, setProfessors] = useState([]);
  const router = useRouter();
  const [isDirty, setIsDirty] = useState(false);

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
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setWorkshop({ ...workshop, [name]: value });
    setIsDirty(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const workshopData = {
        name: workshop.name,
        description: workshop.description,
        startDate: workshop.startDate,
        endDate: workshop.endDate,
        professor: workshop.professor
      };
      const token = localStorage.getItem('user._id');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(process.env.NEXT_PUBLIC_URL_USER + 'workshop/create', workshopData, { headers });
      toast.success('Workshop created successfully!');
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

  const isFormValid = () => {
    return Object.values(workshop).every((value) => value.trim() !== '') && isDirty;
  };

  return (
    <section className='container'>
      <h1 className='main-title'>Create Workshop</h1>
      <form className='form-container' onSubmit={handleSubmit}>
        <input type='text' name='name' placeholder='Name' className='input' value={workshop.name} autoComplete='off' onChange={handleInputChange} />
        <input type='text' name='description' placeholder='Description' className='input' value={workshop.description} autoComplete='off' onChange={handleInputChange} />
        <input type='date' name='startDate' placeholder='Start Date' className='input' value={workshop.startDate} autoComplete='off' onChange={handleInputChange} />
        <input type='date' name='endDate' placeholder='End Date' className='input' value={workshop.endDate} autoComplete='off' onChange={handleInputChange} />
        <select name='professor' className='input' value={workshop.professor} autoComplete='off' onChange={handleInputChange}>
          <option value=''>Select Professor</option>
          {professors.map((professor) => (
            <option key={professor._id} value={professor._id}>
              {professor.firstName} {professor.lastName}
            </option>
          ))}
        </select>
        <button type='submit' className={`button ${!isFormValid() ? 'disabled-button' : 'enabled-button'}`} disabled={!isFormValid()}>Create</button>
      </form>
    </section>
  );
}