"use client";
import Image from "next/image";
import { NavbarContext } from "@/context/NavbarProvider";
import { useContext, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useDateRange } from "@/context/DateRangeContext";
import reportService from '@/services/reportService';
import React from 'react';

function Navbar() {
  const { setIsOpen } = useContext(NavbarContext);
  const { dateRange, setDateRange } = useDateRange();
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState("D"); // Default to "M"
  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);
  const datePickerRef = useRef(null);
  // Add these missing state variables
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectingField, setSelectingField] = useState(null);
  const [isSelectingDate, setIsSelectingDate] = useState(false);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date().getMonth());
  const [currentCalendarYear, setCurrentCalendarYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1180);
    };
    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Load date range from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDateRange = localStorage.getItem('dateRange');
      if (savedDateRange) {
        const parsedDateRange = JSON.parse(savedDateRange);
        setDateRange(parsedDateRange);
        // Also set the view mode if it's saved
        const savedViewMode = localStorage.getItem('viewMode');
        if (savedViewMode) {
          setViewMode(savedViewMode);
        }
      } else {
        // Initialize with default view mode if no saved data
        updateDateRangeForViewMode(viewMode);
      }
    }
  }, []);

  // Save date range to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (dateRange.fromDate && dateRange.toDate) {
        localStorage.setItem('dateRange', JSON.stringify(dateRange));
        localStorage.setItem('viewMode', viewMode);
      }
    }
  }, [dateRange, viewMode]);

  // New function to render view mode buttons
  const renderViewModeButtons = () => (
    <div className="flex items-center">
      <div className="flex rounded-full overflow-hidden">
        <button
          className={`px-2 py-1 text-[10px] sm:px-4 sm:py-1 sm:text-sm cursor-pointer ${viewMode === "D"
            ? "bg-[#ff9933] text-black"
            : "bg-[#c1c6da] text-white hover:bg-[#d6b695]"
            } rounded-l-full`}
          onClick={() => handleViewModeChange("D")}
        >
          D
        </button>
        <button
          className={`px-2 py-1 text-[10px] sm:px-4 sm:py-1 sm:text-sm cursor-pointer ${viewMode === "W"
            ? "bg-[#ff9933] text-black"
            : "bg-[#c1c6da] text-white hover:bg-[#d6b695]"
            }`}
          onClick={() => handleViewModeChange("W")}
        >
          W
        </button>
        <button
          className={`px-2 py-1 text-[10px] sm:px-4 sm:py-1 sm:text-sm cursor-pointer ${viewMode === "M"
            ? "bg-[#ff9933] text-black"
            : "bg-[#c1c6da] text-white hover:bg-[#d6b695]"
            }`}
          onClick={() => handleViewModeChange("M")}
        >
          M
        </button>
        <button
          className={`px-2 py-1 text-[10px] sm:px-4 sm:py-1 sm:text-sm cursor-pointer ${viewMode === "Y"
            ? "bg-[#ff9933] text-black"
            : "bg-[#c1c6da] text-white hover:bg-[#d6b695]"
            } rounded-r-full`}
          onClick={() => handleViewModeChange("Y")}
        >
          Y
        </button>
      </div>
    </div>
  );

  const renderDateRangeDisplay = () => (
    <div className="flex gap-1 items-center justify-center h-auto relative flex-nowrap">
      <div
        ref={fromDateRef}
        className={`bg-[#F0F2F5] px-2 py-2 rounded-full cursor-pointer text-[10px] sm:px-[16px] sm:py-[8px] sm:text-[14px]
          ${selectingField === "fromDate" && isSelectingDate
            ? "border-2 border-[#FF9933]"
            : ""
          }`}
        onClick={() => handleOpenDatePicker("fromDate")}
      >
        <div className="flex items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap">
          {formatDateForDisplay(dateRange.fromDate)}
        </div>
      </div>
      <div className="text-[10px] sm:text-[14px] whitespace-nowrap">to</div>
      <div
        ref={toDateRef}
        className={`bg-[#F0F2F5] px-2 py-2 rounded-full cursor-pointer text-[10px] sm:px-[16px] sm:py-[8px] sm:text-[14px]
          ${selectingField === "toDate" && isSelectingDate
            ? "border-2 border-[#FF9933]"
            : ""
          }`}
        onClick={() => handleOpenDatePicker("toDate")}
      >
        <div className="flex items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap">
          {formatDateForDisplay(dateRange.toDate)}
        </div>
      </div>

      {showDatePicker && <CustomDatePicker />}
    </div>
  );

  // Format date for display (MM/DD/YYYY)
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0"); // Ensuring 2 digits for day
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensuring 2 digits for month
    const year = date.getFullYear(); // Using the full year as is
    return `${day}/${month}/${year}`; // Return in MM/DD/YYYY format
  };

  // Fetch data based on current date range
  const fetchDataForDateRange = async (fromDate, toDate) => {
    if (!fromDate || !toDate) {
      // console.log("Date range not complete, skipping fetch");
      return;
    }

    try {
      setLoading(true);
      let accessToken;
      if (typeof window !== "undefined") {
        accessToken = localStorage.getItem('accessToken');
      }

      if (!accessToken) {
        console.error("No access token found. Please log in again.");
        return;
      }

      // console.log("Navbar: Fetching data for date range:", { fromDate, toDate });
      const data = await reportService.getGtrReport(fromDate, toDate, accessToken);
      // console.log("Navbar: Data fetched successfully:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update date range based on view mode
  const updateDateRangeForViewMode = (mode) => {
    const today = new Date();
    let fromDate = new Date(today);

    switch (mode) {
      case "D":
        // Just today
        break;
      case "W":
        // Last 7 days
        fromDate.setDate(today.getDate() - 7);
        break;
      case "M":
        // Last 30 days
        fromDate.setDate(today.getDate() - 30);
        break;
      case "Y":
        // Last 365 days
        fromDate.setDate(today.getDate() - 365);
        break;
      default:
        // Default to last 30 days
        fromDate.setDate(today.getDate() - 30);
    }

    const toDate = new Date(today);
    toDate.setDate(today.getDate() + 0); // ตั้ง toDate เป็น 1 วันข้างหน้า

    const fromDateStr = fromDate.toISOString().split("T")[0];
    const toDateStr = toDate.toISOString().split("T")[0];

    const newDateRange = {
      fromDate: fromDateStr,
      toDate: toDateStr,
    };

    setDateRange(newDateRange);
    fetchDataForDateRange(fromDateStr, toDateStr);
  };

  // Initialize with default view mode
  useEffect(() => {
    // Only initialize if there's no saved date range
    if (!localStorage.getItem('dateRange')) {
      updateDateRangeForViewMode(viewMode);
    }
  }, [viewMode]);

  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    updateDateRangeForViewMode(mode);
  };

  // Handle opening the custom date picker
  const handleOpenDatePicker = (field) => {
    setSelectingField(field);
    setShowDatePicker(true);
  };

  // Handle date selection in the custom date picker
  const handleDateClick = (date) => {
    if (selectingField === "fromDate") {
      const newDateRange = { ...dateRange, fromDate: date };
      setDateRange(newDateRange);
      // console.log("From date updated:", newDateRange);
      setSelectingField("toDate");
    } else {
      let newDateRange;
      // If selecting end date, ensure it's not before start date
      if (date < dateRange.fromDate) {
        newDateRange = { fromDate: date, toDate: dateRange.fromDate };
      } else {
        newDateRange = { ...dateRange, toDate: date };
      }
      setDateRange(newDateRange);
      // console.log("To date updated:", newDateRange);
      setShowDatePicker(false);

      // Fetch data immediately after both dates are selected
      fetchDataForDateRange(newDateRange.fromDate, newDateRange.toDate);
    }
  };

  // Close date picker
  const closeDatePicker = () => {
    setShowDatePicker(false);
  };

  // Navigate to previous month
  const goToPrevMonth = () => {
    if (currentCalendarMonth === 0) {
      setCurrentCalendarMonth(11);
      setCurrentCalendarYear(currentCalendarYear - 1);
    } else {
      setCurrentCalendarMonth(currentCalendarMonth - 1);
    }
  };

  // Navigate to next month
  const goToNextMonth = () => {
    if (currentCalendarMonth === 11) {
      setCurrentCalendarMonth(0);
      setCurrentCalendarYear(currentCalendarYear + 1);
    } else {
      setCurrentCalendarMonth(currentCalendarMonth + 1);
    }
  };

  // Get month name
  const getMonthName = (month) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[month];
  };

  // Generate calendar for the date picker
  const generateCalendar = () => {
    const daysInMonth = new Date(
      currentCalendarYear,
      currentCalendarMonth + 1,
      0
    ).getDate();
    const firstDayOfMonth = new Date(
      currentCalendarYear,
      currentCalendarMonth,
      1
    ).getDay(); // 0 for Sunday, 1 for Monday, etc.
    const startingDayOfWeek = firstDayOfMonth; // No change for Sunday as first day

    const calendarDays = [];

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="w-4 h-4 sm:w-6 sm:h-6"></div>);
    }

    // Add cells for each day
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${currentCalendarYear}-${String(currentCalendarMonth + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      const isInRange = date >= dateRange.fromDate && date <= dateRange.toDate;
      const isStartDate = date === dateRange.fromDate;
      const isEndDate = date === dateRange.toDate;

      calendarDays.push(
        <div
          key={`day-${day}`}
          onClick={() => handleDateClick(date)}
          className={`flex items-center justify-center cursor-pointer text-[10px] sm:text-sm transition-colors w-4 h-4 sm:w-6 sm:h-6
            ${isInRange && !isStartDate && !isEndDate ? "bg-orange-100 rounded-full" : ""}
            ${isStartDate || isEndDate
              ? "bg-[#FF9933] text-white rounded-full"
              : ""
            }
            ${date === new Date().toISOString().split("T")[0] &&
              !isStartDate &&
              !isEndDate
              ? "border border-gray-400 rounded-full"
              : ""
            }
            hover:bg-gray-200 hover:rounded-full`}
        >
          {day}
        </div>
      );
    }

    return calendarDays;
  };

  // Custom Date Picker Component
  const CustomDatePicker = () => {
    if (!showDatePicker) return null;

    // Years for dropdown (10 years before and after current year)
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
      years.push(year);
    }

    // Months for dropdown
    const months = [
      { value: 0, label: "January" },
      { value: 1, label: "February" },
      { value: 2, label: "March" },
      { value: 3, label: "April" },
      { value: 4, label: "May" },
      { value: 5, label: "June" },
      { value: 6, label: "July" },
      { value: 7, label: "August" },
      { value: 8, label: "September" },
      { value: 9, label: "October" },
      { value: 10, label: "November" },
      { value: 11, label: "December" },
    ];

    const handleMonthChange = (e) => {
      setCurrentCalendarMonth(parseInt(e.target.value));
    };

    const handleYearChange = (e) => {
      setCurrentCalendarYear(parseInt(e.target.value));
    };

    return (
      <div
        className="absolute top-full mt-2 z-[100] bg-white rounded-lg shadow-xl border border-gray-200 p-2 w-full sm:max-w-[290px]"
        style={{
          left: selectingField === "fromDate" ? "0" : "auto",
          right: selectingField === "toDate" ? "0" : "auto",
        }}
        ref={datePickerRef}
      >
        <div className="flex gap-2 font-medium justify-between flex-wrap">
          <div className="flex">
            <select
              value={currentCalendarMonth}
              onChange={handleMonthChange}
              className="bg-gray-100 rounded px-2 py-1 text-[12px] sm:px-2 sm:py-1 sm:text-sm"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex">
            <select
              value={currentCalendarYear}
              onChange={handleYearChange}
              className="flex flex-col bg-gray-100 rounded px-2 py-1 text-[12px] sm:px-2 sm:py-1 sm:text-xs"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-0.5 text-gray-600 text-xs sm:text-sm">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="flex items-center justify-center text-xs sm:text-xs w-4 h-4 sm:w-6 sm:h-6"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-0.5">
            {generateCalendar().map((dayHtml, index) => {
              return dayHtml;
            })}
          </div>
        </div>

        <div className="mt-0.5 text-[8px] text-gray-500 text-center italic sm:text-xs">
          {selectingField === "fromDate"
            ? "Click to select start date"
            : "Click to select end date"}
        </div>
      </div>
    );
  };

  // Close the date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="z-50">
      {/* Mobile Layout */}
      {isMobile && (
        <div className="sticky top-0 w-full bg-white drop-shadow-sm shadow-[0px_-3px_8px_rgba(0,0,0,0.5)] py-[10px] px-[10px]">
          <div
            className={`flex flex-col ${pathname != "/" ? "h-fit" : "h-[94px]"}`}
          >
            <div className="w-full flex justify-between items-center gap-2">
              <div
                className="w-[48px] h-[48px] flex items-center justify-center"
                onClick={() => setIsOpen(true)}
              >
                <Image
                  src="/your-gtr/navbar-icons/menu-icon.png"
                  width={24}
                  height={24}
                  alt="Picture of the author"
                />
              </div>
              <div className="flex flex-grow items-center justify-center gap-1">
                {renderViewModeButtons()}
                {renderDateRangeDisplay()}
              </div>
              <div className="flex">
                {/* <div className="w-[48px] h-[48px] flex items-center justify-center">
                  <Image
                    src="/your-gtr/users_img/Icon.svg"
                    width={24}
                    height={24}
                    alt="Picture of the author"
                  />
                </div> */}
                <div className="w-[48px] h-[48px] flex items-center justify-center">
                  <a href="https://my.goodtime.app/guess-gtr">
                    {/* <Image
                      src="/your-gtr/navbar-icons/menu-plus-icon.png" 
                      width={24}
                      height={24}
                      alt="Picture of the author"
                    /> */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" fill="black" fillRule="evenodd" clipRule="evenodd" />
                      <filter id="filter0_f_32_792" x="-16" y="-16" width="56" height="56" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="8" result="effect1_foregroundBlur_32_792" />
                      </filter>
                    </svg>
                  </a>
                  {/* <div className="w-full flex justify-end">
                    <a
                      href="https://my.goodtime.app/guess-gtr"
                      className="flex self-end items-center p-4 rounded-[22px] bg-[#FF9933] text-[14px] font-medium px-5"
                    >
                      Start New Assessment
                    </a>
                  </div> */}
                  <div className="w-full flex justify-end">
                    {/* <a
                      href="https://my.goodtime.app/guess-gtr"
                      className="flex self-end items-center p-4 rounded-[22px] bg-[#FF9933] text-[14px] font-medium px-5"
                    >
                      Log
                    </a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      {!isMobile && (
        <div className="flex w-full items-center gap-8 bg-white drop-shadow-sm shadow-[0px_-3px_8px_rgba(0,0,0,0.5)] py-[16px] px-[16px]">
          {/* Area Deep Dive Layout */}
          {/* {pathname === "/area-deep-dive" && (
            <>
              {renderDateRangeDisplay()}
              <div className="relative flex-1">
                <input
                  placeholder="E.g. What activities could inspire me? What do I prioritize too much?"
                  className="flex bg-gray-200 w-full p-4 pr-12 rounded-full"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Image
                    src="/your-gtr/navbar-icons/magnify-icon.png"
                    width={42}
                    height={42}
                    alt="Search icon"
                  />
                </div>
              </div>
              <button className="flex self-end items-center p-4 rounded-[22px] bg-[#FF9933] text-[14px] font-medium px-5">
                New Log
              </button>
            </>
          )} */}

          {/* Dashboard Layout */}
          {(pathname === "/dashboard" || pathname === "/insights" || pathname === "/") && (
            <>
              {renderViewModeButtons()}
              {renderDateRangeDisplay()}
            </>
          )}

          {pathname === "/development" && (
            <>
              {renderViewModeButtons()}
              {renderDateRangeDisplay()}
            </>
          )}

          {/* <div className="w-full flex justify-end">
            <a
              href="https://my.goodtime.app/guess-gtr"
              className="flex self-end items-center p-4 rounded-[22px] bg-[#FF9933] text-[14px] font-medium px-5"
            >
              Start New Assessment
            </a>
          </div> */}
          <div className="w-full flex justify-end">
            <a
              href="https://app-test.goodtime.app/guess-gtr"
              className="flex self-end items-center p-4 rounded-[22px] bg-[#FF9933] text-[14px] font-medium px-5"
            >
              Log
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;