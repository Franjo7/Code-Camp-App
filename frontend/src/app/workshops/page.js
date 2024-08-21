"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { DataGrid } from '@mui/x-data-grid';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import Box from '@mui/material/Box';
import { Modal, Button, Typography } from '@mui/material';

export default function WorkshopsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteWorkshopId, setDeleteWorkshopId] = useState(null);
  const [workshopName, setWorkshopName] = useState('');
  const [showVisibilityPopup, setShowVisibilityPopup] = useState(false);
  const [visibilityWorkshopId, setVisibilityWorkshopId] = useState(null);
  const [visibilityStatus, setVisibilityStatus] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [descriptionText, setDescriptionText] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function getWorkshops() {
      const token = localStorage.getItem('user._id');
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + 'workshop/', { headers });
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
    getWorkshops();
  }, [router]);

  async function deleteWorkshop(id) {
    try {
      const token = localStorage.getItem('user._id');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(process.env.NEXT_PUBLIC_URL_USER + `workshop/delete/${id}`, { headers });
      setData(prevData => prevData.filter(workshop => workshop._id !== id));
      toast.success('Workshop deleted successfully!');
      setShowDeletePopup(false);
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  }

  async function toggleVisibility(id, currentVisibility) {
    try {
      const token = localStorage.getItem('user._id');
      const headers = { Authorization: `Bearer ${token}` };
      const updatedVisibility = !currentVisibility;
      await axios.put(process.env.NEXT_PUBLIC_URL_USER + `workshop/visibility/${id}`, { Visibility: updatedVisibility }, { headers });

      const updatedWorkshops = data.map(item => item._id === id ? { ...item, Visibility: updatedVisibility } : item);
      setData(updatedWorkshops);
      updatedVisibility ? toast.success('Workshop is now visible!') : toast.success('Workshop is now hidden!');
      setShowVisibilityPopup(false);
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  }

  function openDescriptionModal(description) {
    setDescriptionText(description);
    setShowDescriptionModal(true);
  }

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1.5 },
    { field: 'description', headerName: 'Description', flex: 1.5,
      renderCell: (params) => (
        <button className="flex items-center text-white rounded" onClick={() => openDescriptionModal(params.row.description)}>
          <FaEye className="mr-2" /> View Description
        </button>
      ),
    },
    { field: 'StartDate', headerName: 'Start Date', flex: 1 },
    { field: 'EndDate', headerName: 'End Date', flex: 1 },
    { field: 'professor', headerName: 'Professor', flex: 1.5 },
    { field: 'Visibility', headerName: 'Visibility', flex: 1,
      renderCell: (params) => (
        <button className={`${params.row.Visibility ? 'text-green-400' : 'text-red-400'}`} onClick={() => {
            setVisibilityWorkshopId(params.row._id);
            setVisibilityStatus(params.row.Visibility);
            setShowVisibilityPopup(true);
          }}
        >
          {params.row.Visibility ? 'Visible ✔' : 'Hidden ✖'}
        </button>
      ),
    },
    { field: 'actions', headerName: 'Actions', flex: 1.2, sortable: false, filterable: false,
      renderCell: (params) => (
        <>
          <button className="btn btn-update" onClick={() => router.push(`/workshops/edit/${params.row._id}`)}>
            <FaEdit />
          </button>
          <button className="btn btn-delete" onClick={() => {
            setDeleteWorkshopId(params.row._id);
            setWorkshopName(params.row.name);
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
            This will delete the <strong>{workshopName}</strong> workshop. 
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => setShowDeletePopup(false)} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => deleteWorkshop(deleteWorkshopId)}>
              Yes, I'm sure
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={showVisibilityPopup}
        onClose={() => setShowVisibilityPopup(false)}
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
            This will change the visibility of <strong>{workshopName}</strong> workshop.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => setShowVisibilityPopup(false)} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => toggleVisibility(visibilityWorkshopId, visibilityStatus)}>
              Yes, I'm sure
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={showDescriptionModal}
        onClose={() => setShowDescriptionModal(false)}
        aria-labelledby="description-modal-title"
        aria-describedby="description-modal-description"
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
          <Typography id="description-modal-title" variant="h5">
            Workshop Description
          </Typography>
          <Typography id="description-modal-description" sx={{ mt: 2 }}>
            {descriptionText}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => setShowDescriptionModal(false)}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      {!loading && (
        <div className="container">
          <h1 className="main-title">Workshops</h1>
          <div className="flex justify-end mb-4">
            <button onClick={() => router.push('/workshops/create')} className="bg-secondary p-3 text-white flex items-center space-x-2">
              <FaPlus /><span className="hidden sm:inline text-sm">Create New Workshop</span>
            </button>
          </div>
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <div style={{ minWidth: '1100px' }}>
              <Box>
                <DataGrid
                  rows={data}
                  columns={columns}
                  disableRowSelectionOnClick
                  getRowId={(row) => row._id}
                  hideFooter
                />
              </Box>
            </div>
          </div>
        </div>
      )}
    </>
  );
}