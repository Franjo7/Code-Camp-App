"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { usePathname } from 'next/navigation';

export default function MyWorkshops() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const id = pathname.split('/').pop();

    useEffect(() => {
        async function getApplications() {
            try {
                setLoading(true);
                const token = localStorage.getItem('user._id');
                const headers = { Authorization: `Bearer ${token}` };
                const response = await axios.get(process.env.NEXT_PUBLIC_URL_USER + `application/applicationsForUser/${id}`, { headers });
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('An error occurred:', error);
                toast.error('Error fetching applications. Please try again.');
            }
        }
        if (id) {
            getApplications();
        }
    }, [id]);

    async function checkID() {
        return !!id;
    }

    return (
        <div className="container">
            {!loading && (
                <div className="overflow-x-auto">
                    <h1 className="main-title text-center mb-4">My Workshops</h1>
                    <table className="w-full table-fixed text-center">
                        <thead>
                            <tr>
                                {checkID() ? (
                                    <>
                                        <th className="w-1/3 py-2">Workshop</th>
                                        <th className="w-1/3 py-2">Registration Date</th>
                                        <th className="w-1/3 py-2">Status</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="w-1/6 py-2">Workshop</th>
                                        <th className="w-1/6 py-2">Registration Date</th>
                                        <th className="w-1/6 py-2">Status</th>
                                        <th className="w-1/6 py-2">Points</th>
                                        <th className="w-1/6 py-2">Evaluation</th>
                                        <th className="w-1/6 py-2">Remark</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((application) => (
                                <tr key={application._id}>
                                    <td className="w-1/6 py-2 break-all">{application.workshop}</td>
                                    <td className="w-1/6 py-2 break-all">{application.registrationDate}</td>
                                    <td className="w-1/6 py-2 break-all">{application.status}</td>
                                    {!checkID() && (
                                        <>
                                            <td className="w-1/6 py-2 break-all">{application.points}</td>
                                            <td className="w-1/6 py-2 break-all">{application.evaluation}</td>
                                            <td className="w-1/6 py-2 break-all">{application.remark}</td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}