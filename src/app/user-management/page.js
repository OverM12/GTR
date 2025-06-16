"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Papa from "papaparse";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalUsers, setTotalUsers] = useState(0);
    const [error, setError] = useState(null);
    const [sortField, setSortField] = useState("id");
    const [sortOrder, setSortOrder] = useState('asc');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    // console.log("currentPage", currentPage);
    const [searchTerm, setSearchTerm] = useState('');

    const endDateRef = useRef(null);
    const [isStartOpen, setIsStartOpen] = useState(false);
    const [isEndOpen, setIsEndOpen] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showDateModal, setShowDateModal] = useState(false);
    const [tempStartDate, setTempStartDate] = useState(null);
    const [tempEndDate, setTempEndDate] = useState('');
    const [exportReady, setExportReady] = useState(false);
    const [selectingField, setSelectingField] = useState(null); // "fromDate" | "toDate"
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date().getMonth());
    const [currentCalendarYear, setCurrentCalendarYear] = useState(new Date().getFullYear());
    const datePickerRef = useRef(null); // ใช้สำหรับปิด popup เมื่อคลิกข้างนอก

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    throw new Error("Token not found in localStorage."); //Should be redirect to login page
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
                const meta = json.meta || {};

                // Filter and sort locally if you want
                if (searchTerm) {
                    fetchedUsers = fetchedUsers.filter((user) =>
                        (user.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (user.email ?? '').toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }

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

                setUsers(fetchedUsers);
                setTotalUsers(meta.totalRecords ?? fetchedUsers.length);
                setItemsPerPage(meta.pageSize ?? itemsPerPage);
                setCurrentPage(meta.page ?? currentPage);
                setError(null);
                fetchLastAssessmentDates(fetchedUsers);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to load user data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [sortField, sortOrder, searchTerm, currentPage, itemsPerPage]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setShowDatePicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const formatDateForDisplay = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const generateCalendar = () => {
        const firstDay = new Date(currentCalendarYear, currentCalendarMonth, 1);
        const startingDayOfWeek = firstDay.getDay();
        const daysInMonth = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();

        const calendarDays = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="w-8 h-8" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = `${currentCalendarYear}-${String(currentCalendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isInRange = date >= startDate && date <= endDate;
            const isStartDate = date === startDate;
            const isEndDate = date === endDate;

            calendarDays.push(
                <div
                    key={`day-${day}`}
                    onClick={() => handleDateClick(date)}
                    className={`w-8 h-8 flex items-center justify-center cursor-pointer text-sm transition-colors
                ${isInRange && !isStartDate && !isEndDate ? "bg-orange-100" : ""}
                ${isStartDate || isEndDate ? "bg-[#FF9933] text-white rounded-full" : "rounded-full"}
                ${date === new Date().toISOString().split("T")[0] && !isStartDate && !isEndDate ? "border border-gray-400" : ""}
                hover:bg-gray-200 hover:rounded-full`}
                >
                    {day}
                </div>
            );
        }

        return calendarDays;
    };

    const handleDateClick = (date) => {
        if (selectingField === "fromDate") {
            setStartDate(date);
            setSelectingField("toDate");
        } else {
            if (date < startDate) {
                setStartDate(date);
                setEndDate(startDate);
            } else {
                setEndDate(date);
            }
            setShowDatePicker(false);
        }
    };

    const CustomDatePicker = () => {
        if (!showDatePicker) return null;
    
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const years = Array.from({ length: 21 }, (_, i) => new Date().getFullYear() - 10 + i);
    
        return (
          <div className="fixed inset-0 z-50 bg-black/20 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 w-[90vw] max-w-[320px]" ref={datePickerRef}>
              <div className="flex justify-between items-center mb-2">
                <select
                  value={currentCalendarMonth}
                  onChange={(e) => setCurrentCalendarMonth(parseInt(e.target.value))}
                  className="bg-gray-100 rounded px-2 py-1 text-sm"
                >
                  {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
                </select>
                <select
                  value={currentCalendarYear}
                  onChange={(e) => setCurrentCalendarYear(parseInt(e.target.value))}
                  className="bg-gray-100 rounded px-2 py-1 text-sm"
                >
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
    
              <div className="grid grid-cols-7 gap-1 mb-2 text-xs text-gray-600">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => <div key={d} className="w-7 h-7 flex items-center justify-center text-xs sm:w-8 sm:h-8 sm:text-sm">{d}</div>)}
              </div>
    
              <div className="grid grid-cols-7 gap-1">{generateCalendar()}</div>
    
              <div className="mt-2 text-xs text-gray-500 text-center italic">
                {selectingField === "fromDate" ? "Click to select start date" : "Click to select end date"}
              </div>
            </div>
          </div>
        );
      };
      
    // const downloadCSVFromAPI = async () => {
    //     try {
    //         const token = localStorage.getItem("accessToken");
    //         if (!token) throw new Error("Missing token");

    //         // ใช้ค่าจาก state
    //         const page = currentPage;
    //         const pageSize = itemsPerPage;
    //         const gte = startDate || "2025-05-01";  // fallback ถ้ายังไม่ได้กรอก
    //         const lte = endDate || "2025-05-31";    // fallback ถ้ายังไม่ได้กรอก

    //         const url = `${process.env.NEXT_PUBLIC_BASE_URL}/users/export?` +
    //             `filter[role]=participant` +
    //             `&page=${page}` +
    //             `&pageSize=${pageSize}` +
    //             `&sort=-createdAt` +
    //             `&filter[latestSession.createdAt][gte]=${gte}` +
    //             `&filter[latestSession.createdAt][lte]=${lte}`;

    //         const response = await fetch(url, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 "Content-Type": "application/json",
    //             },
    //         });

    //         if (!response.ok) {
    //             throw new Error(`Export failed: ${response.status}`);
    //         }

    //         const csvText = await response.text();
    //         const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
    //         const downloadUrl = window.URL.createObjectURL(blob);

    //         const link = document.createElement("a");
    //         link.href = downloadUrl;
    //         link.setAttribute("download", "exported_users.csv");
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //     } catch (err) {
    //         console.error("CSV Export Error:", err);
    //         alert("Export failed. Please try again.");
    //     }
    // };


    const downloadCSVFromAPI = async (gte, lte) => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("Missing token");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/users/export?filter[role]=participant&page=${currentPage}&pageSize=${itemsPerPage}&sort=-createdAt&filter[latestSession.createdAt][gte]=${gte}&filter[latestSession.createdAt][lte]=${lte}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) throw new Error(`Export failed: ${response.status}`);

            const csvText = await response.text();
            const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "exported_users.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("CSV Export Error:", err);
            alert("Export failed.");
        }
    };


    const exportToCSV = () => {
        // กรองตามวันที่ถ้ามีการกรอก
        const filtered = paginatedUsers.filter(user => {
            if (!user.lastAssessment) return false;
            const date = new Date(user.lastAssessment);
            if (startDate && endDate) {
                return date >= new Date(startDate) && date <= new Date(endDate);
            }
            return true;
        });

        const data = filtered.map(user => ({
            Name: user.name,
            Email: user.email,
            Gender: user.gender,
            "Year of Birth": user.yearOfBirth,
            "Country of Origin": user.countryOfOrigin,
            "Current Location": user.currentCountry,
            "Last Assessment": user.lastAssessment ? new Date(user.lastAssessment).toLocaleDateString('en-GB') : "-",
            Registered: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : "-",
            Status: user.status ?? "",
            "Total GTR": user.totalGtr ?? "",
            Self: user.self ?? "",
            Social: user.social ?? "",
            Actions: user.actions ?? "",
            Gets: user.gets ?? "",
            Environment: user.environment ?? ""
        }));

        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "filtered_users.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const fetchLastAssessmentDates = async (usersList) => {
        const token = localStorage.getItem("accessToken");
        const updatedUsers = await Promise.all(
            usersList.map(async (user) => {
                try {
                    const sessionRes = await fetch(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/assessments/sessions?page=1&pageSize=1&sort=-createdAt&filter[userId]=${user.id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    if (!sessionRes.ok) throw new Error("Failed to fetch session");

                    const sessionData = await sessionRes.json();
                    const lastAssessment = sessionData.data?.[0]?.createdAt || null;

                    return {
                        ...user,
                        lastAssessment,
                    };
                } catch (err) {
                    console.error(`Error fetching session for user ${user.id}:`, err);
                    return {
                        ...user,
                        lastAssessment: null,
                    };
                }
            })
        );
        setUsers(updatedUsers);
    };

    const handleSort = (field) => {

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
    const paginatedUsers = users; // API already paginates

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        <h1 className="text-[32px] sm:text-[32px] font-bold text-gray-800">User Management</h1>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            {/* <input
                                type="text"
                                placeholder="Search users..."
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-100 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            /> */}
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
                            <div className="flex gap-2 items-center">
                                <button
                                    onClick={() => {
                                        setSelectingField("fromDate");
                                        setShowDateModal(true);
                                        setShowDatePicker(true);
                                    }}
                                    className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                                >
                                    Export CSV
                                </button>
                            </div>

                            {/* Modal Popup */}
                            {showDateModal && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
                                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                                        <h2 className="text-lg font-semibold mb-4">Select Date Range</h2>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex gap-2 items-center justify-center">
                                                <div
                                                    onClick={() => {
                                                        setSelectingField("fromDate");
                                                        setShowDatePicker(true);
                                                    }}
                                                    className="bg-gray-100 px-3 py-2 rounded cursor-pointer"
                                                >
                                                    {formatDateForDisplay(startDate) || "Start Date"}
                                                </div>
                                                <span>to</span>
                                                <div
                                                    onClick={() => {
                                                        setSelectingField("toDate");
                                                        setShowDatePicker(true);
                                                    }}
                                                    className="bg-gray-100 px-3 py-2 rounded cursor-pointer"
                                                >
                                                    {formatDateForDisplay(endDate) || "End Date"}
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2 mt-4">
                                                <button
                                                    onClick={() => setShowDateModal(false)}
                                                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowDateModal(false);
                                                        downloadCSVFromAPI(startDate, endDate);
                                                    }}
                                                    disabled={!startDate || !endDate}
                                                    className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    Export CSV
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {showDatePicker && <CustomDatePicker />}
                                </div>
                            )}

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
                                                            {user.profilePictureUrl ? (
                                                                <Image
                                                                    src={user.profilePictureUrl}
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
                                                        {user.lastAssessment ? new Date(user.lastAssessment).toLocaleDateString('en-GB') : '-'}
                                                    </td>
                                                    <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : '-'}
                                                    </td>
                                                    <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                                                        <Link
                                                            href={`/user-management/${user.id}`}
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