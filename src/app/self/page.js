"use client";
import { useState, useEffect } from "react";
import KeyInfluencers from "@/components/dashboard/KeyInfluencers";
import TopEmotions from "@/components/dashboard/TopEmotions";
import ApexLineChart from "@/components/dashboard/ApexLineChart";
import Image from "next/image";
import reportService from "@/services/reportService";
import { useDateRange } from "@/context/DateRangeContext";

export default function Self() {
  const { dateRange } = useDateRange();
  const [gtrScore, setGtrScore] = useState(0);
  const [reflectionText, setReflectionText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGtrData = async () => {
      if (!dateRange.fromDate || !dateRange.toDate) {
        //console.log("Self page: Date range not complete, using default 0");
        setGtrScore(0);
        setReflectionText(""); // Ensure reflectionText is cleared
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        //console.log("Self page: Fetching data for date range:", dateRange);
        const data = await reportService.getGtrReport(dateRange.fromDate, dateRange.toDate);
        //console.log("Self page: Data fetched successfully:", data);

        // Check for self data in the response
        const selfData = data.data.data.areas.self;
        if (selfData && selfData.gtr) {
          setGtrScore(parseFloat(selfData.gtr));
        } else {
          setGtrScore(0); // Default to 0 if gtr score is not available
        }

        // Handle the reflection text or any other data
        if (selfData && selfData.reflection) {
          setReflectionText(selfData.reflection);
        } else {
          setReflectionText(""); // Default to empty if reflection is not available
        }

        setError(null); // Reset error state if data is fetched successfully
      } catch (err) {
        console.error("Error loading GTR data:", err);
        setError("Failed to load GTR data");
        setGtrScore(0);
        setReflectionText(""); // Clear reflection text in case of error
      } finally {
        setLoading(false);
      }
    };

    fetchGtrData();
  }, [dateRange]); // Only re-fetch when date range changes

  // Format the score for display
  const formattedScore = gtrScore.toFixed(1);

  return (
    <div className="w-full h-lvh overflow-auto flex flex-col bg-[#F0F2F5] py-[32px] px-[16px] gap-[16px]">
      <h1 className="text-[#737985] text-[24px]">
        Insights / <strong className="text-black">Self</strong>
      </h1>

      <div className="w-full flex flex-col bg-white p-2 rounded-4xl py-6">
        <h1 className="m-2 font-bold">GTR</h1>
        {loading ? (
          <div className="flex justify-center items-center h-10">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#C6B06A]"></div>
          </div>
        ) : (
          <div className="w-full overflow-hidden bg-red rounded-full bg-[#B60A06]">
            <div
              className="items-center justify-end pr-2 text-white flex h-10 bg-[#C6B06A]"
              style={{ width: `${gtrScore}%` }}
            >
              {formattedScore}%
            </div>
          </div>
        )}
      </div>

      {/* KeyInfluencers, TopEmotions, ApexLineChart */}
      <KeyInfluencers />
      <TopEmotions />
      <ApexLineChart />

      {/* Reflection Section */}
      <div className="flex flex-col bg-white p-4 rounded-4xl">
        <div className="reflection-content">
          <h3 className="font-semibold mb-2">
            Your personal Self reflection notes
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            These are the notes you made during the assessment. Now that
            you&apos;ve seen the bigger picture, would you like to add anything?
          </p>

          <div className="w-full bg-[#F0F2F5] rounded-[24px] p-[32px] flex flex-col justify-center">
            <h1 className="font-bold">Reflection on my current Self</h1>
            <p className="text-[16px] mt-4">{reflectionText || "No reflection added."}</p>
          </div>

          <button
            className="border rounded-full flex items-center mt-4 px-4 py-2 gap-2"
            onClick={() => alert('Edit reflection functionality not implemented yet!')}
          >
            <Image
              alt="GTR Icon"
              width={20}
              height={20}
              src="/your-gtr/your-gtr/self-insights/edit-icon.svg"
            />
            Edit reflection
          </button>
        </div>
      </div>
    </div>
  );
}
