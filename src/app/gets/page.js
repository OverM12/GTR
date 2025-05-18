"use client";
import { useState, useEffect } from "react";
import KeyInfluencers from "@/components/dashboard/KeyInfluencers";
import TopEmotions from "@/components/dashboard/TopEmotions";
import ApexLineChart from "@/app/gets/ApexLineChart";
import Image from "next/image";
import reportService from "@/services/reportService";
import { useDateRange } from "@/context/DateRangeContext";

export default function Gets() {
  const { dateRange } = useDateRange();
  const [gtrScore, setGtrScore] = useState(0);
  const [reflectionText, setReflectionText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGetsElements, setShowGetsElements] = useState(false);
  const [getsData, setGetsData] = useState(null);

  useEffect(() => {
    const fetchGtrData = async () => {
      if (!dateRange.fromDate || !dateRange.toDate) {
        setGtrScore(0);
        setReflectionText("");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await reportService.getGtrReport(dateRange.fromDate, dateRange.toDate);
        
        // Update getsData state
        const getsDataResponse = data.data.data.areas.gets;
        setGetsData(getsDataResponse);

        if (getsDataResponse && getsDataResponse.gtr) {
          setGtrScore(parseFloat(getsDataResponse.gtr));
        } else {
          setGtrScore(0);
        }

        if (getsDataResponse && getsDataResponse.reflection) {
          setReflectionText(getsDataResponse.reflection);
        } else {
          setReflectionText("");
        }

        setError(null);
      } catch (err) {
        console.error("Error loading GTR data:", err);
        setError("Failed to load GTR data");
        setGtrScore(0);
        setReflectionText("");
        setGetsData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGtrData();
  }, [dateRange]);

  const formattedScore = gtrScore.toFixed(1);

  const formatElementName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  return (
    <div className="w-full flex flex-col bg-[#F0F2F5] py-[32px] px-[16px] gap-[16px]">
      <h1 className="text-[#737985] text-[24px]">
        Insights / <strong className="text-black">Place</strong>
      </h1>

      <div className="w-full flex flex-col bg-white p-2 rounded-4xl py-6 px-6">
        <h1 className="m-2 font-bold">GTR</h1>
        {loading ? (
          <div className="flex justify-center items-center h-10">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#C6B06A]"></div>
          </div>
        ) : (
          <div className="flex w-full items-center hover:bg-[#F0F1F5] py-6 rounded-[24px]">
            <div className="flex items-center gap-2 pl-2">
              {/* <Image
                src="/your-gtr/your-gtr/dashboard/gets-icon.png"
                width={40}
                height={40}
                alt="Gets Icon"
              />
              <span className="text-gray-700">Gets</span> */}
            </div>
            <div className="flex-1 flex items-center relative h-[30px] mx-2">
              <div className="w-full h-[30px] bg-[#B60A06] rounded-full overflow-hidden relative">
                <div
                  className="h-[30px] bg-[#C6B06A] transition-all duration-500 ease-in-out relative"
                  style={{ width: `${formattedScore}%` }}
                >
                  {parseFloat(formattedScore) >= 3.0 && (
                    <span 
                      className="text-white text-xs font-semibold absolute"
                      style={{ 
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    >
                      {formattedScore}%
                    </span>
                  )}
                </div>
                {parseFloat(formattedScore) < 3.0 && (
                  <span 
                    className="text-white text-xs font-semibold absolute"
                    style={{ 
                      left: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  >
                    {formattedScore}%
                  </span>
                )}
              </div>
            </div>
            <div className="flex pl-4">
              {/* <button
                className="transform transition-transform duration-300"
                style={{ transform: showGetsElements ? 'rotate(180deg)' : 'rotate(0deg)' }}
                onClick={() => setShowGetsElements(!showGetsElements)}
              >
                <Image
                  src="/your-gtr/your-gtr/area-deep-dive/arrow-up-icon.svg"
                  width={40}
                  height={40}
                  alt="Magnify Icon"
                />
              </button> */}
            </div>
          </div>
        )}

        {/* Gets Elements */}
        {/* {showGetsElements && getsData?.elements && (
          <div className="ml-24 mb-4 pl-32 pr-32 border-l-2 border-gray-200 animate-fadeIn">
            <div className="flex flex-col gap-3">
              {getsData.elements.map((element, index) => {
                const percent = parseFloat(element.gtr).toFixed(1);
                return (
                  <div key={index} className="flex items-center animate-slideIn" style={{animationDelay: `${index * 100}ms`}}>
                    <div className="flex items-center justify-end w-[220px] min-w-[220px] pr-4">
                      {element.isHigh && (
                        <span className="mr-2 text-blue-600 text-lg" title="High">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="#2563eb"><circle cx="12" cy="12" r="8"/></svg>
                        </span>
                      )}
                      {element.isLow && (
                        <span className="mr-2 text-red-600 text-lg" title="Low">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="#dc2626"><circle cx="12" cy="12" r="8"/></svg>
                        </span>
                      )}
                      <span className="text-gray-700 text-sm whitespace-nowrap">{formatElementName(element.element)}</span>
                    </div>
                    <div className="flex-1 flex items-center relative h-[30px]">
                      <div className="absolute left-0 top-0 h-[30px] w-full bg-[#B60A06] rounded-full"></div>
                      <div
                        className="absolute left-0 top-0 h-[30px] bg-[#C6B06A] rounded-l-full flex items-center transition-all duration-1000 ease-in-out"
                        style={{ width: `${percent}%` }}
                      >
                        <span className="text-white text-xs font-semibold pl-2">{percent}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )} */}
      </div>

      {/* <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateX(-20px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-in-out forwards;
          opacity: 0;
        }
      `}</style> */}

      <ApexLineChart />

      <div className="w-full flex flex-col bg-white p-6 rounded-4xl">
        <div className="mb-6">
          <h2 className="font-semibold text-lg">Your personal Place reflection notes</h2>
          <p className="text-sm text-gray-500">These are the notes you made during the assessment. Now that you&apos;ve seen the bigger picture, would you like to add anything?</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-10">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#C6B06A]"></div>
          </div>
        ) : (
          <div className="w-full bg-[#F0F2F5] rounded-[24px] p-[32px]">
            {getsData?.notes ? (
              <div className="whitespace-pre-wrap text-gray-700">
                {getsData.notes}
              </div>
            ) : (
              <div className="text-gray-700">
                No reflection notes yet. Click &apos;Edit reflection&apos; to add your thoughts.
              </div>
            )}
          </div>
        )}
        
        <button
          className="border rounded-full flex items-center mt-4 px-4 py-2 gap-2 self-start"
          onClick={() => {/* Add edit functionality here */}}
        >
          <Image
            alt="Edit Icon"
            width={20}
            height={20}
            src="/your-gtr/your-gtr/self-insights/edit-icon.svg"
          />
          Edit reflection
        </button>
      </div>
    </div>
  );
}
