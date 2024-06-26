import React from "react";

import { useFilter } from "../contexts/FilterContext";
import styled from "styled-components";
import { ResponsiveLine } from "@nivo/line";
import * as d3 from "d3";
import { financialStrings } from "../constants/terms";
const StyledCharts = styled.div`
  width: 100%;
  height: 100%;
  font-size: 1em;
`;

export default function LineChartNew({ data1 }) {
  const { selectedMeasure, groupings } = useFilter();
  console.log(data1);
  if (!Array.isArray(groupings) || groupings.length === 0) {
    console.error("groupings is not defined or empty");
    return;
  }
  console.log(groupings);
  if (!Array.isArray(data1) || data1.length === 0) {
    console.error("data is not defined or empty");
    return;
  }

  const levelName = groupings.map(
    (grouping) => grouping.drillDown?.data?.level
  );

  if (!levelName.every(Boolean)) {
    console.error("One or more groupings do not have a valid dimensionName");
    return;
  }
  // const formatNumber = (num) => {
  //   if (num >= 1000000) {
  //     return (num / 1000000).toFixed(1) + "M";
  //   } else if (num >= 1000) {
  //     return (num / 1000).toFixed(1) + "K";
  //   } else {
  //     return num.toString();
  //   }
  // };

  const formatNumber = financialStrings.some((str) =>
    selectedMeasure.label.includes(str)
  )
    ? d3.format("$.2s")
    : d3.format(".2s");

  const formatYear = () => {
    return "year";
  };
  console.log(groupings.some((g) => g.drillDown.label === "Age"));
  const transformData = (data, key) => {
    const groupedData = data.reduce((result, item) => {
      const series = item[key];
      if (!result[series]) {
        result[series] = [];
      }

      result[series].push({
        x: item.Year,
        y: item[selectedMeasure.label],
      });
      return result;
    }, {});
    Object.keys(groupedData).forEach((series) => {
      groupedData[series].sort((a, b) => a.x - b.x);
    });

    return Object.keys(groupedData).map((series) => ({
      id: series,
      data: groupedData[series],
    }));
  };
  const groupedData = transformData(data1, levelName);

  const averageRecordsCount = Object.keys(groupedData).map((groupKey) => {
    const records = groupedData[groupKey];
    const average = records.data.reduce(
      (sum, record) => (sum + record.y) / records.data.length,
      0
    );

    return { records, average };
  });

  const sortedData = averageRecordsCount.sort((a, b) => b.average - a.average);

  const topTenData = sortedData.slice(0, 10).map((data) => data.records);

  return (
    <StyledCharts>
      <ResponsiveLine
        data={groupedData.length > 10 ? topTenData : groupedData}
        margin={{ top: 50, right: 100, bottom: 50, left: 90 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        enableSlices="x"
        yFormat={
          groupings.some((g) => g.drillDown.label === "Age")
            ? (value) => formatYear(value)
            : (value) => formatNumber(value)
        }
        enablePoints={false}
        axisTop={null}
        axisRight={null}
        curve="natural"
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "transportation",
          legendOffset: 40,
          legendPosition: "middle",
          truncateTickAt: 0,
        }}
        theme={{
          text: { fontSize: ".8em" },
          axis: { legend: { text: { fontSize: "1em" } } },
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: selectedMeasure.label,
          legendOffset: -70,
          legendPosition: "middle",
          truncateTickAt: 0,
          format: (value) => formatNumber(value),
        }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabel="data.yFormatted"
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
        useMesh={true}
      />
    </StyledCharts>
  );
}
