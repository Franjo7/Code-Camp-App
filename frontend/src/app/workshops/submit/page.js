"use client"
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const FileUploadPage = () => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [workshopId, setWorkshopId] = useState(null);
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    mode: 'onChange',
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('workshopId');
    const token = localStorage.getItem('user._id');
    const headers = { Authorization: `Bearer ${token}` };
    setToken(headers);
    setWorkshopId(id);
  }, []);

  const handleFileUpload = async (data) => {
    const formData = new FormData();
    formData.append('file', data.file[0]);
    formData.append('workshopId', workshopId);

    axios.post(process.env.NEXT_PUBLIC_URL_USER + `test/createTest`, formData, { headers: token })
      .then(() => {
        toast.success('File uploaded successfully!');
        router.push('/');
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || 'File upload failed, please try again.');
      });
  }

  return (
    <section className='container'>
      <h1 className='main-title'>Upload Your Zip File</h1>
        <form className='form-container' autoComplete='off' onSubmit={handleSubmit(handleFileUpload)}>
          <input type='file' className='input' {...register('file', {
            required: true,
            validate: {
              isZip: (value) => {
                const fileName = value[0]?.name;
                const ext = fileName.substring(fileName.lastIndexOf('.') + 1);
                return ext.toLowerCase() === 'zip';
              }
            }
          })} accept='.zip' />
          <p className='error-message'>{errors.file && errors.file.type === "required" && 'File is required.'}</p>
          <p className='error-message'>{errors.file && errors.file.type === "isZip" && 'File must be a zip.'}</p>
          <button type='submit' className={`button ${!isValid ? 'disabled-button' : 'enabled-button'}`} disabled={!isValid}>Submit</button>
        </form>
    </section>
  );
};

export default FileUploadPage;