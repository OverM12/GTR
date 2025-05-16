import Image from "next/image";
import { useState, useEffect } from "react";
import reportService from "@/services/reportService";
import { useDateRange } from "@/context/DateRangeContext"; // Import the context

function FiveBoxDesk() {
  const { dateRange } = useDateRange(); // Get date range from context
  const [selfData, setSelfData] = useState(null);
  const [socialData, setSocialData] = useState(null);
  const [actionsData, setActionsData] = useState(null);
  const [getsData, setGetsData] = useState(null);
  const [environmentData, setEnvironmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selfExpanded, setSelfExpanded] = useState(true);
  const [socialExpanded, setSocialExpanded] = useState(true);
  const [actionsExpanded, setActionsExpanded] = useState(true);
  const [getsExpanded, setGetsExpanded] = useState(true);
  const [environmentExpanded, setEnvironmentExpanded] = useState(true);

  const [showSelfElements, setShowSelfElements] = useState(false);
  const [showSocialElements, setShowSocialElements] = useState(false);
  const [showActionsElements, setShowActionsElements] = useState(false);
  const [showGetsElements, setShowGetsElements] = useState(false);
  const [showEnvironmentElements, setShowEnvironmentElements] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!dateRange.fromDate || !dateRange.toDate) {
        setError("Please select a date range");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await reportService.getGtrReport(
          dateRange.fromDate,
          dateRange.toDate
        );

        if (!response.data || !response.data.data || !response.data.data.areas) {
          setError("No data available for the selected date range");
          return;
        }

        const data = response.data.data;

        setSelfData(data.areas.self);
        setSocialData(data.areas.social);
        setActionsData(data.areas.actions);
        setGetsData(data.areas.gets);
        setEnvironmentData(data.areas.environment);

      } catch (error) {
        console.error("Error fetching GTR data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#C6B06A]"></div>
      </div>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        {/* <Image
          src="/your-gtr/your-gtr/your-gtr/area-deep-dive/no-data-icon.svg"
          width={80}
          height={80}
          alt="No Data"
        /> */}
        <p className="text-gray-500 mt-4">{error}</p>
      </div>
    );
  }

  const selfScore = selfData?.gtr ? parseFloat(selfData.gtr).toFixed(1) : "0.0";
  const socialScore = socialData?.gtr ? parseFloat(socialData.gtr).toFixed(1) : "0.0";
  const actionsScore = actionsData?.gtr ? parseFloat(actionsData.gtr).toFixed(1) : "0.0";
  const getsScore = getsData?.gtr ? parseFloat(getsData.gtr).toFixed(1) : "0.0";
  const environmentScore = environmentData?.gtr ? parseFloat(environmentData.gtr).toFixed(1) : "0.0";

  const formatElementName = (name) => {
    if (typeof name !== "string") return name;
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const renderElements = (data, show) => {
    if (!show || !data?.elements) return null;
    return (
      <div className="ml-24 mb-4 pl-32 pr-13 border-l-2 border-gray-200 ease-in-out">
        <div className="flex flex-col gap-3">
          {data.elements.map((element, index) => {
            const percent = parseFloat(element.gtr).toFixed(1);
            return (
              <div key={index} className="flex items-center">
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
                    className="absolute left-0 top-0 h-[30px] bg-[#C6B06A] rounded-l-full flex items-center transition-all duration-500 ease-in-out"
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
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C6B06A]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8 h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="hidden md:flex md:flex-col gap-1">
      {/* Self Section */}
      <div className="flex pl-26 w-full items-center hover:bg-[#F0F1F5] py-6 rounded-[24px]">
        <div className="flex items-center gap-2 pl-[39px]">
          <Image
            src="/your-gtr/your-gtr/dashboard/self-icon.png"
            width={40}
            height={40}
            alt="Self Icon"
          />
          <span className="text-gray-700">Self</span>
        </div>
        <div className="flex w-full pl-21">
          {selfExpanded && (
            <div className="flex w-full h-[28px] bg-[#B60A06] rounded-full">
              <div
                className="flex justify-end items-center pr-2 text-white bg-[#C6B06A] rounded-l-full transition-all duration-500 ease-in-out"
                style={{ width: `${selfScore}%` }}
              >
                {selfScore}%
              </div>
            </div>
          )}
        </div>
        <div className="flex pl-4">
          <button
            className="transform transition-transform duration-300"
            onClick={() => setShowSelfElements(!showSelfElements)}
            style={{ transform: showSelfElements ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <Image
              src="/your-gtr/your-gtr/area-deep-dive/arrow-up-icon.svg"
              width={40}
              height={40}
              alt="Magnify Icon"
            />
          </button>
        </div>
      </div>

      {renderElements(selfData, showSelfElements)}

      {/* Social Section */}
      <div className="flex pl-26 w-full items-center hover:bg-[#F0F1F5] py-6 rounded-[24px]">
        <div className="flex items-center gap-2">
          <Image
            src="/your-gtr/your-gtr/area-deep-dive/mental-icon.svg"
            width={40}
            height={40}
            alt="Mental Icon"
          />
          <Image
            src="/your-gtr/your-gtr/area-deep-dive/social-icon.svg"
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
                className="flex justify-end items-center pr-2 text-white bg-[#C6B06A] rounded-l-full transition-all duration-500 ease-in-out"
                style={{ width: `${socialScore}%` }}
              >
                {socialScore}%
              </div>
            </div>
          )}
        </div>
        <div className="flex pl-4">
          <button
            className="transform transition-transform duration-300"
            onClick={() => setShowSocialElements(!showSocialElements)}
            style={{ transform: showSocialElements ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <Image
              src="/your-gtr/your-gtr/area-deep-dive/arrow-up-icon.svg"
              width={40}
              height={40}
              alt="Magnify Icon"
            />
          </button>
        </div>
      </div>

      {renderElements(socialData, showSocialElements)}

      {/* Actions Section */}
      <div className="flex pl-26 w-full items-center hover:bg-[#F0F1F5] py-6 rounded-[24px]">
        <div className="flex items-center gap-2">
          <Image
            src="/your-gtr/your-gtr/area-deep-dive/sense-icon.svg"
            width={40}
            height={40}
            alt="Sense Icon"
          />
          <Image
            src="/your-gtr/your-gtr/area-deep-dive/actions-icon.svg"
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
                className="flex justify-end items-center pr-2 text-white bg-[#C6B06A] rounded-l-full transition-all duration-500 ease-in-out"
                style={{ width: `${actionsScore}%` }}
              >
                {actionsScore}%
              </div>
            </div>
          )}
        </div>
        <div className="flex pl-4">
          <button
            className="transform transition-transform duration-300"
            onClick={() => setShowActionsElements(!showActionsElements)}
            style={{ transform: showActionsElements ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <Image
              src="/your-gtr/your-gtr/area-deep-dive/arrow-up-icon.svg"
              width={40}
              height={40}
              alt="Magnify Icon"
            />
          </button>
        </div>
      </div>

      {renderElements(actionsData, showActionsElements)}

      {/* Obtainments Section */}
      <div className="flex pl-26 w-full items-center hover:bg-[#F0F1F5] py-6 rounded-[24px]">
        <div className="flex items-center gap-2 pl-[39px]">
          <Image
            src="/your-gtr/your-gtr/area-deep-dive/obtain-icon.svg"
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
                className="flex justify-end items-center pr-2 text-white bg-[#C6B06A] rounded-l-full transition-all duration-500 ease-in-out"
                style={{ width: `${getsScore}%` }}
              >
                {getsScore}%
              </div>
            </div>
          )}
        </div>
        <div className="flex pl-4">
          <button
            className="transform transition-transform duration-300"
            onClick={() => setShowGetsElements(!showGetsElements)}
            style={{ transform: showGetsElements ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <Image
              src="/your-gtr/your-gtr/area-deep-dive/arrow-up-icon.svg"
              width={40}
              height={40}
              alt="Magnify Icon"
            />
          </button>
        </div>
      </div>

      {renderElements(getsData, showGetsElements)}

      {/* Environment Section */}
      <div className="flex pl-26 w-full items-center hover:bg-[#F0F1F5] py-6 rounded-[24px]">
        <div className="flex items-center gap-2 pl-[39px]">
          <Image
            src="/your-gtr/your-gtr/area-deep-dive/environment-icon.svg"
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
                className="flex justify-end items-center pr-2 text-white bg-[#C6B06A] rounded-l-full transition-all duration-500 ease-in-out"
                style={{ width: `${environmentScore}%` }}
              >
                {environmentScore}%
              </div>
            </div>
          )}
        </div>
        <div className="flex pl-4">
          <button
            className="transform transition-transform duration-300"
            onClick={() => setShowEnvironmentElements(!showEnvironmentElements)}
            style={{ transform: showEnvironmentElements ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <Image
              src="/your-gtr/your-gtr/area-deep-dive/arrow-up-icon.svg"
              width={40}
              height={40}
              alt="Magnify Icon"
            />
          </button>
        </div>
      </div>

      {renderElements(environmentData, showEnvironmentElements)}
    </div>
  );
}

export default FiveBoxDesk;
