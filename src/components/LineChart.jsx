import React, { useState, useEffect } from "react";

import { Chart } from "primereact/chart";
import { useFilter } from "../contexts/FilterContext";

export default function LineChart({ data }) {
  const { selectedMeasure } = useFilter();
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const years = data.map((d) => d.Year);

  const uniqueYears = [...new Set(years)];

  const sortedUniqueYears = uniqueYears.sort((a, b) => a - b);

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const chartData = {
      labels: sortedUniqueYears,
      datasets: [
        {
          label: "First Dataset",
          data: data.map((d) => d[selectedMeasure.label]),
          fill: false,
          borderColor: documentStyle.getPropertyValue("--cyan-600"),
          tension: 0.4,
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    setChartData(chartData);
    setChartOptions(options);
  }, []);

  return (
    <div className="card">
      <Chart type="line" data={chartData} options={chartOptions} />
    </div>
  );
}
