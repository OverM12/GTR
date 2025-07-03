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
  const [timeZoneOffset, setTimeZoneOffset] = useState(null);
  const cookies = useCookies();

  useEffect(() => {
    // Get timezone offset in minutes
    const offset = new Date().getTimezoneOffset();
    setTimeZoneOffset(offset);
    const offsetHours = Math.floor(Math.abs(offset) / 60);
    const offsetMins = Math.abs(offset) % 60;
    const sign = offset <= 0 ? '+' : '-';
    const offsetString = `local time = UTC ${sign}${offsetHours}${offsetMins > 0 ? `:${String(offsetMins).padStart(2, '0')}` : ''}`;

    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    }

    const accessToken = getCookie("accessToken");

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      setHasToken(true);
    } else {
      const tokenFromLocal = localStorage.getItem("accessToken");
      if (tokenFromLocal) {
        setHasToken(true);
      } else {
        setHasToken(false);
      }
    }

    window.scrollTo(0, 0);
  }, []);

  if (!hasToken) {
    return (
      <div className="flex flex-col h-lvh items-center justify-center bg-[#F0F2F5]">
        <div className="p-6 text-center">
          <h2 className="text-xl text-red-600 mb-2">Your information not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full min-h-screen bg-[#F0F2F5]">
      <div className="flex flex-col max-w-[1300px] w-full h-full">
        <div className="flex flex-col gap-[16px] py-[32px] px-[16px]">
          {/* <h1 className="text-[32px] font-bold">GTR</h1> */}
          <GtrScore />
          <KeyInfluencers />
          <Trends />
          <TopEmotions />
          <ApexLineChart />
        </div>
      </div>
    </div>
  );
}