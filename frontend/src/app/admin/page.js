"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { BrowserRouter as Router } from 'react-router-dom';
import { useRouter } from 'next/navigation';
import cookieCutter from 'cookie-cutter';

export default function Home() {
  const [data, setData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + 'user/allUsers');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
    getUsers();
  }, []);

  async function deleteUser(id) {
    try {
      await axios.delete(process.env.NEXT_PUBLIC_URL_USER + `user/delete/${id}`, {data: { token: cookieCutter.get('token')}}); 
      setData(prevData => prevData.filter(user => user._id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
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
      <table>
        <caption className='text-center text-white text-4xl font-bold'>Users</caption>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, index) => (
            <tr key={index}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.tel}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
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
  );
}