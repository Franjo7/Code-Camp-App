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
        } 
        catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                const errorMessage = error.response.data.error.message;
                const errorCode = error.response.data.error.code;
                toast.error(`Error code: ${errorCode}, Message: ${errorMessage}`);
            } else {
                console.error('An error occurred:', error);
            }
        }
    }

    async function toggleVisibility(id, currentVisibility) {
      try {
          const token = localStorage.getItem('user._id');
          const headers = { Authorization: `Bearer ${token}` };
          const updatedVisibility = !currentVisibility;
          await axios.put(
              process.env.NEXT_PUBLIC_URL_USER + `workshop/visibility/${id}`,
              { Visibility: updatedVisibility },
              { headers }
          );
  
          const updatedWorkshops = data.map(item => 
              item._id === id ? { ...item, Visibility: updatedVisibility } : item
          );
          setData(updatedWorkshops);
          updatedVisibility ? toast.success('Workshop is now visible!') : toast.success('Workshop is now hidden!');
      } 
      catch (error) {
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
            <div className="flex justify-between items-center">
              <h1 className="main-title flex-grow text-right">Workshops</h1>
              <button className="btn btn-create" onClick={() => router.push('/workshops/create')}>
                <FaPlus />
              </button>
            </div>
            <table className="w-full table-fixed text-center">
              <thead>
                <tr>
                  <th className="w-1/7 py-2 break-all">Name</th>
                  <th className="w-1/7 py-2 break-all">Description</th>
                  <th className="w-1/7 py-2 break-all">Start Date</th>
                  <th className="w-1/7 py-2 break-all">End Date</th>
                  <th className="w-1/7 py-2 break-all">Professor</th>
                  <th className="w-1/7 py-2 break-all">Visibility</th>
                  <th className="w-1/7 py-2 break-all">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map(workshop => (
                  <tr key={workshop._id}>
                    <td className="w-1/7 py-2 break-all">{workshop.name}</td>
                    <td className="w-1/7 py-2 break-all">{workshop.description}</td>
                    <td className="w-1/7 py-2 break-all">{workshop.StartDate}</td>
                    <td className="w-1/7 py-2 break-all">{workshop.EndDate}</td>
                    <td className="w-1/7 py-2 break-all">{workshop.professor}</td>
                    <td className="w-1/7 py-2 break-all">
                    <button 
                      className={`btn ${workshop.Visibility ? 'btn-active' : 'btn-inactive'}`}
                      onClick={() => {
                          if (window.confirm(`Are you sure you want to change visibility of ${workshop.name}?`)) {
                              toggleVisibility(workshop._id, workshop.Visibility);
                          }
                      }}
                    >
                      {workshop.Visibility ? 'Visible' : 'Hidden'}
                  </button>

                    </td>
                    <td className="w-1/7 py-2">
                      <Router>
                        <button className="btn btn-update" onClick={() => redirectToUpdate(workshop._id)}>
                          <FaEdit />
                        </button>
                        <button className="btn btn-delete" onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${workshop.name}?`)) {
                            deleteWorkshop(workshop._id);
                          }
                        }}>
                          <FaTrash />
                        </button>
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