"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

function UserGTRPage({ params }) {
    return <UserGTRContent params={params} />;
}

function UserGTRContent({ params }) {
    const { userId } = params;
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State management for showing/hiding sections
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

                // 1. Fetch user data from /users
                const userUrl = new URL("https://api-test.goodtime.app/users");
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

                // 2. Fetch assessment session data from /assessments/sessions
                const sessionUrl = new URL("https://api-test.goodtime.app/assessments/sessions");
                sessionUrl.searchParams.append("page", "1");
                sessionUrl.searchParams.append("pageSize", "10");
                sessionUrl.searchParams.append("sort", "-createdAt");
                sessionUrl.searchParams.append("filter[userId]", userId);

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
                const latestSession = sessionJson.data?.[0];

                setUser({
                    id: foundUser.id,
                    name: foundUser.name,
                    email: foundUser.email,
                    profilePicture: foundUser.profilePicturePath || null,
                    gender: foundUser.gender,
                    yearOfBirth: foundUser.yearOfBirth,
                    lastAssessment: latestSession?.createdAt || null,

                    // GTR scores
                    gtrScore: latestSession?.gtr ?? 0,
                    selfScore: latestSession?.selfGtr ?? 0,
                    socialScore: latestSession?.socialGtr ?? 0,
                    actionsScore: latestSession?.actionsGtr ?? 0,
                    getsScore: latestSession?.getsGtr ?? 0,
                    environmentScore: latestSession?.environmentGtr ?? 0,

                    // Self assessment scores
                    physicalHealthScore: latestSession?.selfAssessments?.find((a) => a.element === "physical_health")?.feeling5Count ?? 0,
                    physicalFitnessScore: 0,
                    bodilyComfortScore: latestSession?.selfAssessments?.find((a) => a.element === "bodily_comfort")?.feeling5Count ?? 0,
                    emotionalHealthScore: latestSession?.selfAssessments?.find((a) => a.element === "emotional_health")?.feeling5Count ?? 0,
                    moodScore: latestSession?.selfAssessments?.find((a) => a.element === "mood")?.feeling5Count ?? 0,
                    stressLevelScore: latestSession?.selfAssessments?.find((a) => a.element === "stress_level")?.feeling5Count ?? 0,
                    mentalClarityScore: latestSession?.selfAssessments?.find((a) => a.element === "mental_clarity")?.feeling5Count ?? 0,
                    selfAwarenessScore: 0,
                    selfAcceptanceScore: latestSession?.selfAssessments?.find((a) => a.element === "self_acceptance")?.feeling5Count ?? 0,
                    senseOfPurposeScore: latestSession?.selfAssessments?.find((a) => a.element === "sense_of_purpose")?.feeling5Count ?? 0,
                    innerPeaceScore: latestSession?.selfAssessments?.find((a) => a.element === "inner_peace")?.feeling5Count ?? 0,
                });

                setSession(latestSession || null);
            } catch (error) {
                setError(error.message);
                setUser(null);
                setSession(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndSession();
    }, [userId]);

    const formatElementName = (name) => {
        if (!name) return "";
        return name.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
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
                            className="h-[30px] bg-[#C6B06A] transition-all duration-500 ease-in-out relative"
                            style={{ width: `${parseFloat(score).toFixed(1)}%` }}
                        >
                            <div className="absolute inset-0 flex items-center justify-end pr-2">
                                <span className="text-white text-xs font-medium">{parseFloat(score).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ml-2">
                    <button
                        onClick={toggleExpanded}
                        className="text-gray-500 hover:text-gray-700 transform transition-transform duration-300"
                        style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
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
                <div className="flex flex-col gap-3 py-2">
                    {elements.map((element, idx) => {
                        const percent = parseFloat(element.gtr ?? element.score ?? 0).toFixed(1);
                        return (
                            <div key={idx} className="flex items-center">
                                <div className="flex items-center justify-end w-[220px] min-w-[220px] pr-4">
                                    {/* {element.isHigh && (
                                        <span className="mr-2 text-blue-600 text-lg" title="High">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#2563eb">
                                                <circle cx="12" cy="12" r="8" />
                                            </svg>
                                        </span>
                                    )}
                                    {element.isLow && (
                                        <span className="mr-2 text-red-600 text-lg" title="Low">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#dc2626">
                                                <circle cx="12" cy="12" r="8" />
                                            </svg>
                                        </span>
                                    )} */}
                                    <span className="text-gray-700 text-sm whitespace-nowrap">{formatElementName(element.element)}</span>
                                </div>
                                <div className="w-full h-[30px] bg-[#B60A06] rounded-full overflow-hidden relative">
                                    <div
                                        className="h-[30px] bg-[#C6B06A] transition-all duration-500 ease-in-out relative"
                                        style={{ width: `${percent}%` }}
                                    >
                                        {parseFloat(percent) >= 4.0 && (
                                            <span
                                                className="text-white text-xs font-semibold absolute"
                                                style={{
                                                    right: '8px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)'
                                                }}
                                            >
                                                {percent}%
                                            </span>
                                        )}
                                    </div>
                                    {parseFloat(percent) < 4.0 && (
                                        <span
                                            className="text-white text-xs font-semibold absolute"
                                            style={{
                                                left: '8px',
                                                top: '50%',
                                                transform: 'translateY(-50%)'
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

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin h-12 w-12 border-t-4 border-blue-500 rounded-full"></div>
            </div>
        );
    if (error)
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl text-red-500 font-bold mb-4">{error}</h1>
                <Link href="/user-mangement" className="text-blue-600 hover:text-blue-800">
                    Back to User Management
                </Link>
            </div>
        );
    if (!user)
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin h-12 w-12 border-t-4 border-blue-500 rounded-full"></div>
            </div>
        );

    return (
        <div className="w-full min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* User table */}
                <div className="overflow-x-auto rounded-lg border bg-white mb-6 text-sm">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-3 px-4 text-left font-semibold text-gray-600">Status</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-600">ID</th>
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
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4">In Progress</td>
                                <td className="py-3 px-4">{user.id}</td>
                                <td className="py-3 px-4">{user.name}</td>
                                <td className="py-3 px-4">{parseFloat(user.gtrScore).toFixed(1)}%</td>
                                <td className="py-3 px-4">{parseFloat(user.selfScore).toFixed(1)}%</td>
                                <td className="py-3 px-4">{parseFloat(user.socialScore).toFixed(1)}%</td>
                                <td className="py-3 px-4">{parseFloat(user.actionsScore).toFixed(1)}%</td>
                                <td className="py-3 px-4">{parseFloat(user.getsScore).toFixed(1)}%</td>
                                <td className="py-3 px-4">{parseFloat(user.environmentScore).toFixed(1)}%</td>
                                <td className="py-3 px-4">
                                    <button
                                        onClick={() => {
                                            const newState = !showDetails;
                                            setShowDetails(newState);
                                            if (typeof window !== "undefined") {
                                                localStorage.setItem(`user-${userId}-showDetails`, JSON.stringify(newState));
                                            }
                                        }}
                                        className="px-4 py-2 bg-[#FF9933] text-white rounded-lg hover:bg-[#FF9955] transition-colors"
                                    >
                                        {showDetails ? "Hide" : "View"}
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Main content area - only shown when View is clicked */}
                {showDetails && (
                    <div className="grid grid-cols-3 gap-6 mt-6">
                        {/* GTR Score section - takes up 2/3 of the width */}
                        <div className="col-span-2 bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">GTR Score</h2>
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
                                    <div className="h-[30px] bg-[#C6B06A] transition-all duration-500 ease-in-out relative" style={{ width: `${user.gtrScore}%` }}>
                                        <div className="absolute inset-0 flex items-center justify-end pr-2">
                                        {parseFloat(user.gtrScore) >= 4.0 && (
                                            <span
                                                className="text-white text-xs font-semibold absolute"
                                                style={{
                                                    right: '8px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)'
                                                }}
                                            >{parseFloat(user.gtrScore).toFixed(1)}%
                                            </span>
                                        )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Self section */}
                            <AreaSection
                                title="Self"
                                score={parseFloat(user.selfScore)}
                                elements={[
                                    { element: "Physical Health", score: parseFloat(user.physicalHealthScore) },
                                    { element: "Physical Fitness", score: parseFloat(user.physicalFitnessScore) },
                                    { element: "Bodily Comfort", score: parseFloat(user.bodilyComfortScore) },
                                    { element: "Emotional Health", score: parseFloat(user.emotionalHealthScore) },
                                    { element: "Mood", score: parseFloat(user.moodScore) },
                                    { element: "Stress level", score: parseFloat(user.stressLevelScore) },
                                    { element: "Mental Clarity", score: parseFloat(user.mentalClarityScore) },
                                    { element: "Self-Awareness", score: parseFloat(user.selfAwarenessScore) },
                                    { element: "Self-Acceptance", score: parseFloat(user.selfAcceptanceScore) },
                                    { element: "Sense of Purpose", score: parseFloat(user.senseOfPurposeScore) },
                                    { element: "Inner Peace", score: parseFloat(user.innerPeaceScore) },
                                ]}
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
                                score={parseFloat(user.socialScore)}
                                elements={[
                                    { element: "Family Relationships", score: 75 },
                                    { element: "Friendships", score: 80 },
                                    { element: "Romantic Relationships", score: 70 },
                                    { element: "Work Relationships", score: 85 },
                                    { element: "Community Connection", score: 65 }
                                ]}
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
                                score={parseFloat(user.actionsScore)}
                                elements={[
                                    { element: "Daily Activities", score: 82 },
                                    { element: "Work Performance", score: 78 },
                                    { element: "Personal Projects", score: 75 },
                                    { element: "Learning & Growth", score: 70 },
                                    { element: "Time Management", score: 85 }
                                ]}
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
                                score={parseFloat(user.getsScore)}
                                elements={[
                                    { element: "Basic Needs", score: 90 },
                                    { element: "Financial Security", score: 75 },
                                    { element: "Career Satisfaction", score: 80 },
                                    { element: "Personal Achievement", score: 85 },
                                    { element: "Life Balance", score: 70 }
                                ]}
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
                                score={parseFloat(user.environmentScore)}
                                elements={[
                                    { element: "Living Space", score: 85 },
                                    { element: "Work Environment", score: 75 },
                                    { element: "Community Safety", score: 80 },
                                    { element: "Access to Nature", score: 70 },
                                    { element: "Environmental Quality", score: 75 }
                                ]}
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