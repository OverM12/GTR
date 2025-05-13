"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import reportService from "@/services/reportService";
import { useDateRange } from "@/context/DateRangeContext";

function Trends() {
  const { dateRange } = useDateRange();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const fetchTrends = async () => {
      if (!dateRange.fromDate || !dateRange.toDate) {
        console.log("Trends: Date range not complete, skipping fetch");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log("Trends: Fetching data for date range:", dateRange);
        const data = await reportService.getGtrReport(dateRange.fromDate, dateRange.toDate);
        console.log("Trends: Data fetched successfully");
        
        setData(data);
        
        // Check if we have actual trend data
        const hasKeyInfluencers = data?.keyInfluencers && 
          ((data.keyInfluencers.high && data.keyInfluencers.high.length > 0) || 
           (data.keyInfluencers.low && data.keyInfluencers.low.length > 0));
        
        setHasData(hasKeyInfluencers);
        setError(null);
      } catch (err) {
        console.error("Error loading trends data:", err);
        setError("Failed to load trends data");
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [dateRange]);

  // Format element name for display
  const formatElementName = (name) => {
    if (typeof name !== 'string') return name;
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get high and low influencers from data
  const highInfluencers = data?.keyInfluencers?.high || [];
  const lowInfluencers = data?.keyInfluencers?.low || [];

  // No data view
  const renderNoDataView = () => (
    <div className="flex flex-col items-center justify-center w-full py-8 px-4 bg-[#F8F9FB] rounded-[24px]">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-[18px] font-bold mb-2">Complete 7 Assessment</h2>
        <p className="text-[16px] text-gray-700 mb-4">To Start Seeing Your Good Time Trends</p>
        <div className="w-16 h-1 bg-[#C6B06A] rounded-full"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white flex flex-col w-full p-[16px] rounded-[40px]">
      <h1 className="font-bold text-[18px] hidden md:flex">Trends</h1>
      <div className="w-full flex flex-col md:flex md:flex-row p-[8px] gap-[16px]">
        <h1 className="font-bold text-[18px] md:hidden">Key influencers</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-[100px] w-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C6B06A]"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 w-full">{error}</div>
        ) : !hasData ? (
          renderNoDataView()
        ) : (
          <>
            {/* Rising Element */}
            <div className="flex bg-[#F8F9FB] w-full rounded-[24px] overflow-hidden">
              <div className="flex h-full w-[8px] bg-[#C6B06A]"></div>
              <div className="flex flex-col w-full p-[16px] ">
                <div className="flex text-[#151C2A] text-[16px] font-bold items-center gap-x-[8px]">
                  <Image
                    src="/dashboard/energy-flow-icon.png"
                    width={40}
                    height={40}
                    alt="GTR Dashboard energy-flow-icon"
                  />
                  Top Rising Element
                </div>
                <div className="flex w-full flex-col pl-[32px]">
                  {highInfluencers.length > 0 ? (
                    <div className="flex flex-col">
                      <h1 className="text-[16px] font-bold">
                        {formatElementName(highInfluencers[0]?.element || "None")}
                      </h1>
                      <p className="text-[14px] font-normal">
                        This element has shown significant improvement in the selected period.
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No rising elements found in this period</p>
                  )}
                </div>
              </div>
            </div>

            {/* Declining Element */}
            <div className="flex bg-[#F8F9FB] w-full rounded-[24px] overflow-hidden">
              <div className="flex h-full w-[8px] bg-[#B60A06]"></div>
              <div className="flex flex-col w-full p-[16px] ">
                <div className="flex text-[#151C2A] text-[16px] font-bold items-center gap-x-[8px]">
                  <Image
                    src="/dashboard/energy-flow-icon.png"
                    width={40}
                    height={40}
                    alt="GTR Dashboard energy-flow-icon"
                  />
                  Top Declining Element
                </div>
                <div className="flex w-full flex-col pl-[32px]">
                  {lowInfluencers.length > 0 ? (
                    <div className="flex flex-col">
                      <h1 className="text-[16px] font-bold">
                        {formatElementName(lowInfluencers[0]?.element || "None")}
                      </h1>
                      <p className="text-[14px] font-normal">
                        This element has shown significant decline in the selected period.
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No declining elements found in this period</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Trends;