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
  const { isOpen, setIsOpen, activeTab, setActiveTab } = useContext(NavbarContext);
  const [userData, setUserData] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gtrScore, setGtrScore] = useState(0);
  const getInitialIsMobile = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth <= 1180;
    }
    return false;
  };
  const [isMobile, setIsMobile] = useState(getInitialIsMobile);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1180);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    if (!userData || !userData.profilePictureUrl) return null;
    if (userData.profilePictureUrl.startsWith('http')) {
      return userData.profilePictureUrl;
    }
    return `${process.env.NEXT_PUBLIC_BASE_URL}/${userData.profilePictureUrl}`;
  }, [userData]);

  const mainGtrScore = useMemo(() =>
    data?.gtr ? parseFloat(data.gtr).toFixed(1) : "0.0"
    , [data]);

  if (!isClient) return null;

  return (
    <>
      {/* Overlay for mobile/tablet */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-opacity-30 z-100"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`sticky top-0 h-full min-h-screen z-100 transition-all duration-300 flex flex-col bg-[#0C2955] ${isMobile
          ? isOpen
            ? "w-[240px] p-4"
            : "w-0 p-0"
          : "w-[240px] p-4 static"
          }`}
      >
        {/* Show content if sidebar is open (mobile/tablet) OR always on desktop */}
        {(isOpen || !isMobile) && (
          <>
            {/* Profile */}
            <div className="flex items-center flex-col justify-between px-[16px]">
              <div className="flex w-full items-center justify-between">
                <Link href="/users">
                  <div className="flex items-center gap-[8px] py-[16px]">
                    {/* เพิ่มรูปโปรไฟล์ตรงนี้ */}
                    {getProfilePictureUrl ? (
                      <img
                        src={getProfilePictureUrl}
                        width={40}
                        height={40}
                        className="rounded-full object-cover aspect-square"
                        style={{ objectFit: 'cover', width: 40, height: 40, borderRadius: '50%' }}
                        alt="Profile"
                      />
                    ) : (
                      <div className="w-[40px] h-[40px] rounded-full bg-[#C6B06A] flex items-center justify-center text-white text-sm font-medium">
                        {getUserInitials}
                      </div>
                    )}
                    <p className="text-sm font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px]">
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
                    className="absolute left-0 top-0 h-full bg-[#C6B06A] rounded-l-full border-[#0C2955] flex items-center"
                    style={{
                      width: `${Math.min(parseFloat(mainGtrScore), 100)}%`
                    }}
                  >
                    <span className="w-full text-right pl-2 pr-2 text-white text-[10.5px] font-medium">
                      {parseFloat(mainGtrScore).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="pt-[32px] flex flex-col w-full">
              <Link
                href="/dashboard"
                className={`flex py-[16px] pl-[16px] pr-[24px] items-center gap-3 text-sm leading-[22.4px] transition-all duration-200 w-full ${pathname === "/dashboard"
                  ? "text-black bg-[#D6E4FF] rounded-[24px] font-medium"
                  : "text-[#C1C6DA] rounded-[24px] hover:bg-[#1A3966]"
                  }`}
              >
                <div className="min-w-[24px] flex justify-center">
                  <Image
                    src="/your-gtr/navbar-icons/function-line.png"
                    width={24}
                    height={24}
                    alt="Dashboard"
                    className={pathname === "/dashboard" ? "filter invert" : ""}
                  />
                </div>
                <span className="whitespace-nowrap">Dashboard</span>
              </Link>

              <Link
                href="/insights"
                className={`flex py-[16px] pl-[16px] pr-[24px] items-center gap-3 text-sm leading-[22.4px] transition-all duration-200 w-full ${pathname === "/insights"
                  ? "text-black bg-[#D6E4FF] rounded-[24px] font-medium"
                  : "text-[#C1C6DA] rounded-[24px] hover:bg-[#1A3966]"
                  }`}
              >
                <div className="min-w-[24px] flex justify-center">
                  <Image
                    src="/your-gtr/dashboard/insights.svg"
                    width={24}
                    height={24}
                    alt="Insights"
                    className={pathname === "/insights" ? "filter invert" : ""}
                  />
                </div>
                <span className="whitespace-nowrap">Insights</span>
              </Link>

              <Link
                href="/development"
                className={`flex py-[16px] pl-[16px] pr-[24px] items-center gap-3 text-sm leading-[22.4px] transition-all duration-200 w-full ${pathname === "/development"
                  ? "text-black bg-[#D6E4FF] rounded-[24px] font-medium"
                  : "text-[#C1C6DA] rounded-[24px] hover:bg-[#1A3966]"
                  }`}
              >
                <div className="min-w-[24px] flex justify-center">
                  <Image
                    src="/your-gtr/dashboard/devp1.png"
                    width={24}
                    height={24}
                    alt="Development"
                    className={pathname === "/development" ? "filter invert" : ""}
                  />
                </div>
                <span className="whitespace-nowrap">Development</span>
              </Link>

              {userData && userData.role === "admin" && (
                <div className="border-b border-white w-full my-2"></div>
              )}

              {/* Only show Users Management link for admin users */}
              {userData && userData.role === "admin" && (
                <Link
                  href="/user-management"
                  className={`flex py-[16px] pl-[16px] pr-[24px] items-center gap-3 text-sm leading-[22.4px] transition-all duration-200 w-full ${pathname === "/user-management"
                    ? "text-black bg-[#D6E4FF] rounded-[24px] font-medium"
                    : "text-[#C1C6DA] rounded-[24px] hover:bg-[#1A3966]"
                    }`}
                >
                  <div className="min-w-[24px] flex justify-center">
                    <Image
                      src="/your-gtr/users_img/usermangement.svg"
                      width={24}
                      height={24}
                      alt="Users Management"
                      className={pathname === "/user-management" ? "filter invert" : ""}
                    />
                  </div>
                  <span className="whitespace-nowrap">Users Management</span>
                </Link>
              )}
            </div>

            <div className="mt-auto mb-4 w-full">
              <button
                onClick={() => {
                  // Clear all cookies with all possible paths and domains
                  const cookies = document.cookie.split(';');
                  for (let cookie of cookies) {
                    const eqPos = cookie.indexOf('=');
                    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
                    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
                    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
                  }

                  // Explicitly clear specific cookies seen in the browser
                  const specificCookies = ['_ga', '_ga_HYE91H9521', 'accessToken', 'user'];
                  const domain = '.goodtime.app';

                  specificCookies.forEach(cookieName => {
                    // Clear with root path and specific domain
                    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domain}`;
                    // Also try with www subdomain
                    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=www.${domain}`;
                    // Also try with app-test subdomain
                    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=app-test.${domain}`;
                    // Try without domain specification
                    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
                  });

                  // Clear localStorage
                  localStorage.clear();

                  // Clear sessionStorage
                  sessionStorage.clear();

                  // Redirect to login page
                  window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL_LOGOUT}`;
                }}
                className="flex w-full py-[16px] pl-[16px] pr-[24px] items-center gap-3 text-sm leading-[22.4px] text-white rounded-[24px] transition-all duration-200 hover:bg-[#1A3966] cursor-pointer"
              >
                <div className="min-w-[24px] flex justify-center">
                  <Image
                    src="/your-gtr/navbar-icons/log-out (1).svg"
                    width={24}
                    height={24}
                    alt="Logout"
                  />
                </div>
                <span className="whitespace-nowrap">Logout</span>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Menu;
