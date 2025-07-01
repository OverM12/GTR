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
        console.log(response);
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
    <div className="flex h-dvh py-[32px] px-[16px] flex-col bg-[#F0F2F5] gap-8">
      <div className="mt-6 bg-white md:rounded-[40px] rounded-[40px] p-8 shadow-sm">
        <h2 className="text-[24px] font-bold mb-4">GTR</h2>

        {data?.data && (
          <>
            <div className="lg:hidden flex flex-col w-full mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 text-sm font-medium">Total GTR</span>
                </div>
              </div>
              <div className="mt-2">
                {totalExpanded && (
                  <div className="w-full h-[30px] bg-[#B60A06] rounded-full overflow-hidden relative">
                    <div
                      className="h-[30px] bg-[#C6B06A] transition-all duration-500 ease-in-out"
                      style={{ width: `${parseFloat(totalGtr)}%` }}
                    >
                    </div>
                    <span
                      className="text-white text-xs font-semibold absolute z-10"
                      style={{
                        left: parseFloat(totalGtr) >= 14.0 ? `calc(min(${parseFloat(totalGtr)}%, 90%) - 30px)` : '8px',
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    >
                      {totalGtr}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden lg:flex w-full items-center py-6">
              <div className="flex items-center gap-2 min-w-[100px]">
                <span className="text-gray-700 text-[14px] text-nowrap">
                  Total GTR
                </span>
              </div>
              <div className="flex-1 flex items-center justify-end relative h-[30px]">
                <div className="w-full max-w-[1450px] h-[30px] bg-[#B60A06] rounded-full overflow-hidden relative mr-10">
                  <div
                    className="h-[30px] bg-[#C6B06A] transition-all duration-500 ease-in-out relative flex items-center"
                    style={{ width: `${Math.min(totalGtr, 100)}%` }}
                  >
                    <span
                      className="text-white text-xs font-semibold absolute right-4 top-1/2 transform -translate-y-1/2 whitespace-nowrap"
                    >
                      {totalGtr}%
                    </span>
                  </div>
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
