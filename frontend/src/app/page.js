"use client"
import React, { useEffect, useState } from 'react';
import { FaHome, FaUser } from 'react-icons/fa';
import Link from 'next/link';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import toast from 'react-hot-toast';
import socket from '../../utils/socket';

const HomePage = () => {
  const [cookies] = useCookies(['token']);
  const [role, setRole] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = cookies.token;
    if (token) {
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.user.role;
      setRole(userRole);
    } else {
      setRole(null);
    }
  }, [cookies.token]);


  useEffect(() => {
    async function getWorkshops() {
      try {
        const token = localStorage.getItem('user._id');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + 'workshop/availableWorkshops', { headers });
        setData(response.data);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
    getWorkshops();
  }, []);

  useEffect(() => {
    if(!socket.connected) {
    console.log('Povezivanje na Socket.io server...');
    socket.connect();
    }

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });
  
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);
  

useEffect(() => {
  const token = cookies.token;

  let userId = null;
  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.user._id;
  }

  if (userId) {
    // Osluskujemo događaje za novoprimljene prijave
    socket.on(`new-application-${userId}`, (data) => {
      // Provjera  podataka za prijavu
      if (data.workshopName && data.studentName) {
        console.log('Primljena nova prijava:', data);
        toast.success(
          `New application received for ${data.workshopName}: ${data.studentName}`
        );
      } else if (data.workshopName && data.status) {
        console.log('Primljeni podaci o rezultatu prijave:', data);
        toast.success(
          `Application result for ${data.workshopName}: ${data.status}`
        );
      } else {
        console.warn('Nepoznati podaci primljeni, preskačem toast:', data);
      }
    });
  }

  return () => {
    if (userId) {
      socket.off(`new-application-${userId}`);
    }
  };
}, [cookies.token]);


  const handleApply = async (workshop) => {
    try {
      const token = localStorage.getItem('user._id');
      const headers = { Authorization: `Bearer ${token}` };
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.user._id;


      const payload = {
        user: userId,
        workshop: workshop,
      };

      const response = await axios.post(process.env.NEXT_PUBLIC_URL_USER + 'application/workshopApplication', payload, { headers });
      
      if (response.status === 201) {
        toast.success('Application successful!');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="max-w-6xl mx-auto">
        {role && (role.includes('user') || role.includes('admin') || role.includes('professor')) ? (
          <>
            <h1 className="main-title">Code Camp Sessions</h1>
            <div className="space-y-8">
              {data.map(workshop => (
                <WorkshopCard key={workshop._id} workshop={workshop} onApply={() => handleApply(workshop._id)} />
              ))}
            </div>
          </>
        ) : (
          <>
            <h1 className="main-title mb-8">Welcome to Code Camp</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="flex flex-col justify-center items-center bg-secondary p-8 rounded-lg">
                <FaHome className="text-5xl text-blue-500 mb-4" />
                <h2 className="text-2xl font-semibold mb-4 text-white">About Us</h2>
                <p className="text-lg text-gray-300">
                  We are a company that offers coding workshops for beginners and advanced developers. Our workshops are designed to help you learn how to code and become a professional developer.
                </p>
              </div>
              <div className="flex flex-col justify-center items-center bg-gray-800 p-8 rounded-lg">
                <FaUser className="text-5xl text-blue-500 mb-4" />
                <h2 className="text-2xl font-semibold mb-4 text-white">Register Now</h2>
                <p className="text-lg text-gray-300">
                  If you already know that you want to join our Code Camp, you can register right away. Just click on the <Link href="/register" className="underline text-white">Register</Link> link and fill out the form. We are looking forward to welcoming you.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const WorkshopCard = ({ workshop, onApply }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 200;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div key={workshop._id} className="p-5 bg-secondary rounded-lg shadow-md text-white">
      <h2 className="text-4xl font-semibold mb-6">{workshop.name}</h2>
      <p className="text-xl">
        {isExpanded ? workshop.description : `${workshop.description.substring(0, maxLength)}${workshop.description.length > maxLength ? '...' : ''}`}
      </p>
      {!isExpanded && workshop.description.length > maxLength && (
        <button onClick={handleToggle} className="text-primary hover:underline mb-6">
          Read more
        </button>
      )}
      {isExpanded && (
        <button onClick={handleToggle} className="text-primary hover:underline mb-6">
          Read less
        </button>
      )}
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <p className="text-lg border rounded p-2"><strong>Start Date:</strong> {workshop.StartDate}</p>
        <p className="text-lg border rounded p-2"><strong>End Date:</strong> {workshop.EndDate}</p>
        <p className="text-lg border rounded p-2"><strong>Professor:</strong> {workshop.professor}</p>
      </div>
      <button className="btn enabled-button text-white text-lg rounded-full w-full" onClick={onApply}>
        Apply
      </button>
    </div>
  );
};

export default HomePage;