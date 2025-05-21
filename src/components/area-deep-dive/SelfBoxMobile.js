import Image from "next/image";
import { useState, useEffect } from "react";
import { useDateRange } from "@/context/DateRangeContext";
import reportService from '@/services/reportService';

export default function SelfBoxMobile() {
  const { dateRange } = useDateRange();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [areaData, setAreaData] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [showElements, setShowElements] = useState(false);

  // Fetch data whenever date range changes
  useEffect(() => {
    const fetchData = async () => {
      if (!dateRange.fromDate || !dateRange.toDate) {
        //console.log("SelfBoxMobile: Date range not available yet");
        return;
      }

      //console.log("SelfBoxMobile: Fetching data with date range:", dateRange);

      try {
        setLoading(true);
        const data = await reportService.getGtrReport(dateRange.fromDate, dateRange.toDate);
        //console.log("SelfBoxMobile: Data fetched successfully:", data);

        // Update state with fetched data - we only need the self data
        setAreaData(data.self);
        setError(null);
      } catch (error) {
        console.error("SelfBoxMobile: Error fetching GTR data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]); // Include dateRange as a dependency

  const selfScore = areaData?.gtr ? parseFloat(areaData.gtr).toFixed(1) : "0.0";

  // Function to format element name for display
  const formatElementName = (name) => {
    if (typeof name !== 'string') return name;
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C6B06A]"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="md:hidden mt-8 flex justify-center items-center p-8 h-32">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="md:hidden mb-6 mt-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-700 text-[14px]">Self</span>
        <div className="flex gap-2">
          <button className="p-1" onClick={() => setShowElements(!showElements)}>
            <Image
              src="/area-deep-dive/arrow-up-icon.svg"
              width={40}
              height={40}
              alt="arrow-up icon"
            />
          </button>
        </div>
      </div>
      {expanded && (
        <div className="relative h-[28px] bg-[#B60A06] rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-[#C6B06A] rounded-l-full flex items-center justify-end"
            style={{ width: `${selfScore}%` }}
          >
            <span className="absolute text-white font-medium text-sm px-2">
              {selfScore}%
            </span>
          </div>
        </div>
      )}

      {/* Elements section */}
      {showElements && areaData?.elements && (
        <div className="mt-4 pl-4 border-l-2 border-gray-200">
          {areaData.elements.map((element, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  {element.isHigh && (
                    <span className="mr-2 text-blue-500">●</span>
                  )}
                  {element.isLow && (
                    <span className="mr-2 text-red-500">●</span>
                  )}
                  <span className="text-gray-700">
                    {formatElementName(element.element)}
                  </span>
                </div>
                <span className="text-gray-700 font-medium">{element.gtr}%</span>
              </div>
              <div className="relative h-[16px] bg-[#B60A06] rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-[#C6B06A] rounded-l-full"
                  style={{ width: `${element.gtr}%` }}
                >
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
