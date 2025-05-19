"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDateRange } from "@/context/DateRangeContext";
import reportService from "@/services/reportService";

export default function DevelopmentPage() {
  const { dateRange } = useDateRange();
  const [loading, setLoading] = useState(false);
  const [developmentData, setDevelopmentData] = useState({
    keep: [],
    lift: [],
    reduce: [],
  });

  useEffect(() => {
    const fetchReportData = async () => {
      if (!dateRange.fromDate || !dateRange.toDate) {
        // Clear data if date range is missing
        setDevelopmentData({ keep: [], lift: [], reduce: [] });
        return;
      }

      try {
        setLoading(true);
        const response = await reportService.getGtrReport(
          dateRange.fromDate,
          dateRange.toDate
        );

        // ดึงข้อมูล development จาก response.data.data.development
        const development =
          response?.data?.data?.development ?? {
            keep: [],
            lift: [],
            reduce: [],
          };

        setDevelopmentData({
          keep: development.keep ?? [],
          lift: development.lift ?? [],
          reduce: development.reduce ?? [],
        });
      } catch (error) {
        console.error("Error fetching report data:", error);
        setDevelopmentData({ keep: [], lift: [], reduce: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [dateRange.fromDate, dateRange.toDate]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Development</h1>

        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C6B06A]"></div>
          </div>
        ) : !dateRange.fromDate || !dateRange.toDate ? (
          <p className="text-gray-600">Please select a date range to view data.</p>
        ) : (
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-1">Improving your GTR</h2>
              <p className="text-gray-600">Explore how you are currently influencing your inner energy flow.</p>
            </div>

            <div className="space-y-6">
              {/* Keep Section */}
              <div className="flex">
                <div className="flex-shrink-0 bg-gray-100 rounded-2xl p-4 mr-4 h-fit">
                  <Image
                    src="/your-gtr/self-insights/mental-icon.svg"
                    width={50}
                    height={50}
                    alt="Energy icon"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Keep</h3>
                  <p className="text-gray-700">
                    Your main energy sources come from {developmentData.keep[0]} and {developmentData.keep[1]}.
                    Continuing to nurture these will feel great and help you to clear blocks in other areas.
                  </p>
                </div>
              </div>

              {/* Lift Section */}
              <div className="flex">
                <div className="flex-shrink-0 bg-gray-100 rounded-2xl p-4 mr-4 h-fit">
                  <Image
                    src="/your-gtr/self-insights/big-energy-icon.svg"
                    width={45}
                    height={45}
                    alt="Energy icon"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Lift</h3>
                  <p className="text-gray-700">
                    Meanwhile, {developmentData.lift[0]} and {developmentData.lift[1]} hold great growth potential.
                    With just a bit more focus, they might break through and offer a noticeable boost to your life.
                  </p>
                </div>
              </div>

              {/* Reduce Section */}
              <div className="flex">
                <div className="flex-shrink-0 bg-gray-100 rounded-2xl p-4 mr-4 h-fit">
                  <Image
                    src="/your-gtr/self-insights/energy-tension-icon.png"
                    width={45}
                    height={45}
                    alt="Sense icon"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-lg mb-2">Reduce</h3>
                  <p className="text-gray-700">
                    Currently, {developmentData.reduce[0]} may affect your self-confidence the most. You might consider whether it&apos;s something you&apos;d like to address now or if giving yourself permission to step back until you feel naturally drawn to it helps you better manage your current energy. Sometimes, simply releasing the pressure can be the first step, allowing you to return to it when you have the capacity to address it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
