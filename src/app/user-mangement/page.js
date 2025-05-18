"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import mockData from './usermangement.json';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Initialize state from localStorage or use defaults
    const [sortField, setSortField] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userManagement-sortField') || 'id';
        }
        return 'id';
    });
    
    const [sortOrder, setSortOrder] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userManagement-sortOrder') || 'asc';
        }
        return 'asc';
    });
    
    const [itemsPerPage, setItemsPerPage] = useState(() => {
        if (typeof window !== 'undefined') {
            return parseInt(localStorage.getItem('userManagement-itemsPerPage') || '10');
        }
        return 10;
    });
    
    const [currentPage, setCurrentPage] = useState(() => {
        if (typeof window !== 'undefined') {
            return parseInt(localStorage.getItem('userManagement-currentPage') || '1');
        }
        return 1;
    });
    
    const [searchTerm, setSearchTerm] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userManagement-searchTerm') || '';
        }
        return '';
    });

    useEffect(() => {
        try {
            setLoading(true);
            let sortedData = [...mockData.data];
            
            // Apply search filter
            if (searchTerm) {
                sortedData = sortedData.filter(user => 
                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // Apply sorting with numeric comparison for ID
            sortedData.sort((a, b) => {
                if (sortField === 'id') {
                    const numA = parseInt(a[sortField]);
                    const numB = parseInt(b[sortField]);
                    return sortOrder === 'asc' ? numA - numB : numB - numA;
                } else {
                    if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
                    if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
                    return 0;
                }
            });

            setUsers(sortedData);
            setError(null);
        } catch (err) {
            console.error("Error loading mock data:", err);
            setError("Failed to load user data. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [sortField, sortOrder, searchTerm]);

    // Save settings to localStorage whenever they change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('userManagement-sortField', sortField);
            localStorage.setItem('userManagement-sortOrder', sortOrder);
            localStorage.setItem('userManagement-itemsPerPage', itemsPerPage.toString());
            localStorage.setItem('userManagement-currentPage', currentPage.toString());
            localStorage.setItem('userManagement-searchTerm', searchTerm);
        }
    }, [sortField, sortOrder, itemsPerPage, currentPage, searchTerm]);

    const handleSort = (field) => {
        const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newOrder);
        setSortField(field);
    };

    // Pagination logic
    const totalPages = Math.ceil(users.length / itemsPerPage);
    const paginatedUsers = users.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="w-full min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-100"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <select
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-100"
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            >
                                <option value={5}>5 per page</option>
                                <option value={10}>10 per page</option>
                                <option value={20}>20 per page</option>
                                <option value={50}>50 per page</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="p-4 text-red-500 text-center">{error}</div>
                    ) : (
                        <>
                            <div className="overflow-x-auto rounded-lg border">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            {['ID', 'Photo & Name', 'Email', 'Year of Birth', 'Gender', 'Last Assessment', 'Registered on', 'Action'].map((header, index) => (
                                                <th 
                                                    key={index}
                                                    className="py-3 px-4 text-left font-semibold text-gray-600 cursor-pointer hover:bg-gray-200"
                                                    onClick={() => handleSort(header.toLowerCase().replace(/ & /g, ''))}
                                                >
                                                    <div className="flex items-center">
                                                        {header}
                                                        {sortField === header.toLowerCase().replace(/ & /g, '') && (
                                                            <span className="ml-2">
                                                                {sortOrder === 'asc' ? '↑' : '↓'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {paginatedUsers.length > 0 ? (
                                            paginatedUsers.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-3 px-4">{user.id}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center">
                                                            {user.profilePicture ? (
                                                                <Image
                                                                    src={user.profilePicture}
                                                                    alt={user.name}
                                                                    width={40}
                                                                    height={40}
                                                                    className="rounded-full mr-3"
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center mr-3">
                                                                    <span className="text-gray-500 font-semibold">
                                                                        {user.name ? user.name.charAt(0).toUpperCase() : ''}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <span className="font-medium">{user.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">{user.email}</td>
                                                    <td className="py-3 px-4">{user.yearOfBirth}</td>
                                                    <td className="py-3 px-4">{user.gender}</td>
                                                    <td className="py-3 px-4">{user.lastAssessment}</td>
                                                    <td className="py-3 px-4">
                                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Link 
                                                            href={`/user-mangement/${user.id}/gtr`}
                                                            className="px-4 py-2 bg-[#FF9933] text-white rounded-lg hover:bg-[#FF9955] transition-colors"
                                                        >
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="py-4 text-center text-gray-500">
                                                    No users found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            <div className="flex justify-between items-center mt-4">
                                <div className="text-gray-600">
                                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, users.length)} of {users.length} entries
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-[#FF9933]"
                                    >
                                        Previous
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`px-4 py-2 border rounded-lg ${
                                                currentPage === i + 1 
                                                    ? 'bg-[#FF9933] text-white' 
                                                    : 'hover:bg-gray-100'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-[#FF9933]"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserManagement;