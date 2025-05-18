"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import userData from '../../usermangement.json';

async function UserGTRPage({ params }) {
    // Create a client component wrapper since we can't use hooks directly in an async component
    return <UserGTRContent params={params} />;
}

// Client component to handle state and rendering
function UserGTRContent({ params }) {
    const { userId } = params;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDetails, setShowDetails] = useState(() => {
        // Check if we're in the browser environment
        if (typeof window !== 'undefined') {
            // Get the stored value or default to false
            const stored = localStorage.getItem(`user-${userId}-showDetails`);
            return stored ? JSON.parse(stored) : false;
        }
        return false;
    });
    // Initialize all toggle states from localStorage
    const [showSelf, setShowSelf] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(`user-${userId}-showSelf`);
            return stored ? JSON.parse(stored) : false;
        }
        return false;
    });
    
    const [showSocial, setShowSocial] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(`user-${userId}-showSocial`);
            return stored ? JSON.parse(stored) : false;
        }
        return false;
    });
    
    const [showActions, setShowActions] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(`user-${userId}-showActions`);
            return stored ? JSON.parse(stored) : false;
        }
        return false;
    });
    
    const [showGets, setShowGets] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(`user-${userId}-showGets`);
            return stored ? JSON.parse(stored) : false;
        }
        return false;
    });
    
    const [showEnvironment, setShowEnvironment] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(`user-${userId}-showEnvironment`);
            return stored ? JSON.parse(stored) : false;
        }
        return false;
    });

    useEffect(() => {
        try {
            if (userId) {
                const foundUser = userData.data.find(u => String(u.id) === String(userId));
                if (foundUser) {
                    setUser(foundUser);
                } else {
                    setError("User not found");
                }
            } else {
                setError("Invalid user ID");
            }
        } catch (err) {
            setError("Failed to load user data: " + err.message);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const AreaSection = ({ title, score, elements, isExpanded, toggleExpanded }) => (
        <div className="w-full mt-6">
            <div className="flex items-center mb-2">
                <div className="flex items-center gap-2 w-[150px]">
                    <span className="font-semibold text-gray-800 pl-12">{title}</span>
                </div>
                <div className="flex-1 flex justify-end">
                    <div className="w-[600px] bg-[#B60A06] h-[28px] rounded-full relative overflow-hidden">
                        <div className="h-[28px] bg-[#C6B06A] rounded-full relative" style={{ width: `${score}%` }}>
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
                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15"></polyline>
                      </svg>
                    </button>
                </div>
            </div>
            {isExpanded && elements.length > 0 && (
                <div className="mt-3 pl-6 space-y-3">
                    {elements.map((el, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                            <span className="text-gray-700 text-xs w-[150px] pl-26 text-nowrap">{el.element}</span>
                            <div className="w-[500px] bg-[#B60A06] h-[28px] rounded-full relative overflow-hidden">
                                <div className="h-[28px] bg-[#C6B06A] rounded-full relative" style={{ width: `${el.score}%` }}>
                                    <div className="absolute inset-0 flex items-center justify-end pr-2">
                                        <span className="text-white text-xs font-medium">{parseFloat(el.score).toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin h-12 w-12 border-t-4 border-blue-500 rounded-full"></div></div>;
    if (error) return <div className="flex flex-col items-center justify-center h-screen"><h1 className="text-2xl text-red-500 font-bold mb-4">{error}</h1><Link href="/user-mangement" className="text-blue-600 hover:text-blue-800">Back to User Management</Link></div>;
    if (!user) return <div className="flex justify-center items-center h-screen"><div className="animate-spin h-12 w-12 border-t-4 border-blue-500 rounded-full"></div></div>;

    return (
        <div className="w-full min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* User table */}
                <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-6 mb-6">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="p-4 border border-gray-200 font-medium text-left">Status</th>
                                <th className="p-4 border border-gray-200 font-medium text-left">ID</th>
                                <th className="p-4 border border-gray-200 font-medium text-left">Name</th>
                                <th className="p-4 border border-gray-200 font-medium text-left">GTR</th>
                                <th className="p-4 border border-gray-200 font-medium text-left">Self</th>
                                <th className="p-4 border border-gray-200 font-medium text-left">Social</th>
                                <th className="p-4 border border-gray-200 font-medium text-left">Actions</th>
                                <th className="p-4 border border-gray-200 font-medium text-left">Gets</th>
                                <th className="p-4 border border-gray-200 font-medium text-left">Environment</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-4 border border-gray-200">{user.status === 'active' ? 'In Progress' : user.status === 'pending' ? 'Pending' : 'Complete'}</td>
                                <td className="p-4 border border-gray-200">{user.id}</td>
                                <td className="p-4 border border-gray-200">{user.name}</td>
                                <td className="p-4 border border-gray-200">{parseFloat(user.gtrScore).toFixed(1)}%</td>
                                <td className="p-4 border border-gray-200">{parseFloat(user.selfScore).toFixed(1)}%</td>
                                <td className="p-4 border border-gray-200">{parseFloat(user.socialScore).toFixed(1)}%</td>
                                <td className="p-4 border border-gray-200">{parseFloat(user.actionsScore).toFixed(1)}%</td>
                                <td className="p-4 border border-gray-200">{parseFloat(user.getsScore).toFixed(1)}%</td>
                                <td className="p-4 border border-gray-200 flex justify-between items-center">
                                    <span>{parseFloat(user.environmentScore).toFixed(1)}%</span>
                                    <button 
                                        onClick={() => {
                                            const newState = !showDetails;
                                            setShowDetails(newState);
                                            // Save to localStorage
                                            if (typeof window !== 'undefined') {
                                                localStorage.setItem(`user-${userId}-showDetails`, JSON.stringify(newState));
                                            }
                                        }} 
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        [{showDetails ? 'Hide' : 'View'}]
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
                                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                    Back to User Management
                                </Link>
                            </div>
                            
                            {/* Total GTR Score */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Total GTR Score</span>
                                    {/* <span>{parseFloat(user.gtrScore).toFixed(1)}%</span> */}
                                </div>
                                <div className="w-[700px] bg-[#B60A06] h-[28px] rounded-full mt-2 relative overflow-hidden">
                                    <div className="h-[28px] bg-[#C6B06A] rounded-full relative" style={{ width: `${user.gtrScore}%` }}>
                                        <div className="absolute inset-0 flex items-center justify-end pr-2">
                                            <span className="text-white text-xs font-medium">{parseFloat(user.gtrScore).toFixed(1)}%</span>
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
                                    { element: "Inner Peace", score: parseFloat(user.innerPeaceScore) }
                                ]}
                                isExpanded={showSelf}
                                toggleExpanded={() => {
                                    const newState = !showSelf;
                                    setShowSelf(newState);
                                    if (typeof window !== 'undefined') {
                                        localStorage.setItem(`user-${userId}-showSelf`, JSON.stringify(newState));
                                    }
                                }}
                            />

                            <AreaSection
                                title="Social"
                                score={parseFloat(user.socialScore)}
                                elements={[
                                    { element: "Relationships", score: 72 },
                                    { element: "Family Support", score: 65 },
                                    { element: "Social Engagement", score: 70 },
                                    { element: "Communication", score: 75 }
                                ]}
                                isExpanded={showSocial}
                                toggleExpanded={() => {
                                    const newState = !showSocial;
                                    setShowSocial(newState);
                                    if (typeof window !== 'undefined') {
                                        localStorage.setItem(`user-${userId}-showSocial`, JSON.stringify(newState));
                                    }
                                }}
                            />

                            <AreaSection
                                title="Actions"
                                score={parseFloat(user.actionsScore)}
                                elements={[
                                    { element: "Daily Routines", score: 79 },
                                    { element: "Work Habits", score: 83 },
                                    { element: "Goal Achievement", score: 82 },
                                    { element: "Time Management", score: 82 }
                                ]}
                                isExpanded={showActions}
                                toggleExpanded={() => {
                                    const newState = !showActions;
                                    setShowActions(newState);
                                    if (typeof window !== 'undefined') {
                                        localStorage.setItem(`user-${userId}-showActions`, JSON.stringify(newState));
                                    }
                                }}
                            />

                            <AreaSection
                                title="Obtainments"
                                score={parseFloat(user.getsScore)}
                                elements={[
                                    { element: "Financial Stability", score: 74 },
                                    { element: "Material Needs", score: 70 },
                                    { element: "Access to Resources", score: 72 }
                                ]}
                                isExpanded={showGets}
                                toggleExpanded={() => {
                                    const newState = !showGets;
                                    setShowGets(newState);
                                    if (typeof window !== 'undefined') {
                                        localStorage.setItem(`user-${userId}-showGets`, JSON.stringify(newState));
                                    }
                                }}
                            />

                            <AreaSection
                                title="Environment"
                                score={parseFloat(user.environmentScore)}
                                elements={[
                                    { element: "Living Space", score: 70 },
                                    { element: "Work Environment", score: 68 },
                                    { element: "Community Safety", score: 67 },
                                    { element: "Natural Surroundings", score: 72 }
                                ]}
                                isExpanded={showEnvironment}
                                toggleExpanded={() => {
                                    const newState = !showEnvironment;
                                    setShowEnvironment(newState);
                                    if (typeof window !== 'undefined') {
                                        localStorage.setItem(`user-${userId}-showEnvironment`, JSON.stringify(newState));
                                    }
                                }}
                            />

                        </div>

                        {/* Right sidebar with profile info */}
                        <div className="col-span-1 space-y-6">
                            {/* Profile Info */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold mb-4">Profile Info</h3>
                                <div className="flex flex-col items-center">
                                    {user.profilePicture ? (
                                        <Image src={user.profilePicture} alt={user.name} width={80} height={80} className="rounded-full mb-3" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full border border-gray-200 flex items-center justify-center mb-3">
                                            <span className="text-gray-600 text-2xl font-semibold">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                                        </div>
                                    )}
                                    <h2 className="text-xl font-bold text-gray-800 text-center">{user.name}</h2>
                                    <p className="text-gray-600 text-center mb-2">{user.email}</p>
                                    <div className="w-full text-sm text-gray-500">
                                        <p className="flex justify-between py-1 border-b"><span>ID:</span> <span>{user.id}</span></p>
                                        <p className="flex justify-between py-1 border-b"><span>Gender:</span> <span>{user.gender || 'Not specified'}</span></p>
                                        <p className="flex justify-between py-1"><span>Year of Birth:</span> <span>{user.yearOfBirth || 'Not specified'}</span></p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Last Assessment */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold mb-2">Last Assessment</h3>
                                <p className="text-gray-700">{new Date(user.lastAssessment).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserGTRPage;