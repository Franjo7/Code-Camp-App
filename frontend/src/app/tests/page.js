"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaDownload, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const TestsPage = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [testsPerPage] = useState(6);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteTestId, setDeleteTestId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function getTests() {
      const token = localStorage.getItem('user._id');
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + 'test/getAllTests', { headers });
        setTests(response.data);
        setLoading(false);
      } catch {
        if (!token) {
          router.push('/login');
        } else {
          router.push('/');
        }
      }
    }
    getTests();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredTests = tests.filter(test => 
    test.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastTest = currentPage * testsPerPage;
  const indexOfFirstTest = indexOfLastTest - testsPerPage;
  const currentTests = filteredTests.slice(indexOfFirstTest, indexOfLastTest);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  async function deleteTest(id) {
    try {
      const token = localStorage.getItem('user._id');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(process.env.NEXT_PUBLIC_URL_USER + `test/deleteTest/${id}`, { headers });
      setTests(prevTests => prevTests.filter(test => test._id !== id));
      toast.success('Test deleted successfully!');
      setShowDeletePopup(false);
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('Error while deleting test. Please try again.');
    }
  }

  async function downloadTest(fileName, downloadLink) {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + `${downloadLink}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('Error while downloading test. Please try again.');
    }
  }
  
  return (
    <div className="container">
      {showDeletePopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Are you sure you want to delete this test?</h2>
            <button className="cancel-btn" onClick={() => setShowDeletePopup(false)}>Cancel</button>
            <button className="confirm-btn" onClick={() => {
              deleteTest(deleteTestId);
              setShowDeletePopup(false);
            }}>Yes, I'm sure</button>
          </div>
        </div>
      )}
      {!loading && (
        <div>
          <h1 className="main-title">Tests</h1>
          <div className="mb-4">
            <input type="text" placeholder="Search by user..." value={searchTerm} 
              onChange={handleSearch} className="input rounded-md p-2 w-full"/>
          </div>
          {currentTests.length === 0 ? (
            <p className="text-center text-2xl text-red-500 font-semibold">No tests found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-white">
              {currentTests.map(test => (
                <div key={test._id} className="border border-gray-400 rounded-lg shadow-md p-6">
                  <p className="mb-2"><strong>Uploaded by:</strong> {test.user}</p>
                  <p className="mb-2"><strong>Workshop: </strong> {test.workshop}</p>
                  <p className="mb-2"><strong>Date of Upload: </strong> {test.date}</p>
                  <div className="mt-6 flex justify-end space-x-1">
                    <button className="btn btn-download" onClick={() => downloadTest(test.fileName, test.downloadLink)}>
                      <FaDownload />
                    </button>
                    <button className="btn btn-delete" onClick={() => {
                      setDeleteTestId(test._id);
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
              {Array.from({ length: Math.ceil(filteredTests.length / testsPerPage) }, (_, index) => (
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
};

export default TestsPage;