"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import reportService from "@/services/reportService";
import { useDateRange } from "@/context/DateRangeContext"; // กรณีใช้ date range ด้วย

function TopEmotions() {
  const { dateRange } = useDateRange(); // ใช้ช่วงวันที่ถ้ามี
  const [positiveEmotions, setPositiveEmotions] = useState([]);
  const [negativeEmotions, setNegativeEmotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const response = await reportService.getGtrReport(
          dateRange.fromDate,
          dateRange.toDate
        );
        const data = response?.data?.data;

        // ✅ ดึงจาก response จริง
        setPositiveEmotions(data?.topEmotions?.positive || []);
        setNegativeEmotions(data?.topEmotions?.negative || []);
      } catch (err) {
        console.error("Error loading topEmotions:", err);
        setPositiveEmotions([]);
        setNegativeEmotions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmotions();
  }, [dateRange]); // ดึงใหม่เมื่อ dateRange เปลี่ยน

  const renderEmotionList = (list) =>
    list.map((item, index) => (
      <div
        key={index}
        className={`flex ${
          index < list.length - 1 ? "border-b" : ""
        } w-full py-[16px] text-[14px] items-center font-normal gap-[8px]`}
      >
        {item.emotion}
      </div>
    ));

  return (
    <div className="bg-white flex flex-col w-full p-[16px] rounded-[40px]">
      <h1 className="font-bold text-[18px] hidden md:flex">Top Emotions</h1>
      <div className="w-full flex flex-col md:flex-row p-[8px] gap-[16px]">
        <h1 className="font-bold text-[18px] md:hidden">Top Emotions</h1>

        {/* Positive */}
        <div className="flex bg-[#F8F9FB] w-full rounded-[24px] overflow-hidden">
          <div className="flex h-full w-[8px] bg-[#C6B06A]"></div>
          <div className="flex flex-col w-full p-[16px]">
            <div className="flex text-[#151C2A] text-[16px] font-bold items-center gap-x-[8px]">
              Positive
            </div>
            <div className="flex w-full flex-col pl-[32px]">
              {loading ? (
                <div className="py-4 flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#C6B06A]"></div>
                </div>
              ) : positiveEmotions.length > 0 ? (
                renderEmotionList(positiveEmotions)
              ) : (
                <div className="py-4 text-gray-500">
                  No positive emotions found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Negative */}
        <div className="flex bg-[#F8F9FB] w-full rounded-[24px] overflow-hidden">
          <div className="flex h-full w-[8px] bg-[#B60A06]"></div>
          <div className="flex flex-col w-full p-[16px]">
            <div className="flex text-[#151C2A] text-[16px] font-bold items-center gap-x-[8px]">
              Negative
            </div>
            <div className="flex w-full flex-col pl-[32px]">
              {loading ? (
                <div className="py-4 flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#B60A06]"></div>
                </div>
              ) : negativeEmotions.length > 0 ? (
                renderEmotionList(negativeEmotions)
              ) : (
                <div className="py-4 text-gray-500">
                  No negative emotions found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopEmotions;
