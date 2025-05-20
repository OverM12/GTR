"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useContext, useEffect, useState, useMemo } from "react";
import { NavbarContext } from "@/context/NavbarProvider";
import { userService } from "@/services/userService";
import reportService from "@/services/reportService";
import { useDateRange } from "@/context/DateRangeContext";

function Menu() {
  const pathname = usePathname();
  const { dateRange } = useDateRange();
  const { isOpen, setIsOpen, activeTab, setActiveTab } =
    useContext(NavbarContext);
  const [userData, setUserData] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gtrScore, setGtrScore] = useState(0);

  // Cache user data fetch results
  const fetchUserData = useMemo(() => async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();

      if (response && response.data) {
        setUserData(response.data.data);
      }

      if (dateRange.fromDate && dateRange.toDate) {
        try {
          const gtrData = await reportService.getGtrReport(
            dateRange.fromDate,
            dateRange.toDate
          );
          if (gtrData) {
            setGtrScore(parseFloat(gtrData.data.gtr));
          } else {
            setGtrScore(0);
          }
        } catch (gtrError) {
          console.error("Error fetching GTR data:", gtrError);
          setGtrScore(0);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  // Cache GTR data fetch results
  const fetchGtrData = useMemo(() => async () => {
    if (!dateRange.fromDate || !dateRange.toDate) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await reportService.getGtrReport(
        dateRange.fromDate,
        dateRange.toDate
      );

      if (response) {
        setData(response.data.data);
        setError(null);
      } else {
        setError("No data available for the selected date range");
      }
    } catch (err) {
      console.error("Error loading GTR data:", err);
      setError("Failed to load GTR data");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    fetchGtrData();
  }, [fetchGtrData]);

  // Memoize helper functions to prevent unnecessary recalculations
  const getUserInitials = useMemo(() => {
    if (!userData || !userData.name) return "U";
    const nameParts = userData.name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return nameParts[0][0];
  }, [userData]);

  const getDisplayName = useMemo(() => {
    if (!userData || !userData.name) return "User";
    const nameParts = userData.name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0]} ${nameParts[1][0]}.`;
    }
    return userData.name;
  }, [userData]);

  const getProfilePictureUrl = useMemo(() => {
    if (!userData || !userData.profilePicturePath) return null;
    return `${process.env.NEXT_PUBLIC_BASE_URL}/${userData.profilePicturePath}`;
  }, [userData]);

  const mainGtrScore = useMemo(() =>
    data?.gtr ? parseFloat(data.gtr).toFixed(1) : "0.0"
    , [data]);

  return (
    <>
      {isOpen && (
        <div
          className="sm:hidden fixed inset-0 bg-opacity-30 z-100"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed z-100 min-h-screen text-nowrap top-0 left-0 sm:static transition-all duration-300 flex flex-col bg-[#0C2955] overflow-hidden ${isOpen ? "w-[240px] p-4 sm:p-4" : "w-0 sm:w-[240px]"
          }`}
      >
        {isOpen && (
          <>
            {/* Profile */}
            <div className="flex items-center flex-col justify-between px-[16px]">
              <div className="flex w-full items-center justify-between">
                <Link href="/users">
                  <div className="flex items-center gap-[8px] py-[16px]">
                    <p className="text-sm font-semibold text-white">
                      {loading ? "Loading..." : getDisplayName}
                    </p>
                  </div>
                </Link>
                <Link href="/edit">
                  <Image
                    src="/your-gtr/navbar-icons/edit-icon.png"
                    width={16}
                    height={16}
                    className="rounded-full"
                    alt="Edit icon"
                  />
                </Link>
              </div>

              {/* Progress Bar - Updated to use GTR score */}
              <div className="flex w-full items-center justify-between">
                <div className="relative w-full h-[18px] bg-[#B60A06] rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-[#C6B06A] rounded-l-full border-r-2 border-[#0C2955] flex items-center"
                    style={{
                      width: `${Math.min(parseFloat(mainGtrScore), 100)}%`
                    }}
                  >
                    <span className="w-full text-right pr-1 text-white text-[10.5px] font-medium">
                      {parseFloat(mainGtrScore).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="pt-[32px] flex flex-col">
              <Link
                href="/dashboard"
                className={`flex py-[16px] pl-[16px] pr-[24px] items-center gap-3 text-sm leading-[22.4px] transition-all duration-200 ${pathname === "/dashboard"
                  ? "text-black bg-[#D6E4FF] rounded-[24px] font-medium"
                  : "text-[#C1C6DA]"
                  }`}
              >
                <Image
                  src="/your-gtr/navbar-icons/function-line.png"
                  width={24}
                  height={24}
                  alt="Dashboard"
                  className={pathname === "/dashboard" ? "filter invert" : ""}
                />
                Dashboard
              </Link>
              <Link
                href="/insights"
                className={`flex py-[16px] pl-[16px] pr-[24px] items-center gap-3 text-sm leading-[22.4px] transition-all duration-200 ${pathname === "/insights"
                  ? "text-black bg-[#D6E4FF] rounded-[24px] font-medium"
                  : "text-[#C1C6DA]"
                  }`}
              >
                <Image
                  src="/your-gtr/dashboard/insights.svg"
                  width={24}
                  height={24}
                  alt="Insights"
                  className={pathname === "/insights" ? "filter invert" : ""}
                />
                Insights
              </Link>
              <Link
                href="/development"
                className={`flex py-[16px] pl-[16px] pr-[24px] items-center gap-3 text-sm leading-[22.4px] transition-all duration-200 ${pathname === "/development"
                  ? "text-black bg-[#D6E4FF] rounded-[24px] font-medium"
                  : "text-[#C1C6DA]"
                  }`}
              >
                <Image
                  src="/your-gtr/dashboard/devp1.png"
                  width={24}
                  height={24}
                  alt="Development"
                  className={pathname === "/development" ? "filter invert" : ""}
                />
                Development
              </Link>
              {userData && userData.role === "admin" && (
                <div className="border-b border-white"></div>
              )}
              {/* Only show Users Management link for admin users */}
              {userData && userData.role === "admin" && (
                <Link
                  href="/user-mangement"
                  className={`flex py-[16px] pl-[16px] pr-[24px] items-center gap-3 text-sm leading-[22.4px] transition-all duration-200 ${pathname === "/user-mangement"
                    ? "text-black bg-[#D6E4FF] rounded-[24px] font-medium"
                    : "text-[#C1C6DA]"
                    }`}
                >
                  <Image
                    src="/your-gtr/users_img/usermangement.svg"
                    width={24}
                    height={24}
                    alt="Users Management"
                    className={pathname === "/user-mangement" ? "filter invert" : ""}
                  />
                  Users Management
                </Link>
              )}
            </div>
            <div className="mt-auto mb-4">
              <button
                onClick={() => {
                  // Handle logout logic here
                  localStorage.removeItem('accessToken');

                  window.location.href = 'https://app-test.goodtime.app/login';
                }}
                className="flex w-full py-[16px] pl-[16px] pr-[24px] items-center gap-3 text-sm leading-[22.4px] text-white hover:text-black hover:bg-[#D6E4FF] rounded-[24px] transition-all duration-200"
              >
                <Image
                  src="/your-gtr/navbar-icons/log-out (1).svg"
                  width={24}
                  height={24}
                  alt="Logout"
                  className="hover:filter hover:invert"
                />
                Logout
              </button>
            </div>
          </>
        )}
      </div>

    </>
  );
}

export default Menu;
