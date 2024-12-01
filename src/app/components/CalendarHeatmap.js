"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CalendarHeatmap = ({ data }) => {
  const [hoveredDay, setHoveredDay] = useState(null);

  const getColor = (amount) => {
    if (amount === 0) return "rgb(235, 236, 237)";
    const maxSpending = Math.max(
      ...data.map((d) => parseFloat(d.total_spending))
    );
    const intensity = amount / maxSpending;

    const colors = {
      r: [198, 144, 67, 25],
      g: [228, 190, 139, 85],
      b: [139, 68, 27, 1],
    };

    const segment = Math.min(Math.floor(intensity * 3), 2);
    const segmentIntensity = intensity * 3 - segment;

    const r =
      colors.r[segment] +
      (colors.r[segment + 1] - colors.r[segment]) * segmentIntensity;
    const g =
      colors.g[segment] +
      (colors.g[segment + 1] - colors.g[segment]) * segmentIntensity;
    const b =
      colors.b[segment] +
      (colors.b[segment + 1] - colors.b[segment]) * segmentIntensity;

    return `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`;
  };

  const renderMonth = (month) => {
    const daysInMonth = new Date(2024, month + 1, 0).getDate();
    const firstDay = new Date(2024, month, 1).getDay();

    return (
      <Card key={month} className="m-1 p-2">
        <CardContent className="p-1">
          <h2 className="text-sm font-semibold mb-1">{months[month]}</h2>
          <div
            className="inline-grid grid-cols-7 gap-[1px]"
            style={{ maxWidth: "fit-content" }}
          >
            {[...Array(firstDay)].map((_, i) => (
              <div key={`empty-${i}`} className="w-6 h-6"></div>
            ))}
            {[...Array(daysInMonth)].map((_, day) => {
              const date = `2024-${String(month + 1).padStart(2, "0")}-${String(
                day + 1
              ).padStart(2, "0")}`;
              const dayData = data.find((d) => d.date === date);
              const amount = dayData ? parseFloat(dayData.total_spending) : 0;

              return (
                <TooltipProvider key={date}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <div
                        className="w-6 h-6 transition-all duration-150 ease-in-out hover:z-10 hover:outline hover:outline-1 hover:outline-black"
                        style={{
                          backgroundColor: getColor(amount),
                        }}
                        onMouseEnter={() => setHoveredDay(dayData)}
                        onMouseLeave={() => setHoveredDay(null)}
                      ></div>
                    </TooltipTrigger>
                    {dayData && (
                      <TooltipContent className="tooltip-no-delay">
                        <p>Date: {date}</p>
                        <p>Total Spent: ${dayData.total_spending}</p>
                        <p>Largest Category: {dayData.largest_category}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-4 gap-1">
      {months.map((_, index) => renderMonth(index))}
    </div>
  );
};

export default CalendarHeatmap;
