"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await axios.get('http://localhost:5001/api/user/');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    getUsers();
  }, []);

  return (
    <div className="container">
      <table>
        <caption>Users</caption>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Role</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
