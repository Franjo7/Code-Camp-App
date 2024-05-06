"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ApplicationsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationsPerPage] = useState(6);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteApplicationId, setDeleteApplicationId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function getApplications() {
      const token = localStorage.getItem('user._id');
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + 'application/applicationsForWorkshop/', { headers });
        setData(response.data);
        setLoading(false);
      } catch {
        if (!token) {
          router.push('/login');
        } else {
          router.push('/');
        }
      }
    }
    getApplications();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredApplications = data.filter(application => 
    application.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  async function deleteApplication(id) {
    try {
      const token = localStorage.getItem('user._id');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(process.env.NEXT_PUBLIC_URL_USER + `application/deleteApplication/${id}`, { headers });
      setData(prevData => prevData.filter(application => application._id !== id));
      toast.success('Application deleted successfully!');
      setShowDeletePopup(false);
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('Error while deleting application. Please try again.');
    }
  }

  function redirectToUpdate(id) {
    router.push(`/applications/edit/${id}`);
  }

  return (
    <div className="container">
      {showDeletePopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Are you sure you want to delete this application?</h2>
            <button className="cancel-btn" onClick={() => setShowDeletePopup(false)}>Cancel</button>
            <button className="confirm-btn" onClick={() => {
              deleteApplication(deleteApplicationId);
              setShowDeletePopup(false);
            }}>Yes, I'm sure</button>
          </div>
        </div>
      )}
      {!loading && (
        <div>
          <h1 className="main-title">Applications</h1>
          <div className="mb-4">
            <input type="text" placeholder="Search by user..." value={searchTerm} 
              onChange={handleSearch} className="input rounded-md p-2 w-full" />
          </div>
          {filteredApplications.length === 0 ? (
            <p className="text-center text-2xl text-red-500 font-semibold">No applications found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-white">
              {currentApplications.map(application => (
                <div key={application._id} className="border border-gray-400 rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-semibold mb-4">{application.user}</h2>
                  <p className="mb-2"><strong>Workshop:</strong> {application.workshop}</p>
                  <p className="mb-2"><strong>Registration Date:</strong> {application.registrationDate}</p>
                  <p className="mb-2"><strong>Status:</strong> {application.status}</p>
                  <p className="mb-2"><strong>Points:</strong> {application.points}</p>
                  <p className="mb-2"><strong>Evaluation:</strong> {application.evaluation}</p>
                  <p className="mb-2"><strong>Remark:</strong> {application.remark}</p>
                  <div className="mt-6 flex justify-end space-x-1">
                    <button className="btn btn-update" onClick={() => redirectToUpdate(application._id)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-delete" onClick={() => {
                      setDeleteApplicationId(application._id);
                      setShowDeletePopup(true);
                    }}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="pagination">
            <ul className="flex justify-center space-x-4 p-4 m-4">
              {Array.from({ length: Math.ceil(filteredApplications.length / applicationsPerPage) }, (_, index) => (
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