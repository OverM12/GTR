import ApexLineChart from "@/components/dashboard/ApexLineChart";
import GtrScore from "@/components/dashboard/GtrScore";
import KeyInfluencers from "@/components/dashboard/KeyInfluencers";
import Trends from "@/components/dashboard/Trends";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-lvh overflow-auto bg-[#F0F2F5]">
      <div className="flex flex-col gap-[16px] py-[32px] px-[16px]">
        {/* <h1 className="text-[24px] font-bold">GTR</h1> */}
        <GtrScore />
        <KeyInfluencers />
        <Trends />
        <ApexLineChart />
      </div>
    </div>
  );
}
