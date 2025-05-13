"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import reportService from "@/services/reportService";

function KeyInfluencers() {
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
    <h1 className="font-bold text-[18px] hidden md:flex">Key influencers</h1>
      <div className="w-full flex flex-col md:flex md:flex-row p-[8px] gap-[16px]">
        <h1 className="font-bold text-[18px] md:hidden">Key influencers</h1>
        <div className="flex bg-[#F8F9FB] w-full rounded-[24px] overflow-hidden">
          <div className="flex h-full w-[8px] bg-[#C6B06A]"></div>
          <div className="flex flex-col w-full p-[16px] ">
            <div className="flex text-[#151C2A] text-[16px] font-bold items-center gap-x-[8px]">
              <Image
                src="/your-gtr/dashboard/energy-flow-icon.png"
                width={40}
                height={40}
                alt="GTR Dashboard energy-flow-icon"
              />
              Energy-Flow
            </div>
            <div className="flex w-full flex-col pl-[32px]">
              {loading ? (
                <div className="py-4 flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#C6B06A]"></div>
                </div>
              ) : (
                highInfluencers.map((item, index) => (
                  <div className="flex" key={`high-${index}`}>
                    <div className={`flex ${index < highInfluencers.length - 1 ? 'border-b' : ''} w-full py-[16px] text-[14px] items-center font-normal gap-[8px]`}>
                      <Image
                        src="/dashboard/self-icon.png"
                        width={27}
                        height={27}
                        alt="GTR Dashboard self-icon"
                      />
                      {item.element} ({item.gtr}%)
                    </div>
                  </div>
                ))
              )}
              {!loading && highInfluencers.length === 0 && (
                <div className="py-4 text-gray-500">No high influencers found</div>
              )}
            </div>
          </div>
        </div>

        <div className="flex bg-[#F8F9FB] w-full rounded-[24px] overflow-hidden">
          <div className="flex h-full w-[8px] bg-[#B60A06]"></div>
          <div className="flex flex-col w-full p-[16px]">
            <div className="flex text-[#151C2A] text-[16px] font-bold items-center gap-x-[8px]">
              <Image
                src="/your-gtr/dashboard/energy-tension-icon.png"
                width={40}
                height={40}
                alt="GTR Dashboard energy-tension-icon"
              />
              Energy-Tension
            </div>
            <div className="flex w-full flex-col pl-[32px]">
              {loading ? (
                <div className="py-4 flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#B60A06]"></div>
                </div>
              ) : (
                lowInfluencers.map((item, index) => (
                  <div className="flex" key={`low-${index}`}>
                    <div className={`flex ${index < lowInfluencers.length - 1 ? 'border-b' : ''} w-full py-[16px] text-[14px] items-center font-normal gap-[8px]`}>
                      <Image
                        src="/dashboard/actions-icon.png"
                        width={27}
                        height={27}
                        alt="GTR Dashboard actions-icon"
                      />
                      {item.element} ({item.gtr}%)
                    </div>
                  </div>
                ))
              )}
              {!loading && lowInfluencers.length === 0 && (
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