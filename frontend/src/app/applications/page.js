"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ApplicationsPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function getApplications() {
            try {
                setLoading(true);
                const token = localStorage.getItem('user._id');
                const headers = { Authorization: `Bearer ${token}` };
                const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + 'application/applicationsForWorkshop/', { headers });
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('An error occurred:', error);
                toast.error('Error fetching applications. Please try again.');
            }
        }
        getApplications();
    }, []);

    async function deleteApplication(id) {
        try {
            const token = localStorage.getItem('user._id');
            const headers = { Authorization: `Bearer ${token}` };
            await axios.delete(process.env.NEXT_PUBLIC_URL_USER + `application/deleteApplication/${id}`, { headers });
            setData(prevData => prevData.filter(application => application._id !== id));
            toast.success('Application deleted successfully!');
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
            {!loading && (
                <div className="overflow-x-auto">
                    <h1 className="main-title text-center mb-4">Applications</h1>
                    <table className="w-full table-fixed text-center">
                        <thead>
                            <tr>
                                <th className="w-1/7 py-2 break-all">User</th>
                                <th className="w-1/7 py-2 break-all">Workshop</th>
                                <th className="w-1/7 py-2 break-all">Registration Date</th>
                                <th className="w-1/7 py-2 break-all">Status</th>
                                <th className="w-1/7 py-2 break-all">Points</th>
                                <th className="w-1/7 py-2 break-all">Evaluation</th>
                                <th className="w-1/7 py-2 break-all">Remark</th>
                                <th className="w-1/7 py-2 break-all">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(application => (
                                <tr key={application._id}>
                                    <td className="w-1/7 py-2 break-all">{application.user}</td>
                                    <td className="w-1/7 py-2 break-all">{application.workshop}</td>
                                    <td className="w-1/7 py-2 break-all">{application.registrationDate}</td>
                                    <td className="w-1/7 py-2 break-all">{application.status}</td>
                                    <td className="w-1/7 py-2 break-all">{application.points}</td>
                                    <td className="w-1/7 py-2 break-all">{application.evaluation}</td>
                                    <td className="w-1/7 py-2 break-all">{application.remark}</td>
                                    <td className="w-1/7 py-2">
                                        <button className="btn btn-update" onClick={() => redirectToUpdate(application._id)}>
                                            <FaEdit />
                                        </button>
                                        <button className="btn btn-delete" onClick={() => {
                                            if (window.confirm(`Are you sure you want to delete ${application.user}'s application?`)) {
                                                deleteApplication(application._id);
                                            }
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