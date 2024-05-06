"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6);
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredUsers = data.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  function redirectToUpdate(id) {
    router.push(`/admin/edit/${id}`);
  }

  return (
    <div className="container">
      {showDeletePopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Are you sure you want to delete this user?</h2>
            <button className="cancel-btn" onClick={() => setShowDeletePopup(false)}>Cancel</button>
            <button className="confirm-btn" onClick={() => {
              deleteUser(deleteUserId);
              setShowDeletePopup(false);
            }}>Yes, I'm sure</button>
          </div>
        </div>
      )}
      {!loading && (
        <div>
          <h1 className="main-title">Users</h1>
          <div className="mb-4">
            <input type="text" placeholder="Search by name or email..." value={searchTerm}
              onChange={handleSearch} className="input border rounded-md p-2 w-full" />
          </div>
          {filteredUsers.length === 0 ? (
            <p className="text-center text-2xl text-red-500 font-semibold">User not found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-fixed text-center">
                <thead>
                  <tr>
                    <th className="w-1/6 py-2">First Name</th>
                    <th className="w-1/6 py-2">Last Name</th>
                    <th className="w-1/6 py-2">Phone Number</th>
                    <th className="w-1/6 py-2">Email</th>
                    <th className="w-1/6 py-2">Role</th>
                    <th className="w-1/6 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr key={index}>
                      <td className="w-1/6 py-2 break-all">{user.firstName}</td>
                      <td className="w-1/6 py-2 break-all">{user.lastName}</td>
                      <td className="w-1/6 py-2 break-all">{user.tel}</td>
                      <td className="w-1/6 py-2 break-all">{user.email}</td>
                      <td className="w-1/6 py-2 break-all">{user.role}</td>
                      <td className="w-1/6 py-2">
                        <button className="btn btn-update" onClick={() => redirectToUpdate(user._id)}><FaEdit /></button>
                        <button className="btn btn-delete" onClick={() => {
                          setDeleteUserId(user._id);
                          setShowDeletePopup(true); 
                        }}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="pagination">
            <ul className="flex justify-center space-x-4 p-4 m-4">
              {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, index) => (
                <li key={index}>
                  <button onClick={() => paginate(index + 1)}
                    className={`py-2 px-4 rounded cursor-pointer text-white ${currentPage === index + 1 ? 'bg-primary' : 'bg-secondary'}`}
                    style={{ padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' 
                  }}
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