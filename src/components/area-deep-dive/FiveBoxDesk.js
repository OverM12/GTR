import Image from "next/image";
import { useState, useEffect } from "react";
import reportService from "@/services/reportService";
import { useDateRange } from "@/context/DateRangeContext"; // Import the context

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
  NO_DATA_ICON: "/your-gtr/area-deep-dive/no-data-icon.svg"
};

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
          src={IMAGE_PATHS.NO_DATA_ICON}
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
      <div className="ml-4 md:ml-24 mb-4 pl-4 md:pl-63 pr-2 md:pr-10 border-l-2 border-gray-200 ease-in-out">
        <div className="flex flex-col gap-2 md:gap-3">
          {data.elements.map((element, index) => {
            const percentRaw = parseFloat(element.gtr);
            const percentDisplay = percentRaw.toFixed(1);
            const widthPercent = Math.min(percentRaw, 100);

            return (
              <div
                key={index}
                className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-0"
              >
                <div className="flex items-center w-full md:w-[300px] md:min-w-[300px] mb-2 md:mb-0">
                  <span className="text-gray-700 text-[14px] text-xs md:text-sm">
                    {formatElementName(element.element)}
                  </span>
                </div>

                <div className="w-[85%] h-[30px] bg-[#B60A06] rounded-full overflow-hidden relative">
                  <div
                    className="h-[30px] bg-[#C6B06A] transition-all duration-500 ease-in-out relative"
                    style={{ width: `${widthPercent}%` }}
                  >
                    {percentRaw >= 4.0 && (
                      <span className="text-white text-[10px] md:text-xs font-semibold absolute right-4 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
                        {percentDisplay}%
                      </span>
                    )}
                  </div>
                  {percentRaw < 4.0 && (
                    <span className="text-white text-[10px] md:text-xs font-semibold absolute left-4 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
                      {percentDisplay}%
                    </span>
                  )}
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
    <div className="hidden lg:flex lg:flex-col gap-1">
      {/* Self Section */}
      <div className="flex pl-12 w-full items-center hover:bg-[#F0F1F5] py-6 rounded-[24px]">
        <div className="flex items-center gap-2 pl-[39px] min-w-[200px]">
          <Image
            src={IMAGE_PATHS.SELF_ICON}
            width={24}
            height={24}
            alt="Self Icon"
          />
          <span className="text-gray-700 text-[14px]">Self</span>
        </div>
        <div className="flex-1 flex items-center justify-end relative h-[30px] ml-12">
          {selfExpanded && (
            <div className="w-full max-w-[1250px] h-[30px] bg-[#B60A06] rounded-full overflow-hidden relative">
              <div
                className="h-[30px] bg-[#C6B06A] transition-all duration-500 ease-in-out relative"
                style={{ width: `${Math.min(parseFloat(selfScore), 100)}%` }}
              >
                {parseFloat(selfScore) >= 4.0 && (
                  <span className="text-white text-xs font-semibold absolute right-4 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
                    {selfScore}%
                  </span>
                )}
              </div>
              {parseFloat(selfScore) < 4.0 && (
                <span className="text-white text-xs font-semibold absolute left-4 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
                  {selfScore}%
                </span>
              )}
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
              src="/your-gtr/area-deep-dive/arrow-up-icon.svg"
              width={24}
              height={24}
              alt="Magnify Icon"
            />
          </button>
        </div>
      </div>

      {renderElements(selfData, showSelfElements)}

      {/* Social Section */}
      <div className="flex pl-12 w-full items-center hover:bg-[#F0F1F5] py-6 rounded-[24px]">
        <div className="flex items-center gap-2 pl-[39px] min-w-[200px]">
          <Image
            src={IMAGE_PATHS.MENTAL_ICON}
            width={24}
            height={24}
            alt="Mental Icon"
          />
          <Image
            src={IMAGE_PATHS.SOCIAL_ICON}
            width={24}
            height={24}
            alt="Social Icon"
          />
          <span className="text-gray-700 text-[14px]">Social</span>
        </div>
        <div className="flex-1 flex items-center justify-end relative h-[30px] ml-12">
          {socialExpanded && (
            <div className="w-full max-w-[1250px] h-[30px] bg-[#B60A06] rounded-full overflow-hidden relative">
              <div
                className="h-[30px] bg-[#C6B06A] transition-all duration-500 ease-in-out relative"
                style={{ width: `${Math.min(parseFloat(socialScore), 100)}%` }}
              >
                {parseFloat(socialScore) >= 4.0 && (
                  <span className="text-white text-xs font-semibold absolute right-4 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
                    {socialScore}%
                  </span>
                )}
              </div>
              {parseFloat(socialScore) < 4.0 && (
                <span className="text-white text-xs font-semibold absolute left-4 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
                  {socialScore}%
                </span>
              )}
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
              src="/your-gtr/area-deep-dive/arrow-up-icon.svg"
              width={24}
              height={24}
              alt="Magnify Icon"
            />
          </button>
        </div>
      </div>

      {renderElements(socialData, showSocialElements)}

      {/* Actions Section */}
      <div className="flex pl-12 w-full items-center hover:bg-[#F0F1F5] py-6 rounded-[24px]">
        <div className="flex items-center gap-2 pl-[39px] min-w-[200px]">
          <Image
            src={IMAGE_PATHS.SENSE_ICON}
            width={24}
            height={24}
            alt="Sense Icon"
          />
          <Image
            src={IMAGE_PATHS.ACTIONS_ICON}
            width={24}
            height={24}
            alt="Actions Icon"
          />
          <span className="text-gray-700 text-[14px]">Actions</span>
        </div>
        <div className="flex-1 flex items-center justify-end relative h-[30px] ml-12">
          {actionsExpanded && (
            <div className="w-full max-w-[1250px] h-[30px] bg-[#B60A06] rounded-full overflow-hidden relative">
              <div
                className="h-[30px] bg-[#C6B06A] transition-all duration-500 ease-in-out relative"
                style={{ width: `${Math.min(parseFloat(actionsScore), 100)}%` }}
              >
                {parseFloat(actionsScore) >= 4.0 && (
                  <span className="text-white text-xs font-semibold absolute right-4 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
                    {actionsScore}%
                  </span>
                )}
              </div>
              {parseFloat(actionsScore) < 4.0 && (
                <span className="text-white text-xs font-semibold absolute left-4 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
                  {actionsScore}%
                </span>
              )}
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
              src="/your-gtr/area-deep-dive/arrow-up-icon.svg"
              width={24}
              height={24}
              alt="Magnify Icon"
            />
          </button>
        </div>
      </div>

      {renderElements(actionsData, showActionsElements)}

      {/* Obtainments Section */}
      <div className="flex pl-12 w-full items-center hover:bg-[#F0F1F5] py-6 rounded-[24px]">
        <div className="flex items-center gap-2 pl-[39px] min-w-[200px]">
          <Image
            src={IMAGE_PATHS.OBTAIN_ICON}
            width={24}
            height={24}
            alt="Obtain Icon"
          />
          <span className="text-gray-700 text-[14px]">Obtainments</span>
        </div>
        <div className="flex-1 flex items-center justify-end relative h-[30px] ml-12">
          {getsExpanded && (
            <div className="w-full max-w-[1250px] h-[30px] bg-[#B60A06] rounded-full overflow-hidden relative">
              <div
                className="h-[30px] bg-[#C6B06A] transition-all duration-500 ease-in-out relative"
                style={{ width: `${Math.min(parseFloat(getsScore), 100)}%` }}
              >
                {parseFloat(getsScore) >= 4.0 && (
                  <span className="text-white text-xs font-semibold absolute right-4 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
                    {getsScore}%
                  </span>
                )}
              </div>
              {parseFloat(getsScore) < 4.0 && (
                <span className="text-white text-xs font-semibold absolute left-4 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
                  {getsScore}%
                </span>
              )}
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
              src="/your-gtr/area-deep-dive/arrow-up-icon.svg"
              width={24}
              height={24}
              alt="Magnify Icon"
            />
          </button>
        </div>
      </div>

      {renderElements(getsData, showGetsElements)}

      {/* Environment Section */}
      <div className="flex pl-12 w-full items-center hover:bg-[#F0F1F5] py-6 rounded-[24px]">
        <div className="flex items-center gap-2 pl-[39px] min-w-[200px]">
          <Image
            src={IMAGE_PATHS.ENVIRONMENT_ICON}
            width={24}
            height={24}
            alt="Environment Icon"
          />
          <span className="text-gray-700 text-[14px]">Environment</span>
        </div>
        <div className="flex-1 flex items-center justify-end relative h-[30px] ml-12">
          {environmentExpanded && (
            <div className="w-full max-w-[1250px] h-[30px] bg-[#B60A06] rounded-full overflow-hidden relative">
              <div
                className="h-[30px] bg-[#C6B06A] transition-all duration-500 ease-in-out relative"
                style={{ width: `${Math.min(parseFloat(environmentScore), 100)}%` }}
              >
                {parseFloat(environmentScore) >= 4.0 && (
                  <span className="text-white text-xs font-semibold absolute right-4 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
                    {environmentScore}%
                  </span>
                )}
              </div>
              {parseFloat(environmentScore) < 4.0 && (
                <span className="text-white text-xs font-semibold absolute left-4 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
                  {environmentScore}%
                </span>
              )}
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
              src="/your-gtr/area-deep-dive/arrow-up-icon.svg"
              width={24}
              height={24}
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
