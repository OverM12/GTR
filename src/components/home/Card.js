"use client";
import Image from "next/image";
import { useState } from "react";

function Card() {
  const [isActive, setIsActive] = useState(1);

  return (
    <>
      <div className="md:hidden w-full bg-white h-[153px] rounded-[40px]">
        <h2 className="text-xl font-bold p-8">Card title</h2>
        <div className="flex flex-nowrap w-full overflow-x-auto">
          <div
            className={`flex flex-none px-4 gap-2 ml-4 h-[48px] items-center justify-center 
        ${isActive === 1 ? "font-bold border-b-[#0C2A55] border-b-2" : ""}`}
            onClick={() => setIsActive(1)}
          >
            Insights
            <Image
              src="/your-gtr/your-gtr/home/i-icon.png"
              width={28}
              height={28}
              alt="Icon GTR"
            />
          </div>
          <div
            className={`flex gap-2 px-4 flex-none h-[48px] items-center justify-center 
        ${isActive === 2 ? "font-bold border-b-[#0C2A55] border-b-2" : ""}`}
            onClick={() => setIsActive(2)}
          >
            Reflection
            <Image
              src="/your-gtr/your-gtr/home/i-icon.png"
              width={28}
              height={28}
              alt="Icon GTR"
            />
          </div>
          <div
            className={`flex gap-2 px-4 flex-none h-[48px] items-center justify-center 
        ${isActive === 3 ? "font-bold border-b-[#0C2A55] border-b-2" : ""}`}
            onClick={() => setIsActive(3)}
          >
            Evolution
            <Image
              src="/your-gtr/your-gtr/home/i-icon.png"
              width={28}
              height={28}
              alt="Icon GTR"
            />
          </div>
        </div>
      </div>
      <div className="hidden md:flex w-full rounded-full bg-white p-6">
        <h1>Card title</h1>
      </div>
    </>
  );
}

export default Card;
