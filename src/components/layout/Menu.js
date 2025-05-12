"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { NavbarContext } from "@/context/NavbarProvider";
import { userService } from "@/services/userService";

function Menu() {
  const pathname = usePathname();
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
        setUserData(response.data);

        // Remove the reference to gtrData since it's not imported
        // Set a default GTR score or fetch it from the API if available
        if (response.data && response.data.gtrScore) {
          setGtrScore(response.data.gtrScore);
        } else {
          // Default value if no GTR score is available
          setGtrScore(74.9); // Example default value
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowMenu(false);
  };

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

  return (
    <>
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-opacity-30 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed z-50 min-h-screen text-nowrap top-0 left-0 md:static transition-all duration-300 flex flex-col bg-[#0C2955] overflow-hidden ${
          isOpen ? "w-[240px] p-4 md:p-4" : "w-0 md:w-[240px]"
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
                    ) : userData?.profilePicture ? (
                      <Image
                        src={userData.profilePicture}
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
                <Link href="/your-gtr/edit">
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
                href="/your-gtr/your-gtr/dashboard"
                className={`flex py-[16px] pl-[16px] pr-[24px] items-center gap-3 text-sm leading-[22.4px] transition-all duration-200 ${
                  pathname === "/your-gtr/your-gtr/dashboard"
                    ? "text-black bg-[#D6E4FF] rounded-[24px] font-medium"
                    : "text-[#C1C6DA]"
                }`}
              >
                <Image
                  src="/your-gtr/navbar-icons/function-line.png"
                  width={24}
                  height={24}
                  alt="Dashboard"
                  className={
                    pathname === "/your-gtr/your-gtr/dashboard" ? "filter invert" : ""
                  }
                />
                Dashboard
              </Link>
              <Link
                href="/your-gtr/insights"
                className={`flex py-[16px] pl-[16px] pr-[24px] items-center gap-3 text-sm leading-[22.4px] transition-all duration-200 ${
                  pathname === "/your-gtr/insights"
                    ? "text-black bg-[#D6E4FF] rounded-[24px] font-medium"
                    : "text-[#C1C6DA]"
                }`}
              >
                <Image
                  src="/your-gtr/dashboard/insights.svg"
                  width={24}
                  height={24}
                  alt="Dashboard"
                  className={
                    pathname === "/your-gtr/insights" ? "filter invert" : ""
                  }
                />
                Insights
              </Link>
              <Link
                href="/your-gtr/development"
                className={`flex py-[16px] pl-[16px] pr-[24px] items-center gap-3 text-sm leading-[22.4px] transition-all duration-200 ${
                  pathname === "/your-gtr/development"
                    ? "text-black bg-[#D6E4FF] rounded-[24px] font-medium"
                    : "text-[#C1C6DA]"
                }`}
              >
                <Image
                  src="/your-gtr/dashboard/development.svg"
                  width={24}
                  height={24}
                  alt="Dashboard"
                  className={
                    pathname === "/your-gtr/development" ? "filter invert" : ""
                  }
                />
                Development
              </Link>

              {/* <div className="w-full flex justify-center">
                <div className="w-[176px] h-[1px] bg-[#788499]" />
              </div>

              <div className="w-full text-white py-[18px] flex pl-[16px] pr-[16px]">
                <h1 className="text-[14px]">You GTR</h1>
              </div>

              {[
                {
                  href: "/your-gtr/area-deep-dive",
                  icon: "area-icon.png",
                  label: "Area Deep Dive",
                },
                {
                  href: "/your-gtr/self",
                  icon: "self-icon.png",
                  label: "Self",
                },
                {
                  href: "/your-gtr/social",
                  icon: "social-icon.png",
                  label: "Social",
                },
                {
                  href: "/your-gtr/actions",
                  icon: "action-icon.png",
                  label: "Actions",
                },
                {
                  href: "/your-gtr/obtainments",
                  icon: "obtainments-icon.png",
                  label: "Obtainments",
                },
                {
                  href: "/your-gtr/environment",
                  icon: "environment-icon.png",
                  label: "Environment",
                },
              ].map(({ href, icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex py-[16px] pl-[16px] pr-[24px] items-center gap-3 text-sm leading-[22.4px] transition-all duration-200 ${pathname === href
                      ? "text-black bg-[#D6E4FF] rounded-[24px] font-medium"
                      : "text-[#C1C6DA]"
                    }`}
                >
                  <Image
                    src={`/your-gtr/navbar-icons/${icon}`}
                    width={24}
                    height={24}
                    alt={label}
                    className={pathname === href ? "filter invert" : ""}
                  />
                  {label}
                </Link>
              ))} */}

              {pathname === "/users" && (
                <div className="md:hidden">
                  <div className="mb-6">
                    <button
                      className={`flex py-[16px] pl-[16px] pr-[24px] items-center gap-3 text-sm leading-[22.4px] ${
                        activeTab === "profile"
                          ? "text-white"
                          : "text-[#C1C6DA]"
                      }`}
                      onClick={() => handleTabChange("profile")}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 36 36"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M18,17a7,7,0,1,0-7-7A7,7,0,0,0,18,17ZM18,5a5,5,0,1,1-5,5A5,5,0,0,1,18,5Z" />
                        <path d="M30.47,24.37a17.16,17.16,0,0,0-24.93,0A2,2,0,0,0,5,25.74V31a2,2,0,0,0,2,2H29a2,2,0,0,0,2-2V25.74A2,2,0,0,0,30.47,24.37ZM29,31H7V25.73a15.17,15.17,0,0,1,22,0h0Z" />
                      </svg>
                      User Profile
                    </button>
                    <button
                      className={`flex py-[16px] pl-[16px] pr-[24px] items-center gap-3 text-sm leading-[22.4px] ${
                        activeTab === "billing"
                          ? "text-white"
                          : "text-[#C1C6DA]"
                      }`}
                      onClick={() => handleTabChange("billing")}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" />
                      </svg>
                      Billing & Payment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Menu;
