"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import reportService from "@/services/reportService";
import { useDateRange } from "@/context/DateRangeContext";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ApexLineChart = () => {
  const { dateRange } = useDateRange();
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Place Score",
        data: [0],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "area",
      },
      colors: ["#C6B06A"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "straight",
      },
      xaxis: {
        type: "category",
        categories: ["Today"],
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 5,
      },
      tooltip: {
        x: {
          formatter: (value, opts) => value,
        },
      },
    },
  });

  useEffect(() => {
    const fetchChartData = async () => {
      if (!dateRange.fromDate || !dateRange.toDate) return;

      try {
        setLoading(true);
        const response = await reportService.getGtrReport(
          dateRange.fromDate,
          dateRange.toDate
        );

        const historyData = response?.data?.data?.areas?.gets?.gtrHistory || [];
        // console.log("historyData", historyData);

        if (historyData.length > 0) {
          const formattedDates = historyData.map((item, index) => {
            const date = new Date(item.date);
            const label = `${date.getDate()}/${date.getMonth() + 1}`;
            return index === historyData.length - 1 ? `Today ${label}` : label;
          });

          const scores = historyData.map((item) => Number(item.gtr) || 0);

          setChartData((prev) => ({
            ...prev,
            series: [
              {
                name: "Place Score",
                data: scores,
              },
            ],
            options: {
              ...prev.options,
              xaxis: {
                ...prev.options.xaxis,
                categories: formattedDates,
              },
              tooltip: {
                x: {
                  formatter: (value, opts) => formattedDates[opts.dataPointIndex],
                },
              },
            },
          }));
        }
      } catch (err) {
        console.error("Error loading GTR history data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [dateRange]);

  return (
    <>
      <div className="md:hidden bg-white rounded-[40px] p-[16px] flex flex-col gap-[16px]">
        <div className="p-[8px]">
          <h1 className="font-bold text-[24px]">Place Time Journey</h1>
          {loading ? (
            <div className="flex justify-center items-center h-[300px]">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C6B06A]"></div>
            </div>
          ) : (
            <ReactApexChart
              options={chartData.options}
              series={chartData.series}
              type="area"
              height={300}
              width="100%"
            />
          )}
        </div>
        {/* <div className="p-[8px]">
          <h1 className="font-bold text-[18px] mb-[8px]">
            You&apos;re currently on an upswing!
          </h1>
          <p className="text-[14px] font-normal mb-[32px]">
            In particular, the increased time you&apos;ve spent with yourself shows a
            significant impact on this trend.
          </p>
        </div>
        <button className="border flex gap-[8px] items-center justify-center rounded-[24px] p-4 text-[#31363F]">
          <Image
            src="/your-gtr/dashboard/forecast-icon.png"
            width={22}
            height={22}
            alt="GTR Dashboard forecast-icon"
          />
          Show forecast
        </button>
        <button className="border flex gap-[8px] items-center justify-center rounded-[24px] p-4 text-[#31363F]">
          <Image
            src="/your-gtr/dashboard/pattern-detection-icon.png"
            width={22}
            height={22}
            alt="GTR Dashboard pattern-detection-icon"
          />
          Show pattern detection
        </button> */}
      </div>

      <div className="hidden md:flex bg-white rounded-[40px] p-[16px] gap-[16px]">
        <div className="w-full p-[8px]">
          <h1 className="font-bold text-[24px]">Place Time Journey</h1>
          {loading ? (
            <div className="flex justify-center items-center h-[300px]">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C6B06A]"></div>
            </div>
          ) : (
            <ReactApexChart
              options={chartData.options}
              series={chartData.series}
              type="area"
              height={350}
              width="100%"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ApexLineChart;