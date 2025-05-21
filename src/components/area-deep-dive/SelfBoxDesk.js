import Image from "next/image";
import { useState, useEffect } from "react";
import { useDateRange } from "@/context/DateRangeContext";

export default function SelfBoxDesk() {
  const { dateRange, loading, gtrData } = useDateRange();
  const [error, setError] = useState(null);
  const [areaData, setAreaData] = useState(null);
  const [showElements, setShowElements] = useState(false);

  // Update component data when gtrData changes
  useEffect(() => {
    if (gtrData) {
      setAreaData(gtrData.self);
      // console.log("data sel", gtrData.self)
      setError(null);
    }
  }, [gtrData]);

  const selfScore = areaData?.gtr ? parseFloat(areaData.gtr).toFixed(2) : "0.00"; // เปลี่ยนเป็นทศนิยม 2 หลัก

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
      <div className="hidden md:flex md:justify-center md:items-center p-8 h-32">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="hidden md:block">
      {/* Overall Self Score */}
      <div className="flex items-center mt-4">
        <span className="text-gray-700 text-[14px] text-nowrap p-4">Self</span>
        <div className="w-full flex bg-[#B60A06] rounded-full h-[28px]">
          <div
            className="bg-[#C6B06A] rounded-l-full flex items-center justify-end transition-all"
            style={{ width: `${selfScore}%` }}
          >
            <span className="text-white font-medium text-sm px-2">
              {selfScore}%
            </span>
          </div>
        </div>
        <div className="flex gap-2 ml-2">
          <button className="p-1" onClick={() => setShowElements(!showElements)}>
            <Image
              src="/your-gtr/area-deep-dive/arrow-up-icon.svg"
              width={40}
              height={40}
              alt="Arrow icon"
            />
          </button>
        </div>
      </div>

      {/* Elements section */}
      {showElements && areaData?.elements && (
        <div className="mt-4 ml-12 border-l-2 border-gray-200 pl-6">
          <div className="flex flex-col gap-3">
            {areaData.elements.map((element, index) => {
              const percent = parseFloat(element.gtr).toFixed(1);
              return (
                <div key={index} className="flex items-center gap-3">
                  {/* Icon for isHigh or isLow */}
                  {element.isHigh && (
                    <span className="text-blue-600 text-lg" title="High">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#2563eb"><circle cx="12" cy="12" r="8" /></svg>
                    </span>
                  )}
                  {element.isLow && (
                    <span className="text-red-600 text-lg" title="Low">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#dc2626"><circle cx="12" cy="12" r="8" /></svg>
                    </span>
                  )}
                  {/* Label */}
                  <span className="w-48 text-gray-700 text-sm">{formatElementName(element.element)}</span>
                  {/* Bar */}
                  <div className="flex-1 flex items-center relative h-[22px]">
                    <div className="absolute left-0 top-0 h-full w-full bg-[#B60A06] rounded-full"></div>
                    <div
                      className="absolute left-0 top-0 h-full bg-[#C6B06A] rounded-l-full flex items-center"
                      style={{ width: `${percent}%` }}
                    >
                      <span className="text-white text-xs font-semibold pl-2">{percent}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {areaData.notes && (
            <div className="mt-4 mb-4 bg-gray-50 p-3 rounded-md">
              <h4 className="text-sm font-semibold mb-1">Notes:</h4>
              <p className="text-sm text-gray-600">{areaData.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
