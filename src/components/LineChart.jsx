import React, { useState, useEffect } from "react";

import { Chart } from "primereact/chart";
import { useFilter } from "../contexts/FilterContext";
import styled from "styled-components";

const StyledCharts = styled.div`
  width: 100%;
  height: 100%;
`;

export default function LineChart({ data }) {
  const { selectedMeasure, groupings } = useFilter();
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const years = data.map((d) => d.Year);
  const uniqueYears = [...new Set(years)];
  const sortedUniqueYears = uniqueYears.sort((a, b) => a - b);

  function settingChartData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    if (!Array.isArray(groupings) || groupings.length === 0) {
      console.error("groupings is not defined or empty");
      return;
    }

    if (!Array.isArray(data) || data.length === 0) {
      console.error("data is not defined or empty");
      return;
    }

    const chartLabels = groupings.map((grouping) =>
      grouping.cutsOptions.map((cut) => cut.label)
    );
    const groupBy = (array, key) => {
      return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
          currentValue
        );

        return result;
      }, {});
    };
    const levelName = groupings.map(
      (grouping) => grouping.drillDown?.data?.level
    );

    if (!levelName.every(Boolean)) {
      console.error("One or more groupings do not have a valid dimensionName");
      return;
    }

    const groupedData = groupBy(data, levelName);

    const averageRecordsCount = Object.keys(groupedData).map((groupKey) => {
      const records = groupedData[groupKey];
      const average = records.reduce(
        (sum, record) => sum + record[selectedMeasure.label],
        0
      );

      return { groupKey, average };
    });

    const sortedData = averageRecordsCount.sort(
      (a, b) => b.average - a.average
    );
    const topTenData = sortedData.slice(0, 10);

    const datasets = topTenData.map((group) => {
      return {
        label: group.groupKey,
        data: groupedData[group.groupKey].map((d) => d[selectedMeasure.label]),
        fill: false,
        borderColor: documentStyle.getPropertyValue("--cyan-600"),
        tension: 0.4,
      };
    });

    const chart = {
      labels: sortedUniqueYears,
      datasets: datasets,
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
    setChartData(chart);
    setChartOptions(options);
  }

  useEffect(() => {
    settingChartData();
  }, [groupings]);

  return (
    <StyledCharts>
      <Chart type="line" data={chartData} options={chartOptions} />
    </StyledCharts>
  );
}
