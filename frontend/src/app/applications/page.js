"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { DataGrid } from '@mui/x-data-grid';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Box from '@mui/material/Box';
import { Modal, Button, Typography } from '@mui/material';

export default function ApplicationsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
  }, [router]);

  const handleSearch = (event) => setSearchTerm(event.target.value);

  const splitName = (fullName) => {
    const [firstName, lastName] = fullName.split(' ');
    return { firstName: firstName || '', lastName: lastName || '' };
  };

  const filteredApplications = data.filter(application => application.user.toLowerCase().includes(searchTerm.toLowerCase()))
    .map(application => ({ ...application, ...splitName(application.user) }));

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

  const columns = [
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'workshop', headerName: 'Workshop', flex: 1.2 },
    { field: 'registrationDate', headerName: 'Registration Date', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1,
      renderCell: (params) => (
        <span className={`${params.value === 'Approved' ? 'text-green-400' : params.value === 'Rejected' ? 'text-red-400' : 'text-gray-400'}`} >
          {params.value}
          {params.value === 'Approved' && ' ✔'}
          {params.value === 'Rejected' && ' ✖'}
          {params.value === 'Pending...' && '⏳'}
        </span>
      ),
    },
    { field: 'points', headerName: 'Points', flex: 1 },
    { field: 'evaluation', headerName: 'Evaluation', flex: 1,
      renderCell: (params) => (
        <span className={`${params.value === 'Pass' ? 'text-green-400' : params.value === 'Fail' ? 'text-red-400' : 'text-gray-400'}`} >
          {params.value}
          {params.value === 'Pass' && ' ✔'}
          {params.value === 'Fail' && ' ✖'}
        </span>
      ),
    },
    { field: 'remark', headerName: 'Remark', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.3,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <button className="btn btn-update" onClick={() => router.push(`/applications/edit/${params.row._id}`)}>
            <FaEdit />
          </button>
          <button className="btn btn-delete" onClick={() => {
            setDeleteApplicationId(params.row._id);
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
            This will delete the application.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => setShowDeletePopup(false)} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => {
              deleteApplication(deleteApplicationId);
            }}>
              Yes, I'm sure
            </Button>
          </Box>
        </Box>
      </Modal>

      {!loading && (
        <div className="container">
          <h1 className="main-title">Applications</h1>
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
                  rows={filteredApplications}
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
                    noRowsLabel: 'No applications found.',
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