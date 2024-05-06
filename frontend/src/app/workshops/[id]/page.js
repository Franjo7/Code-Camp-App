"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { usePathname, useRouter } from 'next/navigation';
import { FaCalendarAlt, FaInfoCircle, FaStar, FaPen, FaCheck } from 'react-icons/fa';

export default function MyWorkshops() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [workshopsPerPage] = useState(1);
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const router = useRouter();

  useEffect(() => {
    async function getWorkshops() {
      try {
        setLoading(true);
        const token = localStorage.getItem('user._id');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + `application/applicationsForUser/${id}`, { headers });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('An error occurred:', error);
        toast.error('Error fetching workshops. Please try again.');
      }
    }
    if (id) {
      getWorkshops();
    }
  }, [id]);

  const indexOfLastWorkshop = currentPage * workshopsPerPage;
  const indexOfFirstWorkshop = indexOfLastWorkshop - workshopsPerPage;
  const currentWorkshops = data.slice(indexOfFirstWorkshop, indexOfLastWorkshop);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  function shouldDisplayExtendedColumns(application) {
    return !!id && application.points && application.evaluation && application.remark;
  }

  function redirectToSubmitTest(workshopId) {
    router.push(`/workshops/submit?workshopId=${workshopId}`);
  }

  return (
    <div className="container">
      {!loading && (
        <div className="max-w-4xl mx-auto">
          <h1 className="main-title text-center">My Workshops</h1>
          <div className="grid grid-cols-1 gap-8 text-xl">
            {currentWorkshops.map((application, index) => (
              <div key={`${application._id}-${index}`} className="p-8 bg-secondary rounded-lg shadow-md text-white text-center">
                <h2 className="text-3xl font-semibold mb-4 underline">{application.workshop}</h2>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2" /> <p className="m-2"><strong>Registration Date:</strong></p>
                  </div>
                  <p className="m-2">{application.registrationDate}</p>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <FaInfoCircle className="mr-2" /> <p className="m-2"><strong>Status:</strong></p>
                  </div>
                  <p className="m-2">{application.status}</p>
                </div>
                {shouldDisplayExtendedColumns(application) && (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <FaStar className="mr-2" /> <p className="m-2"><strong>Points:</strong></p>
                      </div>
                      <p className="m-2">{application.points}</p>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <FaPen className="mr-2" /> <p className="m-2"><strong>Evaluation:</strong></p>
                      </div>
                      <p className="m-2">{application.evaluation}</p>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <FaCheck className="mr-2" /> <p className="m-2"><strong>Remark:</strong></p>
                      </div>
                      <p className="m-2">{application.remark}</p>
                    </div>
                    <button className="enabled-button text-white py-2 px-4 rounded mt-2" onClick={() => redirectToSubmitTest(application.workshopId)}>Submit Your Test</button>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="pagination">
            <ul className="flex justify-center space-x-4 p-4 m-4">
              {Array.from({ length: Math.ceil(data.length / workshopsPerPage) }, (_, index) => (
                <li key={index}>
                  <button onClick={() => paginate(index + 1)}
                    className={`py-2 px-4 rounded cursor-pointer text-white ${currentPage === index + 1 ? 'bg-primary' : 'bg-secondary'}`}
                    style={{ padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                  {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}