"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [gtrScore, setGtrScore] = useState(0);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await userService.getProfile();
        
        // Update to handle the correct response structure
        if (response && response.data) {
          setUserData(response.data);
        }
        
        // Fetch GTR score if date range is available
        if (dateRange.fromDate && dateRange.toDate) {
          try {
            const gtrData = await reportService.getGtrReport(dateRange.fromDate, dateRange.toDate);
            if (gtrData && gtrData.gtr) {
              setGtrScore(parseFloat(gtrData.gtr));
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
    };

    fetchUserData();
  }, [dateRange]);

  // Get user initials for display when no profile pic is available
  const getUserInitials = () => {
    if (!userData || !userData.name) return "U";
    const nameParts = userData.name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return nameParts[0][0];
  };

  // Format user display name
  const getDisplayName = () => {
    if (!userData || !userData.name) return "User";
    const nameParts = userData.name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0]} ${nameParts[1][0]}.`;
    }
    return userData.name;
  };

  // Get profile picture URL
  const getProfilePictureUrl = () => {
    if (!userData || !userData.profilePicturePath) return null;
    return `${process.env.NEXT_PUBLIC_BASE_URL}/${userData.profilePicturePath}`;
  };

  return (
    <>
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-opacity-30 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed z-50 min-h-screen text-nowrap top-0 left-0 md:static transition-all duration-300 flex flex-col bg-[#0C2955] overflow-hidden ${isOpen ? "w-[240px] p-4 md:p-4" : "w-0 md:w-[240px]"
          }`}
      >
        {isOpen && (
          <>
            {/* Profile */}
            <div className="flex items-center flex-col justify-between px-[16px]">
              <div className="flex w-full items-center justify-between">
                <Link href="/users">
                  <div className="flex items-center gap-[8px] py-[16px]">
                    {loading ? (
                      <div className="w-[48px] h-[48px] rounded-full bg-gray-600 flex items-center justify-center">
                        <span className="text-white text-sm">...</span>
                      </div>
                    ) : getProfilePictureUrl() ? (
                      <Image
                        src={getProfilePictureUrl()}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                        alt="Profile"
                      />
                    ) : (
                      <div className="w-[48px] h-[48px] rounded-full bg-gray-600 flex items-center justify-center">
                        <span className="text-white text-sm">
                          {getUserInitials()}
                        </span>
                      </div>
                    )}
                    <p className="text-sm font-semibold text-white">
                      {loading ? "Loading..." : getDisplayName()}
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
                    className="absolute left-0 top-0 h-full bg-[#C6B06A] rounded-l-full border-r-2 border-[#0C2955] flex items-center justify-end pr-1 text-white text-[10.5px] font-medium"
                    style={{ width: `${gtrScore || 0}%` }}
                  >
                    {gtrScore?.toFixed(1) || "0"}
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
                  src="/your-gtr/your-gtr/navbar-icons/function-line.png"
                  width={24}
                  height={24}
                  alt="Dashboard"
                  className={
                    pathname === "/dashboard" ? "filter invert" : ""
                  }
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
                  src="/your-gtr/your-gtr/dashboard/insights.svg"
                  width={24}
                  height={24}
                  alt="Insights"
                  className={
                    pathname === "/insights" ? "filter invert" : ""
                  }
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
                  src="/your-gtr/your-gtr/dashboard/devp1.png"
                  width={24}
                  height={24}
                  alt="Development"
                  className={
                    pathname === "/development" ? "filter invert" : ""
                  }
                />
                Development
              </Link>

              {/* Rest of the menu items remain unchanged */}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Menu;
