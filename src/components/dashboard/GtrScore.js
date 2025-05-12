"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import gtrData from "./gtr.json";

function GtrScore() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      try {
        // Use the imported JSON data
        setData(gtrData.data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading GTR data:", err);
        setError("Failed to load GTR data");
        setLoading(false);
      }
    }, 500); // Simulate a short loading time

    return () => clearTimeout(timer);
  }, []);

  // Display loading state
  if (loading) {
    return (
      <div className="flex flex-col gap-[8px] p-[16px] pb-[44px] pt-[30px] w-full rounded-[40px] bg-white">
        <h1 className="text-[18px] font-bold">GTR</h1>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C6B06A]"></div>
        </div>
      </div>
    );
  }

  // Display error state
  if (error || !data) {
    return (
      <div className="flex flex-col gap-[8px] p-[16px] pb-[44px] pt-[30px] w-full rounded-[40px] bg-white">
        <h1 className="text-[18px] font-bold">GTR</h1>
        <div className="text-red-500 py-4">
          {error || "No GTR data available"}
        </div>
      </div>
    );
  }

  // Extract the main GTR score and area scores from the JSON data
  const mainGtrScore = data.gtr ? parseFloat(data.gtr).toFixed(1) : "0.0";
  const selfScore = data.areas?.self?.gtr ? parseFloat(data.areas.self.gtr).toFixed(1) : "0.0";
  const socialScore = data.areas?.social?.gtr ? parseFloat(data.areas.social.gtr).toFixed(1) : "0.0";
  const actionsScore = data.areas?.actions?.gtr ? parseFloat(data.areas.actions.gtr).toFixed(1) : "0.0";
  const getsScore = data.areas?.gets?.gtr ? parseFloat(data.areas.gets.gtr).toFixed(1) : "0.0";
  const environmentScore = data.areas?.environment?.gtr ? parseFloat(data.areas.environment.gtr).toFixed(1) : "0.0";

  return (
    <div className="z-0 flex flex-col gap-[8px] p-[16px] pb-[44px] pt-[30px] w-full rounded-[40px] bg-white">
      <h1 className="text-[18px] font-bold">GTR</h1>
      <div className="flex w-full items-center justify-between">
        <div className="relative w-full h-[48px] bg-[#B60A06] rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-[#C6B06A] rounded-l-full border-r-2 border-white flex items-center justify-end pr-1 text-white text-[20px] font-medium"
            style={{ width: `${mainGtrScore}%` }}
          >
            {mainGtrScore}%
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex md:flex-row w-full bg-white px-2 gap-[8px] py-[16px]">
        <div className="flex flex-col w-full">
          <div className="flex text-[14px] font-bold items-center gap-[8px]">
            <Image
              src="/your-gtr/dashboard/self-icon.png"
              width={27}
              height={27}
              alt="GTR Dashboard self-icon"
            />
            Self
          </div>
          <div className="flex text-[18px] font-bold items-center gap-[8px]">
            {selfScore}%
            <Image
              src="/your-gtr/dashboard/arrow-up-icon.png"
              width={27}
              height={27}
              alt="GTR Dashboard arrow-up-icon"
              className="mt-2"
            />
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="relative w-full h-[8px] bg-[#B60A06] rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-[#C6B06A] rounded-l-full border-r-2 border-white"
                style={{ width: `${selfScore}%` }}
              >
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex text-[14px] font-bold items-center gap-[8px]">
            <Image
              src="/your-gtr/dashboard/social-icon.png"
              width={27}
              height={27}
              alt="GTR Dashboard social-icon"
            />
            Social
          </div>
          <div className="flex text-[18px] font-bold items-center gap-[8px]">
            {socialScore}%
            <Image
              src="/your-gtr/dashboard/down-icon.png"
              width={27}
              height={27}
              alt="GTR Dashboard down-icon"
              className="mt-2"
            />
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="relative w-full h-[8px] bg-[#B60A06] rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-[#C6B06A] rounded-l-full border-r-2 border-white"
                style={{ width: `${socialScore}%` }}
              >
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex text-[14px] font-bold items-center gap-[8px]">
            <Image
              src="/your-gtr/dashboard/actions-icon.png"
              width={27}
              height={27}
              alt="GTR Dashboard actions-icon"
            />
            Actions
          </div>
          <div className="flex text-[18px] font-bold items-center gap-[8px]">
            {actionsScore}%
            <Image
              src="/your-gtr/dashboard/arrow-up-icon.png"
              width={27}
              height={27}
              alt="GTR Dashboard arrow-up-icon"
              className="mt-2"
            />
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="relative w-full h-[8px] bg-[#B60A06] rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-[#C6B06A] rounded-l-full border-r-2 border-white"
                style={{ width: `${actionsScore}%` }}
              >
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex text-[14px] font-bold items-center gap-[8px]">
            <Image
              src="/your-gtr/dashboard/obtainments-icon.png"
              width={27}
              height={27}
              alt="GTR Dashboard obtainments-icon"
            />
            Obtainments
          </div>
          <div className="flex text-[18px] font-bold items-center gap-[8px]">
            {getsScore}%
            <Image
              src="/your-gtr/dashboard/arrow-up-icon.png"
              width={27}
              height={27}
              alt="GTR Dashboard arrow-up-icon"
              className="mt-2"
            />
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="relative w-full h-[8px] bg-[#B60A06] rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-[#C6B06A] rounded-l-full border-r-2 border-white"
                style={{ width: `${getsScore}%` }}
              >
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex text-[14px] font-bold items-center gap-[8px]">
            <Image
              src="/your-gtr/dashboard/environment-icon.png"
              width={27}
              height={27}
              alt="GTR Dashboard environment-icon"
            />
            Environment
          </div>
          <div className="flex text-[18px] font-bold items-center gap-[8px]">
            {environmentScore}%
            <Image
              src="/your-gtr/dashboard/arrow-up-icon.png"
              width={27}
              height={27}
              alt="GTR Dashboard arrow-up-icon"
              className="mt-2"
            />
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="relative w-full h-[8px] bg-[#B60A06] rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-[#C6B06A] rounded-l-full border-r-2 border-white"
                style={{ width: `${environmentScore}%` }}
              >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GtrScore;
