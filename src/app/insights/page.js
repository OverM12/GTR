"use client";

import React, { useState, useEffect, Suspense } from "react";
import AreaDeepDive from "../area-deep-dive/page";
import Self from "../self/page";
import Social from "../social/page";
import Action from "../actions/page";
import Environment from "../environment/page";
import Gets from "../gets/page";
import reportService from "@/services/reportService";
import Image from "next/image";
import { useDateRange } from "@/context/DateRangeContext";
import { useSearchParams, useRouter } from "next/navigation";

function TabNavigation() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTabFromUrl = searchParams.get("tab") || "Overview";

  const [activeTab, setActiveTab] = useState(activeTabFromUrl);
  const { dateRange, setDateRange } = useDateRange();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    router.replace(`?tab=${tabId}`);
  };

  useEffect(() => {
    const fetchReportData = async () => {
      if (!dateRange.fromDate || !dateRange.toDate) {
        setReportData({
          gtr: 0,
          self: { gtr: 0 },
          social: { gtr: 0 },
          actions: { gtr: 0 },
          gets: { gtr: 0 },
          environment: { gtr: 0 },
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await reportService.getGtrReport(
          dateRange.fromDate,
          dateRange.toDate
        );

        const processedData = {
          gtr: data?.gtr || 0,
          self: data?.self || { gtr: 0 },
          social: data?.social || { gtr: 0 },
          actions: data?.actions || { gtr: 0 },
          gets: data?.gets || { gtr: 0 },
          environment: data?.environment || { gtr: 0 },
        };

        setReportData(processedData);
        setError(null);
      } catch (err) {
        console.error("Error loading report data:", err);
        setError("Failed to load report data");
        setReportData({
          gtr: 0,
          self: { gtr: 0 },
          social: { gtr: 0 },
          actions: { gtr: 0 },
          gets: { gtr: 0 },
          environment: { gtr: 0 },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [dateRange, setDateRange]);

  const tabs = [
    { id: "Overview", label: "Overview" },
    { id: "Self", label: "Self" },
    { id: "Social", label: "Social" },
    { id: "Actions", label: "Actions" },
    { id: "Place", label: "Place" },
    { id: "Obtainment", label: "Obtainment" },
  ];

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C6B06A]"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-[300px]">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }

    switch (activeTab) {
      case "Overview":
        return <AreaDeepDive reportData={reportData} />;
      case "Self":
        return <Self reportData={reportData?.self} />;
      case "Social":
        return <Social reportData={reportData?.social} />;
      case "Actions":
        return <Action reportData={reportData?.actions} />;
      case "Place":
        return <Gets reportData={reportData?.gets} />;
      case "Obtainment":
        return <Environment reportData={reportData?.environment} />;
      default:
        return <div></div>;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center">
      <div className="max-w-[1300px] w-full h-full min-h-screen bg-gray-100 px-2 sm:px-4 md:px-6 py-2 sm:py-4">
        <div className="relative">
          <div className="overflow-x-auto border-b border-gray-200 no-scrollbar ml-4 mr-4">
            <div className="flex flex-nowrap min-w-full justify-start">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-2 sm:px-4 md:px-6 py-2 font-medium text-xs sm:text-sm md:text-base whitespace-nowrap transition-all duration-300 relative cursor-pointer
                    ${activeTab === tab.id ? "text-black" : "text-gray-400"}`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 sm:h-1 bg-[#A7A7A9]"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 text-[12px] sm:text-[14px] text-gray-600 ml-4 mr-4 justify-start">
          <p className="flex items-center space-x-1">
            <Image 
              src="/your-gtr/dashboard/energy-flow-icon.png" 
              width={12}
              height={12}
              className="w-3 h-3 sm:w-4 sm:h-4"
              alt="Energy flow icon" 
            />
            <span>= biggest influencer to energy flow</span>
          </p>
          <p className="flex items-center space-x-1">
            <Image 
              src="/your-gtr/dashboard/energy-tension-icon.png" 
              width={12} 
              height={12}
              className="w-3 h-3 sm:w-4 sm:h-4" 
              alt="Energy tension icon" 
            />
            <span>= biggest influencer to energy blockage</span>
          </p>
        </div>

        <div className="mt-2 sm:mt-4">{renderTabContent()}</div>
      </div>
    </div>
  );
}

export default function InsightsPageWrapper() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <TabNavigation />
    </React.Suspense>
  );
}
