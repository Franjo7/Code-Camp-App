"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function WorkshopsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteWorkshopId, setDeleteWorkshopId] = useState(null);
  const [showVisibilityPopup, setShowVisibilityPopup] = useState(false);
  const [visibilityWorkshopId, setVisibilityWorkshopId] = useState(null);
  const [visibilityStatus, setVisibilityStatus] = useState(false);
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
  }, []);

  async function deleteWorkshop(id) {
    try {
      const token = localStorage.getItem('user._id');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(process.env.NEXT_PUBLIC_URL_USER + `workshop/delete/${id}`, { headers });
      setData(prevData => prevData.filter(workshop => workshop._id !== id));
      toast.success('Workshop deleted successfully!');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  }

  async function toggleVisibility(id, currentVisibility) {
    try {
      const token = localStorage.getItem('user._id');
      const headers = { Authorization: `Bearer ${token}` };
      const updatedVisibility = !currentVisibility;
      await axios.put(
        process.env.NEXT_PUBLIC_URL_USER + `workshop/visibility/${id}`,
        { Visibility: updatedVisibility },
        { headers }
      );

      const updatedWorkshops = data.map(item =>
        item._id === id ? { ...item, Visibility: updatedVisibility } : item
      );
      setData(updatedWorkshops);
      updatedVisibility ? toast.success('Workshop is now visible!') : toast.success('Workshop is now hidden!');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  }

  function redirectToUpdate(id) {
    router.push(`/workshops/edit/${id}`);
  }

  return (
    <div className="container">
      {showDeletePopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Are you sure you want to delete this workshop?</h2>
            <button className="cancel-btn" onClick={() => setShowDeletePopup(false)}>Cancel</button>
            <button className="confirm-btn" onClick={() => {
              deleteWorkshop(deleteWorkshopId);
              setShowDeletePopup(false);
            }}>Yes, I'm sure</button>
          </div>
        </div>
      )}
      {showVisibilityPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Are you sure you want to change visibility of this workshop?</h2>
            <button className="cancel-btn" onClick={() => setShowVisibilityPopup(false)}>Cancel</button>
            <button className="confirm-btn" onClick={() => {
              toggleVisibility(visibilityWorkshopId, visibilityStatus);
              setShowVisibilityPopup(false);
            }}>{visibilityStatus ? 'Hide' : 'Show'}</button>
          </div>
        </div>
      )}
      {!loading && (
        <div className="overflow-x-auto">
          <div className="flex justify-between items-center">
            <h1 className="main-title flex-grow text-right">Workshops</h1>
            <button className="btn btn-create" onClick={() => router.push('/workshops/create')}>
              <FaPlus />
            </button>
          </div>
          <table className="w-full table-fixed text-center">
            <thead>
              <tr>
                <th className="w-1/7 py-2 break-all">Name</th>
                <th className="w-1/7 py-2 break-all">Description</th>
                <th className="w-1/7 py-2 break-all">Start Date</th>
                <th className="w-1/7 py-2 break-all">End Date</th>
                <th className="w-1/7 py-2 break-all">Professor</th>
                <th className="w-1/7 py-2 break-all">Visibility</th>
                <th className="w-1/7 py-2 break-all">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(workshop => (
                <tr key={workshop._id}>
                  <td className="w-1/7 py-2 break-all">{workshop.name}</td>
                  <td className="w-1/7 py-2 break-all">{workshop.description}</td>
                  <td className="w-1/7 py-2 break-all">{workshop.StartDate}</td>
                  <td className="w-1/7 py-2 break-all">{workshop.EndDate}</td>
                  <td className="w-1/7 py-2 break-all">{workshop.professor}</td>
                  <td className="w-1/7 py-2 break-all">
                    <button
                      className={`btn ${workshop.Visibility ? 'enabled-button' : 'disabled-button'}`}
                      onClick={() => {
                        setVisibilityWorkshopId(workshop._id);
                        setVisibilityStatus(workshop.Visibility);
                        setShowVisibilityPopup(true);
                      }}
                    >
                      {workshop.Visibility ? 'Visible' : 'Hidden'}
                    </button>
                  </td>
                  <td className="w-1/7 py-2">
                    <button className="btn btn-update" onClick={() => redirectToUpdate(workshop._id)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-delete" onClick={() => {
                      setDeleteWorkshopId(workshop._id);
                      setShowDeletePopup(true);
                    }}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}