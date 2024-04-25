"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { usePathname } from 'next/navigation';

export default function MyWorkshops() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const id = pathname.split('/').pop();

  useEffect(() => {
    async function getApplications() {
      try {
        setLoading(true);
        const token = localStorage.getItem('user._id');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + `application/applicationsForUser/${id}`, { headers });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('An error occurred:', error);
        toast.error('Error fetching applications. Please try again.');
      }
    }
    if (id) {
      getApplications();
    }
  }, [id]);

  function shouldDisplayExtendedColumns() {
    return !!id;
  }

  return (
    <div className="container">
      {!loading && (
        <div className="overflow-x-auto">
          <h1 className="main-title text-center mb-4">My Workshops</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((application) => (
              <div key={application._id} className="border border-gray-400 rounded-lg shadow-md p-6 text-white">
                <h2 className="text-2xl font-semibold mb-4">{application.workshop}</h2>
                <p className="mb-2"><strong>Registration Date:</strong> {application.registrationDate}</p>
                <p className="mb-2"><strong>Status:</strong> {application.status}</p>
                {shouldDisplayExtendedColumns() && (
                  <>
                    <p className="mb-2"><strong>Points:</strong> {application.points}</p>
                    <p className="mb-2"><strong>Evaluation:</strong> {application.evaluation}</p>
                    <p className="mb-2"><strong>Remark:</strong> {application.remark}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}