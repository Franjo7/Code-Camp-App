"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { BrowserRouter as Router } from 'react-router-dom';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function WorkshopsPage() {
    const [data, setData] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getWorkshops() {
            try {
                setLoading(true);
                const token = localStorage.getItem('user._id');
                const headers = {Authorization: `Bearer ${token}`};
                const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + 'workshop/', {headers});
                setData(response.data);
                setLoading(false);
            } 
            catch (error) {
                const token = localStorage.getItem('user._id');
                if (!token) {
                    router.push('/login');
                }
                else {
                    router.push('/');
                }
            }
        }
        getWorkshops();
    }
    , []);

    async function deleteWorkshop(id) {
        try {
            const token = localStorage.getItem('user._id');
            const headers = {Authorization: `Bearer ${token}`};
            await axios.delete(process.env.NEXT_PUBLIC_URL_USER + `workshop/delete/${id}`, {headers}); 
            setData(prevData => prevData.filter(workshop => workshop._id !== id));
            toast.success('Workshop deleted successfully!');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                const errorMessage = error.response.data.error.message;
                const errorCode = error.response.data.error.code;
                toast.error(`Error code: ${errorCode}, Message: ${errorMessage}`);
            } else {
                console.error('An error occurred:', error);
            }
        }
    }

    function redirectToUpdate(id) {
        router.push(`/workshops/edit/${id}`);
    }

    return (
      <div className="container">
        {showAlert && (
          <div className="alert" onClick={() => setShowAlert(false)}>
            {alertMessage}
          </div>
        )}
        {!loading && (
          <div className="overflow-x-auto">
          <div className="flex justify-end">
            <button className="btn btn-create" onClick={() => router.push('/workshops/create')}><FaPlus /></button>
          </div>
            <table className="w-full table-fixed text-center">
              <caption className='main-title'>Workshops</caption>
              <thead>
                <tr>
                  <th className="w-1/5 py-2">Name</th>
                  <th className="w-1/5 py-2">Description</th>
                  <th className="w-1/5 py-2">Date</th>
                  <th className="w-1/5 py-2">Professor</th>
                  <th className="w-1/5 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map(workshop => (
                  <tr key={workshop._id}>
                    <td className="w-1/5 py-2 break-all">{workshop.name}</td>
                    <td className="w-1/5 py-2 break-all">{workshop.description}</td>
                    <td className="w-1/5 py-2 break-all">{workshop.date}</td>
                    <td className="w-1/5 py-2 break-all">{workshop.professor}</td>
                    <td className="w-1/5 py-2">
                      <Router>
                          <button className="btn btn-update" onClick={() => redirectToUpdate(workshop._id)}><FaEdit /></button>
                          <button className="btn btn-delete" onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${workshop.name}?`)) {
                              deleteWorkshop(workshop._id);
                          }
                          }}><FaTrash /></button>
                      </Router>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
}
