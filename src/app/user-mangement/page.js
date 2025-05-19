"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalUsers, setTotalUsers] = useState(0);
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
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    throw new Error("Token not found in localStorage.");
                }
    
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/users?page=${currentPage}&pageSize=${itemsPerPage}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const json = await response.json();
    
                let fetchedUsers = json.data;
                const total = json.meta?.totalRecords || fetchedUsers.length;
    
                // Search filter
                if (searchTerm) {
                    fetchedUsers = fetchedUsers.filter((user) =>
                        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }
    
                // Sort
                fetchedUsers.sort((a, b) => {
                    const valueA = a[sortField] ?? '';
                    const valueB = b[sortField] ?? '';
    
                    if (sortField === 'yearOfBirth') {
                        return sortOrder === 'asc'
                            ? (valueA || 0) - (valueB || 0)
                            : (valueB || 0) - (valueA || 0);
                    } else if (sortField === 'createdAt' || sortField === 'lastAssessment') {
                        const dateA = valueA ? new Date(valueA).getTime() : 0;
                        const dateB = valueB ? new Date(valueB).getTime() : 0;
                        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
                    } else {
                        return sortOrder === 'asc'
                            ? String(valueA).localeCompare(String(valueB), 'th')
                            : String(valueB).localeCompare(String(valueA), 'th');
                    }
                });
    
                setUsers(fetchedUsers);        // ตั้งค่าข้อมูลผู้ใช้
                setTotalUsers(total);          // ตั้งค่าจำนวนทั้งหมด
                setError(null);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to load user data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchUsers();
    }, [sortField, sortOrder, searchTerm, currentPage, itemsPerPage]);
    

    // Ensure itemsPerPage is a valid number when loaded from localStorage
    useEffect(() => {
        const validPageSize = Math.min(Math.max(1, Number(itemsPerPage)), 100);
        if (validPageSize !== itemsPerPage) {
            setItemsPerPage(validPageSize);
            if (typeof window !== 'undefined') {
                localStorage.setItem('userManagement-itemsPerPage', validPageSize);
            }
        }
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    throw new Error("Token not found in localStorage.");
                }
    
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/users?page=${currentPage}&pageSize=${itemsPerPage}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const json = await response.json();
    
                let fetchedUsers = json.data;
                const total = json.meta?.totalRecords || fetchedUsers.length;
    
                // Search filter
                if (searchTerm) {
                    fetchedUsers = fetchedUsers.filter((user) =>
                        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }
    
                // Sort
                fetchedUsers.sort((a, b) => {
                    const valueA = a[sortField] ?? '';
                    const valueB = b[sortField] ?? '';
    
                    if (sortField === 'yearOfBirth') {
                        return sortOrder === 'asc'
                            ? (valueA || 0) - (valueB || 0)
                            : (valueB || 0) - (valueA || 0);
                    } else if (sortField === 'createdAt' || sortField === 'lastAssessment') {
                        const dateA = valueA ? new Date(valueA).getTime() : 0;
                        const dateB = valueB ? new Date(valueB).getTime() : 0;
                        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
                    } else {
                        return sortOrder === 'asc'
                            ? String(valueA).localeCompare(String(valueB), 'th')
                            : String(valueB).localeCompare(String(valueA), 'th');
                    }
                });
    
                setUsers(fetchedUsers);        // ตั้งค่าข้อมูลผู้ใช้
                setTotalUsers(total);          // ตั้งค่าจำนวนทั้งหมด
                setError(null);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to load user data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchUsers();
    }, [itemsPerPage]);

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
        // console.log('Clicked on field:', field);

        // Special case for Year of Birth
        if (field.toLowerCase() === 'yearofbirth' || field.toLowerCase().includes('year')) {
            // console.log('Handling Year of Birth sorting');

            // Toggle sort order if already sorting by year
            const newOrder = (sortField === 'yearOfBirth' && sortOrder === 'asc') ? 'desc' : 'asc';
            setSortField('yearOfBirth');
            setSortOrder(newOrder);

            // console.log(`Sorting by yearOfBirth in ${newOrder} order`);
            return;
        }

        // Special case for Last Assessment
        if (field.toLowerCase() === 'lastassessment' || field.toLowerCase().includes('assessment')) {
            // console.log('Handling Last Assessment sorting');

            // Toggle sort order if already sorting by last assessment
            const newOrder = (sortField === 'lastAssessment' && sortOrder === 'asc') ? 'desc' : 'asc';
            setSortField('lastAssessment');
            setSortOrder(newOrder);

            // console.log(`Sorting by lastAssessment in ${newOrder} order`);
            return;
        }

        // Special case for Registered On
        if (field.toLowerCase() === 'registeredon' || field.toLowerCase().includes('registered')) {
            // console.log('Handling Registered On sorting');

            // Toggle sort order if already sorting by registration date
            const newOrder = (sortField === 'createdAt' && sortOrder === 'asc') ? 'desc' : 'asc';
            setSortField('createdAt');
            setSortOrder(newOrder);

            // console.log(`Sorting by createdAt in ${newOrder} order`);
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

        // console.log('Normalized field:', normalizedField);
        // console.log('Current sort field:', sortField);

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
        // console.log(`Sorting by ${normalizedField} in ${newOrder} order`);
    };

    const handleItemsPerPageChange = (e) => {
        const value = Math.min(Math.max(1, parseInt(e.target.value) || 10), 100);
        setItemsPerPage(value);
        if (typeof window !== 'undefined') {
            localStorage.setItem('userManagement-itemsPerPage', value);
        }
        setCurrentPage(1);  // Reset to first page when changing page size
    };

    // Pagination logic
    const totalPages = Math.ceil(totalUsers / itemsPerPage);
    const paginatedUsers = users;

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">User Management</h1>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-100 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <select
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-100 appearance-none w-full sm:w-auto"
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                            >
                                <option value={5}>5 per page</option>
                                <option value={10}>10 per page</option>
                                <option value={20}>20 per page</option>
                                <option value={50}>50 per page</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-[300px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C6B06A]"></div>
                      </div>
                    ) : error ? (
                        <div className="p-4 text-red-500 text-center">{error}</div>
                    ) : (
                        <>
                            <div className="overflow-x-auto rounded-lg border shadow-sm">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr className="bg-gray-100 text-xs sm:text-sm">
                                            {['Photo & Name', 'Email', 'Year', 'Gender', 'Last Assessment', 'Registered', 'Action'].map((header, index) => (
                                                <th
                                                    key={index}
                                                    className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-600 cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                                                    onClick={() => handleSort(header.toLowerCase().replace(/ & /g, '').replace(/ of /g, ''))}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="truncate">{header}</span>
                                                        <span className="ml-1 sm:ml-3 w-4 inline-block text-center">
                                                            {(sortField === header.toLowerCase().replace(/ & /g, '').replace(/ of /g, '') ||
                                                                (header.toLowerCase().replace(/ & /g, '') === 'photoname' && sortField === 'name') ||
                                                                (header.toLowerCase().includes('year') && sortField === 'yearOfBirth') ||
                                                                (header.toLowerCase() === 'registered' && sortField === 'createdAt'))
                                                                ? (sortOrder === 'asc' ? '↑' : '↓')
                                                                : ''}
                                                        </span>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
                                        {paginatedUsers.length > 0 ? (
                                            paginatedUsers.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                    {/* <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">{user.id}</td> */}
                                                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                                                        <div className="flex items-center min-w-[150px]">
                                                            {user.profilePicture ? (
                                                                <Image
                                                                    src={user.profilePicture}
                                                                    alt={user.name}
                                                                    width={32}
                                                                    height={32}
                                                                    className="rounded-full mr-2 w-8 h-8 sm:w-10 sm:h-10"
                                                                />
                                                            ) : (
                                                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-200 flex items-center justify-center mr-2 sm:mr-3">
                                                                    <span className="text-gray-500 font-semibold text-xs sm:text-sm">
                                                                        {user.name ? user.name.charAt(0).toUpperCase() : ''}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <span className="truncate max-w-[100px] sm:max-w-none">{user.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-2 sm:py-3 px-2 sm:px-4 max-w-[120px] sm:max-w-none truncate">{user.email}</td>
                                                    <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">{user.yearOfBirth}</td>
                                                    <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">{user.gender}</td>
                                                    <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                                                        {user.lastAssessment || '-'}
                                                    </td>
                                                    <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : '-'}
                                                    </td>
                                                    <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                                                        <Link
                                                            href={`/user-mangement/${user.id}`}
                                                            className="inline-block px-3 py-1 sm:px-4 sm:py-2 bg-[#FF9933] text-white rounded-lg hover:bg-[#FF9955] transition-colors text-xs sm:text-sm whitespace-nowrap"
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
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                                <div className="text-xs sm:text-sm text-gray-600">
                                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalUsers)} of {totalUsers} entries
                                </div>
                                <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 sm:px-4 sm:py-2 border rounded-lg text-xs sm:text-sm disabled:opacity-50 hover:bg-[#FF9933] hover:text-white transition-colors"
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-lg text-xs sm:text-sm ${currentPage === i + 1
                                                ? 'bg-[#FF9933] text-white'
                                                : 'hover:bg-gray-100'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 sm:px-4 sm:py-2 border rounded-lg text-xs sm:text-sm disabled:opacity-50 hover:bg-[#FF9933] hover:text-white transition-colors"
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