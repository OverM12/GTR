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
                    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // Apply sorting based on data type
            sortedData.sort((a, b) => {
                // Handle null or undefined values
                const valueA = a[sortField] === undefined || a[sortField] === null ? '' : a[sortField];
                const valueB = b[sortField] === undefined || b[sortField] === null ? '' : b[sortField];

                // Sort based on data type
                if (sortField === 'id') {
                    // Numeric sorting for IDs
                    const numA = parseInt(valueA) || 0;
                    const numB = parseInt(valueB) || 0;
                    return sortOrder === 'asc' ? numA - numB : numB - numA;
                } else if (sortField === 'yearOfBirth') {
                    // Special handling for Year of Birth
                    console.log('Sorting by year:', valueA, valueB);
                    const yearA = parseInt(valueA) || 0;
                    const yearB = parseInt(valueB) || 0;
                    console.log('Parsed years:', yearA, yearB);
                    return sortOrder === 'asc' ? yearA - yearB : yearB - yearA;
                } else if (sortField === 'createdAt' || sortField === 'lastAssessment') {
                    // Date sorting
                    const dateA = valueA ? new Date(valueA).getTime() : 0;
                    const dateB = valueB ? new Date(valueB).getTime() : 0;
                    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
                } else {
                    // String sorting with localeCompare for proper alphabetical order
                    const strA = String(valueA).toLowerCase();
                    const strB = String(valueB).toLowerCase();
                    return sortOrder === 'asc'
                        ? strA.localeCompare(strB, 'th')
                        : strB.localeCompare(strA, 'th');
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
        console.log('Clicked on field:', field);

        // Special case for Year of Birth
        if (field.toLowerCase() === 'yearofbirth' || field.toLowerCase().includes('year')) {
            console.log('Handling Year of Birth sorting');
            
            // Toggle sort order if already sorting by year
            const newOrder = (sortField === 'yearOfBirth' && sortOrder === 'asc') ? 'desc' : 'asc';
            setSortField('yearOfBirth');
            setSortOrder(newOrder);
            
            console.log(`Sorting by yearOfBirth in ${newOrder} order`);
            return;
        }

        // Special case for Last Assessment
        if (field.toLowerCase() === 'lastassessment' || field.toLowerCase().includes('assessment')) {
            console.log('Handling Last Assessment sorting');
            
            // Toggle sort order if already sorting by last assessment
            const newOrder = (sortField === 'lastAssessment' && sortOrder === 'asc') ? 'desc' : 'asc';
            setSortField('lastAssessment');
            setSortOrder(newOrder);
            
            console.log(`Sorting by lastAssessment in ${newOrder} order`);
            return;
        }
        
        // Special case for Registered On
        if (field.toLowerCase() === 'registeredon' || field.toLowerCase().includes('registered')) {
            console.log('Handling Registered On sorting');
            
            // Toggle sort order if already sorting by registration date
            const newOrder = (sortField === 'createdAt' && sortOrder === 'asc') ? 'desc' : 'asc';
            setSortField('createdAt');
            setSortOrder(newOrder);
            
            console.log(`Sorting by createdAt in ${newOrder} order`);
            return;
        }

        // Normalize the field name to match the actual property names in the data
        let normalizedField = field.toLowerCase();

        // Map header names to actual data properties
        const fieldMappings = {
            'photo&name': 'name',
            'photoname': 'name',  // Handle the case without &
            'gender': 'gender',
            'email': 'email',
            'id': 'id'
        };

        // Use the mapping if available
        if (fieldMappings[normalizedField]) {
            normalizedField = fieldMappings[normalizedField];
        }

        console.log('Normalized field:', normalizedField);
        console.log('Current sort field:', sortField);

        // Always toggle sort order regardless of field
        let newOrder;
        if (sortField === normalizedField) {
            // If clicking the same field, toggle the order
            newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            // If clicking a different field, default to ascending
            newOrder = 'asc';
        }
        
        setSortField(normalizedField);
        setSortOrder(newOrder);

        // Log for debugging
        console.log(`Sorting by ${normalizedField} in ${newOrder} order`);
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
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-100 appearance-none"
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
                                        <tr className="bg-gray-100 text-sm">
                                            {['ID', 'Photo & Name', 'Email', 'Year of Birth', 'Gender', 'Last Assessment', 'Registered on', 'Action'].map((header, index) => (
                                                <th
                                                    key={index}
                                                    className="py-3 px-4 text-left font-semibold text-gray-600 cursor-pointer hover:bg-gray-200"
                                                    onClick={() => handleSort(header.toLowerCase().replace(/ & /g, '').replace(/ of /g, ''))}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span>{header}</span>
                                                        <span className="ml-3 w-4 inline-block text-center">
                                                            {(sortField === header.toLowerCase().replace(/ & /g, '').replace(/ of /g, '') || 
                                                              (header.toLowerCase().replace(/ & /g, '') === 'photoname' && sortField === 'name') ||
                                                              (header.toLowerCase().includes('year') && sortField === 'yearOfBirth'))
                                                                ? (sortOrder === 'asc' ? '↑' : '↓')
                                                                : ''}
                                                        </span>
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
                                            className={`px-4 py-2 border rounded-lg ${currentPage === i + 1
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