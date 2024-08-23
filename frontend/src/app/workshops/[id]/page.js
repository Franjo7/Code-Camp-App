"use client"
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { usePathname, useRouter } from 'next/navigation';
import { FaCalendarAlt, FaInfoCircle, FaStar, FaPen, FaCheck, FaExternalLinkAlt } from 'react-icons/fa';
import Pagination from '@mui/material/Pagination';

export default function MyWorkshops() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const router = useRouter();
  const workshopsPerPage = 1;

  useEffect(() => {
    if (!id) return;

    const getWorkshops = async () => {
      try {
        const token = localStorage.getItem('user._id');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_USER}application/applicationsForUser/${id}`, { 
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (error) {
        toast.error('Error fetching workshops. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    getWorkshops();
  }, [id]);

  const currentWorkshops = useMemo(() => {
    const indexOfLastWorkshop = currentPage * workshopsPerPage;
    return data.slice(indexOfLastWorkshop - workshopsPerPage, indexOfLastWorkshop);
  }, [data, currentPage]);

  const totalPages = Math.ceil(data.length / workshopsPerPage);

  const statusColors = {
    Approved: { color: 'text-green-400', symbol: '✔' },
    Rejected: { color: 'text-red-400', symbol: '✖' },
    default: { color: 'text-gray-400', symbol: '' }
  };

  const evaluationColors = {
    Pass: { color: 'text-green-400', symbol: '✔' },
    Fail: { color: 'text-red-400', symbol: '✖' },
    default: { color: 'text-gray-400', symbol: '' }
  };

  const renderInfoRow = (icon, label, value, colorClass = '') => (
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center md:ml-10">
        {icon}
        <p className="md:ml-5 m-1"><strong>{label}:</strong></p>
      </div>
      <p className={`md:mr-10 m-1 ${colorClass}`}>{value}</p>
    </div>
  );

  const renderColoredStatus = (status) => {
    const { color, symbol } = statusColors[status] || statusColors.default;
    return <span className={color}>{status} {symbol}</span>;
  };

  const renderColoredEvaluation = (evaluation) => {
    const { color, symbol } = evaluationColors[evaluation] || evaluationColors.default;
    return <span className={color}>{evaluation} {symbol}</span>;
  };

  const redirectToSubmitTest = (workshopId) => {
    router.push(`/workshops/submit?workshopId=${workshopId}`);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="container">
      {!loading && (
        <div className="max-w-4xl mx-auto">
          <h1 className="main-title text-center">My Workshops</h1>
          <div className="md:text-xl">
            {currentWorkshops.map((application, index) => (
              <div key={`${application._id}-${index}`} className="p-4 bg-secondary rounded-lg shadow-md text-white text-center">
                <h2 className="text-3xl md:font-semibold mb-4">{application.workshop}</h2>
                {renderInfoRow(<FaCalendarAlt />, 'Registration Date', application.registrationDate)}
                {renderInfoRow(<FaInfoCircle />, 'Status', renderColoredStatus(application.status))}
                {application.points && application.evaluation && application.remark && (
                  <>
                    {renderInfoRow(<FaStar />, 'Points', application.points)}
                    {renderInfoRow(<FaPen />, 'Evaluation', renderColoredEvaluation(application.evaluation))}
                    {renderInfoRow(<FaCheck />, 'Remark', application.remark)}
                    <div className="flex justify-center">
                      <button
                        className="text-white rounded cursor-pointer flex items-center border rounded p-2"
                        onClick={() => redirectToSubmitTest(application.workshopId)}
                      >
                        Submit Your Test
                        <FaExternalLinkAlt className="ml-2" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="pagination flex justify-center m-4">
            <Pagination 
              count={totalPages} 
              page={currentPage} 
              onChange={handlePageChange} 
              color="primary" 
              shape='rounded'
              size='large'
            />
          </div>
        </div>
      )}
    </div>
  );
}