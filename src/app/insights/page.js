"use client";
import { useState, useEffect } from 'react';
import AreaDeepDive from '../area-deep-dive/page';
import Self from '../self/page';
import Social from '../social/page';
import reportService from '@/services/reportService';
import Image from 'next/image';
import { useDateRange } from '@/context/DateRangeContext';

function TabNavigation() {
  const [activeTab, setActiveTab] = useState('Overview');
  const { dateRange } = useDateRange();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      if (!dateRange.fromDate || !dateRange.toDate) {
        console.log("Insights page: Date range not complete, using default values");
        setReportData({
          gtr: 0,
          self: { gtr: 0 },
          social: { gtr: 0 },
          actions: { gtr: 0 },
          gets: { gtr: 0 },
          environment: { gtr: 0 }
        });
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log("Insights page: Fetching data for date range:", dateRange);
        const data = await reportService.getGtrReport(dateRange.fromDate, dateRange.toDate);
        console.log("Insights page: Data fetched successfully");
        
        // Ensure all properties exist with default values of 0
        const processedData = {
          gtr: data?.gtr || 0,
          self: data?.self || { gtr: 0 },
          social: data?.social || { gtr: 0 },
          actions: data?.actions || { gtr: 0 },
          gets: data?.gets || { gtr: 0 },
          environment: data?.environment || { gtr: 0 }
        };
        
        // Ensure each section has a gtr property with default 0
        if (!processedData.self.gtr) processedData.self.gtr = 0;
        if (!processedData.social.gtr) processedData.social.gtr = 0;
        if (!processedData.actions.gtr) processedData.actions.gtr = 0;
        if (!processedData.gets.gtr) processedData.gets.gtr = 0;
        if (!processedData.environment.gtr) processedData.environment.gtr = 0;
        
        setReportData(processedData);
        setError(null);
      } catch (err) {
        console.error("Error loading report data:", err);
        setError("Failed to load report data");
        
        // Set default data with zeros when there's an error
        setReportData({
          gtr: 0,
          self: { gtr: 0 },
          social: { gtr: 0 },
          actions: { gtr: 0 },
          gets: { gtr: 0 },
          environment: { gtr: 0 }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [dateRange]);

  const tabs = [
    { id: 'Overview', label: 'Overview' },
    { id: 'Self', label: 'Self' },
    { id: 'Social', label: 'Social' },
    { id: 'Action', label: 'Actions' },
    { id: 'Obtainments', label: 'Obtainments' },
    { id: 'Gets', label: 'Gets' }
  ];

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen bg-[#F3F4F6]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C6B06A]"></div>
        </div>
      );
    }
    
    if (error) {
      console.log("Rendering error state, but still showing content with zeros");
    }
    
    switch(activeTab) {
      case 'Overview':
        return <AreaDeepDive reportData={reportData} />;
      case 'Self':
        return <Self reportData={reportData?.self} />;
      case 'Social':
        return <Social reportData={reportData?.social} />;
      case 'Action':
        return <div className="h-screen bg-[#F3F4F6] flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Actions</h2>
            <p>GTR Score: {reportData?.actions?.gtr || 0}%</p>
          </div>
        </div>;
      case 'Gets':
        return <div className="h-screen bg-[#F3F4F6] flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Gets & Environment</h2>
            <p>Gets Score: {reportData?.gets?.gtr || 0}%</p>
            <p>Environment Score: {reportData?.environment?.gtr || 0}%</p>
          </div>
        </div>;
      default:
        return <AreaDeepDive reportData={reportData} />;
    }
  };

  return (
    <div className="w-full bg-gray-100 py-4">
      <div className="w-full p-4">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 font-medium text-sm transition-all duration-300 relative
                ${activeTab === tab.id 
                  ? 'text-black' 
                  : 'text-gray-400'}`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#A7A7A9]"></div>
              )}
            </button>
          ))}
        </div>
        
        <div className="flex mt-2 gap-4 text-xs text-gray-600">
          <p className="flex items-center">
            <Image
              src="/your-gtr/dashboard/energy-flow-icon.png"
              width={17}
              height={17}
              alt="Energy flow icon"
            />
            = biggest influencer to energy flow
          </p>
          <p className="flex items-center">
            <Image
              src="/your-gtr/dashboard/energy-tension-icon.png"
              width={17}
              height={17}
              alt="Energy tension icon"
            />
            = biggest influencer to energy blockage
          </p>
        </div>
        
        <div className="mt-4">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

export default TabNavigation;