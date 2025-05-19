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
  const [selectingField, setSelectingField] = useState("fromDate");

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    router.replace(`?tab=${tabId}`); // เปลี่ยนเป็น replace
  };

  useEffect(() => {
    const fetchReportData = async () => {
      if (!dateRange.fromDate || !dateRange.toDate) {
        console.log("Insights page: Date range not complete, using default values");
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
        const data = await reportService.getGtrReport(dateRange.fromDate, dateRange.toDate);

        const processedData = {
          gtr: data?.gtr || 0,
          self: data?.self || { gtr: 0 },
          social: data?.social || { gtr: 0 },
          actions: data?.actions || { gtr: 0 },
          gets: data?.gets || { gtr: 0 },
          environment: data?.environment || { gtr: 0 },
        };

        if (!processedData.self.gtr) processedData.self.gtr = 0;
        if (!processedData.social.gtr) processedData.social.gtr = 0;
        if (!processedData.actions.gtr) processedData.actions.gtr = 0;
        if (!processedData.gets.gtr) processedData.gets.gtr = 0;
        if (!processedData.environment.gtr) processedData.environment.gtr = 0;

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
  }, [dateRange, setDateRange, /* updateDateRangeForViewMode, viewMode */]);
  // ถ้าคุณใช้ updateDateRangeForViewMode หรือ viewMode จริงๆ ก็เพิ่มใน dependencies ด้วยนะครับ

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
      console.log("Rendering error state, but still showing content with zeros");
    }

    switch (activeTab) {
      case "Overview":
        return <AreaDeepDive reportData={reportData} />;
      case "Self":
        return <Self reportData={reportData?.self} />;
      case "Social":
        return <Social reportData={reportData?.social} />;
      case "Actions":
        return <Action reportData={reportData?.actions} />; // แก้ชื่อจาก action -> actions
      case "Place":
        return <Gets reportData={reportData?.gets} />;
      case "Obtainment":
        return <Environment reportData={reportData?.environment} />;
      default:
        return <div></div>;
    }
  };

  return (
    <div className="w-full bg-gray-100 py-4">
      <div className="w-full p-4">
        <div className="flex flex-wrap md:flex-nowrap overflow-x-auto border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-3 md:px-6 py-2 font-medium text-xs md:text-sm whitespace-nowrap transition-all duration-300 relative
                ${activeTab === tab.id ? "text-black" : "text-gray-400"}`}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#A7A7A9]"></div>}
            </button>
          ))}
        </div>

        <div className="flex mt-2 gap-4 text-xs text-gray-600">
          <p className="flex items-center">
            <Image src="/your-gtr/dashboard/energy-flow-icon.png" width={17} height={17} alt="Energy flow icon" />
            = biggest influencer to energy flow
          </p>
          <p className="flex items-center">
            <Image src="/your-gtr/dashboard/energy-tension-icon.png" width={17} height={17} alt="Energy tension icon" />
            = biggest influencer to energy blockage
          </p>
        </div>

        <div className="mt-4">{renderTabContent()}</div>
      </div>
    </div>
  );
}

// ห่อ TabNavigation ด้วย Suspense
export default function InsightsPageWrapper() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <TabNavigation />
    </React.Suspense>
  );
}
