"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { BrowserRouter as Router } from 'react-router-dom';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [data, setData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function getUsers() {
      try {
        const token = localStorage.getItem('user._id');
        const headers = {Authorization: `Bearer ${token}`};
        const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + 'user/allUsers', {headers});
        setData(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
    getUsers();
  }, []);

  async function deleteUser(id) {
    try {
      const token = localStorage.getItem('user._id');
      const headers = {Authorization: `Bearer ${token}`};
      await axios.delete(process.env.NEXT_PUBLIC_URL_USER + `user/delete/${id}`, {headers}); 
      setData(prevData => prevData.filter(user => user._id !== id));
      toast.success('User deleted successfully');
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
    router.push(`/admin/edit/${id}`);
  }

  return (
    <div className="container">
      {showAlert && (
        <div className="alert" onClick={() => setShowAlert(false)}>
          {alertMessage}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-center">
          <caption className='main-title'>Users</caption>
          <thead>
            <tr>
              <th className="w-1/6 py-2">First Name</th>
              <th className="w-1/6 py-2">Last Name</th>
              <th className="w-1/6 py-2">Phone Number</th>
              <th className="w-1/6 py-2">Email</th>
              <th className="w-1/6 py-2">Role</th>
              <th className="w-1/6 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => (
              <tr key={index}>
                <td className="w-1/6 py-2 break-all">{user.firstName}</td>
                <td className="w-1/6 py-2 break-all">{user.lastName}</td>
                <td className="w-1/6 py-2 break-all">{user.tel}</td>
                <td className="w-1/6 py-2 break-all">{user.email}</td>
                <td className="w-1/6 py-2 break-all">{user.role}</td>
                <td className="w-1/6 py-2">
                  <Router>
                    <button className="btn btn-update" onClick={() => redirectToUpdate(user._id)}><FaEdit /></button>
                    <button className="btn btn-delete" onClick={() => {
                      if (window.confirm(`Are you sure you want to delete user ${user.firstName} ${user.lastName}?`)) {
                        deleteUser(user._id);
                      }
                    }}><FaTrash /></button>
                  </Router>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}