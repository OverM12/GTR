
import Image from "next/image";
import { useState, useEffect } from "react";
import { useDateRange } from "@/context/DateRangeContext";
import reportService from '@/services/reportService';

function FiveBoxDesk() {
  const { dateRange } = useDateRange();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for data
  const [selfData, setSelfData] = useState(null);
  const [socialData, setSocialData] = useState(null);
  const [actionsData, setActionsData] = useState(null);
  const [getsData, setGetsData] = useState(null);
  const [environmentData, setEnvironmentData] = useState(null);
  
  // State for expanded sections
  const [selfExpanded, setSelfExpanded] = useState(true);
  const [socialExpanded, setSocialExpanded] = useState(true);
  const [actionsExpanded, setActionsExpanded] = useState(true);
  const [getsExpanded, setGetsExpanded] = useState(true);
  const [environmentExpanded, setEnvironmentExpanded] = useState(true);
  
  // State for showing detailed elements
  const [showSelfElements, setShowSelfElements] = useState(false);
  const [showSocialElements, setShowSocialElements] = useState(false);
  const [showActionsElements, setShowActionsElements] = useState(false);
  const [showGetsElements, setShowGetsElements] = useState(false);
  
  // Update component data when gtrData changes
  useEffect(() => {
    const fetchData = async () => {
      if (!dateRange.fromDate || !dateRange.toDate) {
        console.log("Date range not available yet");
        return;
      }
      
      console.log("FourBoxDesk: Fetching data with date range:", dateRange);
      
      try {
        setLoading(true);
        const data = await reportService.getGtrReport(dateRange.fromDate, dateRange.toDate);
        console.log("FourBoxDesk: Data fetched successfully:", data);
        
        // Update state with fetched data
        setSelfData(data.self);
        setSocialData(data.social);
        setActionsData(data.actions);
        setGetsData(data.gets);
        setEnvironmentData(data.environment);
        setError(null);
      } catch (error) {
        console.error("Error fetching GTR data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]); // Include dateRange as a dependency
  
  // Get scores from the data
  const selfScore = selfData?.gtr ? parseFloat(selfData.gtr).toFixed(1) : "77.5";
  const socialScore = socialData?.gtr ? parseFloat(socialData.gtr).toFixed(1) : "90.4";
  const actionsScore = actionsData?.gtr ? parseFloat(actionsData.gtr).toFixed(1) : "47.0";
  const getsScore = getsData?.gtr ? parseFloat(getsData.gtr).toFixed(1) : "47.0";
  const environmentScore = environmentData?.gtr ? parseFloat(environmentData.gtr).toFixed(1) : "47.0";

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
      <div className="hidden md:flex md:justify-center md:items-center p-8 h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C6B06A]"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="hidden md:flex md:justify-center md:items-center p-8 h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="hidden md:flex md:flex-col gap-1">
      
      {/* Self Section */}
      <div className="flex pl-26 w-full items-center hover:bg-[#F0F1F5] py-6 rounded-[24px]">
        <div className="flex items-center gap-2">
          <Image
            src="/your-gtr/dashboard/self-icon.png"
            width={40}
            height={40}
            alt="Self Icon"
          />
          <span className="text-gray-700">Self</span>
        </div>
        <div className="flex w-full pl-17">
          {selfExpanded && (
            <div className="flex w-full h-[28px] bg-[#B60A06] rounded-full">
              <div
                className="flex justify-end items-center pr-2 text-white bg-[#C6B06A] rounded-l-full"
                style={{ width: `${selfScore}%` }}
              >
                {selfScore}
              </div>
            </div>
          )}
        </div>
        <div className="flex pl-4">
          <button className="" onClick={() => setShowSelfElements(!showSelfElements)}>
            <Image
              src="/area-deep-dive/arrow-up-icon.svg"
              width={40}
              height={40}
              alt="Magnify Icon"
            />
          </button>
        </div>
      </div>

      {/* Self Elements */}
      {showSelfElements && selfData?.elements && (
        <div className="ml-24 mb-4 pl-6 border-l-2 border-gray-200">
          <div className="grid grid-cols-1 gap-3">
            {selfData.elements.map((element, index) => (
              <div key={index} className="flex items-center">
                <div className="flex items-center w-1/4">
                  {element.isHigh && (
                    <span className="mr-2 text-blue-500 text-lg">●</span>
                  )}
                  {element.isLow && (
                    <span className="mr-2 text-red-500 text-lg">●</span>
                  )}
                  <span className="text-gray-700">
                    {formatElementName(element.element)}
                  </span>
                </div>
                <div className="w-3/4 relative h-[20px] bg-[#B60A06] rounded-full overflow-hidden ml-4">
                  <div
                    className="absolute left-0 top-0 h-full bg-[#C6B06A] rounded-l-full flex items-center justify-end"
                    style={{ width: `${element.gtr}%` }}
                  >
                    <span className="absolute text-white font-medium text-xs px-2">
                      {element.gtr}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {selfData.notes && (
            <div className="mt-4 bg-gray-50 p-3 rounded-md">
              <h4 className="text-sm font-semibold mb-1">Notes:</h4>
              <p className="text-sm text-gray-600">{selfData.notes}</p>
            </div>
          )}
        </div>
      )}
      
      {/* Social Section */}
      <div className="flex pl-26 w-full items-center hover:bg-[#F0F1F5] py-6 rounded-[24px]">
        <div className="flex items-center gap-2">
          <Image
            src="/area-deep-dive/mental-icon.svg"
            width={40}
            height={40}
            alt="Mental Icon"
          />
          <Image
            src="/area-deep-dive/social-icon.svg"
            width={40}
            height={40}
            alt="Social Icon"
          />
          <span className="text-gray-700">Social</span>
        </div>
        <div className="flex w-full pl-17">
          {socialExpanded && (
            <div className="flex w-full h-[28px] bg-[#B60A06] rounded-full">
              <div
                className="flex justify-end items-center pr-2 text-white bg-[#C6B06A] rounded-l-full"
                style={{ width: `${socialScore}%` }}
              >
                {socialScore}
              </div>
            </div>
          )}
        </div>
        <div className="flex pl-4">
          <button className="" onClick={() => setShowSocialElements(!showSocialElements)}>
            <Image
              src="/area-deep-dive/arrow-up-icon.svg"
              width={40}
              height={40}
              alt="Magnify Icon"
            />
          </button>
        </div>
      </div>

      {/* Social Elements */}
      {showSocialElements && socialData?.elements && (
        <div className="ml-24 mb-4 pl-6 border-l-2 border-gray-200">
          <div className="grid grid-cols-1 gap-3">
            {socialData.elements.map((element, index) => (
              <div key={index} className="flex items-center">
                <div className="flex items-center w-1/4">
                  {element.isHigh && (
                    <span className="mr-2 text-blue-500 text-lg">●</span>
                  )}
                  {element.isLow && (
                    <span className="mr-2 text-red-500 text-lg">●</span>
                  )}
                  <span className="text-gray-700">
                    {formatElementName(element.element)}
                  </span>
                </div>
                <div className="w-3/4 relative h-[20px] bg-[#B60A06] rounded-full overflow-hidden ml-4">
                  <div
                    className="absolute left-0 top-0 h-full bg-[#C6B06A] rounded-l-full flex items-center justify-end"
                    style={{ width: `${element.gtr}%` }}
                  >
                    <span className="absolute text-white font-medium text-xs px-2">
                      {element.gtr}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions Section */}
      <div className="flex pl-26 w-full items-center hover:bg-[#F0F1F5] py-6 rounded-[24px]">
        <div className="flex items-center gap-2">
          <Image
            src="/area-deep-dive/sense-icon.svg"
            width={40}
            height={40}
            alt="Sense Icon"
          />
          <Image
            src="/area-deep-dive/actions-icon.svg"
            width={40}
            height={40}
            alt="Actions Icon"
          />
          <span className="text-gray-700">Actions</span>
        </div>
        <div className="flex w-full pl-15">
          {actionsExpanded && (
            <div className="flex w-full h-[28px] bg-[#B60A06] rounded-full">
              <div
                className="flex justify-end items-center pr-2 text-white bg-[#C6B06A] rounded-l-full"
                style={{ width: `${actionsScore}%` }}
              >
                {actionsScore}
              </div>
            </div>
          )}
        </div>
        <div className="flex pl-4">
          <button className="" onClick={() => setShowActionsElements(!showActionsElements)}>
            <Image
              src="/area-deep-dive/arrow-up-icon.svg"
              width={40}
              height={40}
              alt="Magnify Icon"
            />
          </button>
        </div>
      </div>

      {/* Actions Elements */}
      {showActionsElements && actionsData?.elements && (
        <div className="ml-24 mb-4 pl-6 border-l-2 border-gray-200">
          <div className="grid grid-cols-1 gap-3">
            {actionsData.elements.map((element, index) => (
              <div key={index} className="flex items-center">
                <div className="flex items-center w-1/4">
                  {element.isHigh && (
                    <span className="mr-2 text-blue-500 text-lg">●</span>
                  )}
                  {element.isLow && (
                    <span className="mr-2 text-red-500 text-lg">●</span>
                  )}
                  <span className="text-gray-700">
                    {formatElementName(element.element)}
                  </span>
                </div>
                <div className="w-3/4 relative h-[20px] bg-[#B60A06] rounded-full overflow-hidden ml-4">
                  <div
                    className="absolute left-0 top-0 h-full bg-[#C6B06A] rounded-l-full flex items-center justify-end"
                    style={{ width: `${element.gtr}%` }}
                  >
                    <span className="absolute text-white font-medium text-xs px-2">
                      {element.gtr}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Obtainments Section */}
      <div className="flex pl-26 w-full items-center hover:bg-[#F0F1F5] py-6 rounded-[24px]">
        <div className="flex items-center gap-2 pl-[39px]">
          <Image
            src="/area-deep-dive/obtain-icon.svg"
            width={40}
            height={40}
            alt="Obtain Icon"
          />
          <span className="text-gray-700">Obtainments</span>
        </div>
        <div className="flex w-full pl-8">
          {getsExpanded && (
            <div className="flex w-full h-[28px] bg-[#B60A06] rounded-full">
              <div
                className="flex justify-end items-center pr-2 text-white bg-[#C6B06A] rounded-l-full"
                style={{ width: `${getsScore}%` }}
              >
                {getsScore}
              </div>
            </div>
          )}
        </div>
        <div className="flex pl-4">
          <button className="" onClick={() => setShowGetsElements(!showGetsElements)}>
            <Image
              src="/area-deep-dive/arrow-up-icon.svg"
              width={40}
              height={40}
              alt="Magnify Icon"
            />
          </button>
        </div>
      </div>

      {/* Obtainments Elements */}
      {showGetsElements && getsData?.elements && (
        <div className="ml-24 mb-4 pl-6 border-l-2 border-gray-200">
          <div className="grid grid-cols-1 gap-3">
            {getsData.elements.map((element, index) => (
              <div key={index} className="flex items-center">
                <div className="flex items-center w-1/4">
                  {element.isHigh && (
                    <span className="mr-2 text-blue-500 text-lg">●</span>
                  )}
                  {element.isLow && (
                    <span className="mr-2 text-red-500 text-lg">●</span>
                  )}
                  <span className="text-gray-700">
                    {formatElementName(element.element)}
                  </span>
                </div>
                <div className="w-3/4 relative h-[20px] bg-[#B60A06] rounded-full overflow-hidden ml-4">
                  <div
                    className="absolute left-0 top-0 h-full bg-[#C6B06A] rounded-l-full flex items-center justify-end"
                    style={{ width: `${element.gtr}%` }}
                  >
                    <span className="absolute text-white font-medium text-xs px-2">
                      {element.gtr}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Environment Section */}
      <div className="flex pl-26 w-full items-center hover:bg-[#F0F1F5] py-6 rounded-[24px]">
        <div className="flex items-center gap-2 pl-[39px]">
          <Image
            src="/area-deep-dive/environment-icon.svg"
            width={40}
            height={40}
            alt="Environment Icon"
          />
          <span className="text-gray-700">Environment</span>
        </div>
        <div className="flex w-full pl-9">
          {environmentExpanded && (
            <div className="flex w-full h-[28px] bg-[#B60A06] rounded-full">
              <div
                className="flex justify-end items-center pr-2 text-white bg-[#C6B06A] rounded-l-full"
                style={{ width: `${environmentScore}%` }}
              >
                {environmentScore}
              </div>
            </div>
          )}
        </div>
        <div className="flex pl-4">
          <button className="" onClick={() => setShowEnvironmentElements(!showEnvironmentElements)}>
            <Image
              src="/area-deep-dive/arrow-up-icon.svg"
              width={40}
              height={40}
              alt="Magnify Icon"
            />
          </button>
        </div>
      </div>

      {/* Environment Elements */}
      {showEnvironmentElements && environmentData?.elements && (
        <div className="ml-24 mb-4 pl-6 border-l-2 border-gray-200">
          <div className="grid grid-cols-1 gap-3">
            {environmentData.elements.map((element, index) => (
              <div key={index} className="flex items-center">
                <div className="flex items-center w-1/4">
                  {element.isHigh && (
                    <span className="mr-2 text-blue-500 text-lg">●</span>
                  )}
                  {element.isLow && (
                    <span className="mr-2 text-red-500 text-lg">●</span>
                  )}
                  <span className="text-gray-700">
                    {formatElementName(element.element)}
                  </span>
                </div>
                <div className="w-3/4 relative h-[20px] bg-[#B60A06] rounded-full overflow-hidden ml-4">
                  <div
                    className="absolute left-0 top-0 h-full bg-[#C6B06A] rounded-l-full flex items-center justify-end"
                    style={{ width: `${element.gtr}%` }}
                  >
                    <span className="absolute text-white font-medium text-xs px-2">
                      {element.gtr}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FiveBoxDesk;
