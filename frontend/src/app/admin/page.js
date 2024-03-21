"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

export default function Home() {
  const [data, setData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + `user/`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
    getUsers();
  }, []);

  async function deleteUser(id) {
    try {
      await axios.delete(process.env.NEXT_PUBLIC_URL_USER + `user/delete/${id}`); 
      setData(prevData => prevData.filter(user => user._id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  async function updateUser(id) {
    try {
      await axios.put(process.env.NEXT_PUBLIC_BASE_URL + `user/update/${id}`);
      setAlertMessage('User updated successfully');
      setShowAlert(true);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  return (
    <div className="container">
      {showAlert && (
        <div className="alert" onClick={() => setShowAlert(false)}>
          {alertMessage}
        </div>
      )}
      <table>
        <caption>Users</caption>
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
                  <Link to={`/admin/edit/${user._id}`}>
                    <button className="btn btn-update" ><FaEdit /></button>
                  </Link>
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
