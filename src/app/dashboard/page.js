"use client";
import ApexLineChart from "@/components/dashboard/ApexLineChart";
import GtrScore from "@/components/dashboard/GtrScore";
import KeyInfluencers from "@/components/dashboard/KeyInfluencers";
import Trends from "@/components/dashboard/Trends";
import TopEmotions from "@/components/dashboard/TopEmotions";
import { useState, useEffect } from "react";
import { useCookies } from 'next-client-cookies';

export default function Dashboard() {
  const [selectingField, setSelectingField] = useState("fromDate");
  const [hasToken, setHasToken] = useState(false);
  const cookies = useCookies();

  useEffect(() => {
    const accessToken = cookies['accessToken'];  // ดึงจาก cookie object

    if (accessToken) {
      // เก็บลง localStorage เป็น string (ถ้าเป็น object แปลง JSON.stringify)
      if (typeof accessToken === "object") {
        localStorage.setItem('accessToken', JSON.stringify(accessToken));
      } else {
        localStorage.setItem('accessToken', accessToken);
      }
      setHasToken(true);
    } else {
      const tokenFromLocal = localStorage.getItem('accessToken');
      if (tokenFromLocal) {
        setHasToken(true);
      } else {
        setHasToken(false);
      }
    }

    window.scrollTo(0, 0);
  }, [cookies]);

  if (!hasToken) {
    return (
      <div className="flex flex-col h-lvh items-center justify-center">
        <div className="p-6 text-center">
          <h2 className="text-xl text-red-600 mb-2">Unable to display information</h2>
        </div>
      </div>
    );
  }

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
