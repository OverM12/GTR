"use client";
import ApexLineChart from "@/components/dashboard/ApexLineChart";
import GtrScore from "@/components/dashboard/GtrScore";
import KeyInfluencers from "@/components/dashboard/KeyInfluencers";
import Trends from "@/components/dashboard/Trends";
import TopEmotions from "@/components/dashboard/TopEmotions";
import { useState, useEffect } from "react";
import { useCookies } from "next-client-cookies";

export default function Dashboard() {
  const [selectingField, setSelectingField] = useState("fromDate");
  const cookies = useCookies();

  useEffect(() => {
    const accessToken = cookies["accessToken"];
  
    if (accessToken) {
      // ถ้า accessToken เป็น object ให้แปลงเป็น string ก่อนเก็บ
      if (typeof accessToken === "object") {
        localStorage.setItem("accessToken", JSON.stringify(accessToken));
      } else {
        localStorage.setItem("accessToken", accessToken);
      }
    }
  
    window.scrollTo(0, 0);
  }, [cookies]);
  

  return (
    <div className="flex flex-col h-lvh overflow-auto bg-[#F0F2F5]">
      <div className="flex flex-col gap-[16px] py-[32px] px-[16px]">
        {/* <h1 className="text-[24px] font-bold">GTR</h1> */}
        <GtrScore />
        <KeyInfluencers />
        <Trends />
        <TopEmotions />
        <ApexLineChart />
      </div>
    </div>
  );
}
