"use client";
import { useState } from 'react';
import AreaDeepDive from '../area-deep-dive/page';
import Self from '../self/page';
import Social from '../social/page';

import Image from 'next/image';

function TabNavigation() {
 const [activeTab, setActiveTab] = useState('Overview');
 
 const tabs = [
   { id: 'Overview', label: 'Overview' },
   { id: 'Self', label: 'Self' },
   { id: 'Social', label: 'Social' },
   { id: 'Action', label: 'Actions' },
//    { id: 'Obtainments', label: 'Obtainments' },
   { id: 'Gets', label: 'Gets Environments' }
 ];

 // Render appropriate component based on active tab
 const renderTabContent = () => {
   switch(activeTab) {
     case 'Overview':
       return <AreaDeepDive />;
     case 'Self':
       return <Self />;
     case 'Social':
       return <Social />;
     case 'Action':
       return  <div className="h-screen bg-[#F3F4F6]"></div>;
     case 'Obtainments':
       return  <div className="h-screen bg-[#F3F4F6]"></div>;
     case 'Gets':
       return <div className="h-screen bg-[#F3F4F6]"></div>;
     default:
       return <AreaDeepDive />;
   }
 };

 return (
   <div className="w-full bg-gray-100 py-4">
     <div className="w-full p-4">
       {/* Tab Navigation */}
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
       
       {/* Icons and legend */}
       <div className="flex mt-2  gap-4 text-xs text-gray-600">
       <p className="flex items-center">
          <Image
            src="/your-gtr/dashboard/energy-flow-icon.png"
            width={17}
            height={17}
            alt="Picture of the author"
          />
          = biggest influencer to energy flow
        </p>
        <p className="flex items-center">
          <Image
            src="/your-gtr/dashboard/energy-tension-icon.png"
            width={17}
            height={17}
            alt="Picture of the author"
          />
          = biggest influencer to energy blockage
        </p>
       </div>
       
       {/* Tab Content Area */}
       <div className="mt-4">
         {renderTabContent()}
       </div>
     </div>
   </div>
 );
}

export default TabNavigation;