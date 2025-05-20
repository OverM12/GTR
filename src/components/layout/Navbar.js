"use client";
import Image from "next/image";
import { NavbarContext } from "@/context/NavbarProvider";
import { useContext, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useDateRange } from "@/context/DateRangeContext";
import reportService from '@/services/reportService';

function Navbar() {
  const { setIsOpen } = useContext(NavbarContext);
  const { dateRange, setDateRange } = useDateRange();
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState("M"); // Default to "M"
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

  // Add these missing state variables
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectingField, setSelectingField] = useState(null);
  const [isSelectingDate, setIsSelectingDate] = useState(false);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date().getMonth());
  const [currentCalendarYear, setCurrentCalendarYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  // Fix: define refs for date fields
  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);
  const datePickerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedViewMode = localStorage.getItem('viewMode');
      if (savedViewMode) setViewMode(savedViewMode);
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

  // Format date for display (MM/DD/YYYY)
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0"); // Ensuring 2 digits for day
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensuring 2 digits for month
    const year = date.getFullYear(); // Using the full year as is
    return `${month}/${day}/${year}`; // Return in MM/DD/YYYY format
  };

  // Fetch data based on current date range
  const fetchDataForDateRange = async (fromDate, toDate) => {
    if (!fromDate || !toDate) {
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

      const data = await reportService.getGtrReport(fromDate, toDate, accessToken);
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
        break;
      case "W":
        fromDate.setDate(today.getDate() - 7);
        break;
      case "M":
        fromDate.setDate(today.getDate() - 30);
        break;
      case "Y":
        fromDate.setDate(today.getDate() - 365);
        break;
      default:
        fromDate.setDate(today.getDate() - 30);
    }

    const fromDateStr = fromDate.toISOString().split("T")[0];
    const toDateStr = today.toISOString().split("T")[0];

    const newDateRange = {
      fromDate: fromDateStr,
      toDate: toDateStr,
    };

    setDateRange(newDateRange);
    fetchDataForDateRange(fromDateStr, toDateStr);
  };

  useEffect(() => {
    if (!localStorage.getItem('dateRange')) {
      updateDateRangeForViewMode(viewMode);
    }
  }, [viewMode]);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    updateDateRangeForViewMode(mode);
  };

  const handleOpenDatePicker = (field) => {
    setSelectingField(field);
    setShowDatePicker(true);
  };

  const handleDateClick = (date) => {
    if (selectingField === "fromDate") {
      const newDateRange = { ...dateRange, fromDate: date };
      setDateRange(newDateRange);
      setSelectingField("toDate");
    } else {
      let newDateRange;
      if (date < dateRange.fromDate) {
        newDateRange = { fromDate: date, toDate: dateRange.fromDate };
      } else {
        newDateRange = { ...dateRange, toDate: date };
      }
      setDateRange(newDateRange);
      setShowDatePicker(false);
      fetchDataForDateRange(newDateRange.fromDate, newDateRange.toDate);
    }
  };

  const closeDatePicker = () => {
    setShowDatePicker(false);
  };

  const goToPrevMonth = () => {
    if (currentCalendarMonth === 0) {
      setCurrentCalendarMonth(11);
      setCurrentCalendarYear(currentCalendarYear - 1);
    } else {
      setCurrentCalendarMonth(currentCalendarMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentCalendarMonth === 11) {
      setCurrentCalendarMonth(0);
      setCurrentCalendarYear(currentCalendarYear + 1);
    } else {
      setCurrentCalendarMonth(currentCalendarMonth + 1);
    }
  };

  const getMonthName = (month) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    return monthNames[month];
  };

  const generateCalendar = () => {
    const currentMonth = currentCalendarMonth;
    const currentYear = currentCalendarYear;
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const calendarDays = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${currentYear}-${String(currentMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
      const isInRange = date >= dateRange.fromDate && date <= dateRange.toDate;
      const isStartDate = date === dateRange.fromDate;
      const isEndDate = date === dateRange.toDate;

      calendarDays.push(
        <div
          key={`day-${day}`}
          onClick={() => handleDateClick(date)}
          className={`w-8 h-8 flex items-center justify-center cursor-pointer text-sm transition-colors
            ${isInRange && !isStartDate && !isEndDate ? "bg-orange-100" : ""}
            ${isStartDate || isEndDate ? "bg-[#FF9933] text-white rounded-full" : "rounded-full"}
            ${date === new Date().toISOString().split("T")[0] && !isStartDate && !isEndDate ? "border border-gray-400" : ""}
            hover:bg-gray-200 hover:rounded-full`}
        >
          {day}
        </div>
      );
    }
    return calendarDays;
  };

  const CustomDatePicker = () => {
    if (!showDatePicker) return null;

    const years = [];
    const currentYear = new Date().getFullYear();
    for(let year = currentYear - 10; year <= currentYear + 10; year++) {
      years.push(year);
    }

    const months = [
      { value:0, label:"January"},{ value:1, label:"February"},{ value:2, label:"March"},{ value:3, label:"April"},
      { value:4, label:"May"},{ value:5, label:"June"},{ value:6, label:"July"},{ value:7, label:"August"},
      { value:8, label:"September"},{ value:9, label:"October"},{ value:10, label:"November"},{ value:11, label:"December"},
    ];

    const handleMonthChange = (e) => setCurrentCalendarMonth(parseInt(e.target.value));
    const handleYearChange = (e) => setCurrentCalendarYear(parseInt(e.target.value));

    return (
      <div
        className="absolute top-full mt-2 z-[100] bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-[290px]"
        style={{
          left: selectingField === "fromDate" ? "0" : "auto",
          right: selectingField === "toDate" ? "0" : "auto",
        }}
        ref={datePickerRef}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="font-medium flex items-center gap-2">
            <select value={currentCalendarMonth} onChange={handleMonthChange} className="bg-gray-100 rounded px-2 py-1 text-sm">
              {months.map((month) => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
            <select value={currentCalendarYear} onChange={handleYearChange} className="bg-gray-100 rounded px-2 py-1 text-sm">
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={goToPrevMonth} className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
              <span>←</span>
            </button>
            <button onClick={goToNextMonth} className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
              <span>→</span>
            </button>
            <button onClick={closeDatePicker} className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
              <span>×</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-7 gap-1 mb-2 text-gray-600">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
              <div key={day} className="w-8 h-8 flex items-center justify-center font-medium text-xs">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">{generateCalendar()}</div>
        </div>

        <div className="mt-2 text-xs text-gray-500 text-center italic">
          {selectingField === "fromDate" ? "Click to select start date" : "Click to select end date"}
        </div>
      </div>
    );
  };

  const renderDateRangeDisplay = () => (
    <div className="flex gap-1 w-fit items-center justify-center h-[48px] relative">
      <div
        ref={fromDateRef}
        className={`bg-[#F0F2F5] px-[16px] py-[8px] w-fit rounded-[16px] cursor-pointer
          ${selectingField === "fromDate" && isSelectingDate ? "border-2 border-[#FF9933]" : ""}`}
        onClick={() => handleOpenDatePicker("fromDate")}
      >
        <div className="flex w-[133px] h-[22px] items-center justify-center text-[14px]">
          {formatDateForDisplay(dateRange.fromDate)}
        </div>
      </div>
      <div className="text-[14px]">to</div>
      <div
        ref={toDateRef}
        className={`bg-[#F0F2F5] px-[16px] py-[8px] w-fit rounded-[16px] cursor-pointer
          ${selectingField === "toDate" && isSelectingDate ? "border-2 border-[#FF9933]" : ""}`}
        onClick={() => handleOpenDatePicker("toDate")}
      >
        <div className="flex w-[133px] h-[22px] items-center justify-center text-[14px]">
          {formatDateForDisplay(dateRange.toDate)}
        </div>
      </div>

      {showDatePicker && <CustomDatePicker />}
    </div>
  );

  // Close the date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
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
        <div className="sticky top-0 w-full bg-white drop-shadow-sm shadow-[0px_-3px_8px_rgba(0,0,0,0.5)] py-[16px] px-[16px]">
          <div className={`flex flex-col ${pathname !== "/" ? "h-fit" : "h-[94px]"}`}>
            <div className="w-full flex justify-between">
              <div className="w-[48px] h-[48px] flex items-center justify-center" onClick={() => setIsOpen(true)}>
                <Image src="/your-gtr/navbar-icons/menu-icon.png" width={24} height={24} alt="Menu icon" />
              </div>
              <div className="flex">
                <div className="w-[48px] h-[48px] flex items-center justify-center">
                  <Image src="/your-gtr/users_img/Icon.svg" width={24} height={24} alt="User icon" />
                </div>
                <div className="w-[48px] h-[48px] flex items-center justify-center">
                  <Image src="/your-gtr/navbar-icons/menu-plus-icon.png" width={24} height={24} alt="Add icon" />
                </div>
              </div>
            </div>
            {pathname !== "/" ? null : renderDateRangeDisplay()}
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      {!isMobile && (
        <div className="flex w-full items-center gap-8 bg-white drop-shadow-sm shadow-[0px_-3px_8px_rgba(0,0,0,0.5)] py-[16px] px-[16px]">
          {/* Area Deep Dive Layout */}
          {pathname === "/area-deep-dive" && (
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
          )}

          {/* Dashboard Layout */}
          {pathname === "/dashboard" && (
            <>
              <div className="flex items-center">
                <div className="flex rounded-full overflow-hidden">
                  <button
                    className={`px-4 py-1 text-sm ${viewMode === "D" ? "bg-[#ff9933] text-black" : "bg-[#c1c6da] text-white"} rounded-l-full`}
                    onClick={() => handleViewModeChange("D")}
                  >
                    D
                  </button>
                  <button
                    className={`px-4 py-1 text-sm ${viewMode === "W" ? "bg-[#ff9933] text-black" : "bg-[#c1c6da] text-white"}`}
                    onClick={() => handleViewModeChange("W")}
                  >
                    W
                  </button>
                  <button
                    className={`px-4 py-1 text-sm ${viewMode === "M" ? "bg-[#ff9933] text-black" : "bg-[#c1c6da] text-white"}`}
                    onClick={() => handleViewModeChange("M")}
                  >
                    M
                  </button>
                  <button
                    className={`px-4 py-1 text-sm ${viewMode === "Y" ? "bg-[#ff9933] text-black" : "bg-[#c1c6da] text-white"} rounded-r-full`}
                    onClick={() => handleViewModeChange("Y")}
                  >
                    Y
                  </button>
                </div>
              </div>
              {renderDateRangeDisplay()}
            </>
          )}

          {/* Development Layout */}
          {pathname === "/development" && (
            <>
              <div className="flex items-center">
                <div className="flex rounded-full overflow-hidden">
                  <button
                    className={`px-4 py-1 text-sm ${viewMode === "D" ? "bg-[#ff9933] text-black" : "bg-[#c1c6da] text-white"} rounded-l-full`}
                    onClick={() => handleViewModeChange("D")}
                  >
                    D
                  </button>
                  <button
                    className={`px-4 py-1 text-sm ${viewMode === "W" ? "bg-[#ff9933] text-black" : "bg-[#c1c6da] text-white"}`}
                    onClick={() => handleViewModeChange("W")}
                  >
                    W
                  </button>
                  <button
                    className={`px-4 py-1 text-sm ${viewMode === "M" ? "bg-[#ff9933] text-black" : "bg-[#c1c6da] text-white"}`}
                    onClick={() => handleViewModeChange("M")}
                  >
                    M
                  </button>
                  <button
                    className={`px-4 py-1 text-sm ${viewMode === "Y" ? "bg-[#ff9933] text-black" : "bg-[#c1c6da] text-white"} rounded-r-full`}
                    onClick={() => handleViewModeChange("Y")}
                  >
                    Y
                  </button>
                </div>
              </div>
              {renderDateRangeDisplay()}
            </>
          )}

          {/* Insights Layout */}
          {(pathname === "/insights" || pathname.includes("/insights/")) && (
            <>
              <div className="flex items-center">
                <div className="flex rounded-full overflow-hidden">
                  <button
                    className={`px-4 py-1 text-sm ${viewMode === "D" ? "bg-[#ff9933] text-black" : "bg-[#c1c6da] text-white"} rounded-l-full`}
                    onClick={() => handleViewModeChange("D")}
                  >
                    D
                  </button>
                  <button
                    className={`px-4 py-1 text-sm ${viewMode === "W" ? "bg-[#ff9933] text-black" : "bg-[#c1c6da] text-white"}`}
                    onClick={() => handleViewModeChange("W")}
                  >
                    W
                  </button>
                  <button
                    className={`px-4 py-1 text-sm ${viewMode === "M" ? "bg-[#ff9933] text-black" : "bg-[#c1c6da] text-white"}`}
                    onClick={() => handleViewModeChange("M")}
                  >
                    M
                  </button>
                  <button
                    className={`px-4 py-1 text-sm ${viewMode === "Y" ? "bg-[#ff9933] text-black" : "bg-[#c1c6da] text-white"} rounded-r-full`}
                    onClick={() => handleViewModeChange("Y")}
                  >
                    Y
                  </button>
                </div>
              </div>
              {renderDateRangeDisplay()}
            </>
          )}

          <div className="w-full flex justify-end">
            <a
              href={typeof window !== "undefined" && localStorage.getItem('accessToken')
                ? "https://app-test.goodtime.app/guess-gtr"
                : "https://app-test.goodtime.app/"}
              className="flex self-end items-center p-4 rounded-[22px] bg-[#FF9933] text-[14px] font-medium px-5"
            >
              Start New Assessment
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
