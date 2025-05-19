"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

async function GetUser({ params }) {
  return <UserGTRContent params={params} />;
}

function UserGTRContent({ params }) {
  const { userId } = params;
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDetails, setShowDetails] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`user-${userId}-showDetails`);
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

        // 1. ดึงข้อมูล user จาก /users
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

        setUser({
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          profilePicture: foundUser.profilePicturePath || null,
          gender: foundUser.gender,
          yearOfBirth: foundUser.yearOfBirth,
          lastAssessment: foundUser.activeAssessmentSessionId || null,
        });

        // 2. ดึงข้อมูล session assessment จาก /assessments/sessions
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

        if (!sessionJson.data || sessionJson.data.length === 0) {
          setSession(null); // ไม่มี session
        } else {
          setSession(sessionJson.data[0]); // เอา session ล่าสุด
        }
      } catch (err) {
        setError(err.message || "Unknown error");
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndSession();
  }, [userId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[300px]">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C6B06A]"></div>
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
      <div className="max-w-4xl mx-auto bg-white rounded shadow p-6">
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

        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Gender:</strong> {user.gender || "Not specified"}
        </p>
        <p>
          <strong>Year of Birth:</strong> {user.yearOfBirth || "Not specified"}
        </p>
        <p>
          <strong>Last Assessment Session ID:</strong> {user.lastAssessment || "N/A"}
        </p>

        {session && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Latest Assessment Scores</h3>
            <p>GTR: {session.gtr ?? "N/A"}%</p>
            <p>Self: {session.selfGtr ?? "N/A"}%</p>
            <p>Social: {session.socialGtr ?? "N/A"}%</p>
            <p>Actions: {session.actionsGtr ?? "N/A"}%</p>
            <p>Gets: {session.getsGtr ?? "N/A"}%</p>
            <p>Environment: {session.environmentGtr ?? "N/A"}%</p>
          </div>
        )}

        {!session && <p className="mt-6 text-gray-500">No assessment session data available.</p>}
      </div>
    </div>
  );
}

export default GetUser;
