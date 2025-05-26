"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import SelfBoxMobile from "@/components/area-deep-dive/SelfBoxMobile";
import SelfBoxDesk from "@/components/area-deep-dive/SelfBoxDesk";
import FiveBoxMobile from "@/components/area-deep-dive/FiveBoxMobile";
import FiveBoxDesk from "@/components/area-deep-dive/FiveBoxDesk";
import ApexLineChart from "@/components/dashboard/ApexLineChart";
import GtrScore from "@/components/dashboard/GtrScore";
import KeyInfluencers from "@/components/dashboard/KeyInfluencers";
import Trends from "@/components/dashboard/Trends";
import SelfCard from "@/components/self/SelfCard";
import reportService from "@/services/reportService";
import { useDateRange } from "@/context/DateRangeContext";

export default function AreaDeepDive() {
  const { dateRange } = useDateRange();
  const [totalExpanded, setTotalExpanded] = useState(true);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!dateRange.fromDate || !dateRange.toDate) return;
      try {
        setLoading(true);
        const response = await reportService.getGtrReport(
          dateRange.fromDate,
          dateRange.toDate
        );

        setData(response?.data || null);
      } catch (error) {
        console.error("Failed to fetch GTR data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C6B06A]"></div>
      </div>
    );
  }

  const totalGtr = data.data?.gtr ? parseFloat(data.data.gtr).toFixed(2) : "0.00";

  //console.log(data);
  return (
    <div className="flex h-dvh py-[32px] px-[16px] flex-col bg-[#F0F2F5] overflow-y-auto gap-8">
      <div className="mt-6 bg-white md:rounded-[40px] rounded-[40px] p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-4">GTR</h2>

        {data?.data && (
          <>
            <div className="md:hidden mb-6 mt-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 text-[14px]">Total GTR</span>
                {/* <div className="flex gap-2">
                  <button className="p-1">
                    <Image
                      src="/your-gtr/area-deep-dive/magnify-icon.svg"
                      width={40}
                      height={40}
                      alt="GTR Magnify Icon"
                    />
                  </button>
                </div> */}
              </div>
              {totalExpanded && (
                <div className="md:hidden w-[80%] mx-auto h-[30px] bg-[#B60A06] rounded-full overflow-hidden relative">
                  <div
                    className="h-[30px] bg-[#C6B06A] transition-all duration-500 ease-in-out relative flex items-center justify-end pr-4"
                    style={{ width: `${totalGtr}%` }}
                  >
                    <span className="text-white text-xs font-semibold whitespace-nowrap">
                      {totalGtr}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center w-full">
              <span className="text-gray-700 text-[14px] text-nowrap p-4">
                Total GTR
              </span>
              <div className="w-[85%] h-[30px] bg-[#B60A06] rounded-full overflow-hidden relative">
                <div
                  className="h-[30px] bg-[#C6B06A] transition-all duration-500 ease-in-out relative flex items-center justify-end pr-4"
                  style={{ width: `${totalGtr}%` }}
                >
                  <span className="text-white text-xs font-semibold whitespace-nowrap">
                    {totalGtr}%
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
        <FiveBoxDesk />
        <FiveBoxMobile />

      </div>
      <div>
        <KeyInfluencers />
      </div>
      <div>
        <Trends />
      </div>
      <div>
        <ApexLineChart />
      </div>
      {/* <div>
        <SelfCard />
      </div> */}
    </div>
  );
}
