"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import mockData from '../../usermangement.json';

function UserGTRPage({ params }) {
    const { userId } = params;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showSelf, setShowSelf] = useState(true);
    const [showSocial, setShowSocial] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [showGets, setShowGets] = useState(false);
    const [showEnvironment, setShowEnvironment] = useState(false);

    useEffect(() => {
        try {
            if (userId) {
                const foundUser = mockData.data.find(u => String(u.id) === String(userId));
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
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">{title}</span>
                    <span className="text-sm text-gray-600">{parseFloat(score).toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-2">
                    <Image src="/your-gtr/your-gtr/area-deep-dive/magnify-icon.svg" width={20} height={20} alt="Zoom" className="cursor-pointer" />
                    <button onClick={toggleExpanded}>
                        <Image src="/your-gtr/your-gtr/area-deep-dive/arrow-up-icon.svg" width={20} height={20} alt="Toggle" className={`transform transition-transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
                    </button>
                </div>
            </div>
            <div className="w-full bg-[#C6B06A] h-4 rounded-full mt-2">
                <div className="h-4 bg-[#B60A06] rounded-full" style={{ width: `${score}%` }} />
            </div>
            {isExpanded && elements.length > 0 && (
                <div className="mt-3 pl-4 space-y-2">
                    {elements.map((el, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between text-sm">
                                <span>{el.element}</span>
                                <span>{parseFloat(el.gtr).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-[#C6B06A] h-3 rounded-full">
                                <div className="h-3 bg-[#B60A06] rounded-full" style={{ width: `${el.gtr}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin h-12 w-12 border-t-4 border-blue-500 rounded-full"></div></div>;
    if (error) return <div className="flex flex-col items-center justify-center h-screen"><h1 className="text-2xl text-red-500 font-bold mb-4">{error}</h1><Link href="/user-mangement" className="text-blue-600 hover:text-blue-800">Back to User Management</Link></div>;

    // แทนที่ block return เดิมด้วยโค้ดด้านล่าง

    return (
        <div className="w-full min-h-screen bg-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <Link href="/user-mangement" className="text-[#FF9933] hover:text-blue-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to User Management
                    </Link>
                </div>

                {/* ตารางสรุปข้อมูลผู้ใช้ */}
                <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">ID</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">GTR</th>
                                <th className="px-4 py-2">Self</th>
                                <th className="px-4 py-2">Social</th>
                                <th className="px-4 py-2">Actions</th>
                                <th className="px-4 py-2">Gets</th>
                                <th className="px-4 py-2">Environment</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t">
                                <td className="px-4 py-2 text-orange-500">In Progress</td>
                                <td className="px-4 py-2">{user.id}</td>
                                <td className="px-4 py-2">{user.name}</td>
                                <td className="px-4 py-2">{user.gtrScore}%</td>
                                <td className="px-4 py-2">{user.selfScore}%</td>
                                <td className="px-4 py-2">{user.socialScore}%</td>
                                <td className="px-4 py-2">{user.actionsScore}%</td>
                                <td className="px-4 py-2">{user.getsScore}%</td>
                                <td className="px-4 py-2 text-blue-600 cursor-pointer underline">
                                    <button onClick={() => setShowDetail(true)}>[View]</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* แสดง GTR Score เฉพาะเมื่อกด View */}
                {showDetail && (
                    <>
                        <h1 className="text-2xl font-bold mt-10 mb-6">GTR Score</h1>

                        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                            <div className="flex items-center mb-6">
                                {user.profilePicture ? (
                                    <Image src={user.profilePicture} alt={user.name} width={80} height={80} className="rounded-full mr-4" />
                                ) : (
                                    <div className="w-20 h-20 rounded-full border border-gray-200 flex items-center justify-center mr-4">
                                        <span className="text-gray-600 text-2xl font-semibold">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                                    <p className="text-gray-600">{user.email}</p>
                                    <div className="flex mt-2 text-sm text-gray-500">
                                        <p className="mr-4">ID: {user.id}</p>
                                        <p className="mr-4">Gender: {user.gender || 'Not specified'}</p>
                                        <p>Year of Birth: {user.yearOfBirth || 'Not specified'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* GTR Breakdown Sections */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Total GTR Score</h2>
                                <span className="text-gray-700 font-semibold">{parseFloat(user.gtrScore).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-[#C6B06A] h-4 rounded-full mt-2">
                                <div className="h-4 bg-[#B60A06] rounded-full" style={{ width: `${user.gtrScore}%` }}></div>
                            </div>
                        </div>

                        {/* ใส่แต่ละ Section แบบ toggle ได้ */}
                        <AreaSection
                            title="Self"
                            score={user.selfScore || 75.4}
                            elements={[
                                { element: "Physical Health", gtr: user.physicalHealthScore || 80 },
                                { element: "Physical Fitness", gtr: user.physicalFitnessScore || 70 },
                                { element: "Bodily Comfort", gtr: user.bodilyComfortScore || 65 },
                                { element: "Emotional Health", gtr: user.emotionalHealthScore || 78 },
                                { element: "Mood", gtr: user.moodScore || 82 },
                                { element: "Stress level", gtr: user.stressLevelScore || 60 },
                                { element: "Mental Clarity", gtr: user.mentalClarityScore || 85 },
                                { element: "Self-Awareness", gtr: user.selfAwarenessScore || 88 },
                                { element: "Self-Acceptance", gtr: user.selfAcceptanceScore || 74 },
                                { element: "Sense of Purpose", gtr: user.senseOfPurposeScore || 79 },
                                { element: "Inner Peace", gtr: user.innerPeaceScore || 76 },
                            ]}
                            isExpanded={showSelf}
                            toggleExpanded={() => setShowSelf(!showSelf)}
                        />

                        <AreaSection
                            title="Social"
                            score={user.socialScore || 68.2}
                            elements={
                                user.socialElements || [
                                    { element: "Relationships", gtr: 72 },
                                    { element: "Family Support", gtr: 65 },
                                    { element: "Social Engagement", gtr: 70 },
                                    { element: "Communication", gtr: 75 },
                                ]
                            }
                            isExpanded={showSocial}
                            toggleExpanded={() => setShowSocial(!showSocial)}
                        />

                        <AreaSection
                            title="Actions"
                            score={user.actionsScore || 81.5}
                            elements={
                                user.actionsElements || [
                                    { element: "Daily Routines", gtr: 79 },
                                    { element: "Work Habits", gtr: 83 },
                                    { element: "Goal Achievement", gtr: 82 },
                                    { element: "Time Management", gtr: 82 },
                                ]
                            }
                            isExpanded={showActions}
                            toggleExpanded={() => setShowActions(!showActions)}
                        />

                        <AreaSection
                            title="Obtainments"
                            score={user.getsScore || 72.1}
                            elements={
                                user.getsElements || [
                                    { element: "Financial Stability", gtr: 74 },
                                    { element: "Material Needs", gtr: 70 },
                                    { element: "Access to Resources", gtr: 72 },
                                ]
                            }
                            isExpanded={showGets}
                            toggleExpanded={() => setShowGets(!showGets)}
                        />

                        <AreaSection
                            title="Environment"
                            score={user.environmentScore || 69.3}
                            elements={
                                user.environmentElements || [
                                    { element: "Living Space", gtr: 70 },
                                    { element: "Work Environment", gtr: 68 },
                                    { element: "Community Safety", gtr: 67 },
                                    { element: "Natural Surroundings", gtr: 72 },
                                ]
                            }
                            isExpanded={showEnvironment}
                            toggleExpanded={() => setShowEnvironment(!showEnvironment)}
                        />

                    </>
                )}
            </div>
        </div>
    );
}

export default UserGTRPage;