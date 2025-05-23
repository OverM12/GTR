"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDateRange } from "@/context/DateRangeContext";
import { use } from "react";

function UserGTRPage({ params }) {
    // แก้ไข: resolve Promise params ด้วย use()
    const paramsResolved = use(params);

    return <UserGTRContent params={paramsResolved} />;
}

function UserGTRContent({ params }) {
    const { dateRange } = useDateRange();
    const userId = params.userId;
    const [user, setUser] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // เลือก session ที่แสดง
    const [selectedSessionIndex, setSelectedSessionIndex] = useState(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(`user-${userId}-selectedSessionIndex`);
            return stored ? parseInt(JSON.parse(stored)) : 0;
        }
        return 0;
    });

    // State สำหรับการแสดงรายละเอียดต่าง ๆ
    const [showDetails, setShowDetails] = useState(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(`user-${userId}-showDetails`);
            return stored ? JSON.parse(stored) : false;
        }
        return false;
    });
    const [showSelf, setShowSelf] = useState(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(`user-${userId}-showSelf`);
            return stored ? JSON.parse(stored) : false;
        }
        return false;
    });
    const [showSocial, setShowSocial] = useState(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(`user-${userId}-showSocial`);
            return stored ? JSON.parse(stored) : false;
        }
        return false;
    });
    const [showActions, setShowActions] = useState(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(`user-${userId}-showActions`);
            return stored ? JSON.parse(stored) : false;
        }
        return false;
    });
    const [showGets, setShowGets] = useState(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(`user-${userId}-showGets`);
            return stored ? JSON.parse(stored) : false;
        }
        return false;
    });
    const [showEnvironment, setShowEnvironment] = useState(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(`user-${userId}-showEnvironment`);
            return stored ? JSON.parse(stored) : false;
        }
        return false;
    });

    useEffect(() => {
        const fetchUserAndSession = async () => {
            setLoading(true);
            setError(null);

            try {
                if (!userId) {
                    setError("Invalid user ID");
                    setLoading(false);
                    return;
                }

                const token = localStorage.getItem("accessToken");
                if (!token) {
                    setError("No access token found");
                    setLoading(false);
                    return;
                }

                // Fetch user info
                const userUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/users`);
                userUrl.searchParams.append("page", "1");
                userUrl.searchParams.append("pageSize", "50");
                userUrl.searchParams.append("filter[role]", "participant");

                const userRes = await fetch(userUrl.toString(), {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!userRes.ok) {
                    const errorText = await userRes.text();
                    throw new Error(`Failed to fetch users: ${errorText}`);
                }

                const userJson = await userRes.json();
                const foundUser = userJson.data.find((u) => u.id === userId);

                if (!foundUser) {
                    setError("User not found");
                    setLoading(false);
                    return;
                }

                // เซ็ต user info เบื้องต้น (lastAssessment จะตั้งทีหลัง)
                setUser({
                    id: foundUser.id,
                    name: foundUser.name,
                    email: foundUser.email,
                    profilePicture: foundUser.profilePicturePath || null,
                    gender: foundUser.gender,
                    yearOfBirth: foundUser.yearOfBirth,
                    lastAssessment: null, // แก้ไขให้ตั้งค่าจาก session หลังดึงเสร็จ
                    countryOfOrigin: foundUser.countryOfOrigin,
                    currentCountry: foundUser.currentCountry,
                    currentCity: foundUser.currentCity,
                });

                // Fetch sessions filtered by date range
                const sessionUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/assessments/sessions`);
                sessionUrl.searchParams.append("page", "1");
                sessionUrl.searchParams.append("pageSize", "100");
                sessionUrl.searchParams.append("sort", "-createdAt");
                sessionUrl.searchParams.append("filter[userId]", userId);

                if (dateRange.fromDate) {
                    sessionUrl.searchParams.append("filter[createdAt_gte]", dateRange.fromDate);
                }
                if (dateRange.toDate) {
                    sessionUrl.searchParams.append("filter[createdAt_lte]", dateRange.toDate);
                }

                const sessionRes = await fetch(sessionUrl.toString(), {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!sessionRes.ok) {
                    const errorText = await sessionRes.text();
                    throw new Error(`Failed to fetch session data: ${errorText}`);
                }

                const sessionJson = await sessionRes.json();

                setSessions(sessionJson.data || []);

                // แก้ไข: อัพเดต lastAssessment ด้วยวันที่ session ล่าสุด (ถ้ามี)
                if (sessionJson.data && sessionJson.data.length > 0) {
                    setUser(prev => ({
                        ...prev,
                        lastAssessment: sessionJson.data[0].createdAt,
                    }));
                } else {
                    setUser(prev => ({
                        ...prev,
                        lastAssessment: null,
                    }));
                }

            } catch (error) {
                setError(error.message);
                setUser(null);
                setSessions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndSession();
    }, [userId, dateRange.fromDate, dateRange.toDate]);

    // DEBUG: ดูข้อมูลก่อนแสดงผล
    console.log("user:", userId);
    console.log("sessions:", sessions);
    console.log("error:", error);

    const formatElementName = (name) => {
        if (!name) return "";
        return name.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const calculateAverageFeelingScore = (assessments, elementName) => {
        if (!assessments || assessments.length === 0) return 0;

        const element = assessments.find(a => a.element === elementName);
        if (!element) return 0;

        // Calculate average based on feeling counts
        let total = 0;
        let count = 0;

        for (let i = 1; i <= 7; i++) {
            const feelingKey = `feeling${i}Count`;
            if (element[feelingKey]) {
                total += i * element[feelingKey];
                count += element[feelingKey];
            }
        }

        if (count === 0) return 0;

        // Convert to percentage (assuming 7 is max)
        return (total / count / 7) * 100;
    };

    const getLatestSession = () => {
        return sessions.length > 0 ? sessions[selectedSessionIndex] : null;
    };

    const getSessionScores = (session) => {
        if (!session) return {
            gtr: 0,
            selfGtr: 0,
            socialGtr: 0,
            actionsGtr: 0,
            getsGtr: 0,
            environmentGtr: 0
        };

        return {
            gtr: session.gtr || 0,
            selfGtr: session.selfGtr || 0,
            socialGtr: session.socialGtr || 0,
            actionsGtr: session.actionsGtr || 0,
            getsGtr: session.getsGtr || 0,
            environmentGtr: session.environmentGtr || 0
        };
    };

    const getSelfElements = (session) => {
        if (!session || !session.selfAssessments) return [];

        return session.selfAssessments.map(assessment => ({
            element: assessment.element,
            score: calculateAverageFeelingScore(session.selfAssessments, assessment.element),
            feelings: assessment.feelings || []
        }));
    };

    const getSocialElements = (session) => {
        if (!session || !session.socialAssessments) return [];

        return session.socialAssessments.map(assessment => ({
            element: assessment.element,
            score: calculateAverageFeelingScore(session.socialAssessments, assessment.element),
            timeSpent: assessment.timeSpent,
            feelings: assessment.feelings || []
        }));
    };

    const getActionsElements = (session) => {
        if (!session || !session.actionsAssessments) return [];

        return session.actionsAssessments.map(assessment => ({
            element: assessment.element,
            score: calculateAverageFeelingScore(session.actionsAssessments, assessment.element),
            timeSpent: assessment.timeSpent,
            feelings: assessment.feelings || []
        }));
    };

    const getGetsElements = (session) => {
        if (!session || !session.getsAssessments) return [];

        return session.getsAssessments.map(assessment => ({
            element: assessment.element,
            score: calculateAverageFeelingScore(session.getsAssessments, assessment.element),
            priority: assessment.priority,
            elementGroup: assessment.elementGroup,
            feelings: assessment.feelings || []
        }));
    };

    const getEnvironmentElements = (session) => {
        if (!session || !session.environmentAssessments) return [];

        return session.environmentAssessments.map(assessment => ({
            element: assessment.element,
            score: calculateAverageFeelingScore(session.environmentAssessments, assessment.element),
            timeSpent: assessment.timeSpent,
            feelings: assessment.feelings || []
        }));
    };

    const AreaSection = ({ title, score, elements, isExpanded, toggleExpanded }) => (
        <div className="w-full mt-6">
            <div className="flex items-center mb-2">
                <div className="flex items-center gap-2 w-[150px]">
                    <span className="font-semibold text-gray-800 pl-12">{title}</span>
                </div>
                <div className="flex-1 flex justify-end">
                    <div className="w-full h-[30px] bg-[#B60A06] rounded-full overflow-hidden relative">
                        <div
                            className="h-full bg-[#C6B06A] transition-all duration-500 ease-in-out relative"
                            style={{ width: `${parseFloat(score).toFixed(1)}%` }}
                        >
                            {parseFloat(score) >= 4.0 && (
                                <span
                                    className="text-white text-xs font-semibold absolute"
                                    style={{
                                        right: "8px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                    }}
                                >
                                    {parseFloat(score).toFixed(1)}%
                                </span>
                            )}
                        </div>
                        {parseFloat(score) < 4.0 && (
                            <span
                                className="text-white text-xs font-semibold absolute"
                                style={{
                                    left: "8px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                }}
                            >
                                {parseFloat(score).toFixed(1)}%
                            </span>
                        )}
                    </div>
                </div>
                <div className="ml-2">
                    <button
                        onClick={toggleExpanded}
                        className="text-gray-500 hover:text-gray-700 transform transition-transform duration-300"
                        style={{ transform: isExpanded ? "rotate(0deg)" : "rotate(180deg)" }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Container for elements */}
            <div
                className={`ml-24 mb-4 pl-32 pr-13 border-l-2 border-gray-200 transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                    }`}
            >
                <div className="flex flex-col gap-2 md:gap-3 py-2">
                    {elements.map((element, idx) => {
                        const percent = parseFloat(element.score ?? 0).toFixed(1);
                        return (
                            <div
                                key={idx}
                                className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-0"
                            >
                                <div className="flex items-center w-full md:w-[300px] md:min-w-[0px] mb-2 md:mb-0">
                                    <span className="text-gray-700 text-xs md:text-sm whitespace-nowrap">
                                        {formatElementName(element.element)}
                                    </span>
                                </div>

                                <div className="w-full h-[24px] md:h-[30px] bg-[#B60A06] rounded-full overflow-hidden relative">
                                    <div
                                        className="h-full bg-[#C6B06A] transition-all duration-500 ease-in-out relative"
                                        style={{ width: `${percent}%` }}
                                    >
                                        {parseFloat(percent) >= 4.0 && (
                                            <span
                                                className="text-white text-[10px] md:text-xs font-semibold absolute"
                                                style={{
                                                    right: "8px",
                                                    top: "50%",
                                                    transform: "translateY(-50%)",
                                                }}
                                            >
                                                {percent}%
                                            </span>
                                        )}
                                    </div>
                                    {parseFloat(percent) < 4.0 && (
                                        <span
                                            className="text-white text-[10px] md:text-xs font-semibold absolute"
                                            style={{
                                                left: "8px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                            }}
                                        >
                                            {percent}%
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );


    if (
        error === "User not found" ||
        error?.toLowerCase().includes("failed to fetch session data") ||
        error?.toLowerCase().includes("page not found")
    ) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl text-gray-500 font-bold mb-4">No information</h1>
                <Link href="/user-management" className="text-blue-600 hover:text-blue-800">
                    Back to User Management
                </Link>
            </div>
        );
    }

    if (user && sessions && sessions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl text-gray-500 font-bold mb-4">No session data for the selected date range</h1>
                <Link href="/user-management" className="text-blue-600 hover:text-blue-800">
                    Back to User Management
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin h-12 w-12 border-t-4 border-blue-500 rounded-full"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin h-12 w-12 border-t-4 border-blue-500 rounded-full"></div>
            </div>
        );
    }

    const latestSession = getLatestSession();
    const sessionScores = getSessionScores(latestSession);

    return (
        <div className="w-full min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* User table */}
                <div className="overflow-x-auto rounded-lg border bg-white mb-6 text-sm">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-3 px-4 text-left font-semibold text-gray-600">Status</th>
                                {/* <th className="py-3 px-4 text-left font-semibold text-gray-600">ID</th> */}
                                <th className="py-3 px-4 text-left font-semibold text-gray-600">Name</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-600">GTR</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-600">Self</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-600">Social</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-600">Actions</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-600">Gets</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-600">Environment</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sessions.map((session, index) => {
                                const scores = getSessionScores(session);
                                return (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4">
                                            {session.isCompleted ? "Complete" : "In Progress"}
                                        </td>
                                        {/* <td className="py-3 px-4">{user.id}</td> */}
                                        <td className="py-3 px-4">{user.name}</td>
                                        <td className="py-3 px-4">{parseFloat(scores.gtr).toFixed(1)}%</td>
                                        <td className="py-3 px-4">{parseFloat(scores.selfGtr).toFixed(1)}%</td>
                                        <td className="py-3 px-4">{parseFloat(scores.socialGtr).toFixed(1)}%</td>
                                        <td className="py-3 px-4">{parseFloat(scores.actionsGtr).toFixed(1)}%</td>
                                        <td className="py-3 px-4">{parseFloat(scores.getsGtr).toFixed(1)}%</td>
                                        <td className="py-3 px-4">{parseFloat(scores.environmentGtr).toFixed(1)}%</td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => {
                                                    // If this is already the selected session, toggle visibility
                                                    if (selectedSessionIndex === index && showDetails) {
                                                        setShowDetails(false);
                                                        if (typeof window !== "undefined") {
                                                            // localStorage.setItem(`user-${userId}-showDetails`, JSON.stringify(false));
                                                        }
                                                    } else {
                                                        // Otherwise, select this session and show details
                                                        setSelectedSessionIndex(index);
                                                        setShowDetails(true);
                                                        if (typeof window !== "undefined") {
                                                            // localStorage.setItem(`user-${userId}-showDetails`, JSON.stringify(true));
                                                        }
                                                    }
                                                }}
                                                className={`px-4 py-2 rounded-lg transition-colors ${showDetails && selectedSessionIndex === index
                                                    ? "bg-white hover:bg-[#f8ece2] text-[#FF9933] border border-[#FF9933]"
                                                    : "bg-[#FF9955] hover:bg-[#f0ba85] text-white hover:"
                                                    }`}
                                            >
                                                {showDetails && selectedSessionIndex === index ? "Hide" : "View"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Remove the separate assessment history section */}

                {/* Main content area - only shown when View is clicked */}
                {showDetails && (
                    <div className="grid grid-cols-3 gap-6 mt-6">
                        {/* GTR Score section - takes up 2/3 of the width */}
                        <div className="col-span-2 bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    <h2 className="text-xl font-semibold">GTR Score</h2>
                                    {selectedSessionIndex > 0 && sessions[selectedSessionIndex] && (
                                        <span className="ml-2 text-sm text-gray-500">
                                            (Session from {new Date(sessions[selectedSessionIndex].createdAt).toLocaleDateString()})
                                        </span>
                                    )}
                                </div>
                                <Link href="/user-mangement" className="text-[#FF9933] hover:text-blue-800 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Back to User Management
                                </Link>
                            </div>

                            {/* Total GTR Score */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Total GTR Score</span>
                                </div>
                                <div className="w-full h-[30px] bg-[#B60A06] rounded-full overflow-hidden relative">
                                    <div className="h-[30px] bg-[#C6B06A] transition-all duration-500 ease-in-out relative" style={{ width: `${sessionScores.gtr}%` }}>
                                        <div className="absolute inset-0 flex items-center justify-end pr-2">
                                            {parseFloat(sessionScores.gtr) >= 4.0 && (
                                                <span
                                                    className="text-white text-xs font-semibold absolute"
                                                    style={{
                                                        right: '8px',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)'
                                                    }}
                                                >{parseFloat(sessionScores.gtr).toFixed(1)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Self section */}
                            <AreaSection
                                title="Self"
                                score={parseFloat(sessionScores.selfGtr)}
                                elements={getSelfElements(latestSession)}
                                isExpanded={showSelf}
                                toggleExpanded={() => {
                                    const newState = !showSelf;
                                    setShowSelf(newState);
                                    if (typeof window !== "undefined") {
                                        localStorage.setItem(`user-${userId}-showSelf`, JSON.stringify(newState));
                                    }
                                }}
                            />

                            {/* Social section */}
                            <AreaSection
                                title="Social"
                                score={parseFloat(sessionScores.socialGtr)}
                                elements={getSocialElements(latestSession)}
                                isExpanded={showSocial}
                                toggleExpanded={() => {
                                    const newState = !showSocial;
                                    setShowSocial(newState);
                                    if (typeof window !== "undefined") {
                                        localStorage.setItem(`user-${userId}-showSocial`, JSON.stringify(newState));
                                    }
                                }}
                            />

                            {/* Actions section */}
                            <AreaSection
                                title="Actions"
                                score={parseFloat(sessionScores.actionsGtr)}
                                elements={getActionsElements(latestSession)}
                                isExpanded={showActions}
                                toggleExpanded={() => {
                                    const newState = !showActions;
                                    setShowActions(newState);
                                    if (typeof window !== "undefined") {
                                        localStorage.setItem(`user-${userId}-showActions`, JSON.stringify(newState));
                                    }
                                }}
                            />

                            {/* Gets section */}
                            <AreaSection
                                title="Gets"
                                score={parseFloat(sessionScores.getsGtr)}
                                elements={getGetsElements(latestSession)}
                                isExpanded={showGets}
                                toggleExpanded={() => {
                                    const newState = !showGets;
                                    setShowGets(newState);
                                    if (typeof window !== "undefined") {
                                        localStorage.setItem(`user-${userId}-showGets`, JSON.stringify(newState));
                                    }
                                }}
                            />

                            {/* Environment section */}
                            <AreaSection
                                title="Environment"
                                score={parseFloat(sessionScores.environmentGtr)}
                                elements={getEnvironmentElements(latestSession)}
                                isExpanded={showEnvironment}
                                toggleExpanded={() => {
                                    const newState = !showEnvironment;
                                    setShowEnvironment(newState);
                                    if (typeof window !== "undefined") {
                                        localStorage.setItem(`user-${userId}-showEnvironment`, JSON.stringify(newState));
                                    }
                                }}
                            />
                        </div>

                        {/* User Info section - takes up 1/3 of the width */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">User Information</h2>

                            {user.profilePicture ? (
                                <img
                                    src={user.profilePicture}
                                    alt={user.name}
                                    className="w-24 h-24 rounded-full object-cover mb-4"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-4 text-4xl text-gray-600 font-bold">
                                    {user.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Name</label>
                                    <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Email</label>
                                    <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Gender</label>
                                    <p className="mt-1 text-sm text-gray-900">{user.gender || "Not specified"}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Year of Birth</label>
                                    <p className="mt-1 text-sm text-gray-900">{user.yearOfBirth || "Not specified"}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Country of Origin</label>
                                    <p className="mt-1 text-sm text-gray-900">{user.countryOfOrigin || "Not specified"}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Current Location</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {user.currentCity}, {user.currentCountry}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Last Assessment</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {user.lastAssessment ? new Date(user.lastAssessment).toLocaleDateString() : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserGTRPage;