"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import SelfBoxMobile from "@/components/area-deep-dive/SelfBoxMobile";
import SelfBoxDesk from "@/components/area-deep-dive/SelfBoxDesk";
import FiveBoxMobile from "@/components/area-deep-dive/FiveBoxMobile";
import FiveBoxDesk from "@/components/area-deep-dive/FiveBoxDesk";

export default function AreaDeepDive() {
  const [totalExpanded, setTotalExpanded] = useState(true);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setData(gtrData.data);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex h-dvh py-[32px] px-[16px] flex-col bg-[#F0F2F5] overflow-y-auto">
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C6B06A]"></div>
        </div>
      </div>
    );
  }

  // Extract the main GTR score from the JSON data
  const mainGtrScore = data?.gtr ? parseFloat(data.gtr).toFixed(1) : "0.0";

  return (
    <div className="flex h-dvh py-[32px] px-[16px] flex-col bg-[#F0F2F5] overflow-y-auto">
      

      {/* GTR Score Card */}
      <div className="mt-6 bg-white md:rounded-[16px] rounded-[40px] p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-4">GTR</h2>
        <div className="md:hidden mb-6 mt-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 text-[14px]">Total GTR</span>
            <div className="flex gap-2">
              <button className="p-1">
                <Image
                  src="/area-deep-dive/magnify-icon.svg"
                  width={40}
                  height={40}
                  alt="Picture of the author"
                />
              </button>
              {/* <button
                className="p-1"
                onClick={() => setTotalExpanded(!totalExpanded)}
              >
                <Image
                  src="/area-deep-dive/arrow-up-icon.svg"
                  width={25}
                  height={25}
                  alt="Picture of the author"
                />
              </button> */}
            </div>
          </div>
          {totalExpanded && (
            <div className="md:hidden relative h-[28px] bg-[#B60A06] rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-[#C6B06A] rounded-l-full flex items-center justify-end"
                style={{ width: `${mainGtrScore}%` }}
              >
                <span className="absolute text-white font-medium text-sm px-2">
                  {mainGtrScore}%
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center">
          <span className="text-gray-700 text-[14px] text-nowrap p-4">
            Total GTR
          </span>
          <div className="w-full flex bg-[#B60A06] rounded-full h-[28px]">
            <div 
              className="bg-[#C6B06A] rounded-l-full "
              style={{ width: `${mainGtrScore}%` }}
            >
              <span className="text-white font-medium text-sm pr-2 h-full items-center w-full flex justify-end">
                {mainGtrScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Self
        <SelfBoxMobile areaData={data?.areas?.self} />
        <SelfBoxDesk areaData={data?.areas?.self} /> */}

        {/* Five */}
        <FiveBoxMobile 
          selfData={data?.areas?.self}
          socialData={data?.areas?.social}
          actionsData={data?.areas?.actions}
          getsData={data?.areas?.gets}
          environmentData={data?.areas?.environment}
        />
        <FiveBoxDesk 
          selfData={data?.areas?.self}
          socialData={data?.areas?.social}
          actionsData={data?.areas?.actions}
          getsData={data?.areas?.gets}
          environmentData={data?.areas?.environment}
        />
      </div>
    </div>
  );
}
