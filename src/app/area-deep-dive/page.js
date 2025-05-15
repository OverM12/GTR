"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import SelfBoxMobile from "@/components/area-deep-dive/SelfBoxMobile";
import SelfBoxDesk from "@/components/area-deep-dive/SelfBoxDesk";
import FiveBoxMobile from "@/components/area-deep-dive/FiveBoxMobile";
import FiveBoxDesk from "@/components/area-deep-dive/FiveBoxDesk";
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
      <div className="flex h-dvh py-[32px] px-[16px] flex-col bg-[#F0F2F5] overflow-y-auto">
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C6B06A]"></div>
        </div>
      </div>
    );
  }

  const totalGtr = data.data?.gtr ? parseFloat(data.data.gtr).toFixed(2) : "0.00";

  //console.log(data);
  return (
    <div className="flex h-dvh py-[32px] px-[16px] flex-col bg-[#F0F2F5] overflow-y-auto">
      <div className="mt-6 bg-white md:rounded-[16px] rounded-[40px] p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-4">GTR</h2>

        <div className="md:hidden mb-6 mt-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 text-[14px]">Total GTR</span>
            <div className="flex gap-2">
              <button className="p-1">
                <Image
                  src="/your-gtr/your-gtr/area-deep-dive/magnify-icon.svg"
                  width={40}
                  height={40}
                  alt="GTR Magnify Icon"
                />
              </button>
            </div>
          </div>
          {totalExpanded && (
            <div className="md:hidden relative h-[28px] bg-[#B60A06] rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-[#C6B06A] rounded-l-full flex items-center justify-end"
                style={{ width: `${totalGtr}%` }}
              >
                <span className="absolute text-white font-medium text-sm px-2">
                  {totalGtr}%
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center">
          <span className="text-gray-700 text-[14px] text-nowrap p-4">
            Total GTR
          </span>
          <div className="w-full flex bg-[#B60A06] overflow-hidden rounded-full h-[28px]">
            <div
              className="bg-[#C6B06A] rounded-l-full"
              style={{ width: `${totalGtr}%` }}
            >
              <span className="text-white font-medium text-sm pr-2 h-full items-center w-full flex justify-end">
                {totalGtr}%
              </span>
            </div>
          </div>
        </div>

        <FiveBoxMobile
          selfData={data.data?.areas?.self}
          socialData={data?.areas?.social}
          actionsData={data?.areas?.actions}
          getsData={data?.areas?.gets}
          environmentData={data?.areas?.environment}
        />
        <FiveBoxDesk />
      </div>
    </div>
  );
}
