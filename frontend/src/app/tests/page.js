"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaDownload, FaTrash, FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import { Modal, Button, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function TestsPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
  }, [router]);

  const handleSearch = (event) => setSearchTerm(event.target.value);
  const filteredTests = tests.filter(test => test.user.toLowerCase().includes(searchTerm.toLowerCase()));

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

  const columns = [
    { field: 'user', headerName: 'Uploaded by', flex: 2 },
    { field: 'workshop', headerName: 'Workshop', flex: 2 },
    { field: 'date', headerName: 'Date of Upload', flex: 2 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <button className="btn btn-download" onClick={() => downloadTest(params.row.fileName, params.row.downloadLink)}>
            <FaDownload />
          </button>
          <button className="btn btn-delete" onClick={() => {
            setDeleteTestId(params.row._id);
            setShowDeletePopup(true);
          }}>
            <FaTrash />
          </button>
        </>
      ),
    },
  ];

  return (
    <>
      <Modal
        open={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '500px',
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 24,
          p: 4
        }}>
          <Typography id="modal-title" variant="h5">
            Are you sure?
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            This will delete the test.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => setShowDeletePopup(false)} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => {
              deleteTest(deleteTestId);
            }}>
              Yes, I'm sure
            </Button>
          </Box>
        </Box>
      </Modal>

      {!loading && (
        <div className="container">
          <h1 className="main-title">Tests</h1>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search by user..."
              value={searchTerm}
              onChange={handleSearch}
              className="bg-secondary text-white border rounded-md pl-10 py-2 w-full"
            />
            <FaSearch className="absolute text-white top-1/2 left-3 transform -translate-y-1/2" />
          </div>
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <div style={{ minWidth: '1100px' }}>
              <Box>
                <DataGrid
                  rows={filteredTests}
                  columns={columns}
                  pageSize={5}
                  getRowId={(row) => row._id}
                  disableRowSelectionOnClick
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      }
                    }
                  }}
                  pageSizeOptions={[5, 10, 20]}
                  localeText={{
                    noRowsLabel: 'No tests found.',
                  }}
                />
              </Box>
            </div>
          </div>
        </div>
      )}
    </>
  );
}