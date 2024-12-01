"use client";

import { useState, useEffect } from "react";
import { parse } from "csv-parse/sync";
import CalendarHeatmap from "./components/CalendarHeatmap";

export default function Home() {
  const [spendingData, setSpendingData] = useState([]);

  useEffect(() => {
    fetch("/2024_ytd_spending_data.csv")
      .then((response) => response.text())
      .then((csvString) => {
        const records = parse(csvString, {
          columns: true,
          skip_empty_lines: true,
        });
        setSpendingData(records);
      });
  }, []);

  return (
    <div className="App">
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">2024 Spending</h1>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <CalendarHeatmap data={spendingData} />
        </div>
      </main>
    </div>
  );
}
