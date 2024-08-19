"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { DataGrid } from '@mui/x-data-grid';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Box from '@mui/material/Box';

export default function AdminPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function getUsers() {
      const token = localStorage.getItem('user._id');
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + 'admin/users', { headers });
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
    getUsers();
  }, []);

  const handleSearch = (event) => setSearchTerm(event.target.value);

  const filteredUsers = data.filter(user =>
    [user.firstName, user.lastName, user.email]
      .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  async function deleteUser(id) {
    try {
      const token = localStorage.getItem('user._id');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(process.env.NEXT_PUBLIC_URL_USER + `admin/delete/${id}`, { headers });
      setData(prevData => prevData.filter(user => user._id !== id));
      toast.success('User deleted successfully!');
      setShowDeletePopup(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error.message;
        const errorCode = error.response.data.error.code;
        toast.error(`Error code: ${errorCode}, Message: ${errorMessage}`);
      } else {
        console.error('An error occurred:', error);
      }
    }
  }

  const columns = [
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'tel', headerName: 'Phone Number', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 2 },
    { field: 'role', headerName: 'Role', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <button className="btn btn-update" onClick={() => router.push(`/admin/edit/${params.row._id}`)}>
            <FaEdit />
          </button>
          <button className="btn btn-delete" onClick={() => {
            setDeleteUserId(params.row._id);
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
      {showDeletePopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Are you sure you want to delete this user?</h2>
            <button className="cancel-btn" onClick={() => setShowDeletePopup(false)}>Cancel</button>
            <button className="confirm-btn" onClick={() => {
              deleteUser(deleteUserId);
            }}>Yes, I'm sure</button>
          </div>
        </div>
      )}
      {!loading && (
        <div className="container">
          <h1 className="main-title">Users</h1>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search by name or email..."
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
                  rows={filteredUsers}
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
                    noRowsLabel: 'No users found.',
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