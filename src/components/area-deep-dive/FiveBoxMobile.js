import Image from "next/image";
import { useState, useEffect } from "react";
import reportService from "@/services/reportService";
import { useDateRange } from "@/context/DateRangeContext";

// Image path constants
const IMAGE_PATHS = {
  // Area icons
  SELF_ICON: "/your-gtr/dashboard/self-icon.png",
  SOCIAL_ICON: "/your-gtr/area-deep-dive/social-icon.svg",
  MENTAL_ICON: "/your-gtr/area-deep-dive/mental-icon.svg",
  ACTIONS_ICON: "/your-gtr/area-deep-dive/actions-icon.svg",
  SENSE_ICON: "/your-gtr/area-deep-dive/sense-icon.svg",
  OBTAIN_ICON: "/your-gtr/area-deep-dive/obtain-icon.svg",
  ENVIRONMENT_ICON: "/your-gtr/area-deep-dive/environment-icon.svg",

  // UI elements
  ARROW_UP_ICON: "/your-gtr/area-deep-dive/arrow-up-icon.svg",
  NO_DATA_ICON: "/your-gtr/area-deep-dive/no-data-icon.svg",
  HIGH_ICON: "/your-gtr/area-deep-dive/highicon.svg",
  MEDIUM_ICON: "/your-gtr/area-deep-dive/medium-icon.svg",
  LOW_ICON: "/your-gtr/area-deep-dive/lowicon.svg",
};

function FiveBoxMobile() {
  const { dateRange } = useDateRange();
  const [selfData, setSelfData] = useState(null);
  const [socialData, setSocialData] = useState(null);
  const [actionsData, setActionsData] = useState(null);
  const [getsData, setGetsData] = useState(null);
  const [environmentData, setEnvironmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Toggle state for each section
  const [showSelfElements, setShowSelfElements] = useState(false);
  const [showSocialElements, setShowSocialElements] = useState(false);
  const [showActionsElements, setShowActionsElements] = useState(false);
  const [showGetsElements, setShowGetsElements] = useState(false);
  const [showEnvironmentElements, setShowEnvironmentElements] = useState(false);

  // Helper functions to format element names
  const formatElementName = (name) => {
    if (typeof name !== "string") return name;
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Fetch data when date range changes
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

        // if (!response.data || !response.data.data || !response.data.data.areas) {
        //   setError("No data available for the selected date range");
        //   return;
        // }

        const data = response.data.data;

        setSelfData(data.areas.self);
        setSocialData(data.areas.social);
        setActionsData(data.areas.actions);
        setGetsData(data.areas.gets);
        setEnvironmentData(data.areas.environment);

      } catch (error) {
        // console.error("Error fetching GTR data:", error);
        // setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  // Calculate scores with proper formatting
  const selfScore = selfData?.gtr ? parseFloat(selfData.gtr).toFixed(1) : "0.0";
  const socialScore = socialData?.gtr ? parseFloat(socialData.gtr).toFixed(1) : "0.0";
  const actionsScore = actionsData?.gtr ? parseFloat(actionsData.gtr).toFixed(1) : "0.0";
  const getsScore = getsData?.gtr ? parseFloat(getsData.gtr).toFixed(1) : "0.0";
  const environmentScore = environmentData?.gtr ? parseFloat(environmentData.gtr).toFixed(1) : "0.0";



  // Render elements for each section when expanded
  const renderElements = (data, show) => {
    if (!show || !data?.elements) return null;
    return (
      <div className="ml-4 mb-2 pl-12 border-l-2 mt-4 border-gray-200 ease-in-out">
        <div className="flex flex-col gap-3">
          {data.elements.map((element, index) => {
            const percent = parseFloat(element.gtr).toFixed(1);
            return (
              <div key={index} className="flex flex-col mb-3 mr-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center">
                    {(element.isHigh || element.isMedium || element.isLow) ? (
                      <Image
                        src={
                          element.isHigh
                            ? IMAGE_PATHS.HIGH_ICON
                            : element.isMedium
                              ? IMAGE_PATHS.MEDIUM_ICON
                              : IMAGE_PATHS.LOW_ICON
                        }
                        width={24}
                        height={24}
                        alt="Performance Icon"
                      />
                    ) : (
                      <div className="w-6 h-6"></div> // placeholder
                    )}
                  </div>
                  <span className="text-gray-700 text-sm">
                    {formatElementName(element.element)}
                  </span>
                </div>

                <div className="w-full h-[28px] bg-[#B60A06] rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-[#C6B06A] transition-all duration-500 ease-in-out"
                    style={{ width: `${percent}%` }}
                  >
                  </div>
                  <span
                    className="text-white text-xs font-semibold absolute z-10"
                    style={{
                      left: parseFloat(percent) >= 14.0 ? `calc(min(${parseFloat(percent)}%, 100%) - 50px)` : '8px',
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  >
                    {percent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C6B06A]"></div>
      </div>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[300px]">
        <p className="text-gray-500 mt-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="lg:hidden flex flex-col p-4 w-full overflow-x-auto">
      {/* Self Section */}
      <div className="flex flex-col w-full mb-4 hover:bg-[#F0F1F5] py-4 rounded-[24px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={IMAGE_PATHS.SELF_ICON}
              width={24}
              height={24}
              alt="Self Icon"
            />
            <span className="text-gray-700 text-sm font-medium">Self</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="transform transition-transform duration-300"
              onClick={() => setShowSelfElements(!showSelfElements)}
              style={{ transform: showSelfElements ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <Image
                src={IMAGE_PATHS.ARROW_UP_ICON}
                width={24}
                height={24}
                alt="Toggle Icon"
              />
            </button>
          </div>
        </div>
        <div className="mt-2">
          <div className="w-full h-[30px] bg-[#B60A06] rounded-full overflow-hidden relative">
            <div
              className="h-[30px] bg-[#C6B06A] transition-all duration-500 ease-in-out"
              style={{ width: `${parseFloat(selfScore)}%` }}
            >
            </div>
            <span
              className="text-white text-xs font-semibold absolute z-10"
              style={{
                left: parseFloat(selfScore) >= 14.0 ? `calc(min(${parseFloat(selfScore)}%, 100%) - 50px)` : '8px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              {selfScore}%
            </span>
          </div>
        </div>
        {renderElements(selfData, showSelfElements)}
      </div>

      {/* Social Section */}
      <div className="flex flex-col w-full mb-4 hover:bg-[#F0F1F5] py-4 rounded-[24px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={IMAGE_PATHS.SOCIAL_ICON}
              width={24}
              height={24}
              alt="Social Icon"
            />
            <span className="text-gray-700 text-sm font-medium">Social</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="transform transition-transform duration-300"
              onClick={() => setShowSocialElements(!showSocialElements)}
              style={{ transform: showSocialElements ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <Image
                src={IMAGE_PATHS.ARROW_UP_ICON}
                width={24}
                height={24}
                alt="Toggle Icon"
              />
            </button>
          </div>
        </div>
        <div className="mt-2">
          <div className="w-full h-[30px] bg-[#B60A06] rounded-full overflow-hidden relative">
            <div
              className="h-[30px] bg-[#C6B06A] transition-all duration-500 ease-in-out"
              style={{ width: `${parseFloat(socialScore)}%` }}
            >
            </div>
            <span
              className="text-white text-xs font-semibold absolute z-10"
              style={{
                left: parseFloat(socialScore) >= 14.0 ? `calc(min(${parseFloat(socialScore)}%, 100%) - 50px)` : '8px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              {socialScore}%
            </span>
          </div>
        </div>
        {renderElements(socialData, showSocialElements)}
      </div>

      {/* Actions Section */}
      <div className="flex flex-col w-full mb-4 hover:bg-[#F0F1F5] py-4 rounded-[24px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={IMAGE_PATHS.ACTIONS_ICON}
              width={24}
              height={24}
              alt="Actions Icon"
            />
            <span className="text-gray-700 text-sm font-medium">Actions</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="transform transition-transform duration-300"
              onClick={() => setShowActionsElements(!showActionsElements)}
              style={{ transform: showActionsElements ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <Image
                src={IMAGE_PATHS.ARROW_UP_ICON}
                width={24}
                height={24}
                alt="Toggle Icon"
              />
            </button>
          </div>
        </div>
        <div className="mt-2">
          <div className="w-full h-[30px] bg-[#B60A06] rounded-full overflow-hidden relative">
            <div
              className="h-[30px] bg-[#C6B06A] transition-all duration-500 ease-in-out"
              style={{ width: `${parseFloat(actionsScore)}%` }}
            >
            </div>
            <span
              className="text-white text-xs font-semibold absolute z-10"
              style={{
                left: parseFloat(actionsScore) >= 14.0 ? `calc(min(${parseFloat(actionsScore)}%, 100%) - 50px)` : '8px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              {actionsScore}%
            </span>
          </div>
        </div>
        {renderElements(actionsData, showActionsElements)}
      </div>

      {/* Gets/Obtainments Section */}
      <div className="flex flex-col w-full mb-4 hover:bg-[#F0F1F5] py-4 rounded-[24px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={IMAGE_PATHS.OBTAIN_ICON}
              width={24}
              height={24}
              alt="Obtainments Icon"
            />
            <span className="text-gray-700 text-sm font-medium">Obtainments</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="transform transition-transform duration-300"
              onClick={() => setShowGetsElements(!showGetsElements)}
              style={{ transform: showGetsElements ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <Image
                src={IMAGE_PATHS.ARROW_UP_ICON}
                width={24}
                height={24}
                alt="Toggle Icon"
              />
            </button>
          </div>
        </div>
        <div className="mt-2">
          <div className="w-full h-[30px] bg-[#B60A06] rounded-full overflow-hidden relative">
            <div
              className="h-[30px] bg-[#C6B06A] transition-all duration-500 ease-in-out"
              style={{ width: `${parseFloat(getsScore)}%` }}
            >
            </div>
            <span
              className="text-white text-xs font-semibold absolute z-10"
              style={{
                left: parseFloat(getsScore) >= 14.0 ? `calc(min(${parseFloat(getsScore)}%, 100%) - 50px)` : '8px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              {getsScore}%
            </span>
          </div>
        </div>
        {renderElements(getsData, showGetsElements)}
      </div>

      {/* Environment Section */}
      <div className="flex flex-col w-full mb-4 hover:bg-[#F0F1F5] py-4 rounded-[24px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={IMAGE_PATHS.ENVIRONMENT_ICON}
              width={24}
              height={24}
              alt="Environment Icon"
            />
            <span className="text-gray-700 text-sm font-medium">Environment</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="transform transition-transform duration-300"
              onClick={() => setShowEnvironmentElements(!showEnvironmentElements)}
              style={{ transform: showEnvironmentElements ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <Image
                src={IMAGE_PATHS.ARROW_UP_ICON}
                width={24}
                height={24}
                alt="Toggle Icon"
              />
            </button>
          </div>
        </div>
        <div className="mt-2">
          <div className="w-full h-[30px] bg-[#B60A06] rounded-full overflow-hidden relative">
            <div
              className="h-[30px] bg-[#C6B06A] transition-all duration-500 ease-in-out"
              style={{ width: `${parseFloat(environmentScore)}%` }}
            >
              {parseFloat(environmentScore) >= 14.0 && (
                <span
                  className="text-white text-xs font-semibold absolute z-10"
                  style={{
                    right: '4px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                >
                  {environmentScore}%
                </span>
              )}
            </div>
            {parseFloat(environmentScore) < 14.0 && (
              <span
                className="text-white text-xs font-semibold absolute z-10"
                style={{
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              >
                {environmentScore}%
              </span>
            )}
          </div>
        </div>
        {renderElements(environmentData, showEnvironmentElements)}
      </div>
    </div>
  );
}

export default FiveBoxMobile;
