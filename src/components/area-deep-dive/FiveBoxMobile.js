import Image from "next/image";
import { useState, useEffect } from "react";
import reportService from "@/services/reportService";
import { useDateRange } from "@/context/DateRangeContext";

function FiveBoxMobile() {
  const { dateRange } = useDateRange();
  const [selfData, setSelfData] = useState(null);
  const [socialData, setSocialData] = useState(null);
  const [actionsData, setActionsData] = useState(null);
  const [getsData, setGetsData] = useState(null);
  const [environmentData, setEnvironmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalGtr, setTotalGtr] = useState(0);

  const [showSelfElements, setShowSelfElements] = useState(false);
  const [showSocialElements, setShowSocialElements] = useState(false);
  const [showActionsElements, setShowActionsElements] = useState(false);
  const [showGetsElements, setShowGetsElements] = useState(false);
  const [showEnvironmentElements, setShowEnvironmentElements] = useState(false);

  const safeParseGtr = (val) => !isNaN(parseFloat(val)) ? parseFloat(val).toFixed(1) : "0.0";
  const safeWidth = (val) => `${Math.max(0, Math.min(100, parseFloat(val)))}%`;

  useEffect(() => {
    const fetchData = async () => {
      if (!dateRange.fromDate || !dateRange.toDate) return;

      try {
        setLoading(true);
        const response = await reportService.getGtrReport(dateRange.fromDate, dateRange.toDate);
        const data = response.data.data;

        setSelfData(data.areas.self);
        setSocialData(data.areas.social);
        setActionsData(data.areas.actions);
        setGetsData(data.areas.gets);
        setEnvironmentData(data.areas.environment);

        if (data.gtr) setTotalGtr(parseFloat(data.gtr));
        setError(null);
      } catch (error) {
        console.error("Error fetching GTR data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const selfScore = safeParseGtr(selfData?.gtr);
  const socialScore = safeParseGtr(socialData?.gtr);
  const actionsScore = safeParseGtr(actionsData?.gtr);
  const getsScore = safeParseGtr(getsData?.gtr);
  const environmentScore = safeParseGtr(environmentData?.gtr);
  const totalGtrScore = totalGtr.toFixed(1);

  const formatElementName = (name) => {
    if (typeof name !== "string") return name;
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const renderElements = (elements) => (
    <div className="mb-4 pl-4 border-l-2 border-gray-200">
      <div className="flex flex-col gap-3">
        {elements.map((element, index) => {
          const percent = safeParseGtr(element.gtr);
          return (
            <div key={`${element.element}-${index}`} className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  {element.isHigh && (
                    <span className="mr-2 text-blue-600" title="High">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#2563eb"><circle cx="12" cy="12" r="8" /></svg>
                    </span>
                  )}
                  {element.isLow && (
                    <span className="mr-2 text-red-600" title="Low">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#dc2626"><circle cx="12" cy="12" r="8" /></svg>
                    </span>
                  )}
                  <span className="text-gray-700 text-sm">{formatElementName(element.element)}</span>
                </div>
              </div>
              <div className="w-full h-[28px] bg-[#B60A06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C6B06A] rounded-l-full flex items-center justify-center text-[14px] text-white"
                  style={{ width: safeWidth(percent) }}
                >
                  {percent}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (loading) return <div className="flex justify-center items-center p-8 h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C6B06A]"></div></div>;
  if (error) return <div className="flex justify-center items-center p-8 h-64"><div className="text-red-500">{error}</div></div>;

  return (
    <div className="md:hidden flex flex-col p-4">
      {/* Self */}
      {renderBox("Self", selfScore, showSelfElements, setShowSelfElements, selfData?.elements)}
      {/* Social */}
      {renderBox("Social", socialScore, showSocialElements, setShowSocialElements, socialData?.elements)}
      {/* Actions */}
      {renderBox("Actions", actionsScore, showActionsElements, setShowActionsElements, actionsData?.elements)}
      {/* Gets */}
      {renderBox("Obtainments", getsScore, showGetsElements, setShowGetsElements, getsData?.elements)}
      {/* Environment */}
      {renderBox("Environment", environmentScore, showEnvironmentElements, setShowEnvironmentElements, environmentData?.elements)}
    </div>
  );

  function renderBox(label, score, show, toggleShow, elements) {
    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{label}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1" onClick={() => toggleShow(!show)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transform transition-transform ${show ? 'rotate-180' : ''}`}>
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        <div className="w-full h-[28px] bg-[#B60A06] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C6B06A] rounded-l-full flex items-center justify-center text-white text-sm"
            style={{ width: safeWidth(score) }}
          >
            {score}%
          </div>
        </div>
        {show && elements && renderElements(elements)}
      </div>
    );
  }
}

export default FiveBoxMobile;
