"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import reportService from "@/services/reportService";
import { useDateRange } from "@/context/DateRangeContext";

function GtrScore() {
  const { dateRange } = useDateRange();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!dateRange.fromDate || !dateRange.toDate) {
        //console.log("GtrScore: Date range not complete, skipping fetch");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        //console.log("GtrScore: Fetching data for date range:", dateRange);
        const response = await reportService.getGtrReport(dateRange.fromDate, dateRange.toDate);
        //console.log("GtrScore: Data fetched successfully:", response);

        if (response) {
          setData(response.data.data);
          setError(null);
        } else {
          setError("No data available for the selected date range");
        }
      } catch (err) {
        console.error("Error loading GTR data:", err);
        setError("Failed to load GTR data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  // Display loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C6B06A]"></div>
      </div>
    );
  }

  // Display error or no data state
  if (error || !data) {
    return (
      <div className="flex flex-col gap-[8px] p-[16px] pb-[44px] pt-[30px] w-full rounded-[40px] bg-white">
        <h1 className="text-[18px] font-bold">GTR</h1>
        <div className="flex flex-col items-center justify-center py-8">
          {/* <Image
            src="/your-gtr/self-insights/i-icon.png"
            width={64}
            height={64}
            alt="No data available"
            className="mb-4"
          /> */}
          <div className="text-gray-500 text-center">
            {error || "No GTR data available for the selected date range"}
          </div>
          <div className="text-gray-400 text-sm text-center mt-2">
            Try selecting a different date range
          </div>
        </div>
      </div>
    );
  }

  // Extract the main GTR score and area scores from the API data
  const mainGtrScore = data?.gtr
    ? parseFloat(data.gtr).toFixed(1)
    : "0.0";

  const selfScore = data?.areas?.self?.gtr
    ? parseFloat(data.areas.self.gtr).toFixed(1)
    : "0.0";

  const socialScore = data?.areas?.social?.gtr
    ? parseFloat(data.areas.social.gtr).toFixed(1)
    : "0.0";

  const actionsScore = data?.areas?.actions?.gtr
    ? parseFloat(data.areas.actions.gtr).toFixed(1)
    : "0.0";

  const getsScore = data?.areas?.gets?.gtr
    ? parseFloat(data.areas.gets.gtr).toFixed(1)
    : "0.0";

  const environmentScore = data?.areas?.environment?.gtr
    ? parseFloat(data.areas.environment.gtr).toFixed(1)
    : "0.0";

  return (
    <div className="z-0 flex flex-col gap-2 sm:gap-3 md:gap-4 p-4 sm:p-6 md:p-8 pb-8 sm:pb-10 md:pb-12 pt-6 sm:pt-7 md:pt-8 w-full rounded-2xl sm:rounded-3xl md:rounded-[40px] bg-white">
      <h1 className="text-xl sm:text-2xl md:text-[24px] font-bold">GTR</h1>
      <div className="flex w-full items-center justify-between">
        <div className="w-full h-8 sm:h-10 md:h-[48px] bg-[#B60A06] rounded-full overflow-hidden relative">
          <div
            className="h-full bg-[#C6B06A] transition-all duration-500 ease-in-out relative flex items-center"
            style={{ width: `${Math.min(mainGtrScore, 100)}%` }}
          >
            <span
              className="text-white text-lg sm:text-2xl md:text-[28px] font-semibold absolute right-4 top-1/2 transform -translate-y-1/2 whitespace-nowrap overflow-hidden text-ellipsis"
              style={{ maxWidth: `${Math.min(mainGtrScore, 100)}%` }}
            >
              {mainGtrScore}%
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 w-full bg-white px-2 py-4">
        {[
          { title: 'Self', score: selfScore, icon: '/your-gtr/dashboard/self-icon.png' },
          { title: 'Social', score: socialScore, icon: '/your-gtr/dashboard/social-icon.png' },
          { title: 'Actions', score: actionsScore, icon: '/your-gtr/dashboard/actions-icon.png' },
          { title: 'Obtainments', score: getsScore, icon: '/your-gtr/dashboard/obtainments-icon.png' },
          { title: 'Environment', score: environmentScore, icon: '/your-gtr/dashboard/environment-icon.png' }
        ].map((item, index) => (
          <div key={index} className="flex flex-col w-full space-y-2">
            <div className="flex text-xs sm:text-sm md:text-[14px] font-bold items-center gap-2">
              <Image
                src={item.icon}
                width={20}
                height={20}
                alt={`GTR Dashboard ${item.title.toLowerCase()}-icon`}
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-[24px] md:h-[24px]"
              />
              {item.title}
            </div>
            <div className="flex text-lg sm:text-xl md:text-[24px] font-bold items-center gap-2">
              {item.score}%
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="w-full h-[6px] sm:h-[7px] md:h-[8px] bg-[#B60A06] rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-[#C6B06A] transition-all duration-500 ease-in-out"
                  style={{ width: `${item.score}%` }}
                >
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GtrScore;