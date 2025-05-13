"use client";
import { createContext, useContext, useState, useEffect } from "react";
import reportService from '@/services/reportService';

// Create the context
const DateRangeContext = createContext();

// Provider component
export function DateRangeProvider({ children }) {
  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [gtrData, setGtrData] = useState(null);

  // Fetch data whenever date range changes
  useEffect(() => {
    const fetchData = async () => {
      if (!dateRange.fromDate || !dateRange.toDate) {
        console.log("DateRangeContext: Date range not complete, skipping fetch");
        return;
      }
      
      try {
        setLoading(true);
        console.log("DateRangeContext: Fetching data for date range:", dateRange);
        const data = await reportService.getGtrReport(dateRange.fromDate, dateRange.toDate);
        console.log("DateRangeContext: Data fetched successfully");
        setGtrData(data);
      } catch (error) {
        console.error("DateRangeContext: Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange.fromDate, dateRange.toDate]);

  // Update date range and trigger data fetch
  const updateDateRange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  return (
    <DateRangeContext.Provider value={{ 
      dateRange, 
      setDateRange: updateDateRange, 
      loading, 
      gtrData 
    }}>
      {children}
    </DateRangeContext.Provider>
  );
}

// Custom hook to use the context
export function useDateRange() {
  return useContext(DateRangeContext);
}