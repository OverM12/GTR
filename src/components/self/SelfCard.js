"use client";
import Image from "next/image";
import { useState } from "react";

function SelfCard() {
  const [isActive, setIsActive] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditing2, setIsEditing2] = useState(false);
  const [reflectionText, setReflectionText] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis actellus et risus vulputate vehicula."
  );
  const [reflection2Text, setReflection2Text] = useState(
    ".Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis actellus et risus vulputate vehicula."
  );

  return (
    <div className=" w-full bg-white rounded-[40px]">
      <h2 className="text-xl font-bold p-8">Card title</h2>
      <div className="flex flex-nowrap w-full overflow-x-auto">
        <div
          className={`flex cursor-default flex-none px-4 gap-2 ml-4 h-[48px] items-center justify-center 
        ${isActive === 1 ? "font-bold border-b-[#0C2A55] border-b-2" : ""}`}
          onClick={() => setIsActive(1)}
        >
          Insights
          <Image src="/your-gtr/your-gtr/home/i-icon.png" width={28} height={28} alt="Icon GTR" />
        </div>
        <div
          className={`flex cursor-default gap-2 px-4 flex-none h-[48px] items-center justify-center 
        ${isActive === 2 ? "font-bold border-b-[#0C2A55] border-b-2" : ""}`}
          onClick={() => setIsActive(2)}
        >
          Reflection
          <Image src="/your-gtr/your-gtr/home/i-icon.png" width={28} height={28} alt="Icon GTR" />
        </div>
        <div
          className={`flex cursor-default gap-2 px-4 flex-none h-[48px] items-center justify-center 
        ${isActive === 3 ? "font-bold border-b-[#0C2A55] border-b-2" : ""}`}
          onClick={() => setIsActive(3)}
        >
          Evolution
          <Image src="/your-gtr/your-gtr/home/i-icon.png" width={28} height={28} alt="Icon GTR" />
        </div>
      </div>

      {/* Content sections based on active tab */}
      <div className="p-4 ">
        {isActive === 1 && (
          <>
            <div className="flex flex-col md:hidden">
              <div className="insights-content">
                <h3 className="font-semibold mb-2">Current Energy Influence</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Explore how you are currently influencing your inner energy
                  flow.
                </p>
                <div className="flex justify-center p-4 bg-[#F0F2F5] rounded-[24px]">
                  <div className="p-2 flex items-center justify-center">
                    <Image
                      src="/your-gtr/your-gtr/self-insights/mental-icon.svg"
                      width={50}
                      height={50}
                      alt="Energy icon"
                    />
                  </div>
                </div>
              </div>

              <div className="insights-content mt-6">
                <h3 className="font-semibold mb-2">The Biggest Energy-Flow</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Your main energy sources come from [Element with the highest
                  GTR] and [Element with the second highest GTR]. Continuing to
                  nurture these will feel great and fuel you to clear blocks in
                  other areas.
                </p>
                <div className="flex justify-center p-4 bg-[#F0F2F5] rounded-[24px]">
                  <div className="p-2 flex items-center justify-center">
                    <Image
                      src="/your-gtr/your-gtr/self-insights/big-energy-icon.svg"
                      width={45}
                      height={45}
                      alt="Energy icon"
                    />
                  </div>
                </div>
              </div>

              <div className="insights-content mt-6">
                <h3 className="font-semibold mb-2">Energy-Flow</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Meanwhile, [Element with the third highest GTR] and [Element
                  with the fourth highest GTR] hold great growth potential. With
                  just a bit more focus, they might break through and offer a
                  noticeable boost to your life.
                </p>
                <div className="flex justify-center p-4 bg-[#F0F2F5] rounded-[24px]">
                  <div className="p-2 flex items-center justify-center">
                    <Image
                      src="/your-gtr/your-gtr/self-insights/energy-tension-icon.png"
                      width={45}
                      height={45}
                      alt="Sense icon"
                    />
                  </div>
                </div>
              </div>

              <div className="insights-content mt-6 border-b border-[#DADCE1] pb-4">
                <h3 className="font-semibold mb-2">Energy Blockage</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Currently, [Element with the lowest GTR] may affect your
                  self-confidence the most. You might consider whether it’s
                  something you’d like to address now or if giving yourself
                  permission to step back until you feel naturally drawn to it
                  helps you better manage your current energy. Sometimes, simply
                  releasing the pressure can be the first step, allowing you to
                  return to it when you have the capacity to address it.
                </p>
              </div>

              <div className="insights-content mt-6 pb-4">
                <h3 className="font-semibold mb-2">Top Emotions and States</h3>
                <p className="text-[14px] flex items-start text-gray-500 mb-4">
                  Know what to look out for to guide your daily life.
                  <Image
                    alt="Icon GTR"
                    src="/your-gtr/your-gtr/self-insights/i-icon.svg"
                    width={20}
                    height={20}
                  />
                </p>
              </div>

              <div className="w-full flex overflow-hidden rounded-[24px] mb-4 bg-[#F8F9FB]">
                <div className="flex w-[8px] bg-[#C6B06A]"></div>
                <div className="w-full gap-[32px] flex flex-col p-[24px]">
                  <p className="font-bold">Positive</p>
                  <div className="w-full flex gap-4">
                    <div className="flex gap-[32px] flex-col justify-between">
                      <p>Inspiration</p>
                      <p>Curious</p>
                      <p>Proud</p>
                    </div>
                    <div className="flex w-full gap-[32px] flex-col justify-between">
                      <div className="flex w-full gap-2">
                        <div className="w-[30%] bg-[#C6B06A] h-[22px] rounded-full"></div>
                        <p className="text-sm">30%</p>
                      </div>
                      <div className="flex w-full gap-2">
                        <div className="w-[23%] bg-[#C6B06A] h-[22px] rounded-full"></div>
                        <p className="text-sm">23%</p>
                      </div>
                      <div className="flex w-full gap-2">
                        <div className="w-[12%] bg-[#C6B06A] h-[22px] rounded-full"></div>
                        <p className="text-sm">12%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full flex overflow-hidden rounded-[24px] bg-[#F8F9FB]">
                <div className="flex w-[8px] bg-[#B60A06]"></div>
                <div className="w-full gap-[32px] flex flex-col p-[24px]">
                  <p className="font-bold">Negative</p>
                  <div className="w-full flex gap-4">
                    <div className="flex gap-[32px] flex-col justify-between">
                      <p>Bored</p>
                      <p>Confused</p>
                      <p>Shame</p>
                    </div>
                    <div className="flex w-full gap-[32px] flex-col justify-between">
                      <div className="flex w-full gap-2">
                        <div className="w-[25%] bg-[#B60A06] h-[22px] rounded-full"></div>
                        <p className="text-sm">25%</p>
                      </div>
                      <div className="flex w-full gap-2">
                        <div className="w-[15%] bg-[#B60A06] h-[22px] rounded-full"></div>
                        <p className="text-sm">15%</p>
                      </div>
                      <div className="flex w-full gap-2">
                        <div className="w-[3%] bg-[#B60A06] h-[22px] rounded-full"></div>
                        <p className="text-sm">3%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop */}
            <div className="hidden md:flex flex-col w-full gap-8">
              <div className="w-full insights-content">
                <h3 className="font-semibold mb-2">Current Energy Influence</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Explore how you are currently influencing your inner energy
                  flow.
                </p>
              </div>

              <div className="flex w-full gap-4">
                <div className="flex justify-center p-4 px-10 bg-[#F0F2F5] rounded-[24px] w-[160px] h-[100px]">
                  <div className="p-2 flex items-center justify-center">
                    <Image
                      src="/your-gtr/your-gtr/self-insights/mental-icon.svg"
                      width={50}
                      height={50}
                      alt="Energy icon"
                    />
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <h3 className="font-semibold mb-2">
                    The Biggest Energy-Flow
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Your main energy sources come from [Element with the highest
                    GTR] and [Element with the second highest GTR]. Continuing
                    to nurture these will feel great and fuel you to clear
                    blocks in other areas.
                  </p>
                </div>
              </div>

              <div className="flex w-full gap-4">
                <div className="flex justify-center p-4 px-10 bg-[#F0F2F5] rounded-[24px] w-[160px] h-[100px]">
                  <div className="p-2 flex items-center justify-center">
                    <Image
                      src="/your-gtr/your-gtr/self-insights/big-energy-icon.svg"
                      width={50}
                      height={50}
                      alt="Energy icon"
                    />
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <h3 className="font-semibold mb-2">Energy-Flow</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Meanwhile, [Element with the third highest GTR] and [Element
                    with the fourth highest GTR] hold great growth potential.
                    With just a bit more focus, they might break through and
                    offer a noticeable boost to your life.
                  </p>
                </div>
              </div>

              <div className="flex w-full gap-4">
                <div className="flex justify-center p-4 px-10 bg-[#F0F2F5] rounded-[24px] w-[160px] h-[100px]">
                  <div className="p-2 flex items-center justify-center">
                    <Image
                      src="/area-deep-dive/sense-icon.svg"
                      width={50}
                      height={50}
                      alt="Energy icon"
                    />
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <h3 className="font-semibold mb-2">Energy Blockage</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Currently, [Element with the lowest GTR] may affect your
                    self-confidence the most. You might consider whether it’s
                    something you’d like to address now or if giving yourself
                    permission to step back until you feel naturally drawn to it
                    helps you better manage your current energy. Sometimes,
                    simply releasing the pressure can be the first step,
                    allowing you to return to it when you have the capacity to
                    address it.
                  </p>
                </div>
              </div>

              <div className="insights-content mt-6 pb-4">
                <h3 className="font-semibold mb-2">Top Emotions and States</h3>
                <p className="text-[14px] flex items-start text-gray-500 mb-4">
                  Know what to look out for to guide your daily life.
                  <Image
                    alt="Icon GTR"
                    src="/your-gtr/your-gtr/self-insights/i-icon.svg"
                    width={20}
                    height={20}
                  />
                </p>
              </div>

              <div className="flex w-full gap-4">
                <div className="w-full flex overflow-hidden rounded-[24px] mb-4 bg-[#F8F9FB]">
                  <div className="flex w-[8px] bg-[#C6B06A]"></div>
                  <div className="w-full gap-[32px] flex flex-col p-[24px]">
                    <p className="font-bold">Positive</p>
                    <div className="w-full flex gap-4">
                      <div className="flex gap-[32px] flex-col justify-between">
                        <p>Inspiration</p>
                        <p>Curious</p>
                        <p>Proud</p>
                      </div>
                      <div className="flex w-full gap-[32px] flex-col justify-between">
                        <div className="flex w-full gap-2">
                          <div className="w-[30%] bg-[#C6B06A] h-[22px] rounded-full"></div>
                          <p className="text-sm">30%</p>
                        </div>
                        <div className="flex w-full gap-2">
                          <div className="w-[23%] bg-[#C6B06A] h-[22px] rounded-full"></div>
                          <p className="text-sm">23%</p>
                        </div>
                        <div className="flex w-full gap-2">
                          <div className="w-[12%] bg-[#C6B06A] h-[22px] rounded-full"></div>
                          <p className="text-sm">12%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full flex overflow-hidden rounded-[24px] bg-[#F8F9FB]">
                  <div className="flex w-[8px] bg-[#B60A06]"></div>
                  <div className="w-full gap-[32px] flex flex-col p-[24px]">
                    <p className="font-bold">Negative</p>
                    <div className="w-full flex gap-4">
                      <div className="flex gap-[32px] flex-col justify-between">
                        <p>Bored</p>
                        <p>Confused</p>
                        <p>Shame</p>
                      </div>
                      <div className="flex w-full gap-[32px] flex-col justify-between">
                        <div className="flex w-full gap-2">
                          <div className="w-[25%] bg-[#B60A06] h-[22px] rounded-full"></div>
                          <p className="text-sm">25%</p>
                        </div>
                        <div className="flex w-full gap-2">
                          <div className="w-[15%] bg-[#B60A06] h-[22px] rounded-full"></div>
                          <p className="text-sm">15%</p>
                        </div>
                        <div className="flex w-full gap-2">
                          <div className="w-[3%] bg-[#B60A06] h-[22px] rounded-full"></div>
                          <p className="text-sm">3%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {isActive === 2 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              {!isEditing ? (
                <div className="reflection-content">
                  <h3 className="font-semibold mb-2">
                    Your personal Self reflection notes
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    These are the notes you made during the assessment. Now that
                    you&apos;ve seen the bigger picture, would you like to add
                    anything?
                  </p>

                  <div className="w-full bg-[#F0F2F5] rounded-[24px] p-[32px] flex flex-col justify-center">
                    <h1 className="font-bold">Reflection on my current Self</h1>
                    <p className="text-[16px] mt-4">{reflectionText}</p>
                  </div>

                  <button
                    className="border rounded-full flex items-center mt-4 px-4 py-2 gap-2"
                    onClick={() => setIsEditing(true)}
                  >
                    <Image
                      alt="GTR Icon"
                      width={20}
                      height={20}
                      src="/your-gtr/your-gtr/self-insights/edit-icon.svg"
                    />
                    Edit reflection
                  </button>
                </div>
              ) : (
                <div className="reflection-edit-mode">
                  <h3 className="font-semibold mb-2">
                    Your personal Self reflection notes
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    These are the notes you made during the assessment. Now that
                    you&apos;ve seen the bigger picture, would you like to add
                    anything?
                  </p>
                  <textarea
                    className="w-full min-h-[200px] text-[16px] border border-gray-300 rounded-[16px] p-4 mt-2"
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                  />
                  <div className="flex gap-4 mt-4">
                    <button
                      className="bg-[#F7931E] text-black rounded-full px-6 py-3 font-medium"
                      onClick={() => setIsEditing(false)}
                    >
                      Save edit
                    </button>
                    <button
                      className="border border-gray-300 rounded-full px-6 py-3 font-medium"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full h-[0.5px] border border-gray-300"></div>

            <div className="flex flex-col">
              {!isEditing2 ? (
                <div className="reflection-content">
                  <h3 className="font-semibold mb-2">
                    Reflecting on the Need for Change
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    When you imagine that nothing would change in this area, are
                    you fine with it, or does it bring you a sense of unease and
                    inspires a desire for transformation? Take a moment to
                    reflect on how important making a change truly is for you.
                  </p>

                  <div className="w-full bg-[#F0F2F5] rounded-[24px] p-[32px] flex flex-col justify-center">
                    <h1 className="font-bold">Reflection on my current Self</h1>
                    <p className="text-[16px] mt-4">{reflection2Text}</p>
                  </div>

                  <button
                    className="border rounded-full flex items-center mt-4 px-4 py-2 gap-2"
                    onClick={() => setIsEditing2(true)}
                  >
                    <Image
                      alt="GTR Icon"
                      width={20}
                      height={20}
                      src="/your-gtr/your-gtr/self-insights/edit-icon.svg"
                    />
                    Edit reflection
                  </button>
                </div>
              ) : (
                <div className="reflection-edit-mode">
                  <h3 className="font-semibold mb-2">
                    Your personal Self reflection notes
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    When you imagine that nothing would change in this area, are
                    you fine with it, or does it bring you a sense of unease and
                    inspires a desire for transformation? Take a moment to
                    reflect on how important making a change truly is for you.
                  </p>
                  <textarea
                    className="w-full min-h-[200px] text-[16px] border border-gray-300 rounded-[16px] p-4 mt-2"
                    value={reflection2Text}
                    onChange={(e) => setReflection2Text(e.target.value)}
                  />
                  <div className="flex gap-4 mt-4">
                    <button
                      className="bg-[#F7931E] text-black rounded-full px-6 py-3 font-medium"
                      onClick={() => setIsEditing2(false)}
                    >
                      Save edit
                    </button>
                    <button
                      className="border border-gray-300 rounded-full px-6 py-3 font-medium"
                      onClick={() => setIsEditing2(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {isActive === 3 && (
          <div className="evolution-content min-h-screen">
            <h3 className="font-semibold mb-2">Personal Evolution</h3>
            <p className="text-sm text-gray-500 mb-4">
              Track your growth and development over time.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm">Jan</span>
                <span className="text-sm">Dec</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full mb-4">
                <div className="h-full w-3/4 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-600">
                You&apos;ve made significant progress in your personal development
                this year.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SelfCard;
