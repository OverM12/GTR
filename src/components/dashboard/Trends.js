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
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await reportService.getGtrReport(dateRange.fromDate, dateRange.toDate);
        const parsedData = response?.data?.data;
        setData(parsedData);

        const hasTrendData =
          parsedData?.trends &&
          (parsedData.trends.high?.length > 0 || parsedData.trends.low?.length > 0);
        setHasData(hasTrendData);
        setError(null);
      } catch (err) {
        setError("Failed to load trends data");
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [dateRange]);

  const formatElementName = (name) => {
    if (typeof name !== 'string') return name;
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const trendHigh = data?.trends?.high || [];
  const trendLow = data?.trends?.low || [];

  // ✅ แก้ตรงนี้: ใช้ชื่อให้ตรงกับ JSX ที่ใช้ด้านล่าง
  const highInfluencers = trendHigh;
  const lowInfluencers = trendLow;

  const renderNoDataView = () => (
    <div className="flex flex-col items-center justify-center w-full py-8 px-4 bg-[#F8F9FB] rounded-[24px]">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-[18px] font-bold mb-2">Complete 7 Assessments</h2>
        <p className="text-[16px] text-gray-700 mb-4">To Start Seeing Your Good Time Trends</p>
        <div className="w-16 h-1 bg-[#C6B06A] rounded-full"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white flex flex-col w-full p-[16px] rounded-[40px]">
      <h1 className="font-bold text-[18px]">Trends</h1>
      <div className="w-full flex flex-col md:flex-row gap-[16px] mt-4">
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
            {/* Rising Elements */}
            <div className="flex bg-[#F8F9FB] w-full rounded-[24px] overflow-hidden">
              <div className="flex h-full w-[8px] bg-[#C6B06A]"></div>
              <div className="flex flex-col w-full p-[16px]">
                <div className="flex text-[#151C2A] text-[16px] font-bold items-center gap-x-[8px]">
                  <Image
                    src="/your-gtr/dashboard/energy-flow-icon.png"
                    width={40}
                    height={40}
                    alt="Energy Flow Icon"
                  />
                  Top Rising Element
                </div>
                <div className="flex w-full flex-col pl-[32px]">
                  {highInfluencers.length > 0 ? (
                    highInfluencers.map((item, index) => (
                      <div className="flex" key={`high-${index}`}>
                        <div className={`flex ${index < highInfluencers.length - 1 ? "border-b" : ""} w-full py-[16px] text-[14px] items-center font-normal gap-[8px]`}>
                          <Image src="/your-gtr/dashboard/self-icon.png" width={27} height={27} alt="icon" />
                          {formatElementName(item.element)} ({parseFloat(item.gtr).toFixed(2)}%)
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-gray-500">No rising elements found</div>
                  )}
                </div>
              </div>
            </div>

            {/* Declining Elements */}
            <div className="flex bg-[#F8F9FB] w-full rounded-[24px] overflow-hidden">
              <div className="flex h-full w-[8px] bg-[#B60A06]"></div>
              <div className="flex flex-col w-full p-[16px]">
                <div className="flex text-[#151C2A] text-[16px] font-bold items-center gap-x-[8px]">
                  <Image
                    src="/your-gtr/dashboard/energy-tension-icon.png"
                    width={40}
                    height={40}
                    alt="Energy Tension Icon"
                  />
                  Top Decreasing Element
                </div>
                <div className="flex w-full flex-col pl-[32px]">
                  {lowInfluencers.length > 0 ? (
                    lowInfluencers.map((item, index) => (
                      <div className="flex" key={`low-${index}`}>
                        <div className={`flex ${index < lowInfluencers.length - 1 ? "border-b" : ""} w-full py-[16px] text-[14px] items-center font-normal gap-[8px]`}>
                          <Image src="/your-gtr/dashboard/actions-icon.png" width={27} height={27} alt="icon" />
                          {formatElementName(item.element)} ({parseFloat(item.gtr).toFixed(2)}%)
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-gray-500">No declining elements found</div>
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
