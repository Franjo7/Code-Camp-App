"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaDownload, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const TestsPage = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [testsPerPage] = useState(6);

  useEffect(() => {
    async function getTests() {
      try {
        setLoading(true);
        const token = localStorage.getItem('user._id');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + 'test/getAllTests', { headers });
        setTests(response.data);
        setLoading(false);
      } catch (error) {
        console.error('An error occurred:', error);
        toast.error('Error fetching tests. Please try again.');
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
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('Error while deleting test. Please try again.');
    }
  }

  async function downloadTest(id, downloadLink) {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + `test/download/${id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', downloadLink);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('Error while downloading test. Please try again.');
    }
  }
  
  return (
    <div className="container">
      {!loading && (
        <div>
          <h1 className="main-title">Tests</h1>
          <div className="mb-4">
            <input 
              type="text" 
              placeholder="Search by user..." 
              value={searchTerm} 
              onChange={handleSearch} 
              className="input rounded-md p-2 w-full"
            />
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
                    <button className="btn btn-download" onClick={() => downloadTest(test._id, test.downloadLink)}>
                      <FaDownload />
                    </button>
                    <button className="btn btn-delete" onClick={() => deleteTest(test._id)}>
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
                  <button 
                    onClick={() => paginate(index + 1)} 
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