"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import reportService from "@/services/reportService";
import { useDateRange } from "@/context/DateRangeContext"; // ถ้าใช้ dateRange

function KeyInfluencers() {
  const { dateRange } = useDateRange(); // ถ้ามี date picker
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await reportService.getGtrReport(
          dateRange?.fromDate,
          dateRange?.toDate
        );

        const keyInfluencers = response?.data?.data?.keyInfluencers;

        //console.log("✅ API response:", response);
        //console.log("✅ Extracted keyInfluencers:", keyInfluencers);

        setData(keyInfluencers || {});
      } catch (err) {
        console.error("Error loading GTR data:", err);
        setData({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const highInfluencers = data?.high || [];
  const lowInfluencers = data?.low || [];

  return (
    <div className="bg-white flex flex-col w-full p-[16px] rounded-[40px]">
      <h1 className="font-bold text-[24px] hidden md:flex">Key influencers</h1>
      <div className="w-full flex flex-col md:flex-row p-[8px] gap-[16px]">
        <h1 className="font-bold text-[18px] md:hidden">Key influencers</h1>

        {/* High Influencers */}
        <div className="flex bg-[#F8F9FB] w-full rounded-[24px] overflow-hidden">
          <div className="flex h-full w-[8px] bg-[#C6B06A]"></div>
          <div className="flex flex-col w-full p-[16px]">
            <div className="flex text-[#151C2A] text-[20px] font-bold items-center gap-x-[8px]">
              <Image
                src="/your-gtr/dashboard/energy-flow-icon.png"
                width={32}
                height={32}
                alt="Energy Flow Icon"
              />
              Energy-Flow
            </div>
            <div className="flex w-full flex-col pl-[32px]">
              {loading ? (
                <div className="flex justify-center items-center h-[300px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C6B06A]"></div>
                </div>
              ) : highInfluencers.length > 0 ? (
                highInfluencers.map((item, index) => (
                  <div className="flex" key={`high-${index}`}>
                    <div className={`flex ${index < highInfluencers.length - 1 ? "border-b" : ""} w-full py-[16px] text-[14px] items-center font-normal gap-[8px]`}>
                      <Image src="/your-gtr/dashboard/self-icon.png" width={27} height={27} alt="icon" />
                      {item.element} ({parseFloat(item.gtr).toFixed(2)}%)
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-gray-500">No high influencers found</div>
              )}
            </div>
          </div>
        </div>

        {/* Low Influencers */}
        <div className="flex bg-[#F8F9FB] w-full rounded-[24px] overflow-hidden">
          <div className="flex h-full w-[8px] bg-[#B60A06]"></div>
          <div className="flex flex-col w-full p-[16px]">
            <div className="flex text-[#151C2A] text-[20px] font-bold items-center gap-x-[8px]">
              <Image
                src="/your-gtr/dashboard/energy-tension-icon.png"
                width={32}
                height={32}
                alt="Energy Tension Icon"
              />
              Energy-Tension
            </div>
            <div className="flex w-full flex-col pl-[32px]">
              {loading ? (
                <div className="flex justify-center items-center h-[300px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C6B06A]"></div>
                </div>
              ) : lowInfluencers.length > 0 ? (
                lowInfluencers.map((item, index) => (
                  <div className="flex" key={`low-${index}`}>
                    <div className={`flex ${index < lowInfluencers.length - 1 ? "border-b" : ""} w-full py-[16px] text-[14px] items-center font-normal gap-[8px]`}>
                      <Image src="/your-gtr/dashboard/actions-icon.png" width={27} height={27} alt="icon" />
                      {item.element} ({parseFloat(item.gtr).toFixed(2)}%)
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-gray-500">No low influencers found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KeyInfluencers;
