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

  if (!developmentData) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p className="text-red-800">No development data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-[32px] md:text-[40px] font-bold mb-4">Development</h1>

        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C6B06A]"></div>
          </div>
        ) : !dateRange.fromDate || !dateRange.toDate ? (
          <p className="text-gray-600">Please select a date range to view data.</p>
        ) : (
          <div className="bg-white rounded-3xl shadow-lg p-4 md:p-8">
            <div className="mb-4">
              <h2 className="text-[20px] md:text-[24px] font-bold mb-1">Improving your GTR</h2>
              <p className="text-gray-600 text-[12px] md:text-[14px]">Explore how you are currently influencing your inner energy flow.</p>
            </div>

            <div className="space-y-6">
              {/* Keep Section */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-0">
                <div className="flex-shrink-0 bg-gray-100 rounded-2xl p-4 md:mr-4 h-fit">
                  <div data-layer="thumbnail / symbol" className="ThumbnailSymbol w-full md:w-40 h-24 bg-layer-background-neutral-container-neutral rounded-3xl inline-flex justify-center items-center gap-2.5">
                    <div data-svg-wrapper data-layer="symbol / energy-flow" data-variants="Flow" className="SymbolEnergyFlow relative">
                      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_d_1427_112487)">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M26 42C35.9411 42 44 33.9411 44 24C44 14.0589 35.9411 6 26 6C16.0589 6 8 14.0589 8 24C8 33.9411 16.0589 42 26 42ZM26 46C38.1503 46 48 36.1503 48 24C48 11.8497 38.1503 2 26 2C13.8497 2 4 11.8497 4 24C4 36.1503 13.8497 46 26 46Z" fill="var(--layer-background-accent-navy-default, #0C2A55)" />
                          <path d="M36.1425 30.4033C35.5397 32.4193 34.2367 34.007 32.2333 35.1665C27.9094 37.6689 24.2349 33.627 17.046 34.7865C17.2826 33.5381 18.082 32.5198 19.4442 31.7314C23.7875 29.2178 29.6436 34.1645 36.1425 30.4033ZM38.2513 22.5143C37.5707 24.9087 36.3397 26.6215 34.5581 27.6525C28.382 31.2269 23.105 24.2032 14.8855 31.0354C15.1331 28.1135 16.6119 25.8684 19.3219 24.3C23.4694 21.8997 30.7671 26.8456 38.2513 22.5143ZM40 14C38.8812 16.8703 37.4903 18.7868 35.8272 19.7493C28.0311 24.2612 19.4501 15.0565 12.3649 26.6592C11.2037 22.9691 12.8662 18.8668 16.6083 16.7011C24.7163 12.0088 30.6447 19.4142 40 14Z" fill="var(--layer-background-accent-navy-default, #0C2A55)" />
                        </g>
                        <defs>
                          <filter id="filter0_d_1427_112487" x="0" y="0" width="52" height="52" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                            <feOffset dy="2" />
                            <feGaussianBlur stdDeviation="2" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0.0705882 0 0 0 0 0.0745098 0 0 0 0 0.0784314 0 0 0 0.16 0" />
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1427_112487" />
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1427_112487" result="shape" />
                          </filter>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-[18px] md:text-[20px] mb-2">Keep</h3>
                  <p className="text-gray-700 text-[12px] md:text-[14px]">
                    Your main energy sources come from {developmentData.keep[0]} and {developmentData.keep[1]}.
                    Continuing to nurture these will feel great and help you to clear blocks in other areas.
                  </p>
                </div>
              </div>

              {/* Lift Section */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-0">
                <div className="flex-shrink-0 bg-gray-100 rounded-2xl p-4 md:mr-4 h-fit">
                  <div data-layer="thumbnail / symbol" className="ThumbnailSymbol w-full md:w-40 h-24 bg-layer-background-neutral-container-neutral rounded-3xl inline-flex justify-center items-center gap-2.5">
                    <div data-svg-wrapper data-layer="symbol / energy-flow" data-variants="Flow" className="SymbolEnergyFlow relative">
                      <svg width="52" height="56" viewBox="0 0 52 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_d_1427_112493)">
                          <path d="M32 33.7884V37.2956C29.8141 38.4492 27.7766 37.9677 25.341 37.3923C23.0698 36.8556 20.4524 36.2372 17.046 36.7866C17.2826 35.5382 18.082 34.5199 19.4442 33.7315C21.3978 32.6009 23.6574 32.9796 26.1439 33.3964C27.9826 33.7045 29.9453 34.0335 32 33.7884Z" fill="var(--layer-background-neutral-container-primary-light-darken, #93B9ED)" />
                          <path d="M32 26.34V30.5989C30.2725 30.9102 28.5749 30.6274 26.8154 30.3342C23.3219 29.7522 19.5846 29.1296 14.8855 33.0355C15.1331 30.1136 16.6119 27.8685 19.3219 26.3001C21.0918 25.2758 23.4354 25.5893 26.1224 25.9488C27.9473 26.1929 29.9305 26.4582 32 26.34Z" fill="var(--layer-background-neutral-container-primary-light-darken, #93B9ED)" />
                          <path d="M32 18.0792V23.0073C30.112 23.2396 28.2007 23.0172 26.2963 22.7956C21.4421 22.2308 16.6322 21.6712 12.3649 28.6593C11.2037 24.9692 12.8662 20.8669 16.6083 18.7012C20.5173 16.4389 23.9197 16.9887 27.4438 17.5581C28.9255 17.7975 30.4286 18.0403 32 18.0792Z" fill="var(--layer-background-neutral-container-primary-light-darken, #93B9ED)" />
                          <path d="M32 42.9758C30.1233 43.6391 28.1038 44 26 44C16.0589 44 8 35.9411 8 26C8 16.0589 16.0589 8 26 8C28.1038 8 30.1233 8.36093 32 9.02423V4.82813C30.0927 4.28867 28.08 4 26 4C13.8497 4 4 13.8497 4 26C4 38.1503 13.8497 48 26 48C28.08 48 30.0927 47.7113 32 47.1719V42.9758Z" fill="var(--layer-background-neutral-container-primary-light-darken, #93B9ED)" />
                          <path d="M40 37.3147V42.9714C44.886 38.9362 48 32.8317 48 26C48 19.1683 44.886 13.0638 40 9.02865V14.6853C42.5016 17.7768 44 21.7134 44 26C44 30.2866 42.5016 34.2232 40 37.3147Z" fill="var(--layer-background-neutral-container-primary-light-darken, #93B9ED)" />
                          <path d="M32 2H36V50H32V2Z" fill="var(--layer-background-neutral-container-primary-light-darken, #93B9ED)" />
                        </g>
                        <defs>
                          <filter id="filter0_d_1427_112493" x="0" y="0" width="52" height="56" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                            <feOffset dy="2" />
                            <feGaussianBlur stdDeviation="2" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0.0705882 0 0 0 0 0.0745098 0 0 0 0 0.0784314 0 0 0 0.16 0" />
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1427_112493" />
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1427_112493" result="shape" />
                          </filter>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-[18px] md:text-[20px] mb-2">Lift</h3>
                  <p className="text-gray-700 text-[12px] md:text-[14px]">
                    Meanwhile, {developmentData.lift[0]} and {developmentData.lift[1]} hold great growth potential.
                    With just a bit more focus, they might break through and offer a noticeable boost to your life.
                  </p>
                </div>
              </div>

              {/* Reduce Section */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-0">
                <div className="flex-shrink-0 bg-gray-100 rounded-2xl p-4 md:mr-4 h-fit">
                  <div data-layer="thumbnail / symbol" className="ThumbnailSymbol w-full md:w-40 h-24 bg-layer-background-neutral-container-neutral rounded-3xl inline-flex justify-center items-center gap-2.5">
                    <div data-svg-wrapper data-layer="symbol / energy-flow" data-variants="Flow" className="SymbolEnergyFlow relative">
                      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_d_1427_112499)">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M26 42C35.9411 42 44 33.9411 44 24C44 14.0589 35.9411 6 26 6C16.0589 6 8 14.0589 8 24C8 33.9411 16.0589 42 26 42ZM26 46C38.1503 46 48 36.1503 48 24C48 11.8497 38.1503 2 26 2C13.8497 2 4 11.8497 4 24C4 36.1503 13.8497 46 26 46Z" fill="var(--layer-background-tertiary-red-base, #E60A0A)" />
                          <path d="M27.25 21.4545H36L24.75 38V26.5455H16L27.25 10V21.4545Z" fill="var(--layer-background-tertiary-red-base, #E60A0A)" />
                        </g>
                        <defs>
                          <filter id="filter0_d_1427_112499" x="0" y="0" width="52" height="52" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                            <feOffset dy="2" />
                            <feGaussianBlur stdDeviation="2" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0.0705882 0 0 0 0 0.0745098 0 0 0 0 0.0784314 0 0 0 0.16 0" />
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1427_112499" />
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1427_112499" result="shape" />
                          </filter>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-[18px] md:text-[20px] mb-2">Reduce</h3>
                  <p className="text-gray-700 text-[12px] md:text-[14px]">
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
