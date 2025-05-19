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
    try {
      // ดึงค่า accessToken จากทั้ง cookies และ localStorage
      const cookieToken = cookies.get('accessToken');
      const localToken = localStorage.getItem("accessToken");
      
      // ใช้ token จาก cookie หรือ localStorage อย่างใดอย่างหนึ่ง
      const accessToken = cookieToken || localToken;
      
      if (accessToken) {
        // บันทึก token ลงทั้งสองที่เพื่อให้แน่ใจว่ามีข้อมูลครบ
        localStorage.setItem("accessToken", accessToken);
        cookies.set('accessToken', accessToken);
        
        // ตรวจสอบว่ามี token จากแหล่งอื่นหรือไม่ (ถ้ามี)
        const allCookies = document.cookie.split(';');
        for (let cookie of allCookies) {
          const [name, value] = cookie.trim().split('=');
          if (name && value && name.includes('Token') || name.includes('token')) {
            // เก็บ token จากแหล่งอื่นด้วย
            localStorage.setItem(name, value);
          }
        }
        
        setHasToken(true);
      } else {
        // ตรวจสอบว่ามี token จากแหล่งอื่นหรือไม่
        const allCookies = document.cookie.split(';');
        let foundToken = false;
        
        for (let cookie of allCookies) {
          const [name, value] = cookie.trim().split('=');
          if (name && value && (name.includes('Token') || name.includes('token'))) {
            // เก็บ token จากแหล่งอื่น
            localStorage.setItem(name, value);
            cookies.set('accessToken', value);
            foundToken = true;
            break;
          }
        }
        
        setHasToken(foundToken);
      }
    } catch (error) {
      console.error("Error handling tokens:", error);
      setHasToken(false);
    }
    
    // Scroll to top when component mounts
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
