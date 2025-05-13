"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import reportService from "@/services/reportService";

function TopEmotions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      try {
        // Use the imported JSON data
        setData(reportService.data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading GTR data:", err);
        setLoading(false);
      }
    }, 500); // Simulate a short loading time

    return () => clearTimeout(timer);
  }, []);

  // Get high and low influencers from data
  const highInfluencers = data?.keyInfluencers?.high || [];
  const lowInfluencers = data?.keyInfluencers?.low || [];

  return (
    <div className="bg-white flex flex-col w-full p-[16px] rounded-[40px]">
      <h1 className="font-bold text-[18px] hidden md:flex">Top Emotions</h1>
      <div className="w-full flex flex-col md:flex md:flex-row p-[8px] gap-[16px]">
        <h1 className="font-bold text-[18px] md:hidden">Top Emotions</h1>
        <div className="flex bg-[#F8F9FB] w-full rounded-[24px] overflow-hidden">
          <div className="flex h-full w-[8px] bg-[#C6B06A]"></div>
          <div className="flex flex-col w-full p-[16px] ">
            <div className="flex text-[#151C2A] text-[16px] font-bold items-center gap-x-[8px]">
              Positive
            </div>
            <div className="flex w-full flex-col pl-[32px]">
              {loading ? (
                <div className="py-4 flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#C6B06A]"></div>
                </div>
              ) : !data ? (
                <div className="py-4 text-gray-500">No information found</div>
              ) : (
                <>
                  <div
                    className={`flex border-b w-full py-[16px] text-[14px] items-center font-normal gap-[8px]`}
                  >
                    Imspiration
                  </div>
                  <div
                    className={`flex border-b w-full py-[16px] text-[14px] items-center font-normal gap-[8px]`}
                  >
                    Curious
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex bg-[#F8F9FB] w-full rounded-[24px] overflow-hidden">
          <div className="flex h-full w-[8px] bg-[#B60A06]"></div>
          <div className="flex flex-col w-full p-[16px] ">
            <div className="flex text-[#151C2A] text-[16px] font-bold items-center gap-x-[8px]">
              Negative
            </div>
            <div className="flex w-full flex-col pl-[32px]">
              {loading ? (
                <div className="py-4 flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#C6B06A]"></div>
                </div>
              ) : !data ? (
                <div className="py-4 text-gray-500">No information found</div>
              ) : (
                <>
                  <div
                    className={`flex border-b w-full py-[16px] text-[14px] items-center font-normal gap-[8px]`}
                  >
                    Bored
                  </div>
                  <div
                    className={`flex border-b w-full py-[16px] text-[14px] items-center font-normal gap-[8px]`}
                  >
                    Confused
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopEmotions;